# Prisma Playground

Experiments with Prisma.

## Dev

-   `npm run prisma:init`: setup prisma for the first time, create a SQLite database file and fill it with random data.
-   `npm run prisma:reset`: wipe out the current SQLite database and fill it with new random date.
-   `npm run prisma`: if necessary, update the current database to reflect a changed schema and create a new migration. Prompts the user for a new migration name if one is required.
-   `npm test`: run tests. (Currently there are none.)
-   `npm run test:types`: type-check the whole repo.
-   `npm run test:full`: run the full CI pipeline checking suite.
