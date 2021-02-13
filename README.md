# Digi Backend Test

# Installation
```bash
npm ci
```

# Development
```bash
docker-compose up -d
npm run dev
```

You can access the API at http://localhost:3000

Swagger URL is at /swagger

# Testing
```bash
npm test
```

# Deployment

Some configs needed for deploying to Heroku:

```
DATABASE_URL: $INSERT_UR_POSTGRES_URI_HERE
PGSSLMODE: no-verify
```

# Files
```sh
- api.js : Holds the `openapi-backend` configs
- db.js/knexfile.js: Holds the database config
- jwt.js: JWT configs and secrets
- handlers.js: The actual controllers that handles the requests and responses
- validation.js: Basic validation utils
- app.js: Main application
- test/: The tests files of the application
```