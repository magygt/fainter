const request = require('request')
require('request-to-curl')
const Promise = require('bluebird')
const getEnvConfig = require('./env')
const uuid = require('node-uuid')
const crypto= require('crypto')

class Fainter {
  constructor(config) {
    this.appKey = config.appKey;
    this.appSecret = config.appSecret;
    this.baseUrl = getEnvConfig(config.env);
  }

  invoke(action, params) {
    if (!this.token) {
      return this.applyIndividualToken()
      .then(res => {
        this.token = res.access_token
        let option = this.generateInvokeOption(this.generateInvokeData(action, params))
        return this.post(option)
      })
    }
    let option = this.generateInvokeOption(this.generateInvokeData(action, params))
    return this.post(option)
  }

  applyIndividualToken() {
    return this.post(this.generateOAuthOption(this.clientForm()))
  }

  applyEnterpriseToken(code, callbackUrl) {
    return this.post(this.generateOAuthOption(this.enterpriseForm(code, callbackUrl)))
  }

  refreshEnterpriseToken(refreshToken) {
    return this.post(this.generateOAuthOption(this.enterpriseRefreshForm(refreshToken)))
  }

  setToken(token) {
    this.token = token;
  }

  post(option) {
    return new Promise((resolve, reject) => {
      request.post(option, (err, response, body) => {
        console.log(response.request.req.toCurl())
        if (!err && response.statusCode == 200) {
          resolve(body)
        }
        reject({
          code: response.statusCode,
          body: body,
          err: err
        })
      })
    })
  }

  generateInvokeOption(data) {
    let elemeRequestId = this.generateElemeRequestId()
    data.id = elemeRequestId
    return {
      url: this.generateInvokeUrl(),
      headers: this.generateInvokeHeaders(elemeRequestId),
      gzip: true,
      json: data
    }
  }

  generateOAuthOption(form) {
    return {
      url: this.generateTokenUrl(),
      headers: this.generateOAuthHeaders(),
      gzip: true,
      json: true,
      form: form
    }
  }

  generateElemeRequestId() {
    return uuid.v4().replace(/-/g, '').toUpperCase()
  }

  clientForm() {
    return { 
      grant_type: 'client_credentials'
    }
  }

  enterpriseForm(code, callbackUrl) {
    return {
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: callbackUrl,
      client_id: this.appKey
    }
  }

  enterpriseRefreshForm(refreshToken) {
    return {
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    }
  }

  generateInvokeData(action, params) {
    let timestamp = parseInt(new Date().getTime())
    return {
      token: this.token,
      nop: '1.0.0',
      metas: {
        app_key: this.appKey,
        timestamp: timestamp
      },
      params: params || {},
      action: action,
      signature: this.generateSignature(timestamp, action, params)
    }
  }

  generateSignature(timestamp, action, params) {
    let foo = {
      'app_key': this.appKey,
      'timestamp': timestamp
    }
    for (let key in params) {
      foo[key] = params[key]
    }
    let bar = []
    for (let key in foo) {
      let keyValue = String(key) + '=' + JSON.stringify(foo[key])
      bar.push(keyValue)
    }
    bar.sort()
    var sign = action + this.token + bar.join('') + this.appSecret;
    let md5 = crypto.createHash('md5')
    md5.update(sign);
    return md5.digest('hex').toUpperCase()
  }

  // userid accuracy issue
  generateMessageSignature(message) {
    delete message['signature']
    let foo = []
    for (let key in message) {
      foo.push(`${key}=${message[key]}`)
    }
    foo.sort()
    let sign = foo.join('') + this.appSecret
    let md5 = crypto.createHash('md5')
    md5.update(sign);
    return md5.digest('hex').toUpperCase()
  }

  generateInvokeHeaders(elemeRequestId) {
    let id = elemeRequestId + '|' + Date.now().toString()
    return {
      'Content-type': "application/json;charset=utf-8",
      'Accept-Encoding': 'gzip',
      'User-Agent': 'fainter',
      'x-eleme-requestid': id
    }
  }

  generateOAuthHeaders() {
    return {
      'Content-type': "application/x-www-form-urlencoded",
      'Accept-Encoding': 'gzip',
      'User-Agent': 'faint',
      'Authorization': this.generateAuth()
    }
  }

  generateAuth() {
    let auth = new Buffer(`${this.appKey}:${this.appSecret}`).toString('base64')
    return `Basic ${auth}`
  }

  generateInvokeUrl() {
    return `https://${this.baseUrl}/api/v1`
  }

  generateTokenUrl() {
    return `https://${this.baseUrl}/token`
  }

  generateAuthorizeUrl(state, scope, callbackUrl) {
    let urlParams = {
      state: state,
      scope: scope,
      redirect_uri: callbackUrl,
      response_type: 'code',
      client_id: this.appKey
    }

    let params = '?'

    for (let key in urlParams) {
      params += `${key}=${urlParams[key]}&`
    }

    return `https://${this.baseUrl}/authorize${params}`
  }

}

module.exports = Fainter

