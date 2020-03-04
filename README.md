# Kudos API

✨ This API uses [this boilerplate](https://github.com/jeffijoe/koa-es7-boilerplate) for writing beautiful `async-await`-based Koa API's using `babel` for **Node v8.0 and above!**. 🚀

Kudos is a noun that means “praise, honor, or acclaim.” Kudo is the singular version of kudos, but kudos is also singular. Kudos comes from the Greek word kydos, which means praise or renown. Kudos are usually offered in response to an exceptional achievement. The Kudos API is an online employee experience and culture platform that leverages the power of employee recognition.

## Auth

This API uses a systema based on passwordless authentication and JWT. Passwordless authentication is becoming an increasingly relevant option for login. The system works generating two tokens, one public and one private. When users try to log in, the private token is saved in their devices, and the public token travels as part as a __magic link__. When users click on that __magic link__, both token are validated in the api.

## TODO

- Integration with an email provider
- More social interaction like favoriting kudos, rankings, etc...
- Roles
- Administration endpoints to create companies, people...
- Continuous integration and deployment system

## Migrations

Kudos uses [knex](https://knexjs.org) to manage migrations. Knex is an SQL query builder for Node.js.

## `npm run` scripts

There are a few defined run scripts, here's a list of them with a description of what they do. To run them, simply execute `npm run <script name>` - e.g. `npm run dev`

- `start`: Used by the production environment to start the app. This will run a compiled version, so you need to execute `build` first.
- `build`: Runs the `babel` CLI to compile the app. Files are emitted to `dist/`.
- `dev`: Runs the app in development mode - uses `babel-node` to compile on-the-fly. Also uses `nodemon` to automatically restart when stuff changes.
- `test`: Runs tests.
- `cover`: Runs tests and collects coverage.
- `lint`: Lints + formats the code.

**Tip**: to pass additional arguments to the actual CLI's being called, do it like in this example:

**For npm:**

```bash
npm run test -- --debug
```

**For yarn:**

```bash
yarn test --debug
```

## `make` scripts

**For running dev:**

```bash
make dev
```

**For running test:**

```bash
make test
```

**Tip**: If you get an error 126 running Docker, try:

```
sudo chmod +x bin/wait-for.sh
```

## Directory structure

The repository root contains auxiliary files like `package.json`, `.gitignore`, etc.

- `src`: the actual source for the app goes here. Duh.
  - `__tests__`: In the source root folder, contains integration tests.
  - `routes`: API endpoints go here, and are automatically loaded at startup. Please see the section about API endpoints for details.
  - `bin`: files that are usually executed by `npm run` scripts, e.g. starting the server.
  - `lib`: stuff that helps the app start up, e.g. environment, logger, the container configuration, etc.
  - `middleware`: custom app middleware.
  - `services`: application services, this is just to illustrate the dynamic discovery of stuff as described in the Dependency injection section.
    - `__tests__`: Unit tests for files in the `services` directory.
  - `[your directory]`: you can plop anything else here, too.
    - `__tests__`: Unit tests for files in your directory.

## Testing

To recap the previous section, `src/__tests__` are for integration tests, and any `__tests__` folder under `src/<folder>` are unit tests.

Test files must end with `.test.js`.

There is a [`src/__tests__/api-helper.js`][api-helper] that makes writing integration tests way easier. Simply replace the example functions with ones matching your own API. The created server instance is closed whenever all tests are done as to not leak resources. This is why it's **important to close network connections in the [`close`][close-event] event!**

## Environment variables

The environment variables can be reached by importing `lib/env`.

```
import { env } from '../lib/env'
```

Additionally, all environment variables you'd usually find on `process.env` will be available on this object.

When attempting to access a key (`env.PORT` for example), if the key does not exist an error is thrown and the process terminated.

In the repository root, you will find a `env.yaml`, which is where you can set up environment variables so you won't have to do it from your shell. This also makes it more platform-agnostic.

The top-level nodes in the YAML-file contain a set of environment variables.
`yenv` will load the set that matches whatever `NODE_ENV` says.

I've set it up so anything in `tests` will override anything in `development` when running tests.

_Actual environment variables will take precedence over the `env.yaml` file!_

See the [`yenv` docs](https://github.com/jeffijoe/yenv) for more info.

## API endpoints

Each file in `/routes` exports a "controller" that `awilix-koa` will use for routing. Please see [`awilix-koa`](https://github.com/jeffijoe/awilix-koa#awesome-usage) docs for more information.

## Dependency injection

This boilerplate uses the [`Awilix`](https://github.com/jeffijoe/awilix) container for managing dependencies - please check out the Awilix documentation
for details. The container is configured in `lib/container.js`.

## Middleware

Middleware is located in the `middleware` folder and is _not_ automatically loaded - they should be installed in `lib/server`.

# Author

- Buti - [@nobuti](https://github.com/nobuti)

# License

MIT.

[api-helper]: /src/__tests__/api-helper.js
[close-event]: /src/lib/server.js#L58