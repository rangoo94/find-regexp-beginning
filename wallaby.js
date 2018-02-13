module.exports = function (wallaby) {
  return {
    files: [
      'lib/**/*.js'
    ],
    tests: [
      'tests/*Spec.js'
    ],

    env: {
      type: 'node'
    },

    testFramework: 'mocha'
  }
}
