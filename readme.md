# Role :

- user = 0
- manager = 1
- admin = 2

# Environment variables :

```
DB_CLIENT=pg
DB_USER=postgres
DB_PASSWORD=postgres
DB_DATABASE=universaldb
SECURITY_ITERATION=10000
SECURITY_NUMBERBYTES=32
SECURITY_FORMATHASH=sha512
SECURITY_SECRET=h3hitemadevoir
```

# Knex migration for table postgresql

```
 - `npx knex migrate:latest`
```
