#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status
set -o errexit

# Install python dependencies
pip install -r requirements.txt

# Collect static files into staticfiles/ for WhiteNoise
python manage.py collectstatic --noinput

# Run database migrations on Supabase
python manage.py migrate
