# console-files

Simple package to handle console output to files

Environment variable  | Method   | Default
---                   | ---      | ---
`LOGGER_OUTPUT`       | `.log`   | `/var/log/node-logger.out`
`LOGGER_ERRORS`       | `.error` | `/var/log/node-logger.err`
`LOGGER_FATAL_ERRORS` | -        | `/var/log/node-stderr`
`LOGGER_SKIP_FATAL`   | -        | -
