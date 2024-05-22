from subprocess import Popen

def run_server(): Popen(['start', 'cmd', '/k', 'cd ./backend && uvicorn run_server:app --host localhost --port 4300 --reload'], shell=True)
def run_bot(): Popen(['start', 'cmd', '/k', 'python backend/run_bot.py'], shell=True)

if __name__ == "__main__":
    run_server()
    run_bot()