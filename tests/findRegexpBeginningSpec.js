const expect = require('expect.js')
const $ = require('../lib/findRegexpBeginning')

describe('E2E: Find RegExp beginning', () => {
  it('should find first letter in simple regex', () => {
    expect($(/abc/)).to.eql([ 'a' ])
    expect($(/def/)).to.eql([ 'd' ])
  })

  it('should correctly match characters', () => {
    expect($(/[a]/)).to.eql([ 'a' ])
    expect($(/[abc]/)).to.eql([ 'a', 'b', 'c' ])
  })

  it('should correctly match character groups', () => {
    expect($(/[0-4]/)).to.eql([ '0', '1', '2', '3', '4' ])
    expect($(/[0-4a]/)).to.eql([ '0', '1', '2', '3', '4', 'a' ])
  })

  it('should correctly match characters classes', () => {
    expect($(/\d/)).to.eql([
      '0', '1', '2', '3', '4',
      '5', '6', '7', '8', '9'
    ])
  })

  it('should correctly handle optionals', () => {
    expect($(/a?bc/)).to.eql([ 'a', 'b' ])
    expect($(/(ac)?bc/)).to.eql([ 'a', 'b' ])
  })

  it('should correctly handle alternatives', () => {
    expect($(/(ab|cd)/)).to.eql([ 'a', 'c' ])
    expect($(/(a?b|cd?)/)).to.eql([ 'a', 'b', 'c' ])
  })

  it('should correctly handle empty alternatives', () => {
    expect($(/(ab|)d/)).to.eql([ 'a', 'd' ])
  })

  it('should correctly handle empty repetition', () => {
    expect($(/a{0}b/)).to.eql([ 'b' ])
  })

  it('should correctly handle Any repetition', () => {
    expect($(/a*b/)).to.eql([ 'a', 'b' ])
  })

  it('should correctly handle Many repetition', () => {
    expect($(/a+b/)).to.eql([ 'a' ])
  })

  it('should correctly handle with beginning position node', () => {
    expect($(/^a*b/)).to.eql([ 'a', 'b' ])
    expect($(/^a+b/)).to.eql([ 'a' ])
    expect($(/^a{0}b/)).to.eql([ 'b' ])
  })

  it('should correctly handle "Any" objects', () => {
    expect($(/./)).to.eql(null)
    expect($(/.?/)).to.eql(null)
    expect($(/.jiji/)).to.eql(null)
  })

  it('should correctly handle unicode characters', () => {
    expect($(/\u4422/)).to.eql([ '䐢' ])
    expect($(/[\u4422\u4321]/)).to.eql([ '䐢', '䌡' ])
  })

  it('should correctly handle maximum no. characters', () => {
    expect($(/[1-4]/, 4)).to.eql([ '1', '2', '3', '4' ])
    expect($(/[1-4]/, 3)).to.eql(null)
    expect($(/[1-8]/, 3)).to.eql(null)
    expect($(/[1-4]|[5-6]/, 4)).to.eql(null)
    expect($(/[1-4]|[5-6]/, 6)).to.eql([ '1', '2', '3', '4', '5', '6' ])
    expect($(/x?[1-9]a/, 15)).to.eql([ 'x', '1', '2', '3', '4', '5', '6', '7', '8', '9' ])
  })

  it('should correctly handle empty expressions', () => {
    expect($(/x?[1-9]?/, 9)).to.eql(null)
  })

  it('should correctly handle case-insensitive regexps', () => {
    expect($(/x?[1-9]/i)).to.eql([ 'x', 'X', '1', '2', '3', '4', '5', '6', '7', '8', '9' ])
    expect($(/[a-c]/i)).to.eql([ 'a', 'A', 'b', 'B', 'c', 'C' ])
    expect($(/[a-c]?D/i)).to.eql([ 'a', 'A', 'b', 'B', 'c', 'C', 'd', 'D' ])
    expect($(/[Da-c]/i)).to.eql([ 'd', 'D', 'a', 'A', 'b', 'B', 'c', 'C' ])
  })
})
