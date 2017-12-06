# Fainter
[![Coverage Status](https://coveralls.io/repos/magygt/fainter/badge.svg?branch=master)](https://coveralls.io/r/magygt/fainter?branch=master)

Simple, adaptive eleme openapi sdk which is easy to use.

## Quickstart

```bash
npm install fainter --save
```

## Testing fainter

```bash
cd /path/to/mocha
npm install
npm test
```

## Example

#### for individual app

```javascript
const Fainter = require('Fainter');

let account = {
  appKey: 'key',
  appSecret: 'secret',
  env: 'production'
};

let fainter = new Fainter(account);

fainter.applyIndividualToken().then(token => {
  fainter.setToken(token.access_token)
  fainter.invoke('eleme.user.getUser')
    .then(res => console.log(res))
    .catch(err => console.log(err))
})
```

## relative api reference
[eleme openapi documentation](https://open.shop.ele.me/openapi/documents)

## PS
饿了么服务市场欢迎广大有能力有想法的开发者入驻🤗
![饿了么服务市场](7xsy7l.com1.z0.glb.clouddn.com/饿了么服务市场.png)


