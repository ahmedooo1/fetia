#!/usr/bin/env bash
# Sauvegarde la base Postgres et les photos uploadees.
# Usage: ./scripts/backup.sh
set -euo pipefail

cd "$(dirname "$0")/.."

STAMP=$(date +%Y%m%d-%H%M%S)
OUT_DIR="backups/$STAMP"
mkdir -p "$OUT_DIR"

echo "Sauvegarde de la base de donnees..."
docker exec fetia-postgres-1 pg_dump -U fetia fetia > "$OUT_DIR/db.sql"

echo "Sauvegarde des photos uploadees..."
# MSYS_NO_PATHCONV evite que Git Bash sur Windows ne deforme les chemins -v host:container
MSYS_NO_PATHCONV=1 docker run --rm \
  -v fetia_fetia_uploads:/uploads:ro \
  -v "$(pwd)/$OUT_DIR":/backup \
  alpine sh -c "cd /uploads && tar -czf /backup/uploads.tar.gz ."

echo "Termine : $OUT_DIR"
