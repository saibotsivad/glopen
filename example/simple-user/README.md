# Glopen Example: Simple User

This example uses the [../../definition/single-user](single-user) and [../../definition/user-session](user-session) definitions, the MongoDB [../../controller-mongodb-data-api/single-user](single-user) and [../../controller-mongodb-data-api/user-session](user-session) controllers backed by [memgo](https://github.com/saibotsivad/memgo), an in-memory MongoDB Data API, and uses [Polka](https://github.com/lukeed/polka) as the server.

The main user/session routes are imported, and the related controllers as well.

Since this is a demo, no data is persisted, it is only stored in memory. The file structure would be identical with a persistent data store.

## Files and Folders

This project has the following files and folders--look at each one for additional comments and information.

#### [glopen.config.js](./glopen.config.js)

This file is the [glopen] configuration, which imports pre-built OpenAPI definitions and handlers for user sessions, e.g. logging in and out.

#### [package.json](./package.json)

The usual dependency and script management file. Notice that the main dependencies for this demo are the controllers and the definitions, plus the [glopen] CLI tool for building, plus [polka] (a very lightweight HTTP server).

#### [README.md](./README.md)

The file you're looking at now!

#### [server.js](./server.js)

The JavaScript file used to launch the server.

---

## License

The code for this project, and all documentation, are published under the [Very Open License](http://veryopenlicense.com/).

[glopen]: https://github.com/saibotsivad/glopen
[polka]: https://github.com/lukeed/polka
