# Python Server

This folder contains the backend Flask API used by the app.

Quick start (local):

1. Create a virtualenv and install requirements:

```bash
python -m venv .venv
source .venv/Scripts/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

2. Run locally:

```bash
python main.py
```

Docker (build + run):

```bash
docker build -t beacon-python-server .
docker run -p 5000:5000 -e PORT=5000 beacon-python-server
```

Heroku/Procfile:

Heroku will use the `Procfile` and run `gunicorn wsgi:app`.
