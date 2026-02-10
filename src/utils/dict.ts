/**
 * 数据字典工具类
 */
// import { ElementPlusInfoType } from '@/types/elementPlus'
// type ElementPlusInfoType = 'success' | 'info' | 'warning' | 'danger'
// import { DictDataVO, listSimpleDictData } from '../api/system/dict/dict.data'
import appStore from '@/store'
import type { DictDataType } from '@/store/modules/dict'

const { useDictStore } = appStore

/** @deprecated 已迁移至 `@/store/modules/dict.ts`, 应该优先使用 pinia 中的 dictStore */
export const dictStore = useDictStore

/**
 * 原项目将数据缓存到 pinia, 参考自: `src/store/modules/dict.ts`
 * @deprecated 已弃用
 */
export interface DictState {
  dictMap: { [key: string]: any }
  isSetDict: boolean
  getDictByType: (type: string) => any
  setDictMap: () => Promise<void>
}

// /**
//  * @deprecated 已迁移至 `@/store/modules/dict.ts`
//  */
// export const dictStore: DictState = {
//   dictMap: {},
//   isSetDict: false,
//   getDictByType(type: string) {
//     return this.dictMap[type]
//   },
//   async setDictMap() {
//     const res = await listSimpleDictData()
//     // 设置数据
//     const dictDataMap: DictState['dictMap'] = {}
//     res.data.data.forEach((dictData: DictDataVO) => {
//       // 获得 dictType 层级
//       const enumValueObj = dictDataMap[dictData.dictType]
//       if (!enumValueObj) {
//         dictDataMap[dictData.dictType] = []
//       }
//       // 处理 dictValue 层级
//       dictDataMap[dictData.dictType].push({
//         value: dictData.value,
//         label: dictData.label,
//         colorType: dictData.colorType,
//         cssClass: dictData.cssClass
//       })
//     })
//     this.dictMap = dictDataMap
//     this.isSetDict = true
//     // wsCache.set(CACHE_KEY.DICT_CACHE, dictDataMap, { exp: 60 }) // 60 秒 过期
//   },
// }

/** @deprecated 已迁移至 `@/store/modules/dict.ts`, 应该优先使用 pinia 中的 dictStore */
export const getDictOptions = useDictStore.getDictOptions.bind(useDictStore)
/** @deprecated 已迁移至 `@/store/modules/dict.ts`, 应该优先使用 pinia 中的 dictStore */
export const getIntDictOptions = useDictStore.getIntDictOptions.bind(useDictStore)
/** @deprecated 已迁移至 `@/store/modules/dict.ts`, 应该优先使用 pinia 中的 dictStore */
export const getStrDictOptions = useDictStore.getStrDictOptions.bind(useDictStore)
/** @deprecated 已迁移至 `@/store/modules/dict.ts`, 应该优先使用 pinia 中的 dictStore */
export const getBoolDictOptions = useDictStore.getBoolDictOptions.bind(useDictStore)

/**
 * get dict object
 * @param dictType
 * @param value
 * @deprecated 弃用
 */
export function getDictObj(dictType: string, value: any) {
  const dictOptions: DictDataType[] = getDictOptions(dictType)
  dictOptions.forEach((dict: DictDataType) => {
    if (dict.value === value.toString())
      return dict
  })
}

/**
 * 获得字典数据的文本展示
 * @deprecated 已迁移至 `@/store/modules/dict.ts`
 * @param dictType 字典类型
 * @param value 字典数据的值
 */
export const getDictLabel = (dictType: string, value: any) => useDictStore.getDictLabel(dictType, value)

export enum DICT_TYPE {
  USER_TYPE = 'user_type',
  COMMON_STATUS = 'common_status',
  SYSTEM_TENANT_PACKAGE_ID = 'system_tenant_package_id',

  // ========== SYSTEM 模块 ==========
  SYSTEM_USER_SEX = 'system_user_sex',
  SYSTEM_MENU_TYPE = 'system_menu_type',
  SYSTEM_ROLE_TYPE = 'system_role_type',
  SYSTEM_DATA_SCOPE = 'system_data_scope',
  SYSTEM_NOTICE_TYPE = 'system_notice_type',
  SYSTEM_OPERATE_TYPE = 'system_operate_type',
  SYSTEM_LOGIN_TYPE = 'system_login_type',
  SYSTEM_LOGIN_RESULT = 'system_login_result',
  SYSTEM_SMS_CHANNEL_CODE = 'system_sms_channel_code',
  SYSTEM_SMS_TEMPLATE_TYPE = 'system_sms_template_type',
  SYSTEM_SMS_SEND_STATUS = 'system_sms_send_status',
  SYSTEM_SMS_RECEIVE_STATUS = 'system_sms_receive_status',
  SYSTEM_ERROR_CODE_TYPE = 'system_error_code_type',
  SYSTEM_OAUTH2_GRANT_TYPE = 'system_oauth2_grant_type',
  SYSTEM_MAIL_SEND_STATUS = 'system_mail_send_status',
  SYSTEM_NOTIFY_TEMPLATE_TYPE = 'system_notify_template_type',

  // ========== INFRA 模块 ==========
  INFRA_BOOLEAN_STRING = 'infra_boolean_string',
  INFRA_JOB_STATUS = 'infra_job_status',
  INFRA_JOB_LOG_STATUS = 'infra_job_log_status',
  INFRA_API_ERROR_LOG_PROCESS_STATUS = 'infra_api_error_log_process_status',
  INFRA_CONFIG_TYPE = 'infra_config_type',
  INFRA_CODEGEN_TEMPLATE_TYPE = 'infra_codegen_template_type',
  INFRA_CODEGEN_FRONT_TYPE = 'infra_codegen_front_type',
  INFRA_CODEGEN_SCENE = 'infra_codegen_scene',
  INFRA_FILE_STORAGE = 'infra_file_storage',

  // ========== BPM 模块 ==========
  BPM_MODEL_CATEGORY = 'bpm_model_category',
  BPM_MODEL_FORM_TYPE = 'bpm_model_form_type',
  BPM_TASK_ASSIGN_RULE_TYPE = 'bpm_task_assign_rule_type',
  BPM_PROCESS_INSTANCE_STATUS = 'bpm_process_instance_status',
  BPM_PROCESS_INSTANCE_RESULT = 'bpm_process_instance_result',
  BPM_TASK_ASSIGN_SCRIPT = 'bpm_task_assign_script',
  BPM_OA_LEAVE_TYPE = 'bpm_oa_leave_type',

  // ========== PAY 模块 ==========
  PAY_CHANNEL_WECHAT_VERSION = 'pay_channel_wechat_version', // 微信渠道版本
  PAY_CHANNEL_ALIPAY_SIGN_TYPE = 'pay_channel_alipay_sign_type', // 支付渠道支付宝算法类型
  PAY_CHANNEL_ALIPAY_MODE = 'pay_channel_alipay_mode', // 支付宝公钥类型
  PAY_CHANNEL_ALIPAY_SERVER_TYPE = 'pay_channel_alipay_server_type', // 支付宝网关地址
  PAY_CHANNEL_CODE_TYPE = 'pay_channel_code_type', // 支付渠道编码类型
  PAY_ORDER_NOTIFY_STATUS = 'pay_order_notify_status', // 商户支付订单回调状态
  PAY_ORDER_STATUS = 'pay_order_status', // 商户支付订单状态
  PAY_ORDER_REFUND_STATUS = 'pay_order_refund_status', // 商户支付订单退款状态
  PAY_REFUND_ORDER_STATUS = 'pay_refund_order_status', // 退款订单状态
  PAY_REFUND_ORDER_TYPE = 'pay_refund_order_type', // 退款订单类别

  // ========== MP 模块 ==========
  MP_AUTO_REPLY_REQUEST_MATCH = 'mp_auto_reply_request_match', // 自动回复请求匹配类型
  MP_MESSAGE_TYPE = 'mp_message_type', // 消息类型

  // ========== MALL 模块 ==========
  PRODUCT_UNIT = 'product_unit', // 商品单位
  PRODUCT_SPU_STATUS = 'product_spu_status', // 商品状态
}
