import asyncio
import os
from datetime import datetime
from sqlalchemy import select
from app.database import async_session
from app.models import AssetType, Asset, Lease, Payment

async def seed_data():
    async with async_session() as session:
        # 1. Get or Create Asset Types (Room, Shop)
        result = await session.execute(select(AssetType).where(AssetType.name == 'Room'))
        room_type = result.scalars().first()
        if not room_type:
            room_type = AssetType(name="Room")
            session.add(room_type)
            
        result = await session.execute(select(AssetType).where(AssetType.name == 'Shop'))
        shop_type = result.scalars().first()
        if not shop_type:
            shop_type = AssetType(name="Shop")
            session.add(shop_type)
            
        await session.flush() # To get IDs
        
        # 2. Extract specific units from Excel mapping
        data_to_insert = [
            {"unit": "1", "type_id": room_type.id, "tenant": "Ahmed Ali", "rent": 800, "paid": 800, "pay_date": "2026-03-05"},
            {"unit": "2", "type_id": room_type.id, "tenant": "Mohammed Salem", "rent": 800, "paid": 800, "pay_date": "2026-03-04"},
            {"unit": "3", "type_id": room_type.id, "tenant": "Abdullah Hassan", "rent": 800, "paid": 600, "pay_date": "2026-03-06"},
            {"unit": "19", "type_id": shop_type.id, "tenant": "Gulf Company", "rent": 2500, "paid": 2500, "pay_date": "2026-03-03"},
            {"unit": "20", "type_id": shop_type.id, "tenant": "Al Noor Store", "rent": 2500, "paid": 2500, "pay_date": "2026-03-02"},
            {"unit": "21", "type_id": shop_type.id, "tenant": "Al Salam Grocery", "rent": 2500, "paid": 2000, "pay_date": "2026-03-07"},
        ]
        
        # Prevent re-running if data exists
        result = await session.execute(select(Asset).where(Asset.name == 'Unit 1'))
        if result.scalars().first():
            print("Test data already seems to exist in the database.")
            return

        for item in data_to_insert:
            # Insert Asset
            asset = Asset(
                type_id=item['type_id'], 
                name=f"Unit {item['unit']}", 
                base_price=item['rent'], 
                status='Rented'
            )
            session.add(asset)
            await session.flush()
            
            # Insert Lease (March 1 to Dec 31 for example duration calculation)
            lease = Lease(
                asset_id=asset.id, 
                tenant_name=item['tenant'], 
                start_date=datetime.strptime('2026-03-01', '%Y-%m-%d').date(), 
                end_date=datetime.strptime('2026-12-31', '%Y-%m-%d').date(), 
                total_contract_amount=item['rent'] * 10
            )
            session.add(lease)
            await session.flush()
            
            # Insert Payment (Revenue) for March
            payment = Payment(
                lease_id=lease.id, 
                amount_paid=item['paid'], 
                date_collected=datetime.strptime(item['pay_date'], '%Y-%m-%d').date(), 
                payment_method='Cash'
            )
            session.add(payment)
            
        await session.commit()
        print("Test data inserted successfully!")

if __name__ == "__main__":
    asyncio.run(seed_data())
