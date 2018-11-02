import sdk from 'contract-editor-sdk'

// 创建账户
export function createAccount () {
  var acc = sdk.account.create().result
  return new Promise(resolve => {
    resolve(acc)
  })
}

// BU转换成mo
export function buToMo (bu) {
  return sdk.util.buToMo(bu)
}

// mo转换成BU
export function moToBu (mo) {
  return sdk.util.moToBu(mo)
}

/*
获取账户余额
@params = {
type: 环境类型[production, development, sandbox],
address: 账户地址
}
*/
export function getBalance (params) {
  return sdk.account.getBalance(params)
}

/*
账户充值
@params = {
type: 环境类型[production, development, sandbox],
address: 账户地址
}
*/
export function recharge (params) {
  return sdk.account.recharge(params)
}

/*
获取合约实例
*/
export function getList () {
  return sdk.case.getList()
}

/*
根据hash查询合约地址
@params = {
type: 环境类型[production, development, sandbox],
hash: 交易hash
}
*/
export function getAddress (params) {
  console.log(params)
  return sdk.contract.getAddress(params.type, params.hash)
}

/*
发布合约
@params = {
type: 环境类型[production, development, sandbox],
privateKey: 账户地址,
contractCode: 合约代码
}
*/
export function createContract (params) {
  console.log(params)
  return sdk.contract.release(params)
}
/*
调用合约
@params = {
type: 环境类型[production, development, sandbox],
privateKey: 账户私钥,
contractAddress: 合约地址,
buAmount: bu数量，字符串类型（单位mo）(非必填项),
input: 合约参数，字符串类型 (非必填项)
}
*/
export function debugForMain (params) {
  console.log(params)
  return sdk.contract.debugForMain(params)
}
/*
查询合约
@params = {
type: 环境类型[production, development, sandbox],
input: 入参[object],
contractAdress: 合约地址
}
*/
export function debugForQuery (params) {
  console.log(params)
  return sdk.contract.debugForQuery(params)
}
