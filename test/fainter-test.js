const assert = require('assert')
const Fainter = require('../');
const sinon = require('sinon')
const request = require('request')


describe('Fainter local', () => {
  let appKey = 'key'
  let appSecret = 'secret'
  let env = 'production'

  let account = {
    appKey,
    appSecret,
    env,
  }
  let fainter = new Fainter(account)

  it('constructor', () => {
    assert.ok(fainter.hasOwnProperty('appKey'))
    assert.equal(appKey, fainter.appKey)
    assert.ok(fainter.hasOwnProperty('appSecret'))
    assert.equal(appSecret, fainter.appSecret)
  })

  it('setToken', () => {
    let token = 'El Psy Congroo'
    fainter.setToken(token)
    assert.ok(fainter.hasOwnProperty('token'))
    assert.equal(token, fainter.token)
  })

  it('generateInvokeOption', () => {
    let option = fainter.generateInvokeOption({})
    assert.ok(option.hasOwnProperty('url'))
    assert.ok(option.hasOwnProperty('headers'))
    assert.ok(option.hasOwnProperty('gzip'))
    assert.ok(option.gzip)
    assert.ok(option.hasOwnProperty('json'))
  })

  it('generateOAuthOption', () => {
    let option = fainter.generateOAuthOption({})
    assert.ok(option.hasOwnProperty('url'))
    assert.ok(option.hasOwnProperty('headers'))
    assert.ok(option.hasOwnProperty('gzip'))
    assert.ok(option.gzip)
    assert.ok(option.hasOwnProperty('json'))
    assert.ok(option.json)
    assert.ok(option.hasOwnProperty('form'))
  })

  it('generateElemeRequestId', () => {
    let requestId = fainter.generateElemeRequestId()
    assert.equal(requestId, requestId.toUpperCase())
    assert.equal(32, requestId.length)
  })

  it('clientForm', () => {
    let form = fainter.clientForm()
    let grantType = 'client_credentials'
    assert.ok(form.hasOwnProperty('grant_type'))
    assert.equal(grantType, form['grant_type'])
  })

  it('enterpriseForm', () => {
    let code = '112358'
    let callbackUrl = 'https://magygt.me'
    let form = fainter.enterpriseForm(code, callbackUrl)
    let grantType = 'authorization_code'
    assert.ok(form.hasOwnProperty('grant_type'))
    assert.equal(grantType, form['grant_type'])
    assert.ok(form.hasOwnProperty('code'))
    assert.equal(code, form['code'])
    assert.ok(form.hasOwnProperty('redirect_uri'))
    assert.equal(callbackUrl, form['redirect_uri'])
    assert.ok(form.hasOwnProperty('client_id'))
    assert.equal(fainter.appKey, form['client_id'])
  })

  it('enterpriseRefreshForm', () => {
    let refreshToken = '853211'
    let form = fainter.enterpriseRefreshForm(refreshToken)
    let grantType = 'refresh_token'
    assert.ok(form.hasOwnProperty('grant_type'))
    assert.equal(grantType, form['grant_type'])
    assert.ok(form.hasOwnProperty('refresh_token'))
    assert.equal(refreshToken, form['refresh_token'])

  })

  it('generateInvokeData with empty params', () => {
    let action = 'getUser'
    let nopVersion = '1.0.0'
    let data = fainter.generateInvokeData(action)
    assert.ok(data.hasOwnProperty('token'))
    assert.equal(fainter.token, data['token'])
    assert.ok(data.hasOwnProperty('nop'))
    assert.equal(nopVersion, data['nop'])
    assert.ok(data.hasOwnProperty('metas'))
    assert.ok(data.metas.hasOwnProperty('app_key'))
    assert.equal(fainter.appKey, data['metas']['app_key'])
    assert.ok(data.metas.hasOwnProperty('timestamp'))
    assert.ok(data.hasOwnProperty('params'))
    assert.equal({}.toString(), data['params'].toString())
    assert.ok(data.hasOwnProperty('action'))
    assert.equal(action, data['action'])
  })

  it('generateInvokeData with nonempty params', () => {
    let action = 'getUser'
    let nopVersion = '1.0.0'
    let shopId = 112358
    let params = {
      shopId
    }
    let data = fainter.generateInvokeData(action, params)
    assert.ok(data.hasOwnProperty('params'))
    assert.equal(params, data['params'])
  })

  it('generateSignature', () => {
    let timestamp = 1000000000000
    let action = 'getUser'
    let params = {}
    let signature = fainter.generateSignature(timestamp, action, params)
    assert.equal(32, signature.length)
  })

  it('generateAuth', () => {
    let auth = fainter.generateAuth()
    let expectAuth = 'Basic a2V5OnNlY3JldA=='
    assert.equal(expectAuth, auth)
  })

  it('generateInvokeUrl', () => {
    let expectUrl = 'https://' + fainter.baseUrl + '/api/v1'
    assert.equal(expectUrl, fainter.generateInvokeUrl())
  })

  it('generateTokenUrl', () => {
    let expectUrl = 'https://' + fainter.baseUrl + '/token'
    assert.equal(expectUrl, fainter.generateTokenUrl())
  })

  it('generateInvokeHeaders', () => {
    let headers = fainter.generateInvokeHeaders()
    let contentType = 'application/json;charset=utf-8'
    let acceptEncoding = 'gzip'
    let userAgent = 'fainter'
    assert.ok(headers.hasOwnProperty('Content-Type'))
    assert.equal(contentType, headers['Content-Type'])
    assert.ok(headers.hasOwnProperty('Accept-Encoding'))
    assert.equal(acceptEncoding, headers['Accept-Encoding'])
    assert.ok(headers.hasOwnProperty('User-Agent'))
    assert.equal(userAgent, headers['User-Agent'])
    assert.ok(headers.hasOwnProperty('x-eleme-requestid'))
  })

  it('generateOAuthHeaders', () => {
    let headers = fainter.generateOAuthHeaders()
    let contentType = 'application/x-www-form-urlencoded'
    let acceptEncoding = 'gzip'
    let userAgent = 'fainter'
    assert.ok(headers.hasOwnProperty('Content-Type'))
    assert.equal(contentType, headers['Content-Type'])
    assert.ok(headers.hasOwnProperty('Accept-Encoding'))
    assert.equal(acceptEncoding, headers['Accept-Encoding'])
    assert.ok(headers.hasOwnProperty('User-Agent'))
    assert.equal(userAgent, headers['User-Agent'])
  })

  it('generateAuthorizeUrl', () => {
    let state = 'single'
    let scope = 'root'
    let callbackUrl = 'https://magygt.me'
    let expectUrl = 'https://' + fainter.baseUrl + '/authorize?' +
      'state=' + state +
      '&scope=' + scope +
      '&redirect_uri=' + callbackUrl +
      '&response_type=code' +
      '&client_id=' + fainter.appKey + '&'
    assert.equal(expectUrl, fainter.generateAuthorizeUrl(state, scope, callbackUrl))
  })

})


describe('Fainter post success', () => {

  let appKey = 'key'
  let appSecret = 'secret'
  let env = 'production'

  let account = {
    appKey,
    appSecret,
    env,
  }
  let fainter = new Fainter(account)

  let statusCode = 200
  let body = {result: 'success'}

  beforeEach(() => {
    sinon
      .stub(request, 'post')
      .yields(null, {statusCode, body}, body)
  })

  afterEach(() => {
    request.post.restore()
  })

  it('post', () => {
    fainter.post({})
      .then(res => {
        assert.ok(res.hasOwnProperty('result'))
        assert.equal('success', res.result)
      })
  })

  it('invoke', () => {
    fainter.invoke('getUser')
      .then(res => {
        assert.ok(res.hasOwnProperty('result'))
        assert.equal('success', res.result)
      })
  })

  it('applyIndividualToken', () => {
    fainter.applyIndividualToken()
      .then(res => {
        assert.ok(res.hasOwnProperty('result'))
        assert.equal('success', res.result)
      })
  })

  it('applyEnterpriseToken', () => {
    fainter.applyEnterpriseToken('oauth code', 'https://magygt.me')
      .then(res => {
        assert.ok(res.hasOwnProperty('result'))
        assert.equal('success', res.result)
      })
  })

  it('refreshEnterpriseToken', () => {
    fainter.refreshEnterpriseToken('refresh token')
      .then(res => {
        assert.ok(res.hasOwnProperty('result'))
        assert.equal('success', res.result)
      })
  })
})

describe('Fainter post error', () => {

  let appKey = 'key'
  let appSecret = 'secret'
  let env = 'production'

  let account = {
    appKey,
    appSecret,
    env,
  }
  let fainter = new Fainter(account)

  let statusCode = 502
  let body = {error: 'service unavailable'}

  beforeEach(() => {
    sinon
      .stub(request, 'post')
      .yields(body, {statusCode, body}, body)
  })

  afterEach(() => {
    request.post.restore()
  })

  it('post error', () => {
    fainter.post({})
      .catch(err => {
        assert.ok(err.hasOwnProperty('code'))
        assert.equal(statusCode, err.code)
        assert.ok(err.hasOwnProperty('body'))
        assert.equal(body, err.body)
        assert.ok(err.hasOwnProperty('err'))
        assert.equal(body, err.err)
      })
  })
})

