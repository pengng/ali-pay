var path = require('path')
var Pay = require('../lib/pay')
var fs = require('fs')

var payClient = new Pay({
  app_id: '2017070907692209',
  key: fs.readFileSync(path.join(__dirname, '../rsa_private_key.pem'))
})

payClient.pay({
  total_amount: '0.01',
  subject: '测试商品'
}).getBody((err, body) => {
  if (err) {
    return console.error(err)
  }
  console.log(body)
})