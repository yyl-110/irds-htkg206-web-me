import httpRequest from '@/httpRequest';

export function isValid(val) {
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

export function executeAnsysSimulate(data: Record<string, unknown>) {
  return httpRequest({
    url: '/flow/executeAnsysSimulate.json',
    method: 'POST',
    data: data,
  });
}
