var rootFilePath = 'D:\\\\\\\\ptc\\\\\\\\mrds_work\\\\\\\\';
var downType = 'pdm'; //测试系统 localhost   长客 pdm
var wsServer = 'ws://localhost:8080'; //服务器地址 "ws://IP:端口"
var ws = new WebSocket(wsServer); //创建WebSocket对象
import { AdminApiwebSocketAuth } from '@/api/tags/管理webSocket';
//206项目 true 需要先去服务器下载,其它项目false
var casicProject = false;
import { message } from 'ant-design-vue';
function ReceiveMessage() {
  return new Promise(resolve => {
    ws.onmessage = function (e) {
      resolve(e.data);
    };
  });
}
//传递参数
function SendMessage(msg) {
  if (ws != null) {
    ws.send(msg);
  }
}

async function openModuleInfo(modelNum, modelType, newModelName, commonName, parametersStr) {
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
  var filePath = rootFilePath + modelNum + '.' + modelType;
  if (downType == 'pdm') {
    filePath = modelNum + '.' + modelType;
  }
  var ret;
  SendMessage(
    '{"ApiName":"ApiOpenModel","Arguments":{"ModelPath":"' +
      filePath +
      '","NewModelName":"' +
      newModelName +
      '","PtcCommonName":"' +
      commonName +
      '","Parameters":[' +
      parametersStr +
      ']}}'
  );
  ret = await ReceiveMessage();
  console.log('ret-------' + ret);
  return ret;
}

async function assembleModuleInfo(modelNum, modelType, parentAsmName, newModelName, commonName, parametersStr) {
  ws.onclose = function (evt) {
    ws = new WebSocket(wsServer); //已经关闭连接需要重新启动
  };
  if (ws.readyState == 3) {
    ws = new WebSocket(wsServer); //已经关闭连接需要重新启动
    alert('是否重新连接WebSocket？');
  }
  ws.onerror = function (evt) {
    alert('请联系管理员检查WebSocket配置'); //产生异常
    return;
  };
  //var ret;
  var filePath = rootFilePath + modelNum + '.' + modelType;
  if (downType == 'pdm') {
    filePath = modelNum + '.' + modelType;
  }
  var ret;
  console.log('filePath=' + filePath);
  if (parametersStr.substring(parametersStr.length - 1) === ',') {
    parametersStr = parametersStr.substring(0, parametersStr.length - 1);
  }
  var sendStr =
    '{"ApiName":"ApiAssembleModelWithProeInterface","Arguments":{"ModelPath":"' +
    filePath +
    '","ParentAsmName":"' +
    parentAsmName +
    '","NewModelName":"' +
    newModelName +
    '","PtcCommonName":"' +
    commonName +
    '","Parameters":[' +
    parametersStr +
    ']}}';
  console.log('sendStr=');
  console.log(sendStr);
  SendMessage(sendStr);
  ret = await ReceiveMessage();
  return ret;
}

async function assembleModuleInfoByCsys(modelNum, modelType, parentAsmName, newModelName, commonName, parametersStr, childZbx, ParentZbx) {
  ws.onclose = function (evt) {
    ws = new WebSocket(wsServer); //已经关闭连接需要重新启动
  };
  if (ws.readyState == 3) {
    ws = new WebSocket(wsServer); //已经关闭连接需要重新启动
    alert('是否重新连接WebSocket？');
  }
  ws.onerror = function (evt) {
    alert('请联系管理员检查WebSocket配置'); //产生异常
    return;
  };
  //var ret;
  var filePath = rootFilePath + modelNum + '.' + modelType;
  if (downType == 'pdm') {
    filePath = modelNum + '.' + modelType;
  }
  var ret;
  if (parametersStr.substring(parametersStr.length - 1) === ',') {
    parametersStr = parametersStr.substring(0, parametersStr.length - 1);
  }
  var sendStr =
    '{"ApiName":"ApiAssembleModelRenamedByParameter","Arguments":{"ModelPath":"' +
    filePath +
    '","ParentAssemblyName":"' +
    parentAsmName +
    '","NewModelName":"' +
    newModelName +
    '","ParentCsysName":"' +
    ParentZbx +
    '","ComponentCsysName":"' +
    childZbx +
    '","AllowAssembleManually":"true","Parameters":[' +
    parametersStr +
    ']}}';
  console.log('sendStr=');
  console.log(sendStr);
  SendMessage(sendStr);
  ret = await ReceiveMessage();
  return ret;
}

async function deleteModuleInfo(modelNum, modelType, parentAsmName) {
  ws.onclose = function (evt) {
    ws = new WebSocket(wsServer); //已经关闭连接需要重新启动
  };
  if (ws.readyState == 3) {
    ws = new WebSocket(wsServer); //已经关闭连接需要重新启动
    alert('是否重新连接WebSocket？');
  }
  ws.onerror = function (evt) {
    alert('请联系管理员检查WebSocket配置'); //产生异常
    return;
  };
  SendMessage('{"ApiName":"ApiDeleteModelInParent","Arguments":{"ParentAssemblyName":"' + parentAsmName + '","ModelName":"' + modelNum + '","ModelType":"' + modelType + '"}}');
}

async function openDrawingInfo(modelNum) {
  ws.onclose = function (evt) {
    ws = new WebSocket(wsServer); //已经关闭连接需要重新启动
  };
  if (ws.readyState == 3) {
    ws = new WebSocket(wsServer); //已经关闭连接需要重新启动
    alert('是否重新连接WebSocket？');
  }
  ws.onerror = function (evt) {
    alert('请联系管理员检查WebSocket配置'); //产生异常
    return;
  };

  var ret;
  var filePath = rootFilePath + modelNum + '.drw';
  if (downType == 'pdm') {
    filePath = modelNum + '.drw';
  }
  SendMessage('{"ApiName":"ApiOpenDrawing","Arguments":{"ModelPath":"' + filePath + '"}}');
  ret = await ReceiveMessage();
  console.log('ret-------' + ret);
  return ret;
}

async function GetRequiredUdfReferences(modelNum, modelType) {
  ws.onclose = function (evt) {
    ws = new WebSocket(wsServer); //已经关闭连接需要重新启动
  };
  if (ws.readyState == 3) {
    ws = new WebSocket(wsServer); //已经关闭连接需要重新启动
    alert('是否重新连接WebSocket？');
  }
  ws.onerror = function (evt) {
    alert('请联系管理员检查WebSocket配置'); //产生异常
    return;
  };

  //var filePath = rootFilePath + modelNum+"."+modelType;
  var filePath = modelNum + '.' + modelType;
  var ret;
  console.log('filePath-------' + filePath);
  SendMessage('{"ApiName":"ApiGetRequiredUdfReferences","Arguments":{"UdfName":"' + filePath + '"}}');
  ret = await ReceiveMessage();
  console.log('ret-------' + ret);
  return ret;
}

async function SelectReferenceForUdf(referencesType) {
  ws.onclose = function (evt) {
    ws = new WebSocket(wsServer); //已经关闭连接需要重新启动
  };
  if (ws.readyState == 3) {
    ws = new WebSocket(wsServer); //已经关闭连接需要重新启动
    alert('是否重新连接WebSocket？');
  }
  ws.onerror = function (evt) {
    alert('请联系管理员检查WebSocket配置'); //产生异常
    return;
  };
  var ret;
  SendMessage('{"ApiName":"ApiSelectReferenceForUdf","Arguments":{"UdfReferenceType":' + referencesType + '}}');
  ret = await ReceiveMessage();
  console.log('ret2-------' + ret);
  return ret;
}

async function CreateGeneralUdf(moduleNum, moduleType, referencesStr, propertyStr) {
  ws.onclose = function (evt) {
    ws = new WebSocket(wsServer); //已经关闭连接需要重新启动
  };
  if (ws.readyState == 3) {
    ws = new WebSocket(wsServer); //已经关闭连接需要重新启动
    alert('是否重新连接WebSocket？');
  }
  ws.onerror = function (evt) {
    alert('请联系管理员检查WebSocket配置'); //产生异常
    return;
  };
  var filePath = moduleNum + '.' + moduleType;
  var ret;
  console.log('filePath3-------' + filePath);
  SendMessage('{"ApiName":"ApiCreateGeneralUdf","Arguments":{"UdfName":"' + filePath + '","UdfReferences":[' + referencesStr + '],"UdfParameters":[' + propertyStr + ']}}');
  ret = await ReceiveMessage();
  console.log('ret3-------' + ret);
  return ret;
}

async function SetModelParameterInFirstCsys(moduleNum, moduleType, parametersStr) {
  ws.onclose = function (evt) {
    ws = new WebSocket(wsServer); //已经关闭连接需要重新启动
  };
  if (ws.readyState == 3) {
    ws = new WebSocket(wsServer); //已经关闭连接需要重新启动
    alert('是否重新连接WebSocket？');
  }
  ws.onerror = function (evt) {
    alert('请联系管理员检查WebSocket配置'); //产生异常
    return;
  };
  var ret;
  var jsonNum =
    '{"ApiName": "ApiSetModelParameterInFirstCsys","Arguments":{ "ModelName": "' + moduleNum + '","ModelType": "' + moduleType + '", "Parameters": [' + parametersStr + ']}}';
  console.log('jsonNum-------' + jsonNum);
  SendMessage(jsonNum);
  ret = await ReceiveMessage();
  return ret;
}

async function ApiExtSyncFilterModels(filename, templateName, filterKey, filterValuePropStr, returnValuePropStr) {
  ws.onclose = function (evt) {
    ws = new WebSocket(wsServer); //已经关闭连接需要重新启动
  };
  if (ws.readyState == 3) {
    ws = new WebSocket(wsServer); //已经关闭连接需要重新启动
    alert('是否重新连接WebSocket？');
  }
  ws.onerror = function (evt) {
    alert('请联系管理员检查WebSocket配置'); //产生异常
    return;
  };
  var ret;
  var jsonNum =
    '{"ApiName": "ApiExtSyncFilterModels","Arguments":{ "filename": "' +
    filename +
    '","template": "' +
    templateName +
    '","filterKey": "' +
    filterKey +
    '", "filterValue": [' +
    filterValuePropStr +
    '], "parameters": [' +
    returnValuePropStr +
    ']}}';
  console.log('jsonNum-------' + jsonNum);
  SendMessage(jsonNum);

  ret = await ReceiveMessage();
  return ret;
}

async function ApiExtSyncFilterUDFs(filename, templateName, filterKey, prefix, filterValuePropStr, returnValuePropStr) {
  ws.onclose = function (evt) {
    ws = new WebSocket(wsServer); //已经关闭连接需要重新启动
  };
  if (ws.readyState == 3) {
    ws = new WebSocket(wsServer); //已经关闭连接需要重新启动
    alert('是否重新连接WebSocket？');
  }
  ws.onerror = function (evt) {
    alert('请联系管理员检查WebSocket配置'); //产生异常
    return;
  };
  var ret;
  var jsonNum =
    '{"ApiName": "ApiExtSyncFilterUDFs","Arguments":{ "filename": "' +
    filename +
    '","template": "' +
    templateName +
    '","filterKey": "' +
    filterKey +
    '","prefix": "' +
    prefix +
    '", "filterValue": [' +
    filterValuePropStr +
    '], "parameters": [' +
    returnValuePropStr +
    ']}}';
  console.log('jsonNum-------' + jsonNum);
  SendMessage(jsonNum);

  ret = await ReceiveMessage();
  return ret;
}

async function ApiExtSyncFilterUDFs2(filename, templateName, filterKey, prefix) {
  ws.onclose = function (evt) {
    ws = new WebSocket(wsServer); //已经关闭连接需要重新启动
  };
  if (ws.readyState == 3) {
    ws = new WebSocket(wsServer); //已经关闭连接需要重新启动
    alert('是否重新连接WebSocket？');
  }
  ws.onerror = function (evt) {
    alert('请联系管理员检查WebSocket配置'); //产生异常
    return;
  };
  var ret;
  var jsonNum =
    '{"ApiName": "ApiExtSyncFilterUDFs2","Arguments":{ "filename": "' +
    filename +
    '","template": "' +
    templateName +
    '","filterKey": "' +
    filterKey +
    '","prefix": "' +
    prefix +
    '" }}';
  console.log('jsonNum-------' + jsonNum);
  SendMessage(jsonNum);

  ret = await ReceiveMessage();
  return ret;
}

async function ApiConnectionPlate() {
  ws.onclose = function (evt) {
    ws = new WebSocket(wsServer); //已经关闭连接需要重新启动
  };
  if (ws.readyState == 3) {
    ws = new WebSocket(wsServer); //已经关闭连接需要重新启动
    alert('是否重新连接WebSocket？');
  }
  ws.onerror = function (evt) {
    alert('请联系管理员检查WebSocket配置'); //产生异常
    return;
  };
  var ret;
  var jsonNum = '{"ApiName": "ApiExtConnectionPlate","Arguments":{}}';
  console.log('jsonNum-------' + jsonNum);
  SendMessage(jsonNum);

  ret = await ReceiveMessage();
  return ret;
}

async function ApiExtRemoveUDF(name) {
  ws.onclose = function (evt) {
    ws = new WebSocket(wsServer); //已经关闭连接需要重新启动
  };
  if (ws.readyState == 3) {
    ws = new WebSocket(wsServer); //已经关闭连接需要重新启动
    alert('是否重新连接WebSocket？');
  }
  ws.onerror = function (evt) {
    alert('请联系管理员检查WebSocket配置'); //产生异常
    return;
  };
  var ret;
  var jsonNum = '{"ApiName": "ApiExtRemoveUDF","Arguments":{ "name": "' + name + '"}}';
  console.log('jsonNum-------' + jsonNum);
  SendMessage(jsonNum);

  ret = await ReceiveMessage();
  return ret;
}

async function ApiExtSkelCsys(inSkel) {
  ws.onclose = function (evt) {
    ws = new WebSocket(wsServer); //已经关闭连接需要重新启动
  };
  if (ws.readyState == 3) {
    ws = new WebSocket(wsServer); //已经关闭连接需要重新启动
    alert('是否重新连接WebSocket？');
  }
  ws.onerror = function (evt) {
    alert('请联系管理员检查WebSocket配置'); //产生异常
    return;
  };
  var ret;
  var jsonNum = '{"ApiName": "ApiExtSkelCsys","Arguments":{ "filename": "","level": 0,"inSkel": ' + inSkel + '}}';
  console.log('jsonNum-------' + jsonNum);
  SendMessage(jsonNum);

  ret = await ReceiveMessage();
  return ret;
}

async function ApiExtAssembleUDF(udfRefCsysName, udfTemplate, udfX, udfY, udfZ, udfSide) {
  ws.onclose = function (evt) {
    ws = new WebSocket(wsServer); //已经关闭连接需要重新启动
  };
  if (ws.readyState == 3) {
    ws = new WebSocket(wsServer); //已经关闭连接需要重新启动
    alert('是否重新连接WebSocket？');
  }
  ws.onerror = function (evt) {
    alert('请联系管理员检查WebSocket配置'); //产生异常
    return;
  };
  var ret;
  var jsonNum =
    '{"ApiName": "ApiExtAssembleUDF","Arguments":{ "filename": "","udfRefCsysPath":"","udfRefCsysIds":"","udfRefCsysName":"' +
    udfRefCsysName +
    '","udfTemplate":"' +
    udfTemplate +
    '","udfX":"' +
    udfX +
    '","udfY":"' +
    udfY +
    '","udfZ":"' +
    udfZ +
    '","udfSide":"' +
    udfSide +
    '"}}';
  console.log('jsonNum-------' + jsonNum);
  SendMessage(jsonNum);

  ret = await ReceiveMessage();
  return ret;
}

async function ApiExtDriveUDF(udfRefCsysName, udfName, udfX, udfY, udfZ, udfSide) {
  ws.onclose = function (evt) {
    ws = new WebSocket(wsServer); //已经关闭连接需要重新启动
  };
  if (ws.readyState == 3) {
    ws = new WebSocket(wsServer); //已经关闭连接需要重新启动
    alert('是否重新连接WebSocket？');
  }
  ws.onerror = function (evt) {
    alert('请联系管理员检查WebSocket配置'); //产生异常
    return;
  };
  var ret;
  var jsonNum =
    '{"ApiName": "ApiExtDriveUDF","Arguments":{ "filename": "","udfRefCsysName":"' +
    udfRefCsysName +
    '","udfName":"' +
    udfName +
    '","udfX":"' +
    udfX +
    '","udfY":"' +
    udfY +
    '","udfZ":"' +
    udfZ +
    '","udfSide":"' +
    udfSide +
    '"}}';
  console.log('jsonNum-------' + jsonNum);
  SendMessage(jsonNum);

  ret = await ReceiveMessage();
  return ret;
}

async function ApiExtSyncModels(filename, templateName, returnValuePropStr) {
  ws.onclose = function (evt) {
    ws = new WebSocket(wsServer); //已经关闭连接需要重新启动
  };
  if (ws.readyState == 3) {
    ws = new WebSocket(wsServer); //已经关闭连接需要重新启动
    alert('是否重新连接WebSocket？');
  }
  ws.onerror = function (evt) {
    alert('请联系管理员检查WebSocket配置'); //产生异常
    return;
  };
  var ret;

  var jsonNum = '{"ApiName": "ApiExtSyncModels","Arguments":{ "filename": "' + filename + '","template": "' + templateName + '","parameters": [' + returnValuePropStr + ']}}';
  console.log('jsonNum-------' + jsonNum);
  SendMessage(jsonNum);

  ret = await ReceiveMessage();
  return ret;
}

async function FlowSynchronizeChildrenModelsToWeb(moduleNum) {
  ws.onclose = function (evt) {
    ws = new WebSocket(wsServer); //已经关闭连接需要重新启动
  };
  if (ws.readyState == 3) {
    ws = new WebSocket(wsServer); //已经关闭连接需要重新启动
    alert('是否重新连接WebSocket？');
  }
  ws.onerror = function (evt) {
    alert('请联系管理员检查WebSocket配置'); //产生异常
    return;
  };
  if (moduleNum === undefined || moduleNum === null) {
    moduleNum = '';
  }
  var ret;
  var jsonNum = '{"ApiName":"ApiSynchronizeChildrenModelsToWeb","Arguments":{"ModelName":"' + moduleNum + '"}}';
  console.log('jsonNum=' + jsonNum);
  SendMessage(jsonNum);
  ret = await ReceiveMessage();
  return ret;
}

async function GetLocSkeletonParametersInFirstCsys(moduleNum, moduleType) {
  ws.onclose = function (evt) {
    ws = new WebSocket(wsServer); //已经关闭连接需要重新启动
  };
  if (ws.readyState == 3) {
    ws = new WebSocket(wsServer); //已经关闭连接需要重新启动
    alert('是否重新连接WebSocket？');
  }
  ws.onerror = function (evt) {
    alert('请联系管理员检查WebSocket配置'); //产生异常
    return;
  };
  var ret;
  var jsonNum = '{"ApiName": "ApiGetLocSkeletonParametersInFirstCsys","Arguments":{ "SkeletonName": "' + moduleNum + '","ModelType": "' + moduleType + '"}}';
  SendMessage(jsonNum);
  ret = await ReceiveMessage();
  return ret;
}

async function apiDownloadFile(Url, DownloadDirectory, NewFileName) {
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
  SendMessage('{"ApiName":"ApiDownloadFile","Arguments":{"Url":"' + Url + '","DownloadDirectory":"' + DownloadDirectory + '","NewFileName":"' + NewFileName + '"}}');
  ret = await ReceiveMessage();
  console.log('ret-------' + ret);
  return ret;
}

async function apiUnPackFiles(zipFilePath, unPackDirectory) {
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
  SendMessage('{"ApiName":"ApiUnPackFiles","Arguments":{"ZipFilePath":"' + zipFilePath + '","UnPackDirectory":"' + unPackDirectory + '"}}');
  ret = await ReceiveMessage();
  console.log('ret-------' + ret);
  return ret;
}

//打开顶层装配重命名
export const openTopAsmTemplateInterfaceModel = async function (that, modelNum, modelType, NewTopAsmName, PtcCommonName, parametersStr) {
  var data = await ApiOpenTopAsmTemplateInterface(modelNum, modelType, NewTopAsmName, PtcCommonName, parametersStr);
  var jsons = eval('(' + data + ')');
  return jsons;
};

/*
新建顶层装配并根据模型第一个坐标系中的“RENAME”参数重命名模型
*/
async function ApiOpenTopAsmTemplateInterface(modelNum, modelType, NewTopAsmName, PtcCommonName, parametersStr) {
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
  var filePath = rootFilePath + modelNum + '.' + modelType;
  if (downType == 'pdm') {
    filePath = modelNum + '.' + modelType;
  }
  console.log(
    '{"ApiName":"ApiOpenTopAsmTemplateInterface","Arguments":{"TopAsmModelPath":"' +
      filePath +
      '","NewTopAsmName":"' +
      NewTopAsmName +
      '","PtcCommonName":"' +
      PtcCommonName +
      '","Parameters":[' +
      parametersStr +
      ']}}',
    '打印结果'
  );
  var ret;
  SendMessage(
    '{"ApiName":"ApiOpenTopAsmTemplateInterface","Arguments":{"TopAsmModelPath":"' +
      filePath +
      '","NewTopAsmName":"' +
      NewTopAsmName +
      '","PtcCommonName":"' +
      PtcCommonName +
      '","Parameters":[' +
      parametersStr +
      ']}}'
  );
  ret = await ReceiveMessage();
  console.log('ret-------+' + ret);
  return ret;
}

async function ApiRenameModel(modelNum, modelType, newModuleNum) {
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
    '{"ApiName":"ApiRenameModel","Arguments":{"OldModelName":"' + modelNum + '","ModelType":"' + modelType + '","NewModelName":"' + newModuleNum + '","PtcCommonName":""}}'
  );
  ret = await ReceiveMessage();
  return ret;
}

//孔检查
/*
minDist1：数值
minDist2：数值
holeEdges：数组【】
*/
async function ApiExtHoleCheck(minDist1, minDist2, holeEdges) {
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
    //
    '{"ApiName":"ApiExtHoleCheck","Arguments":{"minDist1":"' + minDist1 + '","minDist2":"' + minDist2 + '","holeEdges":"' + holeEdges + '"}}'
  );
  ret = await ReceiveMessage();
  return ret;
}

//孔高亮
/*
model 模块名称
path 路径
ids1 坐标1[1817, 1819]
ids2 坐标2[100]
*/
async function ApiExtHoleCheckShow(model, path, ids1, ids2) {
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
  var objValue = {};
  var objChild = {};
  objValue.ApiName = 'ApiExtHoleCheckShow';
  objChild.model = model;
  objChild.path = path;
  objChild.ids1 = ids1;
  objChild.ids2 = ids2;
  objValue.Arguments = objChild;
  console.log(objValue);
  SendMessage(JSON.stringify(objValue));
  ret = await ReceiveMessage();
  return ret;
}

async function ApiExtOpenModel(filename) {
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
    //
    '{"ApiName":"ApiExtOpenModel","Arguments":{"filename":"' + filename + '"}}'
  );
  ret = await ReceiveMessage();
  return ret;
}

//执行下载、解压、打开模型；compressedData 为下载的数据对象 包含物料编码 ,openModuleData为打开模型需要的数据对象
export async function compressedFileAndOpen(that, compressedData, openModuleData) {
  AdminApiwebSocketAuth.compressedFile(compressedData).then(async function (response) {
    if (response.data.zipPath != '') {
      //开始下载，下载完成后自动解压
      await DownloadModuleFile(that, response.data.zipPath, 'D:\\\\PTC\\\\mrds_work', '', compressedData.moduleNum);
      var data = await openModuleInfo(openModuleData.modelNum, openModuleData.modelType, openModuleData.newModelName, openModuleData.commonName, openModuleData.parametersStr);
      var jsons = eval('(' + data + ')');
      if (jsons.ReturnStatus == 0) {
        message.success('模型打开成功！');
      } else {
        message.error('模型打开失败！！');
      }
    } else {
      var data = await openModuleInfo(openModuleData.modelNum, openModuleData.modelType, openModuleData.newModelName, openModuleData.commonName, openModuleData.parametersStr);
      var jsons = eval('(' + data + ')');
      if (jsons.ReturnStatus == 0) {
        message.success('模型打开成功！');
      } else {
        message.error('模型打开失败！！');
      }
    }
  });
}

//执行下载、解压、装配模型；compressedData 为下载的数据对象 包含物料编码 ,openModuleData为需要装配的模型需要的数据对象
async function compressedFileAndAsm(that, compressedData, asmModuleData) {
  return new Promise(resolve => {
    AdminApiwebSocketAuth.compressedFile(compressedData).then(async function (response) {
      if (response.data.zipPath != '') {
        //开始下载，下载完成后自动解压
        await DownloadModuleFile(that, response.data.zipPath, 'D:\\\\PTC\\\\mrds_work', '', compressedData.moduleNum);
        var data = await assembleModuleInfo(
          asmModuleData.modelNum,
          asmModuleData.modelType,
          asmModuleData.parentAsmName,
          asmModuleData.newModelName,
          asmModuleData.commonName,
          asmModuleData.parametersStr
        );
        var jsons = eval('(' + data + ')');
        resolve(jsons);
      } else {
        var data = await assembleModuleInfo(
          asmModuleData.modelNum,
          asmModuleData.modelType,
          asmModuleData.parentAsmName,
          asmModuleData.newModelName,
          asmModuleData.commonName,
          asmModuleData.parametersStr
        );
        var jsons = eval('(' + data + ')');
        resolve(jsons);
      }
    });
  });
}

export const UnPackFiles = async function (zipFilePath, unPackDirectory, that) {
  var data = await apiUnPackFiles(zipFilePath, unPackDirectory);
  var jsons = eval('(' + data + ')');
  if (jsons.ReturnStatus == 0) {
    message.success('模型下载成功！');
  } else {
    message.error('模型下载失败！');
  }
};

export const DownloadModuleFile = async function (that, Url, DownloadDirectory, NewFileName, moduleNum) {
  var data = await apiDownloadFile(Url, DownloadDirectory, NewFileName);
  var jsons = eval('(' + data + ')');
  if (jsons.ReturnStatus == 0) {
    UnPackFiles(rootFilePath + moduleNum + '.zip', rootFilePath, that);
  } else {
    message.error('模型下载失败！');
  }
};

export const DownloadFile = async function (Url, DownloadDirectory, NewFileName) {
  var data = await apiDownloadFile(Url, DownloadDirectory, NewFileName);
  return data;
};

export const openModule = async function (that, modelNum, modelType, newModelName, commonName, parametersStr) {
  //206项目
  if (casicProject == true) {
    //下载需要的数据对象
    let compressedData = {};
    compressedData.moduleNum = modelNum;
    //打开 需要的数据对象
    let openModuleData = {};
    openModuleData.modelNum = modelNum;
    openModuleData.modelType = modelType;
    openModuleData.newModelName = newModelName;
    openModuleData.commonName = commonName;
    openModuleData.parametersStr = parametersStr;
    var jsons = await compressedFileAndOpen(that, compressedData, openModuleData);
  } else {
    var data = await openModuleInfo(modelNum, modelType, newModelName, commonName, parametersStr);
    var jsons = eval('(' + data + ')');
    if (jsons.ReturnStatus == 0) {
      message.success('模型打开成功！');
    } else {
      message.error('模型打开失败');
    }
  }
};

export const assembleModule = async function (that, modelNum, modelType, parentAsmName, newModelName, commonName, parametersStr) {
  //206项目
  //casicProject = false;
  if (casicProject == true) {
    //下载需要的数据对象
    let compressedData = {};
    compressedData.moduleNum = modelNum;

    //打开 需要的数据对象
    let asmModuleData = {};
    asmModuleData.modelNum = modelNum;
    asmModuleData.modelType = modelType;
    asmModuleData.parentAsmName = parentAsmName;
    asmModuleData.newModelName = newModelName;
    asmModuleData.commonName = commonName;
    asmModuleData.parametersStr = parametersStr;
    var jsons = await compressedFileAndAsm(that, compressedData, asmModuleData);
    return jsons;
  } else {
    var data = await assembleModuleInfo(modelNum, modelType, parentAsmName, newModelName, commonName, parametersStr);
    var jsons = eval('(' + data + ')');
    return jsons;
  }
};

export const deleteModule = function (modelNum, modelType, parentAsmName) {
  deleteModuleInfo(modelNum, modelType, parentAsmName);
};

export const openDrawing = async function (that, modelNum) {
  var data = await openDrawingInfo(modelNum);
  var jsons = eval('(' + data + ')');
  if (jsons.ReturnStatus == 0) {
    that.$Message.warning('二维图打开成功！');
  } else {
    that.$Message.warning('二维图打开失败！');
  }
};

export const getRequiredUdf = async function (that, modelNum, modelType) {
  var data = await GetRequiredUdfReferences(modelNum, modelType);
  var jsons = eval('(' + data + ')');
  that.updReferenceTags(jsons.ReturnResult);
};

export const selectReference = async function (that, idx, referencesType) {
  var data = await SelectReferenceForUdf(referencesType);
  var jsons = eval('(' + data + ')');
  that.changeUdfReference(idx, jsons.ReturnResult);
  return '1';
};

export const createUdf = function (moduleNum, moduleType, referencesStr, propertyStr) {
  CreateGeneralUdf(moduleNum, moduleType, referencesStr, propertyStr);
};

export const parameterInFirstCsys = async function (modelNum, modelType, parametersStr) {
  var data = await SetModelParameterInFirstCsys(modelNum, modelType, parametersStr);
  console.log('data-------' + data);
  var jsons = eval('(' + data + ')');
  return jsons;
};

export const extSyncFilterModels = async function (that, item, filename, templateName, filterKey, filterValuePropStr, returnValuePropStr) {
  var data = await ApiExtSyncFilterModels(filename, templateName, filterKey, filterValuePropStr, returnValuePropStr);
  console.log('data-------' + data);
  var jsons = eval('(' + data + ')');
  that.changeModuelToTable(item, jsons);
};

export const ExtSyncModels = async function (that, item, filename, templateName, returnValuePropStr) {
  var data = await ApiExtSyncModels(filename, templateName, returnValuePropStr);
  console.log('data-------' + data);
  var jsons = eval('(' + data + ')');
  that.changeModuelToTable(item, jsons);
};

export const apiExtSyncFilterUDFs = async function (that, item, filename, templateName, filterKey, prefix, filterValuePropStr, returnValuePropStr) {
  var data = await ApiExtSyncFilterUDFs(filename, templateName, filterKey, prefix, filterValuePropStr, returnValuePropStr);
  console.log('data-------' + data);
  var jsons = eval('(' + data + ')');
  that.changeModuelToTable(item, jsons);
};

export const apiExtSyncFilterUDFs2 = async function (that, item, filename, templateName, filterKey, prefix, level) {
  var data = await ApiExtSyncFilterUDFs2(filename, templateName, filterKey, prefix);
  console.log('data-------' + data);
  var jsons = eval('(' + data + ')');
  that.changeModuelToTable2(item, jsons, level);
};

export const GetLocParametersInFirstCsys = async function (that, modelNum, modelType) {
  var data = await GetLocSkeletonParametersInFirstCsys(modelNum, modelType);
  console.log('data-------' + data);
  var jsons = eval('(' + data + ')');
  that.changeParametersByModule(jsons);
};

export const FlowSynchronizeChildrenModels = async function (that, modelNum) {
  var data = await FlowSynchronizeChildrenModelsToWeb(modelNum);
  var jsons = eval('(' + data + ')');
  return jsons;
};

export const apiRenameModel = async function (that, modelNum, modelType, newModuleNum) {
  var data = await ApiRenameModel(modelNum, modelType, newModuleNum);
  var jsons = eval('(' + data + ')');
  return jsons;
};

export const apiExtRemoveUDF = async function (that, modelNum) {
  var data = await ApiExtRemoveUDF(modelNum);
  console.log('data-------' + data);
  var jsons = eval('(' + data + ')');
  return jsons;
};

export const apiAssembleUDF = async function (that, inSkel) {
  var data = await ApiExtSkelCsys(inSkel);
  console.log('data-------' + data);
  var jsons = eval('(' + data + ')');
  that.initZbxData(jsons);
};
export const apiExtAssembleUDF = async function (that, udfRefCsysName, udfTemplate, udfX, udfY, udfZ, udfSide) {
  var data = await ApiExtAssembleUDF(udfRefCsysName, udfTemplate, udfX, udfY, udfZ, udfSide);
  console.log('data-------' + data);
  var jsons = eval('(' + data + ')');
  return jsons;
};

export const apiExtDriveUDF = async function (that, udfRefCsysName, udfName, udfX, udfY, udfZ, udfSide) {
  var data = await ApiExtDriveUDF(udfRefCsysName, udfName, udfX, udfY, udfZ, udfSide);
  console.log('data-------' + data);
  var jsons = eval('(' + data + ')');
  return jsons;
};

//UDF 孔位检查
export const apiExtHoleCheck = async function (that, minDist1, minDist2, holeEdges) {
  var data = await ApiExtHoleCheck(minDist1, minDist2, holeEdges);
  var jsons = eval('(' + data + ')');
  console.log('ApiExtHoleCheck-------' + data);
  that.initUdfCheckData(jsons);
};

//UDF 孔位高亮
export const apiExtHoleCheckShow = async function (that, model, path, ids1, ids2) {
  var data = await ApiExtHoleCheckShow(model, path, ids1, ids2);
  var jsons = eval('(' + data + ')');
  console.log('ApiExtHoleCheck-------' + data);
  //that.initUdfCheckData(jsons);
};

export const apiExtOpenModel = async function (fileName) {
  var data = await ApiExtOpenModel(fileName);
  var jsons = eval('(' + data + ')');
  return jsons;
};

//获取模型清单
export const selectCreoModule = async function (that, item) {
  var data = await FlowSynchronizeChildrenModelsToWeb();
  var jsons = eval('(' + data + ')');
  console.log('selectCreoModule-------' + data);
  that.showSelectCreoModule(jsons, item);
};

export const apiConnectionPlate = async function (that, item) {
  var data = await ApiConnectionPlate();
  console.log('data-------' + data);
  var jsons = eval('(' + data + ')');
  that.changeModuelToTable3(item, jsons);
};

export const assembleModuleByCsys = async function (that, modelNum, modelType, parentAsmName, newModelName, commonName, parametersStr, childZbx, ParentZbx) {
  var data = await assembleModuleInfoByCsys(modelNum, modelType, parentAsmName, newModelName, commonName, parametersStr, childZbx, ParentZbx);
  var jsons = eval('(' + data + ')');
  return jsons;
};
