from sqlalchemy import ForeignKeyConstraint, Enum
from .sql_loader import *
from . import db

class GroupTable(InitialMixin, db.base):
    __tablename__ = "groups"

    title = Column(String(80), nullable=False, unique=True)
    content = Column(Text)

    author_id = Column(Uuid(as_uuid=True), ForeignKey('users.id'))

    posts = relationship("PostTable", backref="groups")

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

    post_props = relationship("PostPropsTable", uselist=False, backref="posts")
    post_images = relationship("PostImagesTable", uselist=False, backref="posts")

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)

    __table_args__ = (
        ForeignKeyConstraint(
            ['group_id'], ['groups.id'], 
            name='fk_group_id'
        ),
    )


class PostPropsTable(InitialMixin, db.base):
    __tablename__ = "postprops"

    post_id = Column(Uuid(as_uuid=True), ForeignKey('posts.id'))
    rank = Column(String)

    # For social media
    discord_tag = Column(String)
    telegram_tag = Column(String)

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)


class PostImagesTable(InitialMixin, db.base):
    __tablename__ = "postimages"

    post_id = Column(Uuid(as_uuid=True), ForeignKey('posts.id'))

    main = Column(LargeBinary, nullable=True)
    
    second = Column(LargeBinary, nullable=True)
    third = Column(LargeBinary, nullable=True)
    fourth = Column(LargeBinary, nullable=True)
    fifth = Column(LargeBinary, nullable=True)

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)

    def get_main(self):
        return b64encode(
            self.main
        ).decode() if self.main else None