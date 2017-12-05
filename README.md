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
```javascript
const Fainter = require('Fainter');
let account = {
  appKey: 'key',
  appSecret: 'secret',
  env: 'production'
};
let fainter = new Fainter(account);
fainter.invoke('eleme.user.getUser')
.then(res => console.log(res)).catch(err => console.log(err));
fainter.invoke('eleme.product.category.getCategory', {shopId: 112358})
.then(res => console.log(res)).catch(err => console.log(err));
```

## relative api reference
[eleme openapi document](https://open.shop.ele.me/openapi/documents)

