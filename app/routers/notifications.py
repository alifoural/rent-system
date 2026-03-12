from datetime import date, timedelta
from decimal import Decimal
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Asset, Lease
from app.schemas import NotificationItem

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])

@router.get("/", response_model=list[NotificationItem])
async def get_notifications(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Asset).where(Asset.is_deleted == False).options(
            selectinload(Asset.leases).selectinload(Lease.payments)
        )
    )
    assets = result.scalars().all()
    notifications = []
    
    today = date.today()
    warning_date = today + timedelta(days=3)

    for asset in assets:
        for lease in asset.leases:
            # 1. Check for Upcoming renewals (ends within 3 days or already ended but no new lease)
            if today <= lease.end_date <= warning_date:
                days_left = (lease.end_date - today).days
                notifications.append(
                    NotificationItem(
                        type="Upcoming",
                        lease_id=lease.id,
                        asset_name=asset.name,
                        tenant_name=lease.tenant_name,
                        phone_number=lease.phone_number,
                        message=f"Lease expires in {days_left} days",
                        days_remaining=days_left,
                    )
                )

            # 2. Check for Overdue items
            # Simplified logic: If today is past the start date, and they haven't paid the base price
            if today > lease.start_date:
                # Calculate total paid for this lease overall
                paid = sum(p.amount_paid for p in lease.payments)
                # Compare against total contract
                balance = lease.total_contract_amount - paid
                
                if balance > 0:
                    notifications.append(
                        NotificationItem(
                            type="Overdue",
                            lease_id=lease.id,
                            asset_name=asset.name,
                            tenant_name=lease.tenant_name,
                            phone_number=lease.phone_number,
                            message=f"Outstanding balance of ${balance:,.2f}",
                            balance_due=balance,
                        )
                    )

    # Sort: Overdue first, then Upcoming
    notifications.sort(key=lambda x: (0 if x.type == "Overdue" else 1, x.asset_name.lower()))
    
    return notifications
