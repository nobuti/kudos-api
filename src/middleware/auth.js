import SessionError from '../errors/session-error'
import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET

const isAuthenticated = async (ctx, next) => {
  SessionError.assert(ctx.headers.authorization)
  const [_, token] = ctx.headers.authorization.split(' ') // eslint-disable-line

  try {
    const decoded = jwt.verify(token, secret)
    SessionError.assert(decoded && decoded.user)

    ctx.request.jwt = decoded
  } catch (err) {
    SessionError.assert(!err)
  }

  await next()
}

export { isAuthenticated }
