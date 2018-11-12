'use strict'

// Node filesystem module
const fs = require('fs')

if (!process.env.LOGGER_SKIP_FATAL) {
  // also debug fatal errors
  process.on('uncaughtException', err => {
    // fatal error
    // log to file before exit
    let msg = '\n[' + new Date().toString() + ']\n'
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

    fs.appendFile(process.env.LOGGER_FATAL_ERRORS || '/var/log/node-stderr', msg, () => {
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
  const d = new Date()
  const host = require('os').hostname()
  return host + ' [' + d.toString() + '] '
}

// log files
const output = fs.createWriteStream(process.env.LOGGER_OUTPUT || '/var/log/node-logger.out')
const errors = fs.createWriteStream(process.env.LOGGER_ERRORS || '/var/log/node-logger.err')
// declares logger with Console class of global console
const logger = new console.Console(output, errors)

// return object with main properties of console
module.exports = {
  ...logger,
  log,
  error
}
