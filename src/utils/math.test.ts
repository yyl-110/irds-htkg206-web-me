import { describe, expect, it } from 'vitest'
import Calculator from './math'

describe('1. 整数运算', () => {
  it('整数加法 1 + 1 = 2', () => expect(Calculator.add(1, 1)).toBe(2))
  it('整数减法 2 - 1 = 1', () => expect(Calculator.sub('2', 1)).toBe(1))
  it('整数乘法 2 * 1 = 2', () => expect(Calculator.mul(2, '1')).toBe(2))
  it('整数除法 9 / 3 = 3', () => expect(Calculator.div(9, 3)).toBe(3))
  it('[链式调用]整数加法 1 + 1 = 2', () => expect(new Calculator(1).add(1).done()).toBe(2))
  it('[链式调用]整数减法 2 - 1 = 1', () => expect(new Calculator('2').sub(1).done()).toBe(1))
  it('[链式调用]整数乘法 2 * 1 = 2', () => expect(new Calculator(2).mul('1').done()).toBe(2))
  it('[链式调用]整数除法 9 / 3 = 3', () => expect(new Calculator(9).div(3).done()).toBe(3))
  it('[表达式]整数加法 1 + 1 = 2', () => expect(Calculator.evaluate('1 + 1')).toBe(2))
  it('[表达式]整数减法 2 - 1 = 1', () => expect(Calculator.evaluate('2 - 1')).toBe(1))
  it('[表达式]整数乘法 2 * 1 = 2', () => expect(Calculator.evaluate('2 * 1')).toBe(2))
  it('[表达式]整数除法 9 / 3 = 3', () => expect(Calculator.evaluate('9 / 3')).toBe(3))
})

describe('2. 浮点数运算精度', () => {
  it('浮点数加法 0.1 + 0.2 = 0.3', () => expect(Calculator.add(0.1, 0.2)).toBe(0.3))
  it('浮点数减法 0.3 - 0.2 = 0.1', () => expect(Calculator.sub(0.3, 0.2)).toBe(0.1))
  it('浮点数乘法 1.005 * 100 = 100.5', () => expect(Calculator.mul(1.005, 100)).toBe(100.5))
  it('浮点数除法 0.69 / 10 = 0.069', () => expect(Calculator.div(0.69, 10)).toBe(0.069))
  it('[链式调用]浮点数加法 0.1 + 0.2 = 0.3', () => expect(new Calculator(0.1).add(0.2).done()).toBe(0.3))
  it('[链式调用]浮点数减法 0.3 - 0.2 = 0.1', () => expect(new Calculator(0.3).sub(0.2).done()).toBe(0.1))
  it('[链式调用]浮点数乘法 1.005 * 100 = 100.5', () => expect(new Calculator(1.005).mul(100).done()).toBe(100.5))
  it('[链式调用]浮点数除法 0.69 / 10 = 0.069', () => expect(new Calculator(0.69).div(10).done()).toBe(0.069))
  it('[表达式]浮点数加法 0.1 + 0.2 = 0.3', () => expect(Calculator.evaluate('0.1 + 0.2')).toBe(0.3))
  it('[表达式]浮点数减法 0.3 - 0.2 = 0.1', () => expect(Calculator.evaluate('0.3 - 0.2')).toBe(0.1))
  it('[表达式]浮点数乘法 1.005 * 100 = 100.5', () => expect(Calculator.evaluate('1.005 * 100')).toBe(100.5))
  it('[表达式]浮点数除法 0.69 / 10 = 0.069', () => expect(Calculator.evaluate('0.69 / 10')).toBe(0.069))
})

describe('3. 浮点数运算格式化', () => {
  it('保留两位小数 10 / 3 = 3.33', () => expect(Calculator.div(10, 3, { precision: 2 })).toBe(3.33))
  it('保留两位小数 13 / 7 = 1.86', () => expect(Calculator.div(13, 7, { precision: 2 })).toBe(1.86))
  it('[链式调用]保留两位小数 10 / 3 = 3.33', () => expect(new Calculator(10).div(3).done({ precision: 2 })).toBe(3.33))
  it('[链式调用]保留两位小数 13 / 7 = 1.86', () => expect(new Calculator(13).div(7).done({ precision: 2 })).toBe(1.86))
  it('[表达式]保留两位小数 10 / 3 = 3.33', () => expect(Calculator.evaluate('10 / 3', { precision: 2 })).toBe(3.33))
  it('[表达式]保留两位小数 13 / 7 = 1.86', () => expect(Calculator.evaluate('13 / 7', { precision: 2 })).toBe(1.86))
})

describe('4. 多个值链式调用', () => {
  it('1 + 2 + 4 = 7', () => expect(new Calculator(1).add(2).add(4).done()).toBe(7))
  it('0.1 + 0.2 + 0.4 = 0.7', () => expect(new Calculator(0.1).add(0.2).add(0.4).done()).toBe(0.7))
})

describe('5. 多个值表达式', () => {
  it('1 + 2 + 4 = 7', () => expect(Calculator.evaluate('1 + 2 + 4')).toBe(7))
  it('0.1 + 0.2 + 0.4 = 0.7', () => expect(Calculator.evaluate('0.1 + 0.2 + 0.4')).toBe(0.7))
})

describe('5. toPrice', () => {
  it('0 => 0.00', () => expect(Calculator.toPrice(0)).toBe('0.00'))
  it('0.1 => 0.10', () => expect(Calculator.toPrice(10)).toBe('0.10'))
})
