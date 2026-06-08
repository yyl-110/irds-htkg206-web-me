import httpRequest from '@/httpRequest';

// 获取流程定义列表
export function getBpmSimpleList(params: any) {
  return httpRequest({
    url: `bpm-service/bpm/process-definition/simple-list`,
    params,
    method: 'GET',
  });
}

// 发起流程
export function instanceCreateProcess(data: any) {
  return httpRequest({
    url: `bpm-service/bpm/process-instance/createProcess`,
    data,
    method: 'POST',
  });
}
// 知识库文件状态更新

export function updateKnowledgeFileStatusFromBpmCallback(data: any) {
  return httpRequest({
    url: `knowledge-service/knowledgeFile/updateStatusFromBpmCallback`,
    data,
    method: 'POST',
  });
}

// 模块库文件状态更新

export function updateModuleLibraryDataStatusFromBpmCallback(data: any) {
  return httpRequest({
    url: `business-service/business/library-data/update-status-from-bpm-callback`,
    data,
    method: 'POST',
  });
}
