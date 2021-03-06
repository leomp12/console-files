'use strict'

const devMode = process.env.NODE_ENV !== 'production'

// Node filesystem and path modules
const fs = require('fs')
const path = require('path')
// use Node OS module to get current hostname
const host = require('os').hostname()

// default header to write in log file
// returns hostname and current date and time
const header = () => host + ' [' + new Date().toString() + '] '

if (!process.env.LOGGER_SKIP_FATAL && (!devMode || process.env.LOGGER_FATAL_ERRORS)) {
  // debug fatal errors
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
    const filename = process.env.LOGGER_FATAL_ERRORS || path.join(process.cwd(), '_stderr')
    fs.appendFile(filename, msg, () => {
      process.exit(1)
    })
  })
}

let logger, isDefaultConsole
if (!devMode || process.env.LOGGER_OUTPUT) {
  // log files
  const output = fs.createWriteStream(process.env.LOGGER_OUTPUT || path.join(process.cwd(), 'logger.out'))
  const errors = fs.createWriteStream(process.env.LOGGER_ERRORS || path.join(process.cwd(), 'logger.err'))
  // declares logger with Console class of global console
  logger = new console.Console(output, errors)
} else {
  // dev mode
  // use default Console
  logger = console
  isDefaultConsole = true
}

const echo = (type, msg) => {
  logger[type](msg)
  if (devMode && !isDefaultConsole) {
    // also outputs to default console
    console[type](msg)
  }
}

// handlers for Console log and error
const handlers = {}
;[ 'log', 'error' ].forEach(type => {
  handlers[type] = function () {
    // write header first
    echo(type, header())
    for (let i = 0; i < arguments.length; i++) {
      echo(type, arguments[i])
    }
    // break line
    echo(type, '  ---  //  ---  \n')
  }
})

// function to replace console.log
const log = handlers.log

// function to replace console.error
const error = handlers.error

// returns object with all properties of Console class
module.exports = {
  ...logger,
  log,
  error
}
