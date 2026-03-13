from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
import calendar
from datetime import date

from app.database import get_db
from app.models import AssetType, Asset, Lease, Payment
from app.schemas import (
    SummaryReport,
    AssetReport,
    MonthlyReportItem,
    AnnualReport,
    AnnualReportLeaseDetails,
    AnnualReportPaymentDetails,
    DynamicReport,
    DynamicReportItem,
    ExpenseReport,
    ExpenseReportItem,
)

router = APIRouter(prefix="/api/reports", tags=["Reports"])


@router.get("/summary", response_model=SummaryReport)
async def summary_report(db: AsyncSession = Depends(get_db)):
    # Total asset types
    type_count = (await db.execute(select(func.count(AssetType.id)))).scalar() or 0

    # Total active (non-deleted) assets
    asset_count = (
        await db.execute(
            select(func.count(Asset.id)).where(Asset.is_deleted == False)  # noqa: E712
        )
    ).scalar() or 0

    # Active leases
    lease_count = (await db.execute(select(func.count(Lease.id)))).scalar() or 0

    # Total revenue collected
    total_revenue = (
        await db.execute(select(func.coalesce(func.sum(Payment.amount_paid), 0)))
    ).scalar()

    # Total contract value
    total_contract = (
        await db.execute(
            select(func.coalesce(func.sum(Lease.total_contract_amount), 0))
        )
    ).scalar()

    pending = Decimal(str(total_contract)) - Decimal(str(total_revenue))

    return SummaryReport(
        total_asset_types=type_count,
        total_assets=asset_count,
        active_leases=lease_count,
        total_revenue=Decimal(str(total_revenue)),
        pending_balance=pending,
    )


@router.get("/asset/{asset_id}", response_model=list[AssetReport])
async def asset_report(asset_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Asset).where(Asset.id == asset_id))
    asset = result.scalar_one_or_none()
    if not asset:
        raise HTTPException(404, "Asset not found")

    reports = []
    for lease in asset.leases:
        paid = sum((p.amount_paid for p in lease.payments), Decimal("0"))
        reports.append(
            AssetReport(
                asset_id=asset.id,
                asset_name=asset.name,
                total_contract_value=lease.total_contract_amount,
                total_paid=paid,
                remaining_balance=lease.total_contract_amount - paid,
            )
        )
    return reports


@router.get("/monthly", response_model=list[MonthlyReportItem])
async def monthly_report(
    year: int = Query(..., description="Year of the report"),
    month: int = Query(..., ge=1, le=12, description="Month of the report"),
    db: AsyncSession = Depends(get_db)
):
    # Fetch all assets and their related leases/payments (asset_type loaded via selectin)
    result = await db.execute(
        select(Asset).where(Asset.is_deleted == False).options(
            selectinload(Asset.leases).selectinload(Lease.payments)
        )
    )
    assets = result.scalars().all()

    _, last_day = calendar.monthrange(year, month)
    start_of_month = date(year, month, 1)
    end_of_month = date(year, month, last_day)

    reports = []
    for asset in assets:
        asset_type_name = asset.asset_type.name if asset.asset_type else None

        # Check if there is an active lease for this month
        active_lease = None
        for lease in asset.leases:
            if lease.start_date <= end_of_month and lease.end_date >= start_of_month:
                active_lease = lease
                break
                
        expected_rent = asset.base_price

        if active_lease:
            # Payments made in this specific month
            payments_this_month = [
                p for p in active_lease.payments
                if p.date_collected.year == year and p.date_collected.month == month
            ]
            paid_this_month = sum(p.amount_paid for p in payments_this_month)
            last_payment_date = max(
                (p.date_collected for p in payments_this_month), default=None
            )
            
            balance_this_month = max(Decimal("0"), expected_rent - paid_this_month)
            
            if balance_this_month <= 0:
                status = "Paid"
            elif paid_this_month > 0:
                status = "Partially Paid"
            else:
                status = "Unpaid"
                
            reports.append(
                MonthlyReportItem(
                    asset_name=asset.name,
                    asset_type_name=asset_type_name,
                    tenant_name=active_lease.tenant_name,
                    expected_rent=expected_rent,
                    amount_paid=paid_this_month,
                    balance=balance_this_month,
                    status=status,
                    last_payment_date=last_payment_date,
                )
            )
        else:
            # Asset is vacant this month
            reports.append(
                MonthlyReportItem(
                    asset_name=asset.name,
                    asset_type_name=asset_type_name,
                    tenant_name="—",
                    expected_rent=Decimal("0"),
                    amount_paid=Decimal("0"),
                    balance=Decimal("0"),
                    status="Vacant",
                    last_payment_date=None,
                )
            )
            
    # Sort the report by asset name for easier readability
    reports.sort(key=lambda x: x.asset_name.lower())
    return reports


@router.get("/annual/{asset_id}", response_model=AnnualReport)
async def annual_report(
    asset_id: str,
    year: int = Query(..., description="Year of the report"),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Asset).where(Asset.id == asset_id).options(
            selectinload(Asset.leases).selectinload(Lease.payments)
        )
    )
    asset = result.scalar_one_or_none()
    if not asset:
        raise HTTPException(404, "Asset not found")

    start_of_year = date(year, 1, 1)
    end_of_year = date(year, 12, 31)

    total_expected = Decimal("0")
    total_paid = Decimal("0")
    report_leases = []
    report_payments = []

    for lease in asset.leases:
        # Check if lease overlaps with this year
        if lease.start_date <= end_of_year and lease.end_date >= start_of_year:
            # For simplicity, we add the total contract amount of any lease that touches this year
            # A more complex approach would prorate it based on days in the year
            total_expected += lease.total_contract_amount
            report_leases.append(
                AnnualReportLeaseDetails(
                    tenant_name=lease.tenant_name,
                    start_date=lease.start_date,
                    end_date=lease.end_date,
                    contract_amount=lease.total_contract_amount,
                )
            )

        # Collect payments made in this year
        for payment in lease.payments:
            if payment.date_collected.year == year:
                total_paid += payment.amount_paid
                report_payments.append(
                    AnnualReportPaymentDetails(
                        amount_paid=payment.amount_paid,
                        date_collected=payment.date_collected,
                    )
                )

    report_payments.sort(key=lambda p: p.date_collected)
    report_leases.sort(key=lambda l: l.start_date)

    return AnnualReport(
        asset_id=asset.id,
        asset_name=asset.name,
        year=year,
        total_expected_rent=total_expected,
        total_paid=total_paid,
        balance=max(Decimal("0"), total_expected - total_paid),
        leases=report_leases,
        payments=report_payments,
    )

@router.get("/dynamic", response_model=DynamicReport)
async def dynamic_report(
    asset_id: str = Query("all", description="Specific asset ID or 'all'"),
    start_date: date = Query(..., description="Start date of the report period"),
    end_date: date = Query(..., description="End date of the report period"),
    db: AsyncSession = Depends(get_db)
):
    query = select(Asset).where(Asset.is_deleted == False).options(
        selectinload(Asset.asset_type),
        selectinload(Asset.leases).selectinload(Lease.payments)
    )
    if asset_id != "all":
        query = query.where(Asset.id == asset_id)

    result = await db.execute(query)
    assets = result.scalars().all()

    paid_list = []
    overdue_list = []

    for asset in assets:
        for lease in asset.leases:
            # Check for ANY overlap with the requested period
            if lease.start_date <= end_date and lease.end_date >= start_date:
                # Based on client logic: Expected Rent per month is the monthly_rate
                expected_rent = lease.monthly_rate if hasattr(lease, 'monthly_rate') and lease.monthly_rate else asset.base_price
                
                # Find payments made within this specific timeframe
                payments_in_period = [
                    p for p in lease.payments 
                    if start_date <= p.date_collected <= end_date
                ]
                
                paid_in_period = sum(p.amount_paid for p in payments_in_period)
                payment_date = max((p.date_collected for p in payments_in_period), default=None)
                
                balance = max(Decimal("0"), expected_rent - paid_in_period)
                
                item = DynamicReportItem(
                    lease_id=lease.id,
                    asset_name=asset.name,
                    asset_type=asset.asset_type.name if asset.asset_type else "Unknown",
                    tenant_name=lease.tenant_name,
                    phone_number=lease.phone_number,
                    expected_rent=expected_rent,
                    amount_paid=paid_in_period,
                    balance=balance,
                    start_date=lease.start_date,
                    end_date=lease.end_date,
                    payment_date=payment_date
                )
                
                if balance > 0:
                    overdue_list.append(item)
                else:
                    paid_list.append(item)

    # Sort both lists by asset name
    paid_list.sort(key=lambda x: x.asset_name.lower())
    overdue_list.sort(key=lambda x: x.asset_name.lower())

    return DynamicReport(paid=paid_list, overdue=overdue_list)

@router.get("/expenses", response_model=ExpenseReport)
async def expenses_report(
    year: int = Query(..., description="Year of the report"),
    month: Optional[int] = Query(None, ge=1, le=12, description="Month of the report (optional)"),
    db: AsyncSession = Depends(get_db)
):
    from app.models import Expense
    query = select(Expense).where(func.extract('year', Expense.date_incurred) == year)
    if month:
        query = query.where(func.extract('month', Expense.date_incurred) == month)
    
    result = await db.execute(query)
    expenses = result.scalars().all()
    
    items = [
        ExpenseReportItem(
            item=e.item,
            amount=e.amount,
            date_incurred=e.date_incurred,
            notes=e.notes
        ) for e in expenses
    ]
    
    total = sum((e.amount for e in expenses), Decimal("0"))
    
    return ExpenseReport(
        items=items,
        total_amount=total,
        year=year,
        month=month
    )


@router.get("/financial")
async def financial_report(
    year: int = Query(..., description="Year of the report"),
    db: AsyncSession = Depends(get_db)
):
    """Full P&L Income Statement: Revenues vs Expenses by month."""
    from app.models import Expense

    # Load all payments for the year
    pay_result = await db.execute(
        select(Payment).where(func.extract('year', Payment.date_collected) == year)
    )
    payments = pay_result.scalars().all()

    # Load all expenses for the year
    exp_result = await db.execute(
        select(Expense).where(func.extract('year', Expense.date_incurred) == year)
    )
    expenses = exp_result.scalars().all()

    # Also load lease info for each payment (tenant name)
    lease_result = await db.execute(
        select(Lease).options(selectinload(Lease.asset))
    )
    leases_map = {l.id: l for l in lease_result.scalars().all()}

    # Build monthly buckets (1..12)
    month_names = calendar.month_name  # 1-indexed
    monthly = {}
    for m in range(1, 13):
        monthly[m] = {"revenue": Decimal("0"), "expenses": Decimal("0"), "revenue_items": [], "expense_items": []}

    for p in payments:
        m = p.date_collected.month
        monthly[m]["revenue"] += p.amount_paid
        lease = leases_map.get(str(p.lease_id)) or leases_map.get(p.lease_id)
        asset_name = (lease.asset.name if lease and lease.asset else "")
        tenant_name = (lease.tenant_name if lease else "")
        monthly[m]["revenue_items"].append({
            "date": str(p.date_collected),
            "description": f"{tenant_name} — {asset_name}",
            "amount": str(p.amount_paid),
        })

    for e in expenses:
        m = e.date_incurred.month
        monthly[m]["expenses"] += e.amount
        monthly[m]["expense_items"].append({
            "date": str(e.date_incurred),
            "description": e.item,
            "notes": e.notes or "",
            "amount": str(e.amount),
        })

    total_revenue = sum(p.amount_paid for p in payments) or Decimal("0")
    total_expenses = sum(e.amount for e in expenses) or Decimal("0")
    net_income = total_revenue - total_expenses

    months_data = []
    for m in range(1, 13):
        d = monthly[m]
        net = d["revenue"] - d["expenses"]
        months_data.append({
            "month": m,
            "month_name": month_names[m],
            "revenue": str(d["revenue"]),
            "expenses": str(d["expenses"]),
            "net_income": str(net),
            "revenue_items": d["revenue_items"],
            "expense_items": d["expense_items"],
        })

    return {
        "year": year,
        "total_revenue": str(total_revenue),
        "total_expenses": str(total_expenses),
        "net_income": str(net_income),
        "months": months_data,
    }
