const assert = require('assert')
const Fainter = require('../');


describe('Fainter', () => {
  let appKey = 'key'
  let appSecret = 'secret'
  let env = 'prodution'

  let account = {
    appKey,
    appSecret,
    env,
  }
  let fainter = new Fainter(account)

  it('constructor', () => {
    assert.equal(appKey, fainter.appKey)
    assert.equal(appSecret, fainter.appSecret)
  })

  it('generateAuth', () => {
    let auth = fainter.generateAuth()
    let expectAuth = 'Basic a2V5OnNlY3JldA=='
    assert.equal(expectAuth, auth)
  })
})

