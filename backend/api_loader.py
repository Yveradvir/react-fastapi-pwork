from fastapi import FastAPI, Depends

from fastapi.requests import Request
from fastapi.responses import JSONResponse

from fastapi.routing import APIRoute, APIRouter
from fastapi.middleware.cors import CORSMiddleware

from config import _g

from src.jwt import JwtSecure, JwtConfig

jwtsecure = JwtSecure(JwtConfig(
    secret_key=_g("secret_key")
))