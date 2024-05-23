from fastapi import FastAPI
from src.routers import (
    auth, profile, 
    post, group, tgbot
)

def set_routers(app: FastAPI):
    """Configure routers for the FastAPI application.

    This function is responsible for adding routers to the FastAPI instance.

    Args:
        app (FastAPI): The FastAPI instance to which routers will be added.
    """
    app.include_router(auth.router)
    app.include_router(profile.router)
    app.include_router(post.router)
    app.include_router(group.router)
    app.include_router(tgbot.router)