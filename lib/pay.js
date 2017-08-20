var timeFormater = require('time-formater')
var request = require('request-client')
var crypto = require('crypto')
var querystring = require('querystring')
var URL = 'https://openapi.alipay.com/gateway.do'
var DEV_URL = 'https://openapi.alipaydev.com/gateway.do'

var Pay = function (options) {
  this.url = options.sandbox ? DEV_URL : URL
  var appId = options.appId
  if (typeof appId !== 'string') {
    throw new TypeError('constructor() appId must be a String')
  }
  if (!options.privateKey) {
    throw new TypeError('constructor() privateKey can\'t be empty')
  }
  this.privateKey = options.privateKey
  this.options = {
    app_id: appId,
    charset: options.charset || 'utf-8',
    sign_type: options.signType || 'RSA2',
    version: '1.0'
  }
  if (this.options.sign_type === 'RSA') {
    this.signType = 'RSA-SHA1'
  } else if (this.options.sign_type === 'RSA2') {
    this.signType = 'RSA-SHA256'
  }
}

Pay.prototype = {
  pay: function (options, callback) {
    var authCode = options.authCode
    if (typeof authCode !== 'string') {
      return callback(new TypeError('pay() authCode must be a String'))
    }
    var newOptions = {
      method: 'alipay.trade.pay',
      content: {
        out_trade_no: options.outTradeNo || this.getOutTradeNo(),
        scene: options.scene || 'bar_code',
        auth_code: authCode,
        subject: subject
      }
    }
    this.copyOptionsIfExists({
      source: options,
      target: newOptions.content,
      fields: ['product_code', 'buyer_id', 'seller_id', 'total_amount', 'discountable_amout', 'body', 'goods_detail', 'store_id', 'terminal_id', 'extend_params', 'timeout_express']
    })
    this.beforeGetUrl('pay', options, newOptions, callback, function () {
      var url = this.getUrl(newOptions)
      this.request(url, callback)
    })
  },
  precreate: function (options, callback) {
    var newOptions = {
      method: 'alipay.trade.precreate',
      content: {
        out_trade_no: options.outTradeNo || this.getOutTradeNo()
      }
    }
    this.copyOptionsIfExists({
      source: options,
      target: newOptions.content,
      fields: ['seller_id', 'discountable_amount', 'body', 'goods_detail', 'store_id', 'terminal_id', 'extend_params', 'timeout_express']
    })
    this.beforeGetUrl('precreate', options, newOptions, callback, function () {
      var url = this.getUrl(newOptions)
      this.request(url, callback)
    })
  },
  pagePay: function (options, callback) {
    var newOptions = {
      method: 'alipay.trade.page.pay',
      content: {
        out_trade_no: options.outTradeNo || this.getOutTradeNo(),
        product_code: 'FAST_INSTANT_TRADE_PAY',
      }
    }
    this.copyOptionsIfExists({
      source: options,
      target: newOptions,
      fields: ['return_url', 'body', 'goods_detail', 'passback_params', 'extend_params', 'goods_type', 'timeout_express', 'enable_pay_channels', 'disable_pay_channels', 'auth_token', 'qr_pay_mode', 'qrcode_width']
    })
    this.beforeGetUrl('pagePay', options, newOptions, callback, function () {
      var url = this.getUrl(newOptions)
      this.request(url, callback)
    })
  },
  create: function (options, callback) {
    var newOptions = {
      method: 'alipay.trade.create',
      content: {
        out_trade_no: options.outTradeNo || this.getOutTradeNo()
      }
    }
    this.copyOptionsIfExists({
      source: options,
      target: newOptions.content,
      fields: ['seller_id', 'discountable_amount', 'body', 'goods_detail', 'store_id', 'terminal_id', 'extend_params', 'timeout_express']
    })
    this.beforeGetUrl('create', options, newOptions, callback, function () {
      var url = this.getUrl(newOptions)
      this.request(url, callback)
    })
  },
  refund: function (options, callback) {
    var refundAmount = options.refundAmount
    if (typeof refundAmount !== 'string') {
      return callback(new TypeError('refund() refundAmount must be a String')
    }
    var newOptions = {
      method: 'alipay.trade.refund',
      content: {
        refund_amount: refundAmount,
        out_request_no: options.outRequestNo || this.getOutRequestNo()
      }
    }
    this.copyOptionsIfExists({
      source: options,
      target: newOptions.content,
      fields: ['refund_reason', 'store_id', 'terminal_id']
    })
    this.beforeGetUrl('refund', options, newOptions, callback, function () {
      var url = this.getUrl(newOptions)
      this.request(url, callback)
    })
  },
  refundQuery: function (options, callback) {
    var newOptions = {
      method: 'alipay.trade.fastpay.refund.query'
    }
    this.beforeGetUrl('refundQuery', options, newOptions, callback, function () {
      var url = this.getUrl(newOptions)
      this.request(url, callback)
    })
  },
  query: function (options, callback) {
    var newOptions = {
      method: 'alipay.trade.query'
    }
    this.beforeGetUrl('query', options, newOptions, callback, function () {
      var url = this.getUrl(newOptions)
      this.request(url, callback)
    })
  },
  close: function (options, callback) {
    var newOptions = {
      method: 'alipay.trade.close'
    }
    this.beforeGetUrl('close', options, newOptions, callback, function () {
      var url = this.getUrl(newOptions)
      this.request(url, callback)
    })
  },
  cancel: function (options, callback) {
    var newOptions = {
      method: 'alipay.trade.cancel'
    }
    this.beforeGetUrl('cancel', options, newOptions, callback, function () {
      var url = this.getUrl(newOptions)
      this.request(url, callback)
    })
  },
  settle: function (options, callback) {
    var tradeNo = options.tradeNo
    if (typeof tradeNo !== 'string') {
      return callback(new TypeError('settle() tradeNo must be a String'))
    }
    var royaltyParameters = options.royaltyParameters
    if (typeof royaltyParameters !== 'object') {
      return callback(new TypeError('settle() royaltyParameters must be a Object'))
    }
    var newOptions = {
      method: 'alipay.trade.order.settle',
      content: {
        out_request_no: options.outRequestNo || this.getOutRequestNo(),
        trade_no: tradeNo,
        royalty_parameters: royaltyParameters
      }
    }
    this.beforeGetUrl('settle', options, newOptions, callback, function () {
      var url = this.getUrl(newOptions)
      this.request(url, callback)
    })
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
    var verify = crypto.createVerify(this.signType)
    verify.update(query)
    return verify.verify(this.public_key, sign, 'base64')
  },
  copyOptionsIfExists: function (options) {
    var target = options.target
    var source = options.source
    var fields = options.fields
    fields.forEach(function (field) {
      if (typeof source[field] === 'string') {
        target[field] = source[field]
      }
    })
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
  beforeGetUrl: function (funcName, options, newOptions, callback, next) {
    newOptions.content = newOptions.content || {}
    if (~['pay', 'create', 'precreate', 'pagePay'].indexOf(funcName)) {
      if (typeof options.subject !== 'string') {
        return callback(new TypeError(funcName + '() subject must be a String'))
      }
      newOptions.content.subject = options.subject
    }
    if (~['pay', 'precreate', 'create', 'refund', 'refundQuery', 'close', 'cancel', 'settle', 'query'].indexOf(funcName)) {
      this.copyOptionsIfExists({
        source: options,
        target: newOptions,
        fields: ['app_auth_token']
      })
    }
    if (~['precreate', 'create', 'pagePay'].indexOf(funcName)) {
      if (typeof options.totalAmount !== 'string') {
        return callback(new TypeError(funcName + '() totalAmount must be a String'))
      }
      newOptions.content.total_amount = options.totalAmount
    }
    if (~['pay', 'pagePay', 'precreate', 'create', 'close'].indexOf(funcName)) {
      this.copyOptionsIfExists({
        source: options,
        target: newOptions,
        fields: ['notify_url']
      })
    }
    if (~['settle', 'close', 'refund', 'pay', 'precreate', 'create'].indexOf(funcName)) {
      this.copyOptionsIfExists({
        source: options,
        target: newOptions,
        fields: ['operator_id']
      })
    }
    if (~['refundQuery', 'refund', 'query', 'close', 'cancel'].indexOf(funcName)) {
      if (typeof options.tradeNo === 'string') {
        newOptions.content.trade_no = options.tradeNo
      } else if (typeof options.outTradeNo === 'string') {
        newOptions.content.out_trade_no = options.outTradeNo
      } else {
        return callback(new TypeError(funcName + '() tradeNo and outTradeNo can\'t all be empty'))
      }
    }
    if (~['refundQuery'].indexOf(funcName)) {
      if (typeof options.outRequestNo !== 'string') {
        return callback(new TypeError(funcName + '() outRequestNo must be a String'))
      }
      newOptions.content.out_request_no = options.outRequestNo
    }
    next()
  },
  getUrl: function (options) {
    options.biz_content = JSON.stringify(options.content)
    delete options.content
    var newOptions = Object.assign({}, this.options, options)
    newOptions.timestamp = this.getTimestamp()
    newOptions.sign = this._generateSign(newOptions)
    return this.url + '?' + querystring.stringify(newOptions)
  },
  request: function (url, callback) {
    request(url, function (err, response, body) {
      if (err) {
        return callback(err)
      }
      try {
        body = JSON.parse(body)
      } catch(err) {
        return callback(err)
      }
      callback(null, body)
    })
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
    return crypto.createSign(this.signType)
      .update(query)
      .sign(this.privateKey).toString('base64')
  },
  getTimestamp: function () {
    return timeFormater().format('YYYY-MM-DD HH:mm:ss')
  },
  getRequestNo: function () {
    return Date.now() + '' + parseInt(Math.random() * 899999 + 100000)
  },
  getOutTradeNo: function () {
    return Date.now() + '' + parseInt(Math.random() * 899999 + 100000)
  }
}

module.exports = Pay