#!/bin/bash
set -e

cd "$(dirname "$0")/.."
docker compose up -d
echo "Landing de NovaCare iniciada correctamente."
