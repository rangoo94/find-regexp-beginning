const ret = require('ret')

const unique = require('./unique')
const findInNode = require('./findInNode')
const makeCaseInsensitive = require('./makeCaseInsensitive')

/**
 * Find beginning character of regular expression
 *
 * @param {RegExp} regex
 * @param {int} [maxCharacters]
 * @returns {null|string[]}
 */
function findRegexpBeginning (regex, maxCharacters = 15) {
  // Check if this regular expression is case-sensitive
  const isCaseSensitive = regex.flags.indexOf('i') === -1

  // Parse regular expression
  const rootNode = ret(regex.source)

  // Build list of possible beginning characters in regular expression
  let characters = findInNode(rootNode, maxCharacters)

  // When "Any character" occurred there, return null
  if (characters.indexOf(true) !== -1) {
    return null
  }

  // When empty string may match an expression as well
  if (characters.indexOf(null) !== -1) {
    return null
  }

  // Make list of unique characters on beginning
  characters = unique(characters)

  // Build case-insensitive list of characters if required
  if (!isCaseSensitive) {
    characters = makeCaseInsensitive(characters)
  }

  // When list of characters is bigger than expected,
  // treat as "Any character" as well
  if (characters.length > maxCharacters) {
    return null
  }

  // Return found list of beginning characters
  return characters
}

module.exports = findRegexpBeginning
