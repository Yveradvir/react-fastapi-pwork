from enum import Enum, auto

from uuid import UUID, uuid4
from typing import Type

from fastapi import HTTPException, status
from sqlalchemy import Table
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from .auth import UserTable

async def get_scalar_by_uuid(
    uuid_str: str, 
    session: AsyncSession, 
    table_cls: Type[Table] = UserTable
):
    try:
        _uuid = UUID(uuid_str)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid UUID. Must be a valid UUID."
        )
    
    scalar: table_cls = (await session.execute(
        select(table_cls).where(table_cls.id == _uuid)
    )).scalar_one_or_none()
    
    return scalar

class AccessEnum(Enum):
    member = 0
    admin = 1
    owner = 2

class FilterTypes(Enum):
    title = auto()
    new = auto()
    old = auto()

async def filtrating(f, ft, base_query, table):
    if ft == FilterTypes.title:
        if f:
            base_query = base_query.where(table.title.ilike(f))
    elif ft == FilterTypes.new:
        base_query = base_query.order_by(table.created_at.desc())
    elif ft == FilterTypes.old:
        base_query = base_query.order_by(table.created_at.asc())

    return base_query