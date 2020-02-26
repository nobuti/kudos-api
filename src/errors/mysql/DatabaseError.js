import { MakeErrorClass } from 'fejl'

import { errorCodes } from './error-codes'
import UniqueError from './unique-error'

const ERRORS = {
  UniqueError
}

export default class DatabaseError extends MakeErrorClass(
  'Database unknown error',
  {
    statusCode: 400,
    sqlMessage: ''
  }
) {
  static assert(err) {
    if (
      err &&
      typeof err.code === 'string' &&
      'sqlMessage' in err &&
      'sqlState' in err &&
      err.sqlState.length === 5 &&
      errorCodes.has(err.code) &&
      typeof err.errno === 'number'
    ) {
      let { message, ...props } = err
      message = Object.values(ERRORS).reduce((memo, current) => {
        const result = current(err)

        if (result) {
          memo.push(result)
        }
        return memo
      }, [])

      throw new this(message.length > 0 ? message[0] : err.sqlMessage, props)
    }

    return err
  }
}
