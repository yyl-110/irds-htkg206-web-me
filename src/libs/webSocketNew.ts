const wsServer = 'ws://localhost:8080';
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

    // 统一接收消息
    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        // 你可以根据返回的 RequestId 匹配回调
        const callback = messageCallbackMap.get(data.RequestId);
        if (callback) {
          callback(data);
          messageCallbackMap.delete(data.RequestId);
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

// 发送消息（带回调）
async function sendMessage(api: string, args: any): Promise<any> {
  const socket = await connectWebSocket();
  if (socket.readyState !== WebSocket.OPEN) {
    throw new Error('WebSocket 未连接');
  }

  return new Promise(async (resolve, reject) => {
    // 超时处理
    const timer = setTimeout(() => {
      messageCallbackMap.delete(reqId);
      reject(new Error('请求超时'));
    }, 10000);

    // 生成唯一 ID，防止消息串扰
    const reqId = 'req_' + Date.now() + Math.random().toString(36).slice(2);

    // 注册回调
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