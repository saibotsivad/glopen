# Globbed OpenAPI

TODO: write all this

## Folders

Each folder may have its own `README.md` file, but here is the high level description of each folder:

### controller-kv

This has controllers per-functionality that use Cloudflare KV as the datastore.

### controller-dynamodb

This has controllers per-functionality that use AWS DynamoDB as the datastore.

### controller-mongodb-data-api

This has controllers per-functionality that use MongoDB Atlas' "Data API" as the datastore.

### integration-test

Although each package may have its own tests, this folder holds the test suites that make sure all controllers, definitions, and packages work together correctly.
