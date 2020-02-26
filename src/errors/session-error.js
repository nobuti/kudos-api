import { MakeErrorClass } from 'fejl'

export default class SessionError extends MakeErrorClass(
  'Authorisation required',
  {
    statusCode: 401
  }
) {}
