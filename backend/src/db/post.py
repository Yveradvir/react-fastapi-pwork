from .sql_loader import *
from . import db

class PostTable(InitialMixin, db.base):
    __tablename__ = "posts"

    title = Column(String(80), nullable=False)
    content = Column(Text, nullable=False)

    post_props = relationship("PostPropsTable", uselist=False, backref="posts")
    post_images = relationship("PostImagesTable", uselist=False, backref="posts")

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)

class PostPropsTable(InitialMixin, db.base):
    __tablename__ = "postprops"

    post_id = Column(Uuid(as_uuid=True), ForeignKey('posts.id'))
    price = Column(Integer)


class PostImagesTable(InitialMixin, db.base):
    __tablename__ = "postimages"

    post_id = Column(Uuid(as_uuid=True), ForeignKey('posts.id'))

    main = Column(LargeBinary, nullable=True)
    
    second = Column(LargeBinary, nullable=True)
    third = Column(LargeBinary, nullable=True)
    fourth = Column(LargeBinary, nullable=True)
    fifht = Column(LargeBinary, nullable=True)