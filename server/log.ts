import bunyan from 'bunyan'
import bunyanFormat from 'bunyan-format'

const formatOut = bunyanFormat({ outputMode: 'short', color: true })

const log = bunyan.createLogger({ name: 'Hmpps Education Employment Ui', stream: formatOut, level: 'debug' })

export default log
