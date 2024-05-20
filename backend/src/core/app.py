from contextlib import asynccontextmanager
from config import _g
from api_loader import *
from .set_routers import set_routers

@asynccontextmanager
async def lifespan(app: FastAPI):
    db.init(_g("db_url"))
    await db.init_models()

    yield

def makeapp() -> FastAPI:
    """
    The function to launch FastApi application

    Returns:
        FastAPI: The launched FastAPI instance.
    """
    app = FastAPI(debug=True, lifespan=lifespan)

    app.add_middleware(
        CORSMiddleware, allow_credentials = True,
        allow_origins = [
            "http://localhost:4200"
        ],
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
        allow_headers=["*"],
    )

    set_routers(app)

    return app

app = makeapp()