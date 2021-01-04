Activate Execution Policy (temporarily) for power shell to run venv

> Set-ExecutionPolicy Unrestricted -scope Process

Power Shell run Flask

> $env:FLASK_APP = "main.py"

> python -m flask run