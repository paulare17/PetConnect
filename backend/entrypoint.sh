#!/bin/sh
set -e

cd /app/PetConnect

python manage.py migrate --noinput
python manage.py collectstatic --noinput

gunicorn PetConnect.wsgi:application --bind 0.0.0.0:8000
