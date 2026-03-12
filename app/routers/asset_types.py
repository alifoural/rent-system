from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import AssetType
from app.schemas import AssetTypeCreate, AssetTypeUpdate, AssetTypeOut

router = APIRouter(prefix="/api/asset-types", tags=["Asset Types"])


@router.get("/", response_model=list[AssetTypeOut])
async def list_asset_types(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AssetType).order_by(AssetType.created_at.desc()))
    return result.scalars().all()


@router.get("/{type_id}", response_model=AssetTypeOut)
async def get_asset_type(type_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AssetType).where(AssetType.id == type_id))
    obj = result.scalar_one_or_none()
    if not obj:
        raise HTTPException(404, "Asset type not found")
    return obj


@router.post("/", response_model=AssetTypeOut, status_code=201)
async def create_asset_type(data: AssetTypeCreate, db: AsyncSession = Depends(get_db)):
    obj = AssetType(name=data.name)
    db.add(obj)
    await db.flush()
    await db.refresh(obj)
    return obj


@router.put("/{type_id}", response_model=AssetTypeOut)
async def update_asset_type(
    type_id: str, data: AssetTypeUpdate, db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(AssetType).where(AssetType.id == type_id))
    obj = result.scalar_one_or_none()
    if not obj:
        raise HTTPException(404, "Asset type not found")
    obj.name = data.name
    await db.flush()
    await db.refresh(obj)
    return obj


@router.delete("/{type_id}", status_code=204)
async def delete_asset_type(type_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AssetType).where(AssetType.id == type_id))
    obj = result.scalar_one_or_none()
    if not obj:
        raise HTTPException(404, "Asset type not found")
    await db.delete(obj)
