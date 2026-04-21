var wsServer = 'ws://localhost:8080'; //服务器地址 "ws://IP:端口"
var ws = new WebSocket(wsServer); //创建WebSocket对象
function ReceiveMessage() {
  return new Promise(resolve => {
    ws.onmessage = function (e) {
      resolve(e.data);
    };
  });
}
//传递参数
function SendMessage(msg: string) {
  if (ws != null) {
    ws.send(msg);
  }
}

export async function download(url: string, dir: string, name: string, open: boolean) {
  ws.onclose = function (evt) {
    ws = new WebSocket(wsServer); //已经关闭连接需要重新启动
  };
  if (ws.readyState == 3) {
    ws = new WebSocket(wsServer); //已经关闭连接需要重新启动
    alert('是否重新连接WebSocket？');
  }
  ws.onerror = function (evt) {
    alert('请联系管理员检查WebSocket配置');
    return;
    //产生异常
  };
  var ret;
  SendMessage(
    '{"ApiName":"ApiDownload","Arguments":{"url":"'
      + url + '","dir":"' + dir + '","name":"' + name + '","open":' + open + '}}',
  );
  ret = await ReceiveMessage();
  console.log('ret-------' + ret);
  return ret;
}
