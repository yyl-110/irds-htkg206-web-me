/**
 * 活动页面配置 - JS 脚本示例
 * 上传此文件到「创建/编辑活动」→「上传JS文件」，保存后在页面配置里选方法。
 */

/** 输出项公式：根据输入参数计算结果 */
function calcOutputValue(params) {
  const input = Number(params?.inputValue ?? 0);
  return { value: input * 2 };
}

/** 校验输入是否合法 */
function validateInputByJs(params) {
  const v = params?.inputValue;
  if (v === undefined || v === null || String(v).trim() === '') {
    return { valid: false, message: '请输入数值' };
  }
  return { valid: true, value: v };
}

/** 计算按钮点击 */
function onCalcButtonClick(params) {
  return calcOutputValue(params);
}

// 以下写法也会被解析到下拉列表
export function exportCalc(params) {
  return calcOutputValue(params);
}

export default {
  defaultCalc: function (params) {
    return calcOutputValue(params);
  },
  defaultValidate: function (params) {
    return validateInputByJs(params);
  },
};
