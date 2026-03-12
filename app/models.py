import uuid
from datetime import date, datetime
from sqlalchemy import (
    Column,
    String,
    Text,
    Numeric,
    Boolean,
    Date,
    DateTime,
    ForeignKey,
    JSON,
    func,
)
from sqlalchemy.orm import relationship
from app.database import Base


def gen_uuid():
    return str(uuid.uuid4())


class AssetType(Base):
    __tablename__ = "asset_types"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    name = Column(String(100), nullable=False, unique=True)
    created_at = Column(DateTime, server_default=func.now())

    assets = relationship("Asset", back_populates="asset_type", lazy="selectin")


class Asset(Base):
    __tablename__ = "assets"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    type_id = Column(
        String(36), ForeignKey("asset_types.id"), nullable=False
    )
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    base_price = Column(Numeric(12, 2), nullable=False, default=0)
    status = Column(String(20), nullable=False, default="Available")
    metadata_ = Column("metadata", JSON, nullable=True)
    is_deleted = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())

    asset_type = relationship("AssetType", back_populates="assets", lazy="selectin")
    leases = relationship("Lease", back_populates="asset", lazy="selectin")


class Lease(Base):
    __tablename__ = "leases"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    asset_id = Column(String(36), ForeignKey("assets.id"), nullable=False)
    tenant_name = Column(String(200), nullable=False)
    phone_number = Column(String(50), nullable=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    total_contract_amount = Column(Numeric(12, 2), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    asset = relationship("Asset", back_populates="leases", lazy="selectin")
    payments = relationship("Payment", back_populates="lease", lazy="selectin")


class Payment(Base):
    __tablename__ = "payments"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    lease_id = Column(String(36), ForeignKey("leases.id"), nullable=False)
    amount_paid = Column(Numeric(12, 2), nullable=False)
    date_collected = Column(Date, nullable=False)
    payment_method = Column(String(50), nullable=False, default="Cash")
    created_at = Column(DateTime, server_default=func.now())

    lease = relationship("Lease", back_populates="payments", lazy="selectin")


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    item = Column(String(200), nullable=False)
    amount = Column(Numeric(12, 2), nullable=False)
    date_incurred = Column(Date, nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

