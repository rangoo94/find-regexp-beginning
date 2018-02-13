const unique = require('./unique')

/**
 * Make case-insensitive list of characters
 *
 * @param {string[]} characters
 * @returns {string[]}
 */
function makeCaseInsensitive (characters) {
  // Build result list
  const result = []

  // Iterate over characters
  for (let i = 0; i < characters.length; i++) {
    // Push both lower and upper-case character
    result.push(
      characters[i].toLowerCase(),
      characters[i].toUpperCase()
    )
  }

  // Find only unique characters
  return unique(result)
}

module.exports = makeCaseInsensitive
