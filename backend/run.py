from src.core import app
from uvicorn import run


if __name__ == "__main__":
    run(app, host="localhost", port=4300)