from sqlalchemy import Date
from sql_loader import *
from . import db

class UserTable(db.base):
    __tablename__ = "users"

    username = Column(String(40), nullable=False, unique=True)
    first_name = Column(String(40), nullable=False)
    last_name = Column(String(40), nullable=False)
    
    birth = Column(Date, nullable=False)

    password = Column(Text, nullable=False)
    email = Column(String(120), nullable=False, unique=True)


class BadTokensTable(db.base):
    __tablename__ = "badtokens"

    type = Column(String(40), nullable=False)
    jti = Column(Text, nullable=False, unique=True, index=True)

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)
