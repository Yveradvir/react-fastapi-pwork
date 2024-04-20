from fastapi import FastAPI, Depends, status, HTTPException

from fastapi.requests import Request
from fastapi.responses import JSONResponse

from fastapi.routing import APIRoute, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.logger import logger

from config import _g

from passlib.context import CryptContext
from src.jwt import JwtSecure, JwtConfig
from src.db import db

from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession

jwtsecure = JwtSecure(JwtConfig(
    secret_key=_g("secret_key")
))
password = CryptContext(schemes=["bcrypt"], deprecated="auto")