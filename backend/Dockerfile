# ---- Base Stage ----
FROM python:3.11-slim AS base

# Prevents Python from writing .pyc files and enables stdout/stderr logging
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies needed by psycopg
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev gcc \
    && rm -rf /var/lib/apt/lists/*

# ---- Dependencies Stage ----
FROM base AS deps

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ---- Production Stage ----
FROM deps AS production

COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput

EXPOSE 8000

# Use gunicorn for production (not runserver)
CMD ["sh", "-c", "python manage.py migrate && gunicorn notes_project.wsgi:application --bind 0.0.0.0:8000 --workers 2"]
