Activate Execution Policy (temporarily) for power shell to run venv

> Set-ExecutionPolicy Unrestricted -scope Process

Power Shell run Flask

> $env:FLASK_APP = "main.py"

> python -m flask run

To run on port 8080: 

> python main.py 

Flask, requests, sqlite3