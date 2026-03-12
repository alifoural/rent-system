from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Payment
from app.schemas import PaymentCreate, PaymentOut

router = APIRouter(prefix="/api/payments", tags=["Payments"])


def _to_out(obj: Payment) -> dict:
    return {
        "id": obj.id,
        "lease_id": obj.lease_id,
        "amount_paid": obj.amount_paid,
        "date_collected": obj.date_collected,
        "payment_method": obj.payment_method,
        "created_at": obj.created_at,
        "tenant_name": obj.lease.tenant_name if obj.lease else None,
    }


@router.get("/", response_model=list[PaymentOut])
async def list_payments(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Payment).order_by(Payment.created_at.desc()))
    return [_to_out(p) for p in result.scalars().all()]


@router.post("/", response_model=PaymentOut, status_code=201)
async def create_payment(data: PaymentCreate, db: AsyncSession = Depends(get_db)):
    obj = Payment(
        lease_id=data.lease_id,
        amount_paid=data.amount_paid,
        date_collected=data.date_collected,
        payment_method=data.payment_method,
    )
    db.add(obj)
    await db.flush()
    await db.refresh(obj)
    return _to_out(obj)


@router.delete("/{payment_id}", status_code=204)
async def delete_payment(payment_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Payment).where(Payment.id == payment_id))
    obj = result.scalar_one_or_none()
    if not obj:
        raise HTTPException(404, "Payment not found")
    await db.delete(obj)
