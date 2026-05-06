#!/bin/bash

cd "$(dirname "$0")/.."
if [ -f logs/app.log ]; then
  cat logs/app.log
else
  echo "Aun no hay logs. Ejecuta la aplicacion primero."
fi
