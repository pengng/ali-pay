var timeFormater = require('time-formater')
var request = require('request-client')
var crypto = require('crypto')
var querystring = require('querystring')
var URL = 'https://openapi.alipay.com/gateway.do'
var DEV_URL = 'https://openapi.alipaydev.com/gateway.do'

var Pay = function (options) {
  this.private_key = options.private_key
  this.sandbox = options.sandbox
  delete options.sandbox
  delete options.private_key
  this.options = {
    app_id: '',
    format: 'JSON',
    charset: 'utf-8',
    sign_type: 'RSA2',
    version: '1.0'
  }
  Object.assign(this.options, options)
  if (this.options.sign_type === 'RSA') {
    this._sign_type = 'RSA-SHA1'
  } else if (this.options.sign_type === 'RSA2') {
    this._sign_type = 'RSA-SHA256'
  }
}

Pay.prototype = {
  pay: function (options) {
    var defaultOptions = {
      method: 'alipay.trade.page.pay',
      timestamp: this.getTimestamp()
    }
    var biz_content = {
      out_trade_no: this.generateOutTradeNo(),
      product_code: 'FAST_INSTANT_TRADE_PAY',
      total_amount: '',
      subject: ''
    }
    Object.assign(biz_content, options)
    defaultOptions.biz_content = JSON.stringify(biz_content)
    var newOptions = Object.assign({}, this.options, defaultOptions)
    newOptions.sign = this._generateSign(newOptions)
    this.readyURL = this._generateURL(newOptions)
    return this.readyURL
  },
  refund: function () {
    var defaultOptions = {
      method: 'alipay.trade.refund',
      timestamp: this.getTimestamp()
    }
    var biz_content = {
      
    }
  },
  refundQuery: function () {
    
  },
  query: function () {
    
  },
  close: function () {
    
  },
  download: function () {
    
  },
  verify: function (options) {
    if (typeof options === 'object') {
      options = querystring.parse(options)
    }
    var sign = options.sign
    if (options.sign) {
      delete options.sign
    }
    if (options.sign_type) {
      delete options.sign_type
    }
    var query = this._generatePreSign(options)
    var verify = crypto.createVerify(this._sign_type)
    verify.update(query)
    return verify.verify(this.public_key, sign, 'base64')
  },
  checkParams: function () {
    
  },
  stream: function () {
    return request(this.readyURL)
  },
  getBody: function (callback) {
    request(this.readyURL, function (err, response, body) {
      if (err) {
        callback && callback(err)
        return
      }
      callback && callback(null, body)
    })
  },
  _generateURL: function (options) {
    var url = this.sandbox ? DEV_URL : URL
    return url + '?' + querystring.stringify(options)
  },
  _generatePreSign: function (options) {
    var tmpArr = []
    for (var key in options) {
      if (options[key]) {
        tmpArr.push(key + '=' + options[key])
      }
    }
    tmpArr.sort()
    return tmpArr.join('&')
  },
  _generateSign: function (options) {
    var query = this._generatePreSign(options)
    return crypto.createSign(this._sign_type)
      .update(query)
      .sign(this.private_key).toString('base64')
  },
  getTimestamp: function () {
    return timeFormater().format('YYYY-MM-DD HH:mm:ss')
  },
  generateOutTradeNo: function () {
    return Date.now() + '' + parseInt(Math.random() * 899999 + 100000)
  }
}

module.exports = Pay