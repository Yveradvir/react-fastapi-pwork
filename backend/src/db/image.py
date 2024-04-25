from .sql_loader import *
from . import db

class ProfileImageTable(InitialMixin, db.base):
    __tablename__ = "profileimages"

    image = Column(LargeBinary, nullable=True)
    user_id = Column(Uuid(as_uuid=True), ForeignKey('users.id'))

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)
