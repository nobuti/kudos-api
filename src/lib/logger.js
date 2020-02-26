import { Bristol } from 'bristol'
import palin from 'palin'
import { env } from './env'
import path from 'path'

export const logger = new Bristol()

/* istanbul ignore next */
if (env.LOG_LEVEL !== 'off') {
  if (env.NODE_ENV === 'production') {
    logger
      .addTarget('console')
      .withFormatter('json')
      .withLowestSeverity(env.LOG_LEVEL)
  } else {
    logger
      .addTarget('console')
      .withFormatter(palin, {
        rootFolderName: path.basename(process.cwd())
      })
      .withLowestSeverity(env.LOG_LEVEL || 'debug')
  }
}
