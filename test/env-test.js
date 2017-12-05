const assert = require('assert')
const getEnvConfig = require('../src/env');

describe('env', () => {
  it('getEnvConfig production', () => {
    let env = 'production'
    let config = 'open-api.shop.ele.me'
    assert.equal(config, getEnvConfig(env))
  })

  it('getEnvConfig sandbox', () => {
    let env = 'production-sandbox'
    let config = 'open-api-sandbox.shop.ele.me'
    assert.equal(config, getEnvConfig(env))
  })

  it('getEnvConfig incorrect env', () => {
    let env = 'nonsense'
    let config = undefined
    assert.equal(config, getEnvConfig(env))
  })
})
