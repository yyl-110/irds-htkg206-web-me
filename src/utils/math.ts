import {
  add,
  all,
  bignumber,
  chain,
  create,
  divide,
  format,
  multiply,
  subtract,
} from "mathjs";

const _opMap = { add, subtract, multiply, divide };

export type CalculatorValue =
  | number
  | string
  | math.Fraction
  | math.BigNumber
  | math.Unit
  | boolean
  | null;

/**
 * 用于四则运算的计算类
 * @author kuidi<hellosc@qq.com>
 *
 * ## 使用
 * ```javascript
 * import Calculator from '@/utils/math.js'
 *
 * Calculator.add(0.1, 0.2) // 0.3
 * ```
 *
 * 更多 `API` 参考测试用例(`./math.test.ts`)
 *
 * **更新时应该增加单元测试, 保证安全性和覆盖率**
 */
export default class Calculator {
  numChain: math.MathJsChain<math.MathType>;
  /**
   * Calculator
   * @param num
   */
  constructor(num: CalculatorValue) {
    this.numChain = chain(num as math.MathType);
  }

  /**
   * +
   * @param n
   */
  add(n: CalculatorValue) {
    this.numChain = this.numChain.add(bignumber(n));
    return this;
  }

  /**
   * -
   * @param n
   */
  sub(n: CalculatorValue) {
    this.numChain = this.numChain.subtract(bignumber(n));
    return this;
  }

  /**
   * x
   * @param n
   */
  mul(n: CalculatorValue) {
    this.numChain = this.numChain.multiply(bignumber(n));
    return this;
  }

  /**
   * ➗
   * @param n
   */
  div(n: CalculatorValue) {
    this.numChain = this.numChain.divide(bignumber(n));
    return this;
  }

  /**
   * done (number)
   * @param {math.FormatOptions?} config
   * @returns {number}
   */
  done(config?: math.FormatOptions) {
    return Calculator.format(this.numChain.done(), config);
  }
  /**
   * done (string)
   * @param {math.FormatOptions?} config
   * @returns {string}
   */
  doneString(config?: math.FormatOptions) {
    return Calculator.formatString(this.numChain.done(), config);
  }
  /**
   * 默认 math.format() config
   * @type {math.FormatOptions}
   */
  static DEFAULT_FORMAT_CONFIG: math.FormatOptions = { notation: "fixed" };
  /**
   * 格式化计算结果值
   * @param {any} value
   * @param {math.FormatOptions?} config
   * @returns {number}
   */
  static format(value: any, config: math.FormatOptions = {}) {
    return Number(
      format(value, { ...Calculator.DEFAULT_FORMAT_CONFIG, ...config }),
    );
  }

  /**
   * 格式化计算结果值
   * @param {any} value
   * @param {math.FormatOptions?} config
   * @returns {string}
   */
  static formatString(value: any, config: math.FormatOptions = {}) {
    return format(value, { ...Calculator.DEFAULT_FORMAT_CONFIG, ...config });
  }

  /**
   * 计算字符串形式的表达式
   * @param {string} expr 计算表达式
   * @param {math.FormatOptions?} config
   * @param {math.createOptions?} mathConfig
   * @returns {number}
   */
  static evaluate(
    expr: string,
    config?: math.FormatOptions,
    mathConfig?: math.FormatOptions,
  ) {
    const math = create(all, { number: "BigNumber", ...(mathConfig || {}) });
    return Calculator.format(math.evaluate(expr), config);
  }

  /**
   * 四则运算计算
   * @param {CalculatorValue} 运算数 a
   * @param {CalculatorValue} 运算数 b
   * @param a
   * @param b
   * @param {'add' | 'subtract' |  'multiply' | 'divide'} op
   * @param {math.FormatOptions=} config
   * @returns {string}
   */
  static calc(
    a: CalculatorValue,
    b: CalculatorValue,
    op: "add" | "subtract" | "multiply" | "divide",
    config: math.FormatOptions = {},
  ) {
    return Calculator.format(_opMap[op](bignumber(a), bignumber(b)), config);
  }

  /**
   * 两数相加
   * @param {CalculatorValue} a 运算数 a
   * @param {CalculatorValue} b 运算数 b
   * @param {math.FormatOptions=} conf
   * @returns {number}
   */
  static add(
    a: CalculatorValue,
    b: CalculatorValue,
    conf?: math.FormatOptions,
  ) {
    return Number(Calculator.calc(a, b, "add", conf));
  }
  /**
   * 两数相减
   * @param {CalculatorValue} a 运算数 a
   * @param {CalculatorValue} b 运算数 b
   * @param {math.FormatOptions=} conf
   * @returns {number}
   */
  static sub(
    a: CalculatorValue,
    b: CalculatorValue,
    conf?: math.FormatOptions,
  ) {
    return Number(Calculator.calc(a, b, "subtract", conf));
  }
  /**
   * 两数相乘
   * @param {CalculatorValue} a 运算数 a
   * @param {CalculatorValue} b 运算数 b
   * @param {math.FormatOptions=} conf
   * @returns {number}
   */
  static mul(
    a: CalculatorValue,
    b: CalculatorValue,
    conf?: math.FormatOptions,
  ) {
    return Number(Calculator.calc(a, b, "multiply", conf));
  }
  /**
   * 两数相除
   * @param {CalculatorValue} a 运算数 a
   * @param {CalculatorValue} b 运算数 b
   * @param {math.FormatOptions=} conf
   * @returns {number}
   */
  static div(
    a: CalculatorValue,
    b: CalculatorValue,
    conf?: math.FormatOptions,
  ) {
    return Number(Calculator.calc(a, b, "divide", conf));
  }
  /**
   * 将后端返回的价格转为真实价格
   * @param {CalculatorValue} price 后端返回的价格
   * @returns {string}
   */
  static toPrice(price: CalculatorValue) {
    const calc = new Calculator(price);
    return calc.div(100).doneString({ precision: 2 });
  }
}
