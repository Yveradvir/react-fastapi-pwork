from .sql_loader import *
from . import db

class GroupTable(InitialMixin, db.base):
    __tablename__ = "groups"

    title = Column(String(80), nullable=False, unique=True)
    content = Column(Text)
    author_id = Column(Uuid(as_uuid=True), ForeignKey('users.id'))
    posts = relationship("PostTable", cascade="all, delete-orphan", backref="group")

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)

class GroupUserMemberships(InitialMixin, db.base):
    __tablename__ = "gumemberships"

    group_id = Column(Uuid(as_uuid=True), ForeignKey('groups.id'))
    user_id = Column(Uuid(as_uuid=True), ForeignKey('users.id'))
    access = Column(Integer, default=0)

    group = relationship("GroupTable", backref="group_memberships")
    user = relationship("UserTable", backref="group_memberships")

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)

class PostTable(InitialMixin, db.base):
    __tablename__ = "posts"

    group_id = Column(Uuid(as_uuid=True), ForeignKey('groups.id'))
    author_id = Column(Uuid(as_uuid=True), ForeignKey('users.id'))
    title = Column(String(80), nullable=False)
    content = Column(Text, nullable=False)
    active = Column(Boolean, default=True)

    post_props = relationship("PostPropsTable", uselist=False, cascade="all, delete-orphan", backref="post")
    post_images = relationship("PostImagesTable", uselist=False, cascade="all, delete-orphan", backref="post")

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)

class PostPropsTable(InitialMixin, db.base):
    __tablename__ = "postprops"

    post_id = Column(Uuid(as_uuid=True), ForeignKey('posts.id', ondelete='CASCADE'))
    rank = Column(String)
    discord_tag = Column(String)
    telegram_tag = Column(String)

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)

class PostImagesTable(InitialMixin, db.base):
    __tablename__ = "postimages"

    post_id = Column(Uuid(as_uuid=True), ForeignKey('posts.id', ondelete='CASCADE'))

    main = Column(LargeBinary, nullable=True)
    second = Column(LargeBinary, nullable=True)
    third = Column(LargeBinary, nullable=True)
    fourth = Column(LargeBinary, nullable=True)
    fifth = Column(LargeBinary, nullable=True)

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)

    def get_main(self):
        return b64encode(self.main).decode() if self.main else None
