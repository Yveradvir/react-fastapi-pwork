from .sql_loader import *

class Database:
    engine: Union[AsyncEngine, None] = None
    session: Union[AsyncSession, None] = None
    base: Union[DeclarativeBase, None] = None

    def __init__(self, url: Union[str, None] = None) -> None:
        self.base = Base
        
        if url:
            self.init(url)
    
    def init(self, url):
        self.engine = create_async_engine(url, echo=False)
        self.session = async_sessionmaker(self.engine, expire_on_commit=False)

    async def init_models(self):
        async with self.engine.begin() as conn:
            # await conn.run_sync(self.base.metadata.drop_all)
            await conn.run_sync(self.base.metadata.create_all)

    async def get_session(self):
        async with self.session() as session:
            yield session
