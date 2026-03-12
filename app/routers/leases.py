from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Lease, Asset
from app.schemas import LeaseCreate, LeaseUpdate, LeaseOut

router = APIRouter(prefix="/api/leases", tags=["Leases"])


def _to_out(obj: Lease) -> dict:
    paid = sum((p.amount_paid for p in obj.payments), Decimal("0"))
    return {
        "id": obj.id,
        "asset_id": obj.asset_id,
        "tenant_name": obj.tenant_name,
        "start_date": obj.start_date,
        "end_date": obj.end_date,
        "total_contract_amount": obj.total_contract_amount,
        "created_at": obj.created_at,
        "asset_name": obj.asset.name if obj.asset else None,
        "paid_amount": paid,
        "remaining": obj.total_contract_amount - paid,
    }


@router.get("/", response_model=list[LeaseOut])
async def list_leases(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Lease).order_by(Lease.created_at.desc()))
    return [_to_out(l) for l in result.scalars().all()]


@router.get("/{lease_id}", response_model=LeaseOut)
async def get_lease(lease_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Lease).where(Lease.id == lease_id))
    obj = result.scalar_one_or_none()
    if not obj:
        raise HTTPException(404, "Lease not found")
    return _to_out(obj)


@router.post("/", response_model=LeaseOut, status_code=201)
async def create_lease(data: LeaseCreate, db: AsyncSession = Depends(get_db)):
    # Mark the asset as rented
    asset_result = await db.execute(select(Asset).where(Asset.id == data.asset_id))
    asset = asset_result.scalar_one_or_none()
    if not asset:
        raise HTTPException(404, "Asset not found")
    asset.status = "Rented"

    obj = Lease(
        asset_id=data.asset_id,
        tenant_name=data.tenant_name,
        start_date=data.start_date,
        end_date=data.end_date,
        total_contract_amount=data.total_contract_amount,
    )
    db.add(obj)
    await db.flush()
    await db.refresh(obj)
    return _to_out(obj)


@router.put("/{lease_id}", response_model=LeaseOut)
async def update_lease(
    lease_id: str, data: LeaseUpdate, db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Lease).where(Lease.id == lease_id))
    obj = result.scalar_one_or_none()
    if not obj:
        raise HTTPException(404, "Lease not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(obj, field, value)
    await db.flush()
    await db.refresh(obj)
    return _to_out(obj)


@router.delete("/{lease_id}", status_code=204)
async def delete_lease(lease_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Lease).where(Lease.id == lease_id))
    obj = result.scalar_one_or_none()
    if not obj:
        raise HTTPException(404, "Lease not found")
    # Free the asset
    asset_result = await db.execute(select(Asset).where(Asset.id == obj.asset_id))
    asset = asset_result.scalar_one_or_none()
    if asset:
        asset.status = "Available"
    await db.delete(obj)
