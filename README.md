# Find RegExp beginning

[![Travis](https://travis-ci.org/rangoo94/find-regexp-beginning.svg)](https://travis-ci.org/rangoo94/find-regexp-beginning)
[![Code Climate](https://codeclimate.com/github/rangoo94/find-regexp-beginning/badges/gpa.svg)](https://codeclimate.com/github/rangoo94/find-regexp-beginning)
[![Coverage Status](https://coveralls.io/repos/github/rangoo94/find-regexp-beginning/badge.svg?branch=master)](https://coveralls.io/github/rangoo94/find-regexp-beginning?branch=master)
[![NPM Downloads](https://img.shields.io/npm/dm/find-regexp-beginning.svg)](https://www.npmjs.com/package/find-regexp-beginning)

Useful, when you need to to detect what could be the first character which will pass regular expression (i.e. for lexer optimizations)

## How to install

Package is available as `find-regexp-beginning` in NPM, so you can use it in your project using
`npm install find-regexp-beginning` or `yarn add find-regexp-beginning`

## What are requirements?

Code itself is written in ES6 and should work in Node.js 4+ environment (best in Node.js 9+).
If you would like to use it in browser or older development, there is also transpiled and bundled (UMD) version included.
You can use `find-regexp-beginning/browser` in your requires or `FindRegexpBeginning` in global environment (in browser):

```js
// Load library
const findRegexpBeginning = require('find-regexp-beginning/browser')

const result = findRegexpBeginning(/abc/i) // [ 'a', 'A' ]
```

## How to use it?

Most importantly first argument is `RegExp` instance.

```js
const findRegexpBeginning = require('find-regexp-beginning')

const result1 = findRegexpBeginning(/abc/) // [ 'a' ]
const result2 = findRegexpBeginning(/abc/i) // [ 'a', 'A' ]
```

This function returns either list of possible characters on beginning
or `null` (when there is negation or any object is accepted).

Additionally, there is second argument `maxCharacters` (default: `15`).
It's important when you want to not detect characters if they exceed number of maximum characters,
i.e.:

```js
const findRegexpBeginning = require('find-regexp-beginning')

const result1 = findRegexpBeginning(/[1-9]/) // [ '1', '2', '3', '4', '5', '6', '7', '8', '9' ]
const result2 = findRegexpBeginning(/[1-9]/, 9) // [ '1', '2', '3', '4', '5', '6', '7', '8', '9' ]
const result3 = findRegexpBeginning(/[1-9]/, 100) // [ '1', '2', '3', '4', '5', '6', '7', '8', '9' ]
const result4 = findRegexpBeginning(/[1-9]/, Infinity) // [ '1', '2', '3', '4', '5', '6', '7', '8', '9' ]
const result5 = findRegexpBeginning(/[1-9]/, 3) // null
```
