import httpRequest from "@/httpRequest";

interface SecondTagNodeQuery {
  tagType: number
  nodeLevel: string
  fileType: number
}

interface IQueryPage {
  kldType: number;
  keyWords: string;
  userName: string;
  allowDownload: string;
  all: string;
  kldTagIds: string;
  currentPage: number;
  pageSize: number;
  userId: string;
}

const proxyApi = '/Know'

/**
 * 知识中心二级筛选tag
 * @param params
 */

export function querySecondTagNode(data: SecondTagNodeQuery) {
  return httpRequest({
    url: `${proxyApi}/knowledge-server/knowledgeTag/querySecondTagNode`,
    data,
    method: 'POST',
  })
}

/**
 * 获取热门文件列表
 * @param data {"currentPage":1,"pageSize":10000,"fileType":1}
 */
export function hotFileList(data: any) {
  return httpRequest({
    url: `${proxyApi}/knowledge-server/knowledgePersonal/hotFileList`,
    data,
    method: "POST",
  });
}
/**
 * 查询个人信息
 * @param data
 */

export function knowledgePersonal(data: { userId: string }) {
  return httpRequest({
    url: `${proxyApi}/knowledge-server/knowledgePersonal/resume`,
    data,
    method: "POST",
  });
}
/**
 * 获取知识中心列表
 * @param data
 */
export function knowledgeQueryPage(data: IQueryPage) {
  return httpRequest({
    url: `${proxyApi}/knowledge-server/es_kld/queryPage`,
    data,
    method: "POST",
  });
}
/**
 * 获取浏览记录
 * @param data {"currentPage":1,"pageSize":10000,"userId":"582","type":"1","fileType":1}
 */

export function lookFileLogList(data: any) {
  return httpRequest({
    url: `${proxyApi}/knowledge-server/knowledgePersonal/lookFileLogList`,
    data,
    method: "POST",
  });
}

/**
 * 知识地图获取用户历史列表
 * @param data
 */

export function getHistoryList(data: { userId: string }) {
  return httpRequest({
    url: `${proxyApi}/knowledge-server/knowledgeFileMapData/getHistoryList`,
    data,
    method: "POST",
  });
}

/**
 * 获取知识树节点
 * @param data {"menuId":45,"menuParentId":15,"treeType":2,"nodeLevel":"2","nodeName":""}
 */

export function getNodeByLevel(data: any) {
  return httpRequest({
    url: `${proxyApi}/knowledge-server/knowledgeTree/getNodeByLevel`,
    data,
    method: "POST",
  });
}

/**
 * 获取Echarts数据
 * @param data
 */
export function getEchartsDataByTypel(data: any) {
  return httpRequest({
    url: `${proxyApi}/knowledge-server/knowledgeFileMapData/getEchartsDataByType`,
    data,
    method: 'POST',
  });
}

/**
 * 知识地图文件列表
 * @param data {"currentPage":1,"pageSize":10000,"type":"1","kldTreeId":"","userId":"582","titleOrUserName":""}
 */
export function fileList(data: any) {
  return httpRequest({
    url: `${proxyApi}/knowledge-server/knowledgeFileMapData/fileList`,
    data,
    method: "POST",
  });
}
/**
 * 知识地图-评论详情
 * @param data {"kldId":256,"userId":"582","kldType":1}
 */
export function commentDetail(data: any) {
  return httpRequest({
    url: `${proxyApi}/knowledge-server/knowledgeDiscuss/detail`,
    data,
    method: "POST",
  });
}
/**
 * 知识地图-保存评论
 * @param data {"kldId":256,"type":0,"replyUserId":60,"replyUserName":"","content":"1","parentId":"","beReplyUserId":"582","beReplyUserName":"ddhl_ljj","kldType":1}
 */
export function commentSave(data: any) {
  return httpRequest({
    url: `${proxyApi}/knowledge-server/knowledgeDiscuss/save`,
    data,
    method: "POST",
  });
}
/**
 * 知识地图-点赞评论
 * @param data {"userId":"582","discussId":41}
 */
export function commentFavour(data: any) {
  return httpRequest({
    url: `${proxyApi}/knowledge-server/knowledgeDiscuss/favour`,
    data,
    method: "POST",
  });
}
/**
 * 知识地图-收藏文档
 * @param data {"kldId":256,"userId":"582"}
 */
export function doCollectFile(data: any) {
  return httpRequest({
    url: `${proxyApi}/knowledge-server/knowledgePersonal/doCollectFile`,
    data,
    method: "POST",
  });
}
/**
 * 知识地图-分享
 * @param data {"id":"","kldFileId":"256","loginUserId":"582","userType":"3","userIds":"","userNames":"ddhl_ljj","status":"1","kldType":1}
 */
export function knowledgeShare(data: any) {
  return httpRequest({
    url: `${proxyApi}/knowledge-server/knowledgeShare/save`,
    data,
    method: "POST",
  });
}

/**
 * 知识学习-获取任务列表
 * @param data {"userId":"582","queryContent":"","currentPage":1,"pageSize":10,"clientEnd":1}
 */
export function taskMaplist(data: any) {
  return httpRequest({
    url: `${proxyApi}/knowledge-server/knowledgeTM/taskMaplist`,
    data,
    method: "POST",
  });
}
/**
 * 知识学习-获取个人任务列表
 * @param data {"userId":"582","type":1,"currentPage":1,"pageSize":10}
 */
export function personalMapList(data: any) {
  return httpRequest({
    url: `${proxyApi}/knowledge-server/knowledgeTM/personalMapList`,
    data,
    method: "POST",
  });
}
/**
 * 知识问答-列表
 * @param data {"all":"","searchType":1,"creatUser":"","kldTagIds":"","userId":"582","currentPage":1,"pageSize":10}
 */
export function knowledgeQuestion(data: any) {
  return httpRequest({
    url: `${proxyApi}/knowledge-server/knowledgeQuestion/list`,
    data,
    method: "POST",
  });
}
/**
 * 知识问答-专家板块
 * @param data {"currentPage":1,"pageSize":10,"userNameOrExpertRole":""}
 */
// export function queryExpertInformationList(data: any) {
//   return httpRequest({
//     url: `${proxyApi}/knowledge-server/knowledgeQuestion/queryExpertInformationList`,
//     data,
//     method: "POST",
//   })
// }
/**
 * 知识问答-热门问题
 * @param data {"currentPage":1,"pageSize":10,"userNameOrDes":""}
 */
export function hotQuestion(data: any) {
  return httpRequest({
    url: `${proxyApi}/knowledge-server/knowledgeQuestion/hotQuestion`,
    data,
    method: "POST",
  });
}
/**
 * 知识问答-回答问题
 * @param data {"questionId":42,"userId":"582","content":"1"}
 */
export function answerQuestion(data: any) {
  return httpRequest({
    url: `${proxyApi}/knowledge-server/knowledgeQuestion/answerQuestion`,
    data,
    method: "POST",
  });
}
/**
 * 知识问答-删除回答
 * @param data {"questionId":42,"userId":"582","content":"1"}
 */
export function removeAnswer(data: any) {
  return httpRequest({
    url: `${proxyApi}/knowledge-server/knowledgeQuestion/removeAnswer`,
    data,
    method: "POST",
  });
}
/**
 * 知识问答-标签列表
 * @param data {"nodeLevel":"2","tagType":"1"}
 */
export function getTreeNodeByNodeLevel(data: any) {
  return httpRequest({
    url: `${proxyApi}/knowledge-server/knowledgeTag/getTreeNodeByNodeLevel`,
    data,
    method: "POST",
  });
}
/**
 * 知识问答-指定回复人员列表
 * @param data {"type":2,"kldFileId":"","kldType":"2","userId":"582"}
 */
export function userList(data: any) {
  return httpRequest({
    url: `${proxyApi}/knowledge-server/knowledgeShare/userList`,
    data,
    method: "POST",
  });
}
/**
 * 知识问答-提问题
 * @param data {"id":"","userId":"582","description":"32防守打法","urgency":"严重","kldTagId":"3","kldTagName":"设计","assignType":2,"assignUserId":"60,71","assignUserName":"","tagJson":"[]","status":1,"kldType":2}
 */
export function saveQuestion(data: any) {
  return httpRequest({
    url: `${proxyApi}/knowledge-server/knowledgeQuestion/save`,
    data,
    method: "POST",
  });
}
/**
 * 知识问答-更多专家
 * @param data {"currentPage":1,"pageSize":10,"userNameOrExpertRole":""}
 */
export function queryExpertInformationList(data: any) {
  return httpRequest({
    url: `${proxyApi}/knowledge-server/knowledgeQuestion/queryExpertInformationList`,
    data,
    method: "POST",
  });
}
/**
 * 个人主页-收藏列表
 * @param data {"titleOrUserName":"","userId":"582","attachmentType":1,"currentPage":1,"pageSize":10}
 */
export function collectFileList(data: any) {
  return httpRequest({
    url: `${proxyApi}/knowledge-server/knowledgePersonal/collectFileList`,
    data,
    method: "POST",
  });
}

