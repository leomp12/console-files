'use strict'

// Node filesystem module
const fs = require('fs')
// use Node OS module to get current hostname
const host = require('os').hostname()

if (!process.env.LOGGER_SKIP_FATAL) {
  // also debug fatal errors
  process.on('uncaughtException', err => {
    // fatal error
    // log to file before exit
    let msg = '\n' + header() + '\n'
    if (err) {
      if (err.hasOwnProperty('stack')) {
        msg += err.stack
      } else if (err.hasOwnProperty('message')) {
        msg += err.message
      } else {
        msg += err.toString()
      }
      msg += '\n'
    }

    // append error message to stderr file
    fs.appendFile(process.env.LOGGER_FATAL_ERRORS || process.cwd() + '/_stderr', msg, () => {
      process.exit(1)
    })
  })
}

// function to substitute console.log
function log (out, desc) {
  logger.log(header())
  if (desc) {
    logger.log(desc)
  }
  logger.log(out)
  logger.log()
}

// function to substitute console.error
function error (out, desc) {
  logger.error(header())
  if (desc) {
    logger.error(desc)
  }
  logger.error(out)
  logger.error()
}

function header () {
  // return default header to write in log file
  // have to be function to use correct date and time
  return host + ' [' + new Date().toString() + '] '
}

let output, errors, logger
if (process.env.NODE_ENV === 'production' || process.env.LOGGER_OUTPUT) {
  // log files
  output = fs.createWriteStream(process.env.LOGGER_OUTPUT || process.cwd() + '/logger.out')
  errors = fs.createWriteStream(process.env.LOGGER_ERRORS || process.cwd() + '/logger.err')
  // declares logger with Console class of global console
  logger = new console.Console(output, errors)
} else {
  // dev mode
  // use default Console
  logger = console
}

// return object with main properties of console
module.exports = {
  ...logger,
  log,
  error
}
