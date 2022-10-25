const bunyan = require('bunyan')
const bunyanFormat = require('bunyan-format')

const formatOut = bunyanFormat({ outputMode: 'json', color: true })

const log = bunyan.createLogger({ name: 'Book video link', stream: formatOut, level: 'info' })

module.exports = log
