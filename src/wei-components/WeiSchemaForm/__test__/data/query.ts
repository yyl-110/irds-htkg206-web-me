// import { OpenApiActions } from '@wei/openapi-codegen/es/src/OpenApiTags'
import { reactive } from 'vue';
import type { WeiSchemaFormPropsType } from '../../types';
import type { WeiSchemaFormTestModel } from './model';

export const schema = reactive();
export const props: WeiSchemaFormPropsType<WeiSchemaFormTestModel> = schema as WeiSchemaFormPropsType<WeiSchemaFormTestModel>;
props.schemaActionType = '';
