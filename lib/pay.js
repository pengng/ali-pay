var timeFormater = require('time-formater')
var request = require('request-client')
var crypto = require('crypto')
var querystring = require('querystring')
var URL = 'https://openapi.alipay.com/gateway.do'

var Pay = function (options) {
  this.key = options.key
  delete options.key
  this.options = {
    app_id: '',
    format: 'JSON',
    charset: 'utf-8',
    sign_type: 'RSA2',
    version: '1.0'
  }
  Object.assign(this.options, options)
}

Pay.prototype = {
  pay: function (options) {
    var defaultOptions = {
      method: 'alipay.trade.page.pay',
      timestamp: this.getTimestamp(),
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
    console.log(this.readyURL)
    return this.readyURL
  },
  refund: function () {
    
  },
  refundQuery: function () {
    
  },
  query: function () {
    
  },
  close: function () {
    
  },
  download: function () {
    
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
    return URL + '?' + querystring.stringify(options)
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
    var type = ''
    if (this.options.sign_type === 'RSA') {
      type = 'RSA-SHA1'
    } else if (this.options.sign_type === 'RSA2') {
      type = 'RSA-SHA256'
    }
    return crypto.createSign(type)
      .update(query)
      .sign(this.key).toString('base64')
  },
  getTimestamp: function () {
    return timeFormater().format('YYYY-MM-DD HH:mm:ss')
  },
  generateOutTradeNo: function () {
    return Date.now() + '' + parseInt(Math.random() * 899999 + 100000)
  }
}

module.exports = Pay