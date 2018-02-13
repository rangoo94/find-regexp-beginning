const fs = require('fs')
const path = require('path')

const ret = require('ret')

// const code = fs.readFileSync(path.join(__dirname, 'example.scss'))

const cases = [
  /abc/,
  /def/,
  /ghi/,
  /[jk]/,
  /\s+x/,
  /\s{0}x/,
  /([jk]|[bc])/,
  /([jk]|[0-9])/,
  /(j|a)/,
  /(j|)a/,
  /^(j|)a/,
  /\u4422/,
  /[\u4422\u4321]/,
  /./
]

function _findOptionsInList (list) {
  const options = []

  if (list.length === 0) {
    return [ null ]
  }

  for (let i = 0; i < list.length; i++) {
    options.push(_findFirstOptions(list[i]))
  }

  let results = []

  for (let i = 0; i < options.length; i++) {
    if (options[i].indexOf(true) !== -1) {
      return [ true ]
    }

    results = results.filter(x => x !== null)
    results.push(...options[i])

    if (options[i].indexOf(null) === -1) {
      return results
    }
  }

  return results
}

const MAX_CHARS = 15

function _findFirstOptions (token) {
  if (token.options) {
    const opts = token.options.map(_findOptionsInList)

    for (let i = 0; i < opts.length; i++) {
      if (opts[i].indexOf(true) !== -1) {
        return [ true ]
      }
    }

    return opts.reduce((a, b) => a.concat(b), [])
  }

  let options = []

  if (token.type === ret.types.REPETITION) {
    let xxx = []

    if (token.min === 0) {
      xxx.push(null)
    }

    if (token.max === 0) {
      return [ null ]
    }

    xxx.push(..._findFirstOptions(token.value))

    return xxx
  }

  if (token.type === ret.types.REFERENCE) {
    return [ true ]
  }

  if (token.type === ret.types.RANGE) {
    if (Math.abs(token.to - token.from) > MAX_CHARS) {
      return [ true ]
    }

    const chrs = []

    for (let i = token.from; i <= token.to; i++) {
      chrs.push(String.fromCharCode(i))
    }

    return chrs
  }

  if (token.type === ret.types.POSITION) {
    return [ null ]
  }

  if (token.type === ret.types.CHAR) {
    return [ String.fromCharCode(token.value) ]
  }

  if (token.type === ret.types.SET) {
    if (token.not) {
      return [ true ]
    }

    return token.set.reduce((a, b) => a.concat(_findFirstOptions(b)), [])
  }

  if (token.stack) {
    options = _findOptionsInList(token.stack)
  }

  return options
}

const unique = arr => arr.filter((x, i) => arr.indexOf(x) === i)

function findFirstCharacter (regex) {
  const isCaseSensitive = regex.flags.indexOf('i') === -1
  const root = ret(regex.source)

  const x = _findFirstOptions(root)

  if (x.indexOf(true) !== -1) {
    return null
  }

  if (x.indexOf(null) !== -1) {
    return null
  }

  if (!isCaseSensitive) {
    let result = []

    for (let i = 0; i < x.length; i++) {
      result.push(x[i].toLowerCase(), x[i].toUpperCase())
    }

    result = unique(result)

    if (result > MAX_CHARS) {
      return null
    }

    return result
  }

  return x
}

for (let c of cases) {
  console.log(c.toString(), '->', findFirstCharacter(c))
}
// const Benchmark = require('benchmark')
// const suite = new Benchmark.Suite()
// suite.add('Test', test)
