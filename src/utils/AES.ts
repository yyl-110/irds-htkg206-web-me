import { AES, enc, mode, pad } from 'crypto-js'
/**
 * AES 加密
 * @param word: 需要加密的文本
 * @param privateKey: // 需要前后端保持一致
 * @param mode: ECB // 需要前后端保持一致
 * @param pad: Pkcs7 //前端 Pkcs7 对应 后端 Pkcs5
 */

// 当前页面 storage 的加解密  key
const privateKey = 'twDpuiqGODEunrjX' // 本地默认的key

/** 密码正则 */
export const passwordPattern: RegExp = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,30}$/
/** 密码正则提示 */
export const passwordPatternMessage = '请填写包含 大写字母/小写字母/数字/特殊符号 的8-30位密码'

export function encryptValue(word: any, randomKey = privateKey) {
  const key = enc.Utf8.parse(randomKey)
  const val = AES.encrypt(word, key, {
    mode: mode.ECB,
    padding: pad.Pkcs7,
  }).toString()
  return val
}

export function decryptValue(word: any, randomKey = privateKey) {
  const key = enc.Utf8.parse(randomKey)
  const val = AES.decrypt(word, key, {
    mode: mode.ECB,
    padding: pad.Pkcs7,
  }).toString(enc.Utf8)
  return val
}
