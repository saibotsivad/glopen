# Globbed OpenAPI

TODO: write all this

## Folders

The folders explained:

### controller-kv

This has controllers per-functionality that use Cloudflare KV as the datastore.

### controller-dynamodb

This has controllers per-functionality that use AWS DynamoDB as the datastore.

### controller-memory

This has controllers that only store data in-memory. Once the server is shut down, all data is lost.

This isn't probably useful other than as a demo.

### controller-mongodb

This has controllers per-functionality that use MongoDB Atlas' "Data API" as the datastore.
