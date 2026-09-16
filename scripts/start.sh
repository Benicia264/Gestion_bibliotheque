#!/bin/sh
set -e

CONN="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}"
DUMP_FILE="database/bibliothèque.sql"

TABLE_EXISTS=$(psql -tAc "SELECT to_regclass('public.livres') IS NOT NULL;" "$CONN" 2>/dev/null || echo "f")

if [ "$TABLE_EXISTS" != "t" ]; then
  echo "Base de données vide : import du schéma initial ($DUMP_FILE)..."
  # \restrict/\unrestrict (pg_dump >=18 search_path guards), OWNER TO
  # statements (dump was taken with a "root" role that won't exist on the
  # target instance) and the transaction_timeout setting (PG17+ only, the
  # target instance may be older) are stripped; the connecting DB_USER
  # becomes the owner of everything it creates, which is all the app needs.
  grep -vE '^[\](restrict|unrestrict)' "$DUMP_FILE" \
    | sed -e '/OWNER TO/d' -e '/SET transaction_timeout/d' \
    | psql -v ON_ERROR_STOP=1 "$CONN"
  echo "Import terminé."
else
  echo "Schéma déjà présent : import ignoré."
fi

exec node src/server.js
