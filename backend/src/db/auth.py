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

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "birth": self.birth.isoformat(),
            "email": self.email
        }

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)


class BadTokensTable(InitialMixin, db.base):
    __tablename__ = "badtokens"

    type = Column(String(40), nullable=False)
    jti = Column(Text, nullable=False, unique=True, index=True)

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)
