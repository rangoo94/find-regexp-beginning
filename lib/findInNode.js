const ret = require('ret')

/**
 * Find characters in reference.
 * As reference on beginning is pretty complex stuff,
 * just use it as "Any character".
 *
 * @param {object} node
 * @param {int} maxCharacters
 * @returns {Array<boolean>}
 */
function findInReference (node, maxCharacters) {
  return [ true ]
}

/**
 * Find characters which are in specified range (i.e. [a-z]).
 *
 * @param {object} node
 * @param {int} maxCharacters
 * @returns {Array<boolean|string>}
 */
function findInRange (node, maxCharacters) {
  // When range has more characters than maximum expected,
  // Just treat it is "Any character"
  if (node.to - node.from > maxCharacters) {
    return [ true ]
  }

  // Build list of characters
  const characters = []

  // Populate characters from range using their char code
  for (let i = node.from; i <= node.to; i++) {
    characters.push(String.fromCharCode(i))
  }

  // Return list of characters in range
  return characters
}

/**
 * Find possible characters from set (i.e. [abcde], [0-9a-z])
 *
 * @param {object} node
 * @param {int} maxCharacters
 * @returns {Array<boolean|string>}
 */
function findInSet (node, maxCharacters) {
  // When we found negated set treat it as "Any character",
  // because it's any different character
  if (node.not) {
    return [ true ]
  }

  // Combine all possible characters in set
  return [].concat.apply([], node.set.map(child => findInNode(child, maxCharacters)))
}

/**
 * Find options for Repetition nodes (i.e. A+, A{3,5})
 *
 * @param {object} node
 * @param {int} maxCharacters
 * @returns {Array<string|null|boolean>}
 */
function findInRepetition (node, maxCharacters) {
  // When there is maximum of 0 repeats, it means that it will never be applied
  if (node.max === 0) {
    return [ null ]
  }

  // Build empty list of characters
  const characters = []

  // When there is minimum of 0 repeats, it may also be not applied
  if (node.min === 0) {
    characters.push(null)
  }

  // Gather all characters from inside
  return characters.concat(findInNode(node.value, maxCharacters))
}

/**
 * Find by node options (possibilities to use this node)
 *
 * @param {object} node
 * @param {int} maxCharacters
 * @returns {Array<boolean|string|null>}
 */
function findInNodeOptions (node, maxCharacters) {
  // Find possible characters for all options
  const options = node.options.map(list => findInNodesList(list, maxCharacters))

  // Check if there isn't a situation that "Any character" is possible,
  // And return it then
  for (let i = 0; i < options.length; i++) {
    if (options[i].indexOf(true) !== -1) {
      return [ true ]
    }
  }

  // Combine all characters from all options
  return [].concat.apply([], options)
}

/**
 * Find possible characters in list of nodes
 *
 * @param {object[]} nodes
 * @param {int} maxCharacters
 * @returns {Array<null|boolean|string>}
 */
function findInNodesList (nodes, maxCharacters) {
  // When list of nodes is empty anything can match it
  if (nodes.length === 0) {
    return [ null ]
  }

  // Find options in each node
  const options = nodes.map(child => findInNode(child, maxCharacters))

  // Build list of resulting characters
  let characters = []

  // Iterate over all nodes
  for (let i = 0; i < options.length; i++) {
    // Get possible characters from current node
    const optionChars = options[i]

    // Check if "Any character" is found there,
    // return it then
    if (optionChars.indexOf(true) !== -1) {
      return [ true ]
    }

    // Filter 'null' values from previous characters list,
    // As we are already in next node
    characters = characters.filter(x => x !== null)

    // Append characters from current node
    characters = characters.concat(optionChars)

    // Finish iteration, when there is no option to continue with next node
    if (optionChars.indexOf(null) === -1) {
      return characters
    }
  }

  // Finish with found characters as all nodes has been combined
  return characters
}

/**
 * Find beginning character in specified node
 *
 * @param {object} node
 * @param {int} maxCharacters
 * @returns {Array<boolean|null|string>}
 */
function findInNode (node, maxCharacters) {
  if (node.options) {
    return findInNodeOptions(node, maxCharacters)
  }

  if (node.type === ret.types.REPETITION) {
    return findInRepetition(node, maxCharacters)
  }

  if (node.type === ret.types.REFERENCE) {
    return findInReference(node, maxCharacters)
  }

  if (node.type === ret.types.RANGE) {
    return findInRange(node, maxCharacters)
  }

  if (node.type === ret.types.SET) {
    return findInSet(node, maxCharacters)
  }

  if (node.type === ret.types.POSITION) {
    // Ignore positions (^, $, \b)
    return [ null ]
  }

  if (node.type === ret.types.CHAR) {
    // Get this simple character
    return [ String.fromCharCode(node.value) ]
  }

  return findInNodesList(node.stack, maxCharacters)
}

module.exports = findInNode
