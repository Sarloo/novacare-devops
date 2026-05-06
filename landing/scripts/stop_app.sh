#!/bin/bash
set -e

cd "$(dirname "$0")/.."
docker compose down
echo "Landing de NovaCare detenida correctamente."
