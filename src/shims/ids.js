/**
 * ids 包仅提供命名导出 { Ids }，而 bpmn-js-token-simulation 使用默认导入、bpmn-js 使用命名导入。
 * 此 shim 同时提供 default 与命名导出，避免构建报错。
 */
import { Ids } from '../../node_modules/ids/dist/index.js';
export { Ids };
export default Ids;
