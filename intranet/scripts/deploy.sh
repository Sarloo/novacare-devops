#!/bin/bash
set -e

cd "$(dirname "$0")/.."
mkdir -p logs
touch logs/app.log
docker compose down
docker compose up -d --build
echo "Intranet de NovaCare desplegada correctamente."
