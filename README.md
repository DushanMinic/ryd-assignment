# ryd assignment - Node.js/TypeScript/Express/TypeOrm

To run this project, run `docker-compose up` command (this will run migrations and then start the app)

To run tests, type `docker-compose run --rm app npm test`.

In this project you can:

1. Report a new Issue on POST `/issues`
2. Resolve an Issue on PATCH `/issues/:issueId`
3. List all Issues on GET `/issues`