import type { BaseUISchema, BaseUISchemaGetter } from '@wei/openapi-codegen/es/src/BaseUISchema';
import { BaseUISchemaComponentType } from '@wei/openapi-codegen/es/src/BaseUISchemaComponent';
import { UserPageRequestDTOModel } from '../models/UserPageRequestDTOModel';

export const uiSchema: BaseUISchemaGetter<UserPageRequestDTOModel> = (model: UserPageRequestDTOModel = new UserPageRequestDTOModel()) => {
  const schema: BaseUISchema<UserPageRequestDTOModel> = {
    schemaName: 'UserPageRequestDTO',
    model,
    dataSource: [],
    rules: {
      pageNo: [{ required: true, message: '请填写页码' }],
      pageSize: [{ required: true, message: '请填写每页条数' }],
      username: [],
      nickname: [{ required: true, message: '请填写用户昵称' }],
      mobile: [],
      status: [],
      createTime: [],
      deptId: [],
      fullname: [],
    },
    columns: [
      {
        dataIndex: 'pageNo',
        title: '页码',
        label: '页码',
        name: 'pageNo',
        schemaOriginalDescription: '页码，从 1 开始',
        schemaOption: { schemaType: BaseUISchemaComponentType.InputNumber, min: 1 },
      },
      {
        dataIndex: 'pageSize',
        title: '每页条数',
        label: '每页条数',
        name: 'pageSize',
        schemaOriginalDescription: '每页条数，最大值为 100',
        schemaOption: { schemaType: BaseUISchemaComponentType.InputNumber, max: 100, min: 1 },
      },
      {
        dataIndex: 'username',
        title: '用户账号',
        label: '用户账号',
        name: 'username',
        schemaOriginalDescription: '用户账号，模糊匹配',
        schemaOption: { schemaType: BaseUISchemaComponentType.Input },
      },
      {
        dataIndex: 'nickname',
        title: '用户昵称',
        label: '用户昵称',
        name: 'nickname',
        schemaOriginalDescription: '用户昵称',
        schemaOption: { schemaType: BaseUISchemaComponentType.Input },
      },
      {
        dataIndex: 'mobile',
        title: '手机号码',
        label: '手机号码',
        name: 'mobile',
        schemaOriginalDescription: '手机号码， 模糊匹配',
        schemaOption: { schemaType: BaseUISchemaComponentType.Input },
      },
      {
        dataIndex: 'status',
        title: '展示状态',
        label: '展示状态',
        name: 'status',
        schemaOriginalDescription: '展示状态，参见 CommonStatusEnum 枚举类',
        schemaOption: { schemaType: BaseUISchemaComponentType.InputNumber },
      },
      {
        dataIndex: 'createTime',
        title: '创建时间',
        label: '创建时间',
        name: 'createTime',
        schemaOriginalDescription: '创建时间',
        schemaOption: { schemaType: BaseUISchemaComponentType.Input },
      },
      {
        dataIndex: 'deptId',
        title: '部门编号',
        label: '部门编号',
        name: 'deptId',
        schemaOriginalDescription: '部门编号，同时筛选子部门',
        schemaOption: { schemaType: BaseUISchemaComponentType.InputNumber },
      },
      {
        dataIndex: 'fullname',
        title: '用户账号或用户昵称模糊匹配',
        label: '用户账号或用户昵称模糊匹配',
        name: 'fullname',
        schemaOriginalDescription: '用户账号或用户昵称模糊匹配',
        schemaOption: { schemaType: BaseUISchemaComponentType.Input },
      },
    ],
    schemaData: {
      required: ['nickname', 'pageNo', 'pageSize'],
      type: 'object',
      properties: {
        pageNo: {
          minimum: 1,
          type: 'integer',
          description: '页码，从 1 开始',
          format: 'int32',
          example: 1,
        },
        pageSize: {
          maximum: 100,
          minimum: 1,
          type: 'integer',
          description: '每页条数，最大值为 100',
          format: 'int32',
          example: 10,
        },
        username: { type: 'string', description: '用户账号，模糊匹配', example: '' },
        nickname: { type: 'string', description: '用户昵称', example: '' },
        mobile: { type: 'string', description: '手机号码， 模糊匹配', example: '' },
        status: {
          type: 'integer',
          description: '展示状态，参见 CommonStatusEnum 枚举类',
          format: 'int32',
          example: 1,
        },
        createTime: {
          type: 'array',
          description: '创建时间',
          example: '[2022-07-01 00:00:00, 2022-07-01 23:59:59]',
          items: { type: 'string', description: '创建时间', format: 'date-time' },
        },
        deptId: {
          type: 'integer',
          description: '部门编号，同时筛选子部门',
          format: 'int64',
          example: 1024,
        },
        fullname: {
          type: 'string',
          description: '用户账号或用户昵称模糊匹配',
          example: '',
        },
      },
      description: '管理后台 - 用户分页 Request DTO',
    },
  };
  return schema;
};

export default uiSchema;
