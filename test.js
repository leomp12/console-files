'use strict'

if (process.env.NODE_ENV !== 'production') {
  process.env.LOGGER_OUTPUT = './test.out'
  process.env.LOGGER_ERRORS = './test.err'
}

const logger = require('./main')

logger.log('Hello console-files!')
logger.error(new Error(`Keep calm, it's just a test ;)`))
