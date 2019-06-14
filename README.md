# console-files

Simple Node.js package to write application outputs to files.

It works as a default JavaScript
[`Console`](https://developer.mozilla.org/en-US/docs/Web/API/Console) object,
but with special handlers for `.log` and `.error` methods,
saving output to configured files.

It also treats application fatal errors
(`uncaughtException`), appending error message to file
before exiting process.

## Using

```bash
npm i --save console-files
```

```js
const logger = require('console-files')

/*
Do the stuff
*/

logger.log('Hello console-files!')

/*
More work to do
*/

logger.error(new Error('Keep calm, it is just a test ;)'))
```

## Configuration

It's configurable through the following
environment variables:

Environment variable  | Method   | Default
---                   | ---      | ---
`LOGGER_OUTPUT`       | `.log`   | `./logger.out`
`LOGGER_ERRORS`       | `.error` | `./logger.err`
`LOGGER_FATAL_ERRORS` | -        | `./_stderr`
`LOGGER_SKIP_FATAL`   | -        | -

## Development and production

`console-files` checks the `NODE_ENV`
to work differently for production and development modes:

```js
const devMode = process.env.NODE_ENV !== 'production'
```

- On dev mode it'll output to default console,
unless the `LOGGER_OUTPUT` or `LOGGER_FATAL_ERRORS`
env variable is explicitly set;

- On production mode it'll output only to files;
