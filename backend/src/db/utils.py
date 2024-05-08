from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from .auth import UserTable


async def get_user_by_uuid(user_id: str, session: AsyncSession) -> UserTable:
    try:
        user_uuid = UUID(user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID. Must be a valid UUID."
        )

    user = (await session.execute(
        select(UserTable).where(UserTable.id == user_uuid)
    )).scalar_one_or_none()

    return user
