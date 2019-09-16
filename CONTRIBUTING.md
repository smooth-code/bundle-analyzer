# Contributing

## Applications

### client

The client of Bundle Analyzer, available in production on `https://app.bundle-analyzer.com`.

A static application deployed automatically by [Netlify](https://app.netlify.com/sites/bundle-analyzer-app/).

### server

The server of Bundle Analyzer, available in production on `https://api.bundle-analyzer.com`.

A Node.js application deployed automatically by [Heroku](https://dashboard.heroku.com/apps/bundle-analyzer-api).

### docs

The docs of Bundle Analyzer, available in production on `https://docs.bundle-analyzer.com`.

A static application deployed automatically by [Netlify](https://app.netlify.com/sites/bundle-analyzer-docs/).

## Setup project

### Requirements

- [nvm](https://github.com/nvm-sh/nvm)
- [Docker](https://docker.com)
- [yarn](https://yarnpkg.com)

### Getting Started

1. Be sure to use the correct Node.js version specified in `.nvmrc`.
2. Install dependencies at the root of the repository: `yarn`.
3. Setup environment variables:

- Copy `apps/client/example.env` to `.env` and fill the values (available in OnePassword).
- Copy `apps/server/example.env` to `.env` and fill the values (available in OnePassword).

4. Start database and RabbitMQ, at the root of the repository: `docker-compose up -d`.
5. Initialize the database, at the root of the repository: `yarn setup`.
6. Run the project in development: `yarn dev`.

- The app is available at `http://localhost:8080`
- The API is available at `http://localhost:3000`
- A GraphQL Playground is available at `http://localhost:3000/graphql`
- A RabbitMQ interface is available at `http://localhost:15672` (guest / guest)

## Database

### Create a new migration

To create a new migration, run the following command at the root of the repository:

```bash
yarn workspace server knex migrate:make <name-of-migration>
```

### Run migrations

To run migrations, run the following command at the root of the repository:

```bash
yarn workspace server db:migrate
```

### Reset database

To reset database, run the following command at the root of the repository:

```bash
yarn workspace server db:reset
```
