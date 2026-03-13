from __future__ import annotations
from datetime import date, datetime
from decimal import Decimal
from typing import Any, Optional
from pydantic import BaseModel, ConfigDict, Field


# ── Asset Types ──────────────────────────────────────────────────────────────

class AssetTypeCreate(BaseModel):
    name: str


class AssetTypeUpdate(BaseModel):
    name: str


class AssetTypeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    created_at: Optional[datetime] = None


# ── Assets ───────────────────────────────────────────────────────────────────

class AssetCreate(BaseModel):
    type_id: str
    name: str
    description: Optional[str] = None
    base_price: Decimal = Decimal("0")
    status: str = "Available"
    metadata_: Optional[dict[str, Any]] = Field(None, alias="metadata")


class AssetUpdate(BaseModel):
    type_id: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    base_price: Optional[Decimal] = None
    status: Optional[str] = None
    metadata_: Optional[dict[str, Any]] = Field(None, alias="metadata")


class AssetOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    type_id: str
    name: str
    description: Optional[str] = None
    base_price: Decimal
    status: str
    metadata_: Optional[dict[str, Any]] = Field(None, alias="metadata")
    is_deleted: bool
    created_at: Optional[datetime] = None
    type_name: Optional[str] = None


# ── Leases ───────────────────────────────────────────────────────────────────

class LeaseCreate(BaseModel):
    asset_id: str
    tenant_name: str
    phone_number: Optional[str] = None
    start_date: date
    end_date: date
    total_contract_amount: Decimal


class LeaseUpdate(BaseModel):
    tenant_name: Optional[str] = None
    phone_number: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    total_contract_amount: Optional[Decimal] = None


class LeaseOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    asset_id: str
    tenant_name: str
    phone_number: Optional[str] = None
    start_date: date
    end_date: date
    total_contract_amount: Decimal
    created_at: Optional[datetime] = None
    asset_name: Optional[str] = None
    paid_amount: Optional[Decimal] = None
    remaining: Optional[Decimal] = None


# ── Payments ─────────────────────────────────────────────────────────────────

class PaymentCreate(BaseModel):
    lease_id: str
    amount_paid: Decimal
    date_collected: date
    payment_method: str = "Cash"


class PaymentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    lease_id: str
    amount_paid: Decimal
    date_collected: date
    payment_method: str
    created_at: Optional[datetime] = None
    tenant_name: Optional[str] = None


# ── Expenses ─────────────────────────────────────────────────────────────────

class ExpenseCreate(BaseModel):
    item: str
    amount: Decimal
    date_incurred: date
    notes: Optional[str] = None


class ExpenseOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    item: str
    amount: Decimal
    date_incurred: date
    notes: Optional[str] = None
    created_at: Optional[datetime] = None


# ── Reports ──────────────────────────────────────────────────────────────────

class SummaryReport(BaseModel):
    total_asset_types: int
    total_assets: int
    active_leases: int
    total_revenue: Decimal
    pending_balance: Decimal


class AssetReport(BaseModel):
    asset_id: str
    asset_name: str
    total_contract_value: Decimal
    total_paid: Decimal
    remaining_balance: Decimal

class MonthlyReportItem(BaseModel):
    asset_name: str
    asset_type_name: Optional[str] = None
    tenant_name: str
    expected_rent: Decimal
    amount_paid: Decimal
    balance: Decimal
    status: str
    last_payment_date: Optional[date] = None


class AnnualReportLeaseDetails(BaseModel):
    tenant_name: str
    start_date: date
    end_date: date
    contract_amount: Decimal

class AnnualReportPaymentDetails(BaseModel):
    amount_paid: Decimal
    date_collected: date

class AnnualReport(BaseModel):
    asset_id: str
    asset_name: str
    year: int
    total_expected_rent: Decimal
    total_paid: Decimal
    balance: Decimal
    leases: list[AnnualReportLeaseDetails]
    payments: list[AnnualReportPaymentDetails]

# ── Dynamic Reporting ────────────────────────────────────────────────────────
class DynamicReportItem(BaseModel):
    lease_id: str
    asset_name: str
    asset_type: str
    tenant_name: str
    phone_number: Optional[str] = None
    expected_rent: Decimal
    amount_paid: Decimal
    balance: Decimal
    start_date: date
    end_date: date
    payment_date: Optional[date] = None

class DynamicReport(BaseModel):
    paid: list[DynamicReportItem]
    overdue: list[DynamicReportItem]

# ── Notifications ────────────────────────────────────────────────────────────
class NotificationItem(BaseModel):
    type: str  # "Upcoming" or "Overdue"
    lease_id: str
    asset_name: str
    tenant_name: str
    phone_number: Optional[str] = None
    message: str
    days_remaining: Optional[int] = None
    balance_due: Optional[Decimal] = None

# ── Expense Reporting ────────────────────────────────────────────────────────
class ExpenseReportItem(BaseModel):
    item: str
    amount: Decimal
    date_incurred: date
    notes: Optional[str] = None

class ExpenseReport(BaseModel):
    items: list[ExpenseReportItem]
    total_amount: Decimal
    year: int
    month: Optional[int] = None
