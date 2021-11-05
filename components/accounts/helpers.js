import bcrypt from 'bcrypt'

/**
 * Hash the provided string
 * @param {String} string
 * @returns {String}
 */
export async function hash(string) {
  if (typeof string === 'string' && string) {
    return await bcrypt.hash(string, 10)
  }
  return false
}

/**
 * Compare the provided string against the hash
 * @param {String} string
 * @param {String} hash
 * @returns {Boolean}
 */
export async function compare(string, hash) {
  if (hash && string) {
    return await bcrypt.compare(string, hash)
  }
  return false
}

/**
 * Returns an object with key(field name) value(error message) pairs
 * @param {Object} error
 * @param {Object} error.errors
 * @param {String} error.errors.message
 * @returns {Object}
 */
export function populateInvalidFields({ errors }) {
  const result = {}
  if (errors) {
    Object.getOwnPropertyNames(errors).forEach((name) => {
      result[name.replace('virtual.', '')] = errors[name].message
    })
  }
  return result
}
