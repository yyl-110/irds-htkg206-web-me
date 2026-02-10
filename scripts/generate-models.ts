import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import $ from 'gogocode';
import type { ClassDeclaration, ClassProperty, Identifier } from '@babel/types'; // 从 @babel/types 中获取 AST 类型
import { set } from 'lodash-es';

// type ModelGeneraterModelClassTemplateAstType = Partial<{
//   [typeName in TSTypeAnnotation['typeAnnotation']['type']]: ClassProperty
// }>

/**
 *
 */
class ModelGenerater {
  static OUTPUT_MODEL_DIR_PATH = resolve(fileURLToPath(import.meta.url), '../../src/api/models/');
  /** OpenApi 生成的所有数据模型的 interface 定义文件 */
  static CONTRACTS_PATH = resolve(fileURLToPath(import.meta.url), '../../src/api/tags/data-contracts.ts');
  /** 模型类名称后缀 */
  static MODEL_CLASS_SUFFIX = 'Model';
  /** 代码替换模板 */
  static MODEL_CLASS_TEMPLATE = `export class FooModel extends BaseModel {
    number: number = 0
    string: string = ''
    boolean: boolean = false
    object: object = {}
    array: number[] = []

    @Type(() => BarModel)
    relationModel: BarModel = new BarModel
  }`;
  // static MODEL_CLASS_TEMPLATE_AST_MAP?: ModelGeneraterModelClassTemplateAstType
  // /**
  //  * 解析 `ModelGenerater.MODEL_CLASS_TEMPLATE` 并生成属性 map
  //  * @returns 包含 `ModelGenerater.MODEL_CLASS_TEMPLATE` 属性的 map
  //  */
  // static getModelClassTemplateAstMap() {
  //   if (ModelGenerater.MODEL_CLASS_TEMPLATE_AST_MAP) return ModelGenerater.MODEL_CLASS_TEMPLATE_AST_MAP
  //   const astMap: ModelGeneraterModelClassTemplateAstType = {}
  //   $(ModelGenerater.MODEL_CLASS_TEMPLATE)
  //     .find(`class $_$ {}`)
  //     .each(c => {
  //       const node = c.node as ClassDeclaration
  //       // 从模板代码中取出包含默认值的类型定义节点
  //       for (const property of node.body.body) { // 遍历 Model 中的所有属性
  //         // 只处理属性节点
  //         if (property.type !== 'ClassProperty' || property.typeAnnotation?.type !== 'TSTypeAnnotation') continue
  //         const type = property.typeAnnotation.typeAnnotation.type
  //         astMap[type] = property
  //       }
  //     })
  //   ModelGenerater.MODEL_CLASS_TEMPLATE_AST_MAP = {}
  // }
  static testCode = `
/** ????? */
export interface CommonResultPageResultOperateLogResponseDTO {
  /** @format int32 */
  code?: number;
  /** 分页结果 */
  data?: PageResultOperateLogResponseDTO;
  msg?: string;
}

/** 管理后台 - 字典类型创建 Request DTO */
export interface DictTypeCreateRequestDTO {
  /**
   * 字典名称
   * @minLength 0
   * @maxLength 100
   * @example "性别"
   */
  name: string;
  /**
   * 状态，参见 CommonStatusEnum 枚举类
   * @format int32
   * @example 1
   */
  status: number;
  /**
   * 备注
   * @example "快乐的备注"
   */
  remark?: string;
  /**
   * 字典类型
   * @minLength 0
   * @maxLength 100
   * @example "sys_common_sex"
   */
  type: string;
  /**
   * 测试类型
   */
  testType: Array<DictTypeCreateRequestDTO>;
  test: object;
}
  `;

  classMap: { [name: string]: string } = {};
  modelClassMap: { [name: string]: string } = {};

  /** init */
  init() {
    const code = this.getCode(); // 获取源码
    this.classMap = this.getClassMap(code); // 先将所有的 interface 简单替换为 class
    // this.classMap = this.getClassMap(ModelGenerater.testCode) // 先将所有的 interface 简单替换为 class
    for (const name in this.classMap) {
      // 将每个 class 修改为可以使用的 Model Class
      const modelClassCode = this.generateModelClassCode(this.classMap[name]);
      this.modelClassMap[name] = modelClassCode;
    }
    // TODO 与本地已有的 model class 进行合并
    this.generateModelFiles(); // 生成 model class 文件
    // console.log(this.modelClassMap)
    // this.classMap = this.getClassMap(code)
  }

  /**
   * 生成 model calss 文件
   */
  generateModelFiles() {
    for (const modelName in this.modelClassMap) {
      writeFileSync(resolve(ModelGenerater.OUTPUT_MODEL_DIR_PATH, `${modelName + ModelGenerater.MODEL_CLASS_SUFFIX}.ts`), this.modelClassMap[modelName]);
    }
  }

  /**
   * generateModelClassCode
   * @param code
   */
  generateModelClassCode(code: string) {
    return $(code)
      .find('class $_$ {}') // 匹配所有简单替换后的 class
      .each(c => {
        const node = c.node as ClassDeclaration;
        if (!node.id) throw new Error('class name is required');
        const DTOName = node.id.name || '';
        // 为所有模型类名称增加后缀
        node.id.name = node.id.name + ModelGenerater.MODEL_CLASS_SUFFIX;
        // 通过修改 name 的方式增加 extends BaseModel
        node.id.name += ` extends BaseModel implements ${DTOName}`;
        let referenceTypes: string[] = [];
        // const templateAstMap = ModelGenerater.getModelClassTemplateAstMap()
        for (const property of node.body.body) {
          // 遍历 Model 中的所有属性
          // 只处理属性节点
          if (property.type !== 'ClassProperty' || property.typeAnnotation?.type !== 'TSTypeAnnotation') continue;
          /** 需要添加 Type Decorator 时的类型名称 */
          const parameter = this.getArrayAnnotationParameter(property);
          let referenceType = parameter.type;
          const arrayChildType = parameter.arrayChildType;
          // 处理不同类型的属性
          if (arrayChildType) {
            // 对于数组类型, 需要判断其子元素类型, 如果是引用类型, 则标记为需要为其添加 Type Decorator
            set(property, 'value', '[]');
            if (referenceType && typeof arrayChildType !== 'boolean') arrayChildType.name = arrayChildType.name + ModelGenerater.MODEL_CLASS_SUFFIX;
          } else if (property.typeAnnotation.typeAnnotation.type === 'TSStringKeyword') {
            set(property, 'value', `''`);
          } else if (property.typeAnnotation.typeAnnotation.type === 'TSNumberKeyword') {
            set(property, 'value', `0`);
          } else if (property.typeAnnotation.typeAnnotation.type === 'TSBooleanKeyword') {
            set(property, 'value', `false`);
            // } else if (property.typeAnnotation.typeAnnotation.type === 'TSObjectKeyword') {
            //   set(property, 'value', `{}`)
          } else if (property.typeAnnotation.typeAnnotation.type === 'TSTypeReference') {
            if (property.typeAnnotation.typeAnnotation.typeName.type === 'Identifier' && Reflect.has(this.classMap, property.typeAnnotation.typeAnnotation.typeName.name)) {
              property.typeAnnotation.typeAnnotation.typeName.name = property.typeAnnotation.typeAnnotation.typeName.name + ModelGenerater.MODEL_CLASS_SUFFIX;
              set(property, 'value', `new ${property.typeAnnotation.typeAnnotation.typeName.name}()`);
              referenceType = property.typeAnnotation.typeAnnotation.typeName.name;
            } else if (property.typeAnnotation.typeAnnotation.typeName.type === 'Identifier' && property.typeAnnotation.typeAnnotation.typeName.name === 'Record') {
              set(property, 'value', `{}`);
            } else {
              this.setUnknowTypeValue(property);
              // if (property.key.type === 'Identifier') property.key.name = property.key.name + '!'
            }
          } else {
            this.setUnknowTypeValue(property);
            // if (property.key.type === 'Identifier') property.key.name = property.key.name + '!'
          }
          // https://github.com/thx/gogocode/issues/32
          if (referenceType) {
            if (property.key.type === 'Identifier') {
              c.find(property).before(`@Type(() => ${referenceType})`);
              referenceTypes.push(referenceType);
            } else {
              // console.log('Warning .')
            }
          }
        }
        // 若存在对于其他模型类的引用, 则在文件顶部增加 import 语句
        if (referenceTypes.length) {
          referenceTypes = Array.from(new Set(referenceTypes));
          c.root().before(`\n${referenceTypes.map(t => `import { ${t} } from './${t}'`).join('\n')}\n\n`);
        }
        // 增加 DTO interface 的 import 语句
        c.root().before(`import { ${DTOName} } from '../tags/data-contracts'\n\n`);
        // 增加基类的 import 语句
        c.root().before(`import { BaseModel } from '../BaseModel'\n`);
      })
      .root()
      .generate();
  }

  /**
   * 为未知的类型添加 definite(若此属性为可选值时不作处理)
   * ```typescript
   * export class FooModel {
   *   foo: UnknowType;
   *   bar?: UnknowType;
   * }
   * ```
   *
   * output:
   * ```typescript
   * export class FooModel {
   *   foo!: UnknowType;
   *   bar?: UnknowType;
   * }
   * ```
   * @param property 属性节点
   */
  setUnknowTypeValue(property: ClassProperty) {
    if (property.key.type !== 'Identifier') return;
    if (property.optional) return; // 可选值
    // property.definite = true // 为其增加 `!`, 断言为有值
    // 修改 definite 后代码依然没有 !, 所以直接修改属性名称
    property.key.name = `${property.key.name}!`;
  }

  /**
   * 如果当前属性节点是数组类型, 则返回子类型, 否则返回空
   *
   * > 只考虑只有一层的数组结构
   *
   * 在 `TypeScript` 中数组类型声明有两种方式:
   *
   * ```typescript
   * const arr1: Array<number>
   * const arr2: number[]
   * ```
   *
   * 这两种方式的 `AST` 结构和节点类型是不同的, 需要判断当前属性是否是数组,
   *
   * 并返回其子类型用于判断是否需要添加 `Type Decorator`, 详见 https://github.com/typestack/class-transformer#working-with-nested-objects
   *
   * @param property 属性声明节点
   * @returns 当前数组属性声明节点的子类型
   */
  getArrayAnnotationParameter(property: ClassProperty) {
    /** 当前属性否是数组类型时的子引用类型 */
    let arrayChildType: boolean | Identifier = false;
    /** 当前数组类型中包含的引用类型的子类型 */
    let type = '';
    // 判断是否是泛型 Array<number>
    if (
      property.typeAnnotation?.type === 'TSTypeAnnotation' &&
      property.typeAnnotation.typeAnnotation.type === 'TSTypeReference' &&
      property.typeAnnotation.typeAnnotation.typeName.type === 'Identifier' &&
      property.typeAnnotation.typeAnnotation.typeName.name === 'Array' &&
      property.typeAnnotation.typeAnnotation.typeParameters?.type === 'TSTypeParameterInstantiation'
    ) {
      arrayChildType = true;
      // 判断子元素是否是引用类型值
      if (
        property.typeAnnotation.typeAnnotation.typeParameters.params[0] &&
        property.typeAnnotation.typeAnnotation.typeParameters.params[0].type === 'TSTypeReference' &&
        property.typeAnnotation.typeAnnotation.typeParameters.params[0].typeName.type === 'Identifier'
      ) {
        type = property.typeAnnotation.typeAnnotation.typeParameters.params[0].typeName.name;
        arrayChildType = property.typeAnnotation.typeAnnotation.typeParameters.params[0].typeName;
      }
    } else if (property.typeAnnotation?.type === 'TSTypeAnnotation' && property.typeAnnotation.typeAnnotation.type === 'TSArrayType') {
      arrayChildType = true;
      if (property.typeAnnotation.typeAnnotation.elementType.type === 'TSTypeReference' && property.typeAnnotation.typeAnnotation.elementType.typeName.type === 'Identifier') {
        type = property.typeAnnotation.typeAnnotation.elementType.typeName.name;
        arrayChildType = property.typeAnnotation.typeAnnotation.elementType.typeName;
      }
    }
    if (!Reflect.has(this.classMap, type)) type = '';
    type = type ? type + ModelGenerater.MODEL_CLASS_SUFFIX : '';
    return { type, arrayChildType };
  }

  /**
   * 将 interface 转换为 class 并返回 Map
   * @param code 包含 interface 的源码
   * @returns 所有的 class 代码
   */
  getClassMap(code: string) {
    const classMap: ModelGenerater['classMap'] = {};
    $(code)
      .find('export interface $_$1 {}') // 获取代码中所有的 interface AST
      .each(i => {
        // 将 interface type 修改为 class type 并输出代码, 这里只做简单替换
        i.find('interface $_$1 {}').each(_i => {
          _i.node.type = 'ClassDeclaration';
          classMap[_i.attr('id.name').toString()] = i.generate();
        });
      });
    return classMap;
  }

  /** 获取文件源码 string */
  getCode() {
    return readFileSync(ModelGenerater.CONTRACTS_PATH).toString();
  }
}

const generater = new ModelGenerater();
generater.init();
