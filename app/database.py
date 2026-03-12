import os
from pathlib import Path
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase

# Use DATABASE_URL env var (PostgreSQL) if set, otherwise fallback to SQLite for local dev
DATABASE_URL = os.getenv("DATABASE_URL", "")

if not DATABASE_URL or DATABASE_URL.startswith("postgresql"):
    try:
        import asyncpg  # noqa: F401
        if not DATABASE_URL:
            DATABASE_URL = "postgresql+asyncpg://user:password@db:5432/asset_management"
    except ImportError:
        # Fallback to SQLite when asyncpg is not installed (local dev)
        db_path = Path(__file__).parent.parent / "data" / "app.db"
        db_path.parent.mkdir(parents=True, exist_ok=True)
        DATABASE_URL = f"sqlite+aiosqlite:///{db_path}"

engine = create_async_engine(DATABASE_URL, echo=False)
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def get_db():
    """FastAPI dependency that yields database sessions."""
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


async def init_db():
    """Create all tables on startup."""
    from app import models  # noqa: F401 — ensure models are imported

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
