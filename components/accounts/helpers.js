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
 * Push all key names from "error.errors" to array
 * @param {String[]} array
 * @param {Object} error
 * @param {Object} error.errors
 * @returns {String[]}
 */
export function insertInvalidFields(array, error) {
  if (error && error.errors) {
    Object.keys(error.errors).forEach((key) => {
      if (
        error.errors.hasOwnProperty(key) &&
        !array.includes(key) &&
        key !== 'hashedPassword'
      ) {
        array.push(key)
      }
    })
  }
  return array
}
