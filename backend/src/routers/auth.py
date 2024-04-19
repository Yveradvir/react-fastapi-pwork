from api_loader import *
from base_loader import *

from src.db.auth import UserTable
from src.models.auth import AuthResponse, SignInRequest, SignUpRequest

router = APIRouter(prefix="/auth")

@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def signup(
    request: Request, body: SignUpRequest,
    session: AsyncSession = Depends(db.get_session)
) -> JSONResponse:
    existing_user = (await session.execute(
        select(UserTable).where(UserTable.username == body.username)
    )).scalar_one_or_none()
    is_email_taken = (await session.execute(
        select(UserTable).where(UserTable.email == body.email)
    )).scalar_one_or_none()

    if not existing_user:
        if not is_email_taken:
            body.password = password.hash(body.password)
            body.birth = datetime.strptime(body.birth, "%Y-%m-%dT%H:%M:%S.%fZ")
            new_user = UserTable(**body.dict())

            session.add(new_user)
            await session.commit()

            uid = str(new_user.id)

            access, access_csrf = jwtsecure.create_access_token(data={"id": uid})
            refresh, refresh_csrf = jwtsecure.create_refresh_token(data={"id": uid})

            response = JSONResponse(
                AuthResponse(
                    subdata=AuthResponse.Subdata(
                        uuid=uid
                    )
                ).dict(), status.HTTP_201_CREATED
            )
            
            jwtsecure.set_access_cookie(response, str(access))
            jwtsecure.set_refresh_cookie(response, str(refresh))

            return response
        else:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already exists"
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User already exists"
        )

@router.post("/signin", response_model=AuthResponse, status_code=status.HTTP_200_OK)
async def signin(
    request: Request, body: SignInRequest, 
    session: AsyncSession = Depends(db.get_session)
) -> JSONResponse:
    user = (await session.execute(
        select(UserTable).where(UserTable.username == body.username)
    )).one_or_none()

    if user:
        uid = str(user.id)
        if password.verify(body.password, user.password):
            access, access_csrf = jwtsecure.create_access_token(data={"id": uid})
            refresh, refresh_csrf = jwtsecure.create_refresh_token(data={"id": uid})

            response = JSONResponse(
                AuthResponse(
                    subdata=AuthResponse.Subdata(
                        uuid=uid
                    )
                ).dict(), status.HTTP_200_OK
            )
            
            jwtsecure.set_access_cookie(response, str(access))
            jwtsecure.set_refresh_cookie(response, str(refresh))

            return response
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Passwords don't match"
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User doesn't exists"
        )