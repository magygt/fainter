const PRODUCTION = 'production'
const SANDBOX = 'sandbox'

function sandboxify(env) {
  return `${env}-${SANDBOX}`
}

function getEnvConfig(env) {
  switch(env) {
    case PRODUCTION:
      return 'open-api.shop.ele.me'
    case sandboxify(PRODUCTION):
      return 'open-api-sandbox.shop.ele.me'
    default:
      console.log('no such env, this function can accept envs are as below ', getOptionalEnv())
  }
}

function getOptionalEnv() {
  return [PRODUCTION, sandboxify(PRODUCTION)].toString()
}

module.exports = getEnvConfig

