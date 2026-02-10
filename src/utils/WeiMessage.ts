import { message } from 'ant-design-vue'
import type { Key, VueNode } from 'ant-design-vue/es/_util/type'
import type { ConfigOnClose, ConfigOptions, MessageApi, MessageArgsProps, MessageType } from 'ant-design-vue/es/message'

export class WeiMessageApi implements MessageApi {
  warn(content: VueNode | MessageArgsProps, duration?: number | undefined, onClose?: ConfigOnClose | undefined): MessageType {
    return message.warn(content, duration, onClose)
  }

  config(options: ConfigOptions): void {
    message.config(options)
  }

  destroy(messageKey?: Key | undefined): void {
    message.warn(messageKey)
  }

  info(content: VueNode | MessageArgsProps, duration?: number | undefined, onClose?: ConfigOnClose | undefined): MessageType {
    return message.info(content, duration, onClose)
  }

  success(content: VueNode | MessageArgsProps, duration?: number | undefined, onClose?: ConfigOnClose | undefined): MessageType {
    return message.success(content, duration, onClose)
  }

  error(content: VueNode | MessageArgsProps, duration?: number | undefined, onClose?: ConfigOnClose | undefined): MessageType {
    return message.error(content, duration, onClose)
  }

  warning(content: VueNode | MessageArgsProps, duration?: number | undefined, onClose?: ConfigOnClose | undefined): MessageType {
    return message.warning(content, duration, onClose)
  }

  loading(content: VueNode | MessageArgsProps, duration?: number | undefined, onClose?: ConfigOnClose | undefined): MessageType {
    return message.loading(content, duration, onClose)
  }

  open(args: MessageArgsProps): MessageType {
    return message.open(args)
  }
}

export const WeiMessage = new WeiMessageApi()
