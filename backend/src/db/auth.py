from .sql_loader import *
from . import db

class UserTable(InitialMixin, db.base):
    __tablename__ = "users"

    username = Column(String(40), nullable=False, unique=True)
    first_name = Column(String(40), nullable=False)
    last_name = Column(String(40), nullable=False)
    
    birth = Column(Date, nullable=False)

    password = Column(Text, nullable=False)
    email = Column(String(120), nullable=False, unique=True)

    # ..._uh means "which user have"    
    groups_uh = relationship("GroupTable", backref="users")
    posts_uh = relationship("PostTable", backref="users")

    profile_image = relationship("ProfileImageTable", uselist=False, backref="users")

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)


class BadTokensTable(InitialMixin, db.base):
    __tablename__ = "badtokens"

    type = Column(String(40), nullable=False)
    jti = Column(Text, nullable=False, unique=True, index=True)

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)

class ProfileImageTable(InitialMixin, db.base):
    __tablename__ = "profileimages"

    image = Column(LargeBinary, nullable=True)
    first = Column(String, nullable=True)
    user_id = Column(Uuid(as_uuid=True), ForeignKey('users.id'))

    @staticmethod
    async def add_new(b64: str, uid: str):
        first, image = b64.split(",")
        image = b64decode(image.encode())

        async with db.session() as session:
            new_image = ProfileImageTable(
                image=image,
                first=first+",",
                user_id=uid
            )

            session.add(new_image)
            await session.commit()

    def __init__(self, **kwargs) -> None:
        super(ProfileImageTable, self).__init__(**kwargs)
