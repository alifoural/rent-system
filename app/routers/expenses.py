from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.database import get_db
from app.models import Expense
from app.schemas import ExpenseOut, ExpenseCreate

router = APIRouter(prefix="/api/expenses", tags=["Expenses"])


@router.get("/", response_model=List[ExpenseOut])
async def get_expenses(db: AsyncSession = Depends(get_db)):
    """Fetch all expenses ordered by date (newest first)."""
    result = await db.execute(
        select(Expense)
        .order_by(Expense.date_incurred.desc())
    )
    return result.scalars().all()


@router.post("/", response_model=ExpenseOut)
async def create_expense(expense_in: ExpenseCreate, db: AsyncSession = Depends(get_db)):
    """Log a new expense."""
    new_expense = Expense(**expense_in.model_dump())
    db.add(new_expense)
    try:
        await db.commit()
        await db.refresh(new_expense)
        return new_expense
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{expense_id}")
async def delete_expense(expense_id: str, db: AsyncSession = Depends(get_db)):
    """Delete an expense record."""
    result = await db.execute(select(Expense).filter(Expense.id == expense_id))
    expense = result.scalar_one_or_none()
    
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
        
    await db.delete(expense)
    await db.commit()
    return {"status": "success", "message": "Expense deleted"}
