import { message } from 'ant-design-vue';

const wsServer = 'ws://localhost:8080';

/** 与 legacy webSocket.ts 一致：非 pdm 时拼到 ModelPath 前；可用 VITE_WS_MODEL_ROOT 覆盖 */
const DEFAULT_MODEL_WORK_ROOT = 'D:\\ptc\\mrds_work\\';
const MODEL_WORK_ROOT = import.meta.env?.VITE_WS_MODEL_ROOT || DEFAULT_MODEL_WORK_ROOT;
/** pdm：ModelPath 仅为 modelNum.modelType；否则为根路径 + 文件名 */
const WS_DOWN_TYPE = import.meta.env?.VITE_WS_DOWN_TYPE || 'pdm';
let ws: WebSocket | null = null;
let connecting = false; // 防止重复创建连接

// 消息回调映射：保证多请求不串消息
const messageCallbackMap = new Map<string, (data: any) => void>();

// 连接 WebSocket（单例）
function connectWebSocket(): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      return resolve(ws);
    }
    if (connecting) return;

    connecting = true;
    ws = new WebSocket(wsServer);

    // 连接成功
    ws.onopen = () => {
      connecting = false;
      resolve(ws!);
    };

    // 统一接收消息：优先按 RequestId 匹配；桥接层若不回传 RequestId，则与旧 ReceiveMessage 一致按「唯一在途请求」消费
    ws.onmessage = (e) => {
      try {
        const raw = e.data;
        const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
        const rid = data?.RequestId ?? data?.requestId ?? data?.RequestID;
        const key = rid != null && rid !== '' ? String(rid) : '';
        let cb = key ? messageCallbackMap.get(key) : undefined;

        if (cb) {
          cb(data);
          messageCallbackMap.delete(key);
          return;
        }

        if (messageCallbackMap.size === 1) {
          const looksLikeApiResult =
            data &&
            typeof data === 'object' &&
            ('ReturnStatus' in data ||
              'returnStatus' in data ||
              'status' in data ||
              'Status' in data ||
              'message' in data ||
              'Message' in data ||
              'msg' in data);
          if (looksLikeApiResult) {
            const [onlyId, onlyCb] = messageCallbackMap.entries().next().value!;
            onlyCb(data);
            messageCallbackMap.delete(onlyId);
          }
        }
      } catch (err) {
        console.error('消息解析失败', err);
      }
    };

    // 关闭
    ws.onclose = () => {
      connecting = false;
      ws = null;
    };

    // 错误
    ws.onerror = (evt) => {
      connecting = false;
      ws = null;
      reject(new Error('WebSocket 连接失败，请检查服务'));
      alert('WebSocket 连接异常，请联系管理员');
    };
  });
}

export type SendMessageOptions = {
  /** 等待桥接返回的超时毫秒，默认 10000；打开模型等操作建议更长 */
  timeoutMs?: number;
};

// 发送消息（带回调）
async function sendMessage(api: string, args: any, options?: SendMessageOptions): Promise<any> {
  const socket = await connectWebSocket();
  if (socket.readyState !== WebSocket.OPEN) {
    throw new Error('WebSocket 未连接');
  }

  const timeoutMs = options?.timeoutMs ?? 10000;

  return new Promise((resolve, reject) => {
    const reqId = `req_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const timer = setTimeout(() => {
      messageCallbackMap.delete(reqId);
      reject(new Error('请求超时'));
    }, timeoutMs);

    messageCallbackMap.set(reqId, (resData) => {
      clearTimeout(timer);
      resolve(resData);
    });

    // 安全发送 JSON（不再手动拼接字符串）
    const msg = JSON.stringify({
      RequestId: reqId,
      ApiName: api,
      Arguments: args
    });

    socket.send(msg);
  });
}

function buildOpenModelPath(modelNum: string, modelType: string): string {
  const file = `${modelNum}.${modelType}`;
  return WS_DOWN_TYPE === 'pdm' ? file : `${MODEL_WORK_ROOT}${file}`;
}

/**
 * 历史接口把 Parameters 以「数组字面量内部片段」传入，这里包装为合法 JSON 再解析。
 * 若无法解析则返回空数组，避免 JSON.stringify 后服务端收到非法结构。
 */
/** 桥接 Parameters 数组片段：兼容末尾多余逗号 */
function normalizeParametersArrayFragment(parametersStr: string): string {
  let s = parametersStr?.trim() ?? '';
  if (s.endsWith(',')) s = s.slice(0, -1);
  return s;
}

function parseOpenModelParametersFragment(parametersStr: string): unknown[] {
  const raw = normalizeParametersArrayFragment(parametersStr);
  if (!raw) return [];
  try {
    return JSON.parse(`[${raw}]`) as unknown[];
  } catch {
    console.warn('[webSocketNew] Parameters 数组片段解析失败，已使用 []', parametersStr);
    return [];
  }
}

function toWsResultObject(payload: unknown): Record<string, unknown> | null {
  if (payload == null) return null;
  if (typeof payload === 'string') {
    try {
      return JSON.parse(payload) as Record<string, unknown>;
    } catch {
      return null;
    }
  }
  if (typeof payload === 'object') {
    return payload as Record<string, unknown>;
  }
  return null;
}

/** 桥接层业务状态：ReturnStatus / status 等为 0 表示成功（与 message 字段并存） */
function getWsReturnStatus(obj: Record<string, unknown>): unknown {
  return obj.ReturnStatus ?? obj.returnStatus ?? obj.status ?? obj.Status;
}

/** 与 legacy webSocket 一致：状态为 0 表示业务成功 */
function isWsApiSuccess(payload: unknown): boolean {
  const obj = toWsResultObject(payload);
  if (!obj) return false;
  const rs = getWsReturnStatus(obj);
  return rs === 0 || rs === '0';
}

/**
 * 失败时优先展示桥接返回的 message（及 Message/msg 等别名），无则退回默认文案。
 */
function getWsApiUserMessage(payload: unknown, fallback: string): string {
  const obj = toWsResultObject(payload);
  if (!obj) return fallback;
  const candidates = [obj.message, obj.Message, obj.msg, obj.Msg, obj.errorMessage, obj.ErrorMessage];
  for (const c of candidates) {
    if (c != null && String(c).trim() !== '') return String(c).trim();
  }
  return fallback;
}

/**
 * 将「首坐标系骨架参数」接口返回的 `Parameters` 按 `Name` 对齐到表格行的 `paraDictionaryName`，写入 `paraValue`（数值化）。
 * 仅当桥接业务成功（ReturnStatus 等为 0）且存在非空 `Parameters` 数组时返回新行数组；否则返回 `null`（与旧版 `changeParametersByModule` 失败分支一致，由调用方提示）。
 */
export function mergeLocSkeletonParametersIntoParmDesign(
  bridgePayload: unknown,
  parmDesignRows: any[],
): any[] | null {
  if (!isWsApiSuccess(bridgePayload)) return null;
  const obj = toWsResultObject(bridgePayload);
  if (!obj) return null;
  const rawParams = obj.Parameters;
  if (!Array.isArray(rawParams)) return null;

  const next = (parmDesignRows ?? []).map((row: any) => ({ ...row }));
  if (rawParams.length === 0) return next;
  const indexByName = new Map<string, number>();
  next.forEach((row, idx) => {
    const key = row?.paraDictionaryName;
    if (key != null && String(key) !== '') indexByName.set(String(key), idx);
  });

  for (const p of rawParams as Record<string, unknown>[]) {
    const name = p?.Name != null ? String(p.Name) : '';
    if (!name) continue;
    const idx = indexByName.get(name);
    if (idx === undefined) continue;
    const v = p.Value;
    if (v == null || v === '') continue;
    const num = Number(v);
    if (Number.isNaN(num)) continue;
    next[idx] = { ...next[idx], paraValue: num };
  }
  return next;
}

// 对外下载接口
export async function download(
  url: string,
  dir: string,
  name: string,
  open: boolean
) {
  try {
    const ret = await sendMessage('ApiDownload', {
      url,
      dir,
      name,
      open
    });
    console.log('下载结果：', ret);
    return ret;
  } catch (err) {
    console.error('下载失败：', err);
    throw err;
  }
}

/**
 * 打开模型（ApiOpenModel）。走统一 sendMessage：自动建连、RequestId 对齐、超时与错误处理，
 * 不再直接操作全局 ws / 手写 JSON 字符串（避免引号转义与消息串扰）。
 */
export async function openModuleInfoNew(
  modelNum: string,
  modelType: string,
  newModelName: string,
  commonName: string,
  parametersStr: string,
): Promise<any> {
  try {
    const modelPath = buildOpenModelPath(modelNum, modelType);
    /** 打开模型在客户端/桥接侧可能较慢；且部分桥接不回传 RequestId，依赖 onmessage 单在途回退 */
    const ret = await sendMessage(
      'ApiOpenModel',
      {
        ModelPath: modelPath,
        NewModelName: newModelName,
        PtcCommonName: commonName,
        Parameters: parseOpenModelParametersFragment(parametersStr),
      },
      { timeoutMs: 180000 },
    );
    console.log('[webSocketNew] ApiOpenModel 返回:', ret);
    if (isWsApiSuccess(ret)) {
      message.success('打开成功');
    } else {
      message.error(getWsApiUserMessage(ret, '打开失败'));
    }
    return ret;
  } catch (err) {
    console.error('[webSocketNew] ApiOpenModel 失败:', err);
    message.error(err instanceof Error && err.message ? err.message : '打开失败');
    // 调用方多为 fire-and-forget，不再向外抛避免 Uncaught (in promise)
    return undefined;
  }
}

/**
 * 装配模型（ApiAssembleModelWithProeInterface）。走 sendMessage，与 openModuleInfoNew 一致的路径与超时策略。
 */
export async function assembleModuleInfoNew(
  modelNum: string,
  modelType: string,
  parentAsmName: string,
  newModelName: string,
  commonName: string,
  parametersStr: string,
): Promise<any> {
  try {
    const modelPath = buildOpenModelPath(modelNum, modelType);
    const ret = await sendMessage(
      'ApiAssembleModelWithProeInterface',
      {
        ModelPath: modelPath,
        ParentAsmName: parentAsmName,
        NewModelName: newModelName,
        PtcCommonName: commonName,
        Parameters: parseOpenModelParametersFragment(parametersStr),
      },
      { timeoutMs: 180000 },
    );
    console.log('[webSocketNew] ApiAssembleModelWithProeInterface 返回:', ret);
    if (isWsApiSuccess(ret)) {
      message.success('装配成功');
    } else {
      message.error(getWsApiUserMessage(ret, '装配失败'));
    }
    return ret;
  } catch (err) {
    console.error('[webSocketNew] ApiAssembleModelWithProeInterface 失败:', err);
    message.error(err instanceof Error && err.message ? err.message : '装配失败');
    return undefined;
  }
}

/**
 * 打开工程图（ApiOpenDrawing）。走 sendMessage，路径规则与三维模型一致，扩展名为 .drw。
 */
export async function openDrawingInfoNew(modelNum: string): Promise<any> {
  try {
    const modelPath = buildOpenModelPath(modelNum, 'drw');
    const ret = await sendMessage(
      'ApiOpenDrawing',
      { ModelPath: modelPath },
      { timeoutMs: 180000 },
    );
    console.log('[webSocketNew] ApiOpenDrawing 返回:', ret);
    if (isWsApiSuccess(ret)) {
      message.success('工程图打开成功');
    } else {
      message.error(getWsApiUserMessage(ret, '工程图打开失败'));
    }
    return ret;
  } catch (err) {
    console.error('[webSocketNew] ApiOpenDrawing 失败:', err);
    message.error(err instanceof Error && err.message ? err.message : '工程图打开失败');
    return undefined;
  }
}

/**
 * 首坐标系模型参数（ApiSetModelParameterInFirstCsys）。
 * 与 {@link openModuleInfoNew} 一致：单例连接、RequestId、Parameters 数组片段解析，避免手写 JSON 注入问题。
 */
export async function setModelParameterInFirstCsysNew(
  moduleNum: string,
  moduleType: string,
  parametersStr: string,
): Promise<any> {
  try {
    const ret = await sendMessage(
      'ApiSetModelParameterInFirstCsys',
      {
        ModelName: moduleNum,
        ModelType: moduleType,
        Parameters: parseOpenModelParametersFragment(parametersStr),
      },
      { timeoutMs: 120000 },
    );
    console.log('[webSocketNew] ApiSetModelParameterInFirstCsys 返回:', ret);
    if (!isWsApiSuccess(ret)) {
      message.error(getWsApiUserMessage(ret, '参数设置失败'));
    }
    return ret;
  } catch (err) {
    console.error('[webSocketNew] ApiSetModelParameterInFirstCsys 失败:', err);
    message.error(err instanceof Error && err.message ? err.message : '参数设置失败');
    return undefined;
  }
}

/**
 * 首坐标系定位骨架参数（ApiGetLocSkeletonParametersInFirstCsys）。
 * 与 {@link setModelParameterInFirstCsysNew} 一致走 {@link sendMessage}，Arguments 与旧版 JSON 一致：`SkeletonName`、`ModelType`。
 */
export async function getLocSkeletonParametersInFirstCsysNew(
  moduleNum: string,
  moduleType: string,
): Promise<any> {
  try {
    const ret = await sendMessage(
      'ApiGetLocSkeletonParametersInFirstCsys',
      {
        SkeletonName: moduleNum,
        ModelType: moduleType,
      },
      { timeoutMs: 120000 },
    );
    console.log('[webSocketNew] ApiGetLocSkeletonParametersInFirstCsys 返回:', ret);
    return ret;
  } catch (err) {
    console.error('[webSocketNew] ApiGetLocSkeletonParametersInFirstCsys 失败:', err);
    message.error(err instanceof Error && err.message ? err.message : '获取骨架参数失败');
    return undefined;
  }
}


// 同步子模型
export async function flowSynchronizeChildrenModelsToWeb(moduleNum?: string | null): Promise<any> {
  try {
    const modelName = moduleNum ?? '';
    const ret = await sendMessage(
      'ApiSynchronizeChildrenModelsToWeb',
      { ModelName: modelName },
      { timeoutMs: 120000 },
    );
    console.log('[webSocketNew] ApiSynchronizeChildrenModelsToWeb 返回:', ret);
    return ret;
  } catch (err) {
    console.error('[webSocketNew] ApiSynchronizeChildrenModelsToWeb 失败:', err);
    message.error(err instanceof Error && err.message ? err.message : '同步子模型失败');
    return undefined;
  }
}
