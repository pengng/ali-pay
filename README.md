# ali-pay

支付宝支付SDK。

### Usage

```bash
npm install -S ali-pay
```

```javascript
const fs = require('fs')
const path = require('path')
const Alipay = require('ali-pay')
const api = new Alipay({
  appId: '',
  publicKey: fs.readFileSync(path.join(__dirname, '/public_key.pem')),
  privateKey: fs.readFileSync(path.join(__dirname, '/private_key.pem'))
})

api.pagePay({
  subject: 'Iphone 7',
  totalAmount: '6799'
}, (err, result) => {
  if (err) {
    return console.error(err)
  }
  console.log(result)
})
```

### new Alipay(options)

返回`Alipay`实例对象。

#### options 配置对象

| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| appId | string | 是 | APPID 即创建应用后生成。 |
| publicKey | string | 是 | 开发者公钥，由开发者自己生成。 传入公钥的内容。 |
| privateKey | string | 是 | 开发者私钥，由开发者自己生成。 传入私钥的内容。 |
| charset | string | 否 | 请求使用的编码格式，如utf-8,gbk,gb2312等。默认utf-8。 |
| signType | string | 否 | 商户生成签名字符串所使用的签名算法类型，目前支持RSA2和RSA，推荐使用RSA2。默认为RSA2。 |
| sandbox | boolean | 否 | 是否沙箱测试。默认`false` |

### Alipay 实例方法

- [`pay(options, callback) 统一收单下单并支付页面接口`](#pay)
- [`wapPay(options, callback) 手机网站支付`](#wappay)
- [`pagePay(options, callback) 电脑网站支付`](#pagepay)
- [`create(options, callback) 统一收单交易创建接口`](#create)
- [`precreate(options, callback) 统一收单线下交易预创建`](#precreate)
- [`verify(options) 验签接口`](#verify)
- [`refund(options, callback) 统一收单交易退款接口`](#refund)
- [`refundQuery(options, callback) 统一收单交易退款查询接口`](#refundQuery)
- [`query(options, callback) 统一收单线下交易查询接口`](#query)
- [`close(options, callback) 统一收单交易关闭接口`](#close)
- [`cancel(options, callback) 统一收单交易撤销接口`](#cancel)
- [`settle(options, callback) 统一收单交易结算接口`](#settle)
- [`download(options, callback) 查询对账单下载地址`](#download)

### pay

收银员使用扫码设备读取用户手机支付宝“付款码”/声波获取设备（如麦克风）读取用户手机支付宝的声波信息后，将二维码或条码信息/声波信息通过本接口上送至支付宝发起支付。

#### options 对象属性

| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| subject | string | 是 | 订单标题 |
| authCode | string | 否 | 支付授权码，25~30开头的长度为16~24位的数字，实际字符串长度以开发者获取的付款码长度为准 |
| notifyUrl | string | 否 | 支付宝服务器主动通知商户服务器里指定的页面http/https路径。 |
| appAuthToken | string | 否 | 详见[应用授权概述](https://docs.open.alipay.com/common/105193) |
| outTradeNo | string | 否 | 商户订单号,64个字符以内、可包含字母、数字、下划线；需保证在商户端不重复 |
| scene | string | 否 | 支付场景<br/>条码支付，取值：bar_code<br/>声波支付，取值：wave_code。<br/>默认为`bar_code` |
| productCode | string | 否 | 销售产品码 |
| buyerId | string | 否 | 买家的支付宝用户id，如果为空，会从传入了码值信息中获取买家ID |
| sellerId | string | 否 | 如果该值为空，则默认为商户签约账号对应的支付宝用户ID |
| totalAmount | string | 否 | 订单总金额，单位为元，精确到小数点后两位，取值范围[0.01,100000000] 如果同时传入【可打折金额】和【不可打折金额】，该参数可以不用传入； 如果同时传入了【可打折金额】，【不可打折金额】，【订单总金额】三者，则必须满足如下条件：【订单总金额】=【可打折金额】+【不可打折金额】 |
| discountableAmount | string | 否 | 参与优惠计算的金额，单位为元，精确到小数点后两位，取值范围[0.01,100000000]。 如果该值未传入，但传入了【订单总金额】和【不可打折金额】，则该值默认为【订单总金额】-【不可打折金额】 |	
| body | string | 否 | 订单描述 |
| goodsDetail | string | 否 | 订单包含的商品列表信息，Json格式，其它说明详见商品明细说明 |
| operatorId | string | 否 | 商户操作员编号 |
| storeId | string | 否 | 商户门店编号 |
| terminalId | string | 否 | 商户机具终端编号 |
| extendParams | string | 否 | 业务扩展参数 |
| timeoutExpress | string | 否 | 该笔订单允许的最晚付款时间，逾期将关闭交易。取值范围：1m～15d。m-分钟，h-小时，d-天，1c-当天（1c-当天的情况下，无论交易何时创建，都在0点关闭）。 该参数数值不接受小数点， 如 1.5h，可转换为 90m |

#### 返回

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| err | error | 错误对象 |
| result | object | 结果对象 |

#### result 对象

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| code | string | 网关返回码,详见文档 |
| msg | string | 网关返回码描述,详见文档 |
| sub_code | string | 业务返回码,详见文档 |
| sub_msg | string | 业务返回码描述,详见文档 |
| sign | string | 签名,详见文档 |
| trade_no | string | 支付宝交易号 |
| out_trade_no | string | 商户订单号 |
| buyer_logon_id | string | 买家支付宝账号 |
| total_amount | number | 交易金额 |
| receipt_amount | string | 实收金额 |
| buyer_pay_amount | number | 买家付款的金额 |
| point_amount | number | 使用积分宝付款的金额 |
| invoice_amount | number | 交易中可给用户开具发票的金额 |
| gmt_payment | string | 交易支付时间 |
| fund_bill_list | object | 交易支付使用的资金渠道	|
| card_balance | number | 支付宝卡余额 |
| store_name | string | 发生支付交易的商户门店名称 |
| buyer_user_id | string | 买家在支付宝的用户id |
| discount_goods_detail | string | 本次交易支付所使用的单品券优惠的商品优惠信息 |
| voucher_detail_list | object | 本交易支付时使用的所有优惠券信息 |

### pagePay

电脑网站支付

#### options 参数

| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| totalAmount | string | 是 | 订单总金额，单位为元，精确到小数点后两位，取值范围[0.01,100000000] |
| subject | string | 是 | 订单标题 |
| outTradeNo | string | 否 | 商户订单号，64个字符以内、可包含字母、数字、下划线；需保证在商户端不重复。默认为当前时间戳 + 6位随机数。 |
| body | string | 否 | 订单描述。 |
| goodsDetail | string | 否 | 订单包含的商品列表信息，Json格式，详见[商品明细说明](#商品明细说明)。 | {"show_url":"https://www.alipay.com"} |
| passbackParams | string | 否 | 公用回传参数，如果请求时传递了该参数，则返回给商户时会回传该参数。支付宝只会在异步通知时将该参数原样返回。本参数必须进行UrlEncode之后才可以发送给支付宝。 |
| extendParams | string | 否 | 业务扩展参数，详见[业务扩展参数说明](#业务扩展参数说明)。 {"sys_service_provider_id":"2088511833207846"} |
| goodsType | string | 否 | 商品主类型：0—虚拟类商品，1—实物类商品（默认） 注：虚拟类商品不支持使用花呗渠道  |
| timeoutExpress | string | 否 | 该笔订单允许的最晚付款时间，逾期将关闭交易。取值范围：1m～15d。m-分钟，h-小时，d-天，1c-当天（1c-当天的情况下，无论交易何时创建，都在0点关闭）。 该参数数值不接受小数点， 如 1.5h，可转换为 90m。该参数在请求到支付宝时开始计时。 |
| enablePayChannels | string | 否 | [可用渠道](#可用渠道)，用户只能在指定渠道范围内支付当有多个渠道时用“,”分隔注：与disablePayChannels互斥 |
| disablePayChannels | string | 否 | [禁用渠道](#可用渠道)，用户不可用指定渠道支付当有多个渠道时用“,”分隔注：与enable_pay_channels互斥 |
| authToken | string | 否 | 针对用户授权接口，获取用户相关数据时，用于标识用户授权关系 |
| qrPayMode | string | 否 | PC扫码支付的方式，支持前置模式和跳转模式。前置模式是将二维码前置到商户的订单确认页的模式。需要商户在自己的页面中以 iframe 方式请求支付宝页面。具体分为以下几种：<br/>0：订单码-简约前置模式，对应 iframe 宽度不能小于600px，高度不能小于300px；<br/>1：订单码-前置模式，对应iframe 宽度不能小于 300px，高度不能小于600px；<br/>3：订单码-迷你前置模式，对应 iframe 宽度不能小于 75px，高度不能小于75px；<br/>4：订单码-可定义宽度的嵌入式二维码，商户可根据需要设定二维码的大小。<br/>跳转模式下，用户的扫码界面是由支付宝生成的，不在商户的域名下。<br/>2：订单码-跳转模式 |
| qrcodeWidth | string | 否 | 商户自定义二维码宽度 <br/>注：qr_pay_mode=4时该参数生效 |

#### 商品明细说明

| 名称 | 类型 | 最大长度 | 必填 | 描述 |
| --- | --- |  --- | --- | --- |
| show_url | string | 400 | 否 | 商品的展示地址。 |

#### 业务扩展参数说明

| 名称 | 类型 | 最大长度 | 必填 | 描述 |
| --- | --- |  --- | --- | --- |
| sys_service_provider_id | string | 64 | 否 | 系统商编号，该参数作为系统商返佣数据提取的依据，请填写系统商签约协议的PID |

##### 可用渠道

| 渠道名称 | 说明 |
| --- | --- |
| balance | 余额 |
| moneyFund | 余额宝 |
| coupon | 红包 |
| pcredit | 花呗 |
| pcreditpayInstallment | 花呗分期 |
| creditCard  | 信用卡 |
| creditCardExpress | 信用卡快捷 |
| creditCardCartoon | 信用卡卡通 |
| credit_group  | 信用支付类型（包含信用卡卡通、信用卡快捷、花呗、花呗分期） |
| debitCardExpress  | 借记卡快捷 |
| mcard | 商户预存卡 |
| pcard | 个人预存卡 |
| promotion | 优惠（包含实时优惠+商户优惠） |
| voucher | 营销券 |
| point | 积分 |
| mdiscount | 商户优惠 |
| bankPay | 网银 |

### 页面回跳参数
对于PC网站支付的交易，在用户支付完成之后，支付宝会根据API中商户传入的return_url参数，通过GET请求的形式将部分支付结果参数通知到商户系统。
 
##### 公共参数

| 名称 | 类型 | 最大长度 | 必填 | 描述 | 示例 |
| --- | --- |  --- | --- | --- | --- |
| app_id  | String | 是 | 32  | 支付宝分配给开发者的应用ID  | 2016040501024706 |
| method  | String | 是 | 128 | 接口名称  | alipay.trade.page.pay.return |
| sign_type | String | 是 | 10 |  签名算法类型，目前支持RSA2和RSA，推荐使用RSA2  | RSA2 |
| sign  | String | 是 | 256 | 支付宝对本次支付结果的签名，开发者必须使用支付宝公钥验证签名  | 详见示例 |
| charset | String | 是 | 10 |  编码格式，如utf-8,gbk,gb2312等 | utf-8 |
| timestamp | String | 是 | 19  | 前台回跳的时间，格式"yyyy-MM-dd HH:mm:ss" | 2016-08-11 19:36:01 |
| version | String | 是 | 3 | 调用的接口版本，固定为：1.0 | 1.0 |
| auth_app_id | String | 是 | 32  | 授权方的appid <br/>注：由于本接口暂不开放第三方应用授权，因此auth_app_id=app_id | 2016040501024706 |

##### 业务参数

| 名称 | 类型 | 最大长度 | 必填 | 描述 | 示例 |
| --- | --- |  --- | --- | --- | --- |
| out_trade_no | String  | 是 | 64  | 商户网站唯一订单号 | 70501111111S001111119 |
| trade_no  | String | 是 | 64  | 该交易在支付宝系统中的交易流水号。<br/>最长64位。 | 2016081121001004630200142207 |
| total_amount | Price | 是 | 9 | 该笔订单的资金总额，单位为RMB-Yuan。<br/>取值范围为[0.01，100000000.00]，<br/>精确到小数点后两位。 | 9.00 |
| seller_id | String | 是 | 16  | 收款支付宝账号对应的支付宝唯一用户号。 <br/>以2088开头的纯16位数字  | 2088111111116894 |

### 页面回跳示例
```http
https://m.alipay.com/GkSL?total_amount=0.10&timestamp=2016-11-02+18%3A34%3A19&sign=G3WI0czviMAOzS5t0fYaDgK32sGpjkkXYVFTpYMtgX8JaXLiGiUTO%2F2IHogcCFT96jBCLZ6IsNzd%2BmxkB%2FRuwG%2F7naQk1qReuORMkrB5cpBf9U40bIUoCmSNqtANsTE2UPV7GKegYG2RqoCRScTmeFAFHj5L7zsM%2BLuYb9mqN3g%3D&trade_no=2016110221001004330228438026&sign_type=RSA2&auth_app_id=2014073000007292&charset=UTF-8&seller_id=2088411964605312&method=alipay.trade.page.pay.return&app_id=2014073000007292&out_trade_no=20150g320g010101001&version=1.0 
```

### verify
验签接口。

#### 参数
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| options | object or string | 是 | 支付宝 POST 到`notify_url`的主体数据。<br/>格式是`application/x-www-form-urlencoded`。<br/>可以直接传入或格式化成`object`后传入。 |

#### 返回值

返回`true`或`false`。