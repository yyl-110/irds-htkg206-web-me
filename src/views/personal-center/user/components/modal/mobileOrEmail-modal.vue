<!-- 专用工具  -->
<script lang="ts" setup>
import { HeartTwoTone, LockOutlined, MinusCircleOutlined, NotificationOutlined, PauseOutlined, PhoneOutlined, PlusCircleOutlined, SearchOutlined, SmileTwoTone, UserOutlined } from '@ant-design/icons-vue'
import { defineComponent, ref } from 'vue'
import type { CarouselProps, FormInstance, TableColumnType, TableProps, TreeProps, UploadChangeParam, UploadProps } from 'ant-design-vue'
import type { ColumnsType } from 'ant-design-vue/es/table'
import { message } from 'ant-design-vue'
import { WeiI18n } from '@/utils/WeiI18n'
import { AdminApiSystemUserProfile } from '@/api/tags/管理后台用户个人中心'
import { UserPhoneOrEmailUpdateRequestDTOModel } from '@/api/models/UserProfileUpdateRequestDTOModel'
import { useUserStore } from '@/store/modules/user'
import { langValue } from '@/utils/changelang'
const props = defineProps({
  /** 弹窗状态 */
  modalVisible: {
    require: false,
    type: Boolean,
    default: false,
  },

  /** 修改类型  1:phone  2:email 3: */
  updateType: {
    require: false,
    type: String,
    default: '',
  },

  /** 弹窗标题 */
  modalTitle: {
    require: false,
    type: String,
    default: '',
  },

  /** 主手机号码 */
  mobileMain: {
    require: false,
    type: String,
    default: '',
  },

})
function Changelanguage(lang: any) {
  const langtype = navigator.language
  return langValue(lang, langtype)
}
const emit = defineEmits<{
  /** 点击取消按钮 */
  onClose: [visible: boolean]
  /** 点击确定按钮 */
  handleUpdateSuccess: [visible: boolean]
  /** 主手机号码点击确定按钮 */
  handleMainPhoneSuccess: [visible: boolean]
  handleMainPhoneVerify: [visible: boolean]
}>()
const userStore = useUserStore()
/** 表单对象 */
const formRef = ref<FormInstance>()
/** resetForm */
const resetForm = () => formRef.value?.resetFields()

resetForm()

/** 弹窗状态 */
const visible = computed(() => {
  if (props.modalVisible) {
    nextTick(() => {
      resetForm()
    })
  }
  return props.modalVisible
})

/** 手机验证码数据对象 */
const mobileData = reactive({
  phoneNumber: '',
  phoneCode: '',
  email: '',
  emailCode: '',
  engineNumber: '',
})

const requestParams = reactive(new UserPhoneOrEmailUpdateRequestDTOModel())

/** 手机号码校验规则 */
const phoneRules = ref([
  {
    required: true,
    pattern: /^1(3\d|4[014-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/,
    message: WeiI18n.$t('请输入正确的手机号码'),
    trigger: 'blur',
  },
])

/** 主手机号码便渐渐状态 */
const mobileFlag = ref<boolean>(false)

/**
 * @description 验证码确认， 关闭弹窗
 */
async function handleSave() {
  formRef.value?.validate().then(async () => {
    // 先调用验证码校验接口
    if (props.updateType === '1') {
      const res = await AdminApiSystemUserProfile.commonCheckMessageCode({ mobile: mobileData.phoneNumber, code: mobileData.phoneCode })
      if (props.modalTitle === '主手机号码验证') {
        emit('handleMainPhoneSuccess', false)
        resetForm()
      }
      else if (props.modalTitle === '新手机号码绑定' && res.data.data) {
        save()
      }
      // if (res.data.data) {
      //   save()
      // }
    }
    else if (props.updateType === '2') {
      const res = await AdminApiSystemUserProfile.commonCheckEmailCode({ email: mobileData.email, code: mobileData.emailCode })
      if (res.data.data) {
        save()
      }
    }
    else if (props.updateType === '3') {
      const res = await AdminApiSystemUserProfile.commonCheckMessageCode({ mobile: mobileData.phoneNumber, code: mobileData.phoneCode, })
      if (res.data.data) {
        save()
      }
    }
    else if (props.updateType === '4') {
      save()
    }
    else if (props.updateType === '5') {
      const res = await AdminApiSystemUserProfile.commonCheckMessageCode({ mobile: mobileData.phoneNumber, code: mobileData.phoneCode })
      if (res.data.data) {
        emit('handleMainPhoneVerify', false)
      }
    }
  })
}

/**
 * @description 保存 修改数据
 */
async function save() {
  try {
    // 调用保存接口
    // 判断是绑定手机号码，还是修改手机号码
    // "1:修改手机号 2：修改邮箱  3：修改子手机号  4：修改发动机编号",
    let parm = {}
    if (props.updateType === '1') {
      requestParams.type = '1'
      requestParams.mobile = mobileData.phoneNumber
      requestParams.operationType = 'insert'
      parm = { ...requestParams }
    }
    else if (props.updateType === '2') {
      parm = { type: '2', email: mobileData.email, operationType: 'insert' }
    }
    else if (props.updateType === '3') {
      parm = { type: '3', mobiles: [Number(mobileData.phoneNumber)], operationType: 'insert', userId: userStore.getUser.id, }
    }
    else if (props.updateType === '4') {
      parm = { type: '4', bindVinSerial: `${mobileData.engineNumber}`, operationType: 'insert' }
    }
    const res = await AdminApiSystemUserProfile.updatePhoneOrEmailOrEngine({ ...parm })
    if (res.data) {
      message.info(WeiI18n.$t('修改成功'))
      emit('handleUpdateSuccess', false)
    }
    else {
      message.error(WeiI18n.$t(res.data?.msg || '修改失败'))
    }
  }
  catch (err) {
  }
}

function cancel() {
  emit('onClose', false)
}
/** 发送验证码状态 */
const sendingType = ref<boolean>(true)
/** 验证码秒数 */
const countdownTime = ref<number>(300)
/** 发送验证码状态 */
const sendingTypetwo = ref<boolean>(true)
/** 验证码秒数 */
const countdownTimetow = ref<number>(300)
/**
 * 倒计时函数
 *
 * 该函数通过setInterval每秒更新一次倒计时，并在倒计时结束时更改发送类型为true。
 */
 function countdown() {
// 使用setInterval设置每秒更新一次倒计时
  const countdownInterval = setInterval(() => {
    countdownTime.value--
    // 检查倒计时是否结束
    if (countdownTime.value <= 0) {
      sendingType.value = true
      // 清除定时器
      clearInterval(countdownInterval)
    }
  }, 1000) // 1000毫秒 = 1秒
}
/**
 * 倒计时函数
 *
 * 该函数通过setInterval每秒更新一次倒计时，并在倒计时结束时更改发送类型为true。
 */
 function countdowntwo() {
// 使用setInterval设置每秒更新一次倒计时
  const countdownInterval = setInterval(() => {
    countdownTimetow.value--
    // 检查倒计时是否结束
    if (countdownTimetow.value <= 0) {
      sendingTypetwo.value = true
      // 清除定时器
      clearInterval(countdownInterval)
    }
  }, 1000) // 1000毫秒 = 1秒
}
/**
 *@description 发送短信验证码
 */
async function handleSendSMS() {
  const res = await AdminApiSystemUserProfile.commonSendingMessage({ mobile: mobileData.phoneNumber })
  if (res.data) {
    sendingType.value = false
    countdownTime.value = 300
    countdown()
    message.info('验证码发送成功')
  }
  else {
    message.error(res.data?.msg || '验证码发送失败')
  }
}

/**
 *@description 发送邮箱验证码
 */
async function handleSendEmail() {
  const res = await AdminApiSystemUserProfile.commonSendingEmail({ email: mobileData.email })
  if (res.data) {
    sendingTypetwo.value = false
    countdownTimetow.value = 300
    countdowntwo()
    message.info('验证码发送成功')
  }
  else {
    message.error(res.data?.msg || '验证码发送失败')
  }
}

/**
 * @description 电话号码改变 事件
 * @param event 手机号码
 */
function handlePhoneChange(event: string) {
  const value = mobileData.phoneNumber
  // 检查输入框的值是否只包含数字
  if (!/^\d+$/.test(value)) {
    mobileData.phoneNumber = ''
  }
}
watch(() => props.mobileMain, () => {
  if (props.mobileMain) {
    mobileData.phoneNumber = props.mobileMain
    mobileFlag.value = true
  }
  else {
    mobileData.phoneNumber = ''
    mobileFlag.value = false
  }
}, { immediate: true })
</script>

<template>
  <a-modal
    v-model:visible="visible"
    style="width: 620px"
    :title="$t(modalTitle)"
    :confirm-loading="$isPending('save')"
    :mask-closable="false"
    @ok="handleSave"
    @cancel="cancel"
  >
    <div class="w-[562px] my-[30px]">
      <a-form ref="formRef" :model="mobileData" name="mobileData" :label-col="{ style: { width: '90px' } }">
        <a-form-item
          v-if="['1', '3', '5'].includes(updateType)" :label="$t('电话号码')" name="phoneNumber" :rules="phoneRules"
        >
          <a-input v-model:value="mobileData.phoneNumber" allow-clear :placeholder="$t('请输入手机号码')" :disabled="mobileFlag" @change="handlePhoneChange">
            <template #prefix>
              <PhoneOutlined />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item v-if="['1', '3', '5'].includes(updateType)" :label="$t('验证码')" name="phoneCode" :rules="[{ required: true, message: $t('请输入验证码') }]">
          <a-input-group compact>
            <a-input v-model:value="mobileData.phoneCode" style="width: calc(100% - 150.4px)" :placeholder="$t('请输入验证码')">
              <template #prefix>
                <LockOutlined />
              </template>
            </a-input>
            <a-button   v-if="sendingType" type="primary" @click="handleSendSMS" style="margin-left: 20px;">
              {{ $t('发送验证码') }}
            </a-button>
            <a-button v-else type="link" style="width: 125px;text-align: center;">
              {{ `${countdownTime}${Changelanguage('Resendinseconds')}` }}
            </a-button>
          </a-input-group>
        </a-form-item>

        <a-form-item v-if="updateType === '2'" :label="$t('邮箱')" name="email" :rules="[{ required: true, message: $t('请输入邮箱') }]">
          <a-input v-model:value="mobileData.email" allow-clear :placeholder="$t('请输入邮箱')">
            <template #prefix>
              <UserOutlined class="icon_style" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item v-if="updateType === '2'" :label="$t('验证码')" name="emailCode" :rules="[{ required: true, message: $t('请输入验证码') }]">
          <a-input-group compact>
            <a-input v-model:value="mobileData.emailCode" style="width: calc(100% - 150.4px)" :placeholder="$t('请输入验证码')">
              <template #prefix>
                <LockOutlined />
              </template>
            </a-input>
            <a-button v-if="sendingTypetwo" type="primary" @click="handleSendEmail">
              {{ $t('发送验证码') }}
            </a-button>
            <a-button v-else type="link" style="width: 125px;text-align: center;">
              {{ `${countdownTimetow}${Changelanguage('Resendinseconds')}` }}
            </a-button>
          </a-input-group>
        </a-form-item>

        <a-form-item v-if="updateType === '4'" :label="$t('发动机号')" name="engineNumber" :rules="[{ required: true, message: $t('请输入发动机号') }]">
          <a-input v-model:value="mobileData.engineNumber" allow-clear :placeholder="$t('请输入发动机号')">
            <template #prefix>
              <UserOutlined class="icon_style" />
            </template>
          </a-input>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<style lang="less" scoped>
.drawerContent{
  display: flex;
  height: calc(100vh - 163px);
  background-color: var(--main-page-background)
}

.dragLine {
  cursor: ew-resize;
  position: absolute;
  right: 0;
  width: 15px;
  height: 84%;
  padding-top:35vh;
  top: 0;
}

.left-body{
  min-width: 150px;
  height: auto;
  position: relative;
  background-color: #FFFFFF;
}

.center-body{
  min-width: 300px;
  height: auto;
  background-color: #FFFFFF;
  position: relative;
  margin-left: 20px;
  padding: 20px;
}
.right-body{
  min-width: 300px;
  height: auto;
  background-color: #FFFFFF;
  margin-right: 20px;
  padding: 20px;
}

.carousel-item{
  width: 100%;
  height: 550px;
}

.img-btn-body{
  display: inline-flex;
  justify-content:flex-end;
  align-items: center;
}

.btn-body{
  flex-direction: row;
  justify-content:flex-end;
}

.row-body{
    flex-direction: row;
    justify-content: space-between;
  }
</style>
