from fastapi import Path
from api_loader import *
from base_loader import *
from src.db.utils import get_scalar_by_uuid
from src.models.base_models import Subdated
from sqlalchemy.orm import selectinload


from src.db.auth import UserTable
from src.db.post import GroupUserMemberships

from src.models.auth import PasswordsRequest

router = APIRouter(prefix="/tg")
api_key = lambda uid: f"$[{uid}]::{token_urlsafe(16)};{password.encrypt(token_urlsafe(8)+str(uuid4()))}"

@router.post("/{api_token}/match")
async def match_api_token(
    request: Request, body: PasswordsRequest,
    api_token: str = Path(..., title="Api Key(Token)"), 
    session: AsyncSession = Depends(db.get_session)
):
    tokenpart = api_token.split("]")[0][2:]
    user = (await get_scalar_by_uuid(
        tokenpart, session
    ))

    if user:
        if password.verify(body.password, user.password):
            new_key = api_key(user.id)
            user.api_key = new_key
            await session.commit()

            return JSONResponse(
                Subdated(
                    subdata={
                        "api_key":new_key,
                        "username": user.username, 
                    }
                ).model_dump()
            )
        else:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Forbiden. Incorrect password.")
    else: 
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User is not exists")
    
@router.post("/{api_token}")
async def api_token(
    request: Request, api_token: str = Path(..., title="Api Key(Token)"), 
    session: AsyncSession = Depends(db.get_session)
):
    user = (await session.execute(
        select(UserTable).where(UserTable.api_key == api_token)
    )).scalar_one_or_none()

    if user:
        membersips = (await session.execute(
            select(GroupUserMemberships)
                .where(GroupUserMemberships.user_id == user.id)
                .options(selectinload(GroupUserMemberships.group))
        )).scalars().all()

        return JSONResponse(
            Subdated(
                subdata={
                    "api_key": user.api_key,
                    "profile": {
                        "username": user.username,
                        "profile": [ms.group.title for ms in membersips]
                    },
                    "current_group": None
                }
            ).model_dump()
        )
    else:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User is not exists")