/** 将指定的属性改为 required */
export type RequiredByKeys<T, K extends keyof T = keyof T> = Omit<T & Required<Pick<T, K & keyof T>>, never>

/** 将指定的属性改为 required, 其余属性改为可为空 */
export type OnlyRequiredByKeys<T, K extends keyof T = keyof T> = RequiredByKeys<Partial<T>, K>

// /** 从标准的 ant-design-vue 组件 props 中提取事件属性 */
// type ExtractEmits<Props> = {
//   [K in keyof Props as K extends `on${infer Event}` ? Uncapitalize<Event> : never]: Props[K] extends (...args: any[]) => any
//     ? Parameters<Props[K]>
//     : never;
// }

// /** 提取事件类型并过滤掉不符合条件的属性 */
// type UploadEmits<Props> = ExtractEmits<Required<ExtractPropTypes<Props>>>

// /** 过滤掉类型为 never 的属性 */
// // type FilterNever<T> = {
// //   [K in keyof T as T[K] extends never ? never : K]: T[K];
// // }
// type FilterNever<T> = Omit<T, never>

// /** 从标准的 ant-design-vue 组件 props 中提取用于声明 defineEmits 泛型参数的事件属性 */
// export type GetEventsByComponentProps<Props> = FilterNever<UploadEmits<Props>>
