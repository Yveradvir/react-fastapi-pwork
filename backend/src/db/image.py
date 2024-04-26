from .sql_loader import *
from . import db

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
