from enum import Enum, auto

from uuid import UUID, uuid4
from typing import Type

from fastapi import HTTPException, status
from sqlalchemy import Table
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from src.db.post import GroupUserMemberships

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
    print(f, ft)
    if ft == FilterTypes.title.name:
        if f.strip():
            base_query = base_query.where(table.title.ilike(f))
    elif ft == FilterTypes.new.name:
        base_query = base_query.order_by(table.created_at.desc())
    elif ft == FilterTypes.old.name:
        base_query = base_query.order_by(table.created_at.asc())

    return base_query

async def max_memberships(session: AsyncSession, user_id):
    q = select(GroupUserMemberships).where(
        GroupUserMemberships.user_id == user_id
    )

    if len((await session.execute(q)).scalars().all()) >= 5:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "You cannot be a member more than 5 groups (Including your own)")