import httpRequest from '@/httpRequest';

export function isValid(val: unknown) {
  if (Object.prototype.toString.call(val) === '[object Object]') {
    if (Reflect.ownKeys(val).length <= 0) {
      return false;
    }
  } else {
    if (val == '' && val.length == 0) {
      return false;
    }
    if (val == 0 || val == '0') {
      return true;
    }
    if (
      val == undefined ||
      val == 'undefined' ||
      val == 'UNDEFINED' ||
      val == null ||
      val == 'null' ||
      val == 'NULL' ||
      val == 'Null' ||
      val == ''
    ) {
      return false;
    }
  }
  return true;
}

export function deepCopy<T>(val: T): T {
  return JSON.parse(JSON.stringify(val)) as T;
}

export function executeAnsysSimulate(data: Record<string, unknown>) {
  return httpRequest({
    url: '/flow/executeAnsysSimulate.json',
    method: 'POST',
    data: data,
  });
}

export function getJsContent(data: Record<string, unknown>) {
  return httpRequest({
    url: '/flow/getJsContent.json',
    method: 'POST',
    data,
  });
}

export function setJsContent(data: Record<string, unknown>) {
  return httpRequest({
    url: '/flow/setJsContent.json',
    method: 'POST',
    data,
  });
}

export function readTDDPInputData(data: Record<string, unknown>) {
  return httpRequest({
    url: '/flow/readTDDPInputData.json',
    method: 'POST',
    data,
  });
}

export function getFlowModuleid(data: Record<string, unknown>) {
  return httpRequest({
    url: '/flow/getFlowModuleid.json',
    method: 'POST',
    data,
  });
}

export function delPageInputtempByIds(data: { inputtempids: string }) {
  return httpRequest({
    url: '/flow/delPageInputtempByIds.json',
    method: 'POST',
    data,
  });
}

export function writeToFile(data: Record<string, unknown>) {
  return httpRequest({
    url: '/flow/writeToFile.json',
    method: 'post',
    data: JSON.stringify(data),
  });
}

export function getTabledataByTablenumTaskid(data: Record<string, unknown>) {
  return httpRequest({
    url: '/flow/getTabledataByTablenumTaskid.json',
    method: 'post',
    data: JSON.stringify(data),
  });
}
