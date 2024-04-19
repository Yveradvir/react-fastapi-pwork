from os import path, environ
from dotenv import load_dotenv

basepath = path.join(path.dirname(__file__), "..")

load_dotenv(
    path.join(
        basepath, ".env"
    )
)

_g = lambda key: environ.get(key.upper(), None)
