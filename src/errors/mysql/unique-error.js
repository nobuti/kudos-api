const CODES = ['ER_DUP_ENTRY', 'ER_DUP_ENTRY_WITH_KEY_NAME']
const CONSTRAINT_REGEX = /Duplicate entry '(.+)' for key '(.+)'/

export default err => {
  if (CODES.indexOf(err.code) === -1) {
    return null
  }

  const match = CONSTRAINT_REGEX.exec(err.sqlMessage)

  if (!match) {
    return null
  }

  const fields = match[2].split('_').slice(0, 2)
  const field = fields[1] || fields.join(' ')
  return `Duplicate entry ${match[1]} for field ${field}`
}
