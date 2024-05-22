from aiogram.types import ReplyKeyboardMarkup, KeyboardButton

default_markup_text = ["Confirm", "Contradict"]

def markup(markup_text = default_markup_text, otk=True) -> ReplyKeyboardMarkup:
    _markup = ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text=text) for text in markup_text]
        ],
        resize_keyboard=True, one_time_keyboard=otk
    )

    return _markup
