#!/bin/bash
set -e

cd "$(dirname "$0")/.."
docker compose down
echo "Intranet de NovaCare detenida correctamente."
