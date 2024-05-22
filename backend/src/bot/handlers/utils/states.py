from aiogram.fsm.state import State, StatesGroup

class AuthStates(StatesGroup):
    api_key = State()
    password = State()
    
    confirmation = State()