from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Asset, AssetType
from app.schemas import AssetCreate, AssetUpdate, AssetOut

router = APIRouter(prefix="/api/assets", tags=["Assets"])


def _to_out(obj: Asset) -> dict:
    """Convert an Asset ORM object to a dict matching AssetOut."""
    return {
        "id": obj.id,
        "type_id": obj.type_id,
        "name": obj.name,
        "description": obj.description,
        "base_price": obj.base_price,
        "status": obj.status,
        "metadata": obj.metadata_,
        "is_deleted": obj.is_deleted,
        "created_at": obj.created_at,
        "type_name": obj.asset_type.name if obj.asset_type else None,
    }


@router.get("/", response_model=list[AssetOut])
async def list_assets(
    include_deleted: bool = False,
    type_id: Optional[str] = Query(None, description="Filter by asset type ID"),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Asset).join(Asset.asset_type, isouter=True).order_by(Asset.created_at)

    if not include_deleted:
        stmt = stmt.where(Asset.is_deleted == False)  # noqa: E712
    if type_id:
        stmt = stmt.where(Asset.type_id == type_id)
    result = await db.execute(stmt)
    return [_to_out(a) for a in result.scalars().all()]


@router.get("/{asset_id}", response_model=AssetOut)
async def get_asset(asset_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Asset).where(Asset.id == asset_id))
    obj = result.scalar_one_or_none()
    if not obj:
        raise HTTPException(404, "Asset not found")
    return _to_out(obj)


@router.post("/", response_model=AssetOut, status_code=201)
async def create_asset(data: AssetCreate, db: AsyncSession = Depends(get_db)):
    obj = Asset(
        type_id=data.type_id,
        name=data.name,
        description=data.description,
        base_price=data.base_price,
        status=data.status,
        metadata_=data.metadata_,
    )
    db.add(obj)
    await db.flush()
    await db.refresh(obj)
    return _to_out(obj)


@router.put("/{asset_id}", response_model=AssetOut)
async def update_asset(
    asset_id: str, data: AssetUpdate, db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Asset).where(Asset.id == asset_id))
    obj = result.scalar_one_or_none()
    if not obj:
        raise HTTPException(404, "Asset not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        if field == "metadata_":
            setattr(obj, "metadata_", value)
        else:
            setattr(obj, field, value)
    await db.flush()
    await db.refresh(obj)
    return _to_out(obj)


@router.delete("/{asset_id}", status_code=204)
async def delete_asset(asset_id: str, db: AsyncSession = Depends(get_db)):
    """Soft-delete: preserves financial history for reports."""
    result = await db.execute(select(Asset).where(Asset.id == asset_id))
    obj = result.scalar_one_or_none()
    if not obj:
        raise HTTPException(404, "Asset not found")
    obj.is_deleted = True
    obj.status = "Deleted"
