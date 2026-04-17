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

/**
 * 知识中心二级筛选tag
 * @param params
 */

export function querySecondTagNode(data: SecondTagNodeQuery) {
  return httpRequest({
    url: '/knowledge-service/knowledgeTag/querySecondTagNode',
    data,
    method: 'POST',
  })
}
/**
 * 知识中心三级级筛选tag
 * @param params
 */

export function queryThreeTagNode(data: SecondTagNodeQuery) {
  return httpRequest({
    url: '/knowledge-service/knowledgeTag/queryThreeTagNode',
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
    url: '/knowledge-service/knowledgePersonal/hotFileList',
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
    url: '/knowledge-service/knowledgePersonal/resume',
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
    url: '/knowledge-service/es_kld/queryPage',
    data,
    method: "POST",
  });
}
/**
 * 搜索中心问答列表
 * @param data
 */
export function queryPageQuestion(data: IQueryPage) {
  return httpRequest({
    url: '/knowledge-service/es_kld_que/queryPage',
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
    url: '/knowledge-service/knowledgePersonal/lookFileLogList',
    data,
    method: "POST",
  });
}
/**
 * 学习完成
 * @param data
 */

export function LearningCompleted(data: any) {
  return httpRequest({
    url: '/knowledge-service/knowledgeTMNode/LearningCompleted',
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
    url: '/knowledge-service/knowledgeFileMapData/getHistoryList',
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
    url: '/knowledge-service/knowledgeTree/getNodeByLevel',
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
    url: '/knowledge-service/knowledgeFileMapData/getEchartsDataByType',
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
    url: '/knowledge-service/knowledgeFileMapData/fileList',
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
    url: '/knowledge-service/knowledgeDiscuss/detail',
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
    url: '/knowledge-service/knowledgeDiscuss/save',
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
    url: '/knowledge-service/knowledgeDiscuss/favour',
    data,
    method: "POST",
  });
}
/**
 * 知识地图-喜欢评论
 * @param data 
 */
export function doInterestQuestion(data: any) {
  return httpRequest({
    url: '/knowledge-service/knowledgeQuestion/doInterestQuestion',
    data,
    method: "POST",
  });
}
/**
 * 知识地图-根据登录用户和 知识主键查询分享数据，如果存在，不能再重复分享
 * @param data 
 */
export function shareDetail(data: any) {
  return httpRequest({
    url: '/knowledge-service/knowledgeShare/detail',
    data,
    method: 'POST',
  });
}
/**
 * 知识地图-收藏文档
 * @param data {"kldId":256,"userId":"582"}
 */
export function doCollectFile(data: any) {
  return httpRequest({
    url: '/knowledge-service/knowledgePersonal/doCollectFile',
    data,
    method: "POST",
  });
}
/**
 * 知识地图-浏览记录保存
 * @param data 
 */
export function saveLookFileLog(data: any) {
  return httpRequest({
    url: '/knowledge-service/knowledgePersonal/saveLookFileLog',
    data,
    method: "POST",
  });
}
/**
 * 知识地图-预览接口
 * @param data 
 */
export function updateKldCounting(data: any) {
  return httpRequest({
    url: '/knowledge-service/knowledgeFile/updateKldCounting',
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
    url: '/knowledge-service/knowledgeShare/save',
    data,
    method: 'POST',
  });
}
export function modifyInit(data: any) {
  return httpRequest({
    url: '/knowledge-service/knowledgeFile/modifyInit',
    data,
    method: 'POST',
  });
}

/**
 * 知识学习-获取任务列表
 * @param data {"userId":"582","queryContent":"","currentPage":1,"pageSize":10,"clientEnd":1}
 */
export function taskMaplist(data: any) {
  return httpRequest({
    url: '/knowledge-service/knowledgeTM/taskMaplist',
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
    url: '/knowledge-service/knowledgeTM/personalMapList',
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
    url: '/knowledge-service/knowledgeQuestion/list',
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
//     url: '/knowledge-service/knowledgeQuestion/queryExpertInformationList',
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
    url: '/knowledge-service/knowledgeQuestion/hotQuestion',
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
    url: '/knowledge-service/knowledgeQuestion/answerQuestion',
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
    url: '/knowledge-service/knowledgeQuestion/removeAnswer',
    data,
    method: "POST",
  });
}
/**
 * 知识问答-删除问题
 * @param data {"questionId":42}
 */
export function removeQuestion(data: any) {
  return httpRequest({
    url: '/knowledge-service/knowledgeQuestion/remove',
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
    url: '/knowledge-service/knowledgeTag/getTreeNodeByNodeLevel',
    data,
    method: "POST",
  });
}
/**
 * 知识问答-查询用户列表
 * @param data {"type":2,"kldFileId":"","kldType":"2","userId":"582"}
 */
export function userList(data: any) {
  return httpRequest({
    url: '/knowledge-service/knowledgeShare/userList',
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
    url: '/knowledge-service/knowledgeQuestion/save',
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
    url: '/knowledge-service/knowledgeQuestion/queryExpertInformationList',
    data,
    method: "POST",
  });
}
/**
 * 个人主页-收藏列表
 * @param data {"titleOrUserName":"","userId":"582","attachmentType":1,"currentPage":1,"pageSize":10}
 * @param config axios config (可选，用于传递 signal 等)
 */
export function collectFileList(data: any, config?: any) {
  return httpRequest({
    url: '/knowledge-service/knowledgePersonal/collectFileList',
    data,
    method: "POST",
    ...config,
  });
}
/**
 * 个人主页-关注列表
 * @param data
 * @param config axios config (可选，用于传递 signal 等)
 */
export function interestList(data: any, config?: any) {
  return httpRequest({
    url: '/knowledge-service/knowledgePersonal/interestList',
    data,
    method: "POST",
    ...config,
  });
}
/**
 * 个人主页-分享问题列表
 * @param data
 * @param config axios config (可选，用于传递 signal 等)
 */
export function shareQuestionList(data: any, config?: any) {
  return httpRequest({
    url: '/knowledge-service/knowledgePersonal/shareQuestionList',
    data,
    method: "POST",
    ...config,
  });
}
/**
 * 个人主页-分享文档列表
 * @param data
 * @param config axios config (可选，用于传递 signal 等)
 */
export function shareFileList(data: any, config?: any) {
  return httpRequest({
    url: '/knowledge-service/knowledgePersonal/shareFileList',
    data,
    method: "POST",
    ...config,
  });
}
/**
 * 技术标准-检索标准分类
 * @param data
 */
export function findAllBzfl(data: any) {
  return httpRequest({
    url: '/knowledge-service/tbea/bzw/findAllBzfl',
    data,
    method: "POST",
  });
}
/**
 * 技术标准-检索标准信息
 * @param data
 */
export function findBzwj(data: any) {
  return httpRequest({
    url: '/knowledge-service/tbea/bzw/findBzwj',
    data,
    method: "POST",
  });
}
/**
 * 技术标准
 * @param data
 */
export function getFileInfo(data: any) {
  return httpRequest({
    url: '/knowledge-service/tbea/bzw/getFileInfo',
    data,
    method: "POST",
  });
}
/**
 * 开始学习
 * @param data
 */
export function startLearning(data: any) {
  return httpRequest({
    url: '/knowledge-service/knowledgeTMNode/startLearning',
    data,
    method: "POST",
  });
}
/**
 * 开始学习
 * @param data
 */
export function learningCompleted(data: any) {
  return httpRequest({
    url: '/knowledge-service/knowledgeTMNode/LearningCompleted',
    data,
    method: "POST",
  });
}
/**
 * 任务地图 数据树列表
 * @param data
 */
export function taskMapList(data: any) {
  return httpRequest({
    url: '/knowledge-service/knowledgeTMNode/list',
    data,
    method: "POST",
  });
}
/**
 * 任务地图 查询所有二级节点
 * @param data
 */
export function queryMapNodeList(data: any) {
  return httpRequest({
    url: '/knowledge-service/knowledgeTMNode/queryNodeList',
    data,
    method: "POST",
  });
}
/**
 * 任务地图获取任务详情
 * @param data
 */
export function queryMapTaskDetail(data: any) {
  return httpRequest({
    url: '/knowledge-service/knowledgeTM/queryMapTaskDetail',
    data,
    method: "POST",
  });
}
/**
 * 任务地图-浏览文件
 * @param data
 */
export function getPdfPreviewPath(data: any) {
  return httpRequest({
    url: '/system-service/fileManagerController/getPdfPreviewPath.json',
    data,
    method: "POST",
  });
}
/**
 * 知识配置-标签列表
 * @param data
 */
export function knowledgeTagList(data: any) {
  return httpRequest({
    url: '/knowledge-service/knowledgeTag/list',
    data,
    method: "POST",
  });
}
/**
 * 知识配置-标签保存
 * @param data
 */
export function tagSave(data: any) {
  return httpRequest({
    url: '/knowledge-service/knowledgeTag/save',
    data,
    method: "POST",
  });
}
/**
 * 知识配置-标签排序
 * @param data
 */
export function sortTag(data: any) {
  return httpRequest({
    url: '/knowledge-service/knowledgeTag/sort',
    data,
    method: "POST",
  });
}
/**
 * 知识配置-删除节点
 * @param data
 */
export function removeTag(data: any) {
  return httpRequest({
    url: '/knowledge-service/knowledgeTag/remove',
    data,
    method: "POST",
  });
}
/**
 * 编辑任务查询
 * @param data
 */
export function modifyInitMap(data: any) {
  return httpRequest({
    url: '/knowledge-service/knowledgeTM/modifyInit',
    data,
    method: "POST",
  });
}
/**
 * 删除任务查询
 * @param data
 */
export function removeMap(data: any) {
  return httpRequest({
    url: '/knowledge-service/knowledgeTM/remove',
    data,
    method: "POST",
  });
}
/**
 * OU属性接口
 * @param data
 */
export function OuList(data: any) {
  return httpRequest({
    url: '/knowledge-service/knowledgeDict/queryByKey',
    data,
    method: "POST",
  });
}

/**
 * 暂存任务地图
 * @param data
 */
export function stagSave(data: any) {
  return httpRequest({
    url: '/knowledge-service/knowledgeTM/save',
    data,
    method: "POST",
  });
}
/**
 * 查询所有任务地图模板
 * @param data
 */
export function queryTemplate(data: any) {
  return httpRequest({
    url: '/knowledge-service/knowledgeTM/queryTemplate',
    data,
    method: "POST",
  });
}
/**
 * 删除数据和节点
 * @param data
 */
export function taskMapRemoveTree(data: any) {
  return httpRequest({
    url: '/knowledge-service/knowledgeTMNode/removeTree',
    data,
    method: "POST",
  });
}
/**
 * 保存任务地图 第二级节点
 * @param data
 */
export function taskMapSaveTree(data: any) {
  return httpRequest({
    url: '/knowledge-service/knowledgeTMNode/saveTree',
    data,
    method: "POST",
  });
}
/**
 * 保存任务地图 数据
 * @param data
 */
export function saveTreeData(data: any) {
  return httpRequest({
    url: '/knowledge-service/knowledgeTMNode/saveTreeData',
    data,
    method: "POST",
  });
}
/**
 * 任务地图提交 数据
 * @param data
 */
export function submitMap(data: any) {
  return httpRequest({
    url: '/knowledge-service/knowledgeTM/submit',
    data,
    method: "POST",
  });
}
/**
 * 知识地图上下移动接口
 * @param data
 */
export function mapTreeSort(data: any) {
  return httpRequest({
    url: '/knowledge-service/knowledgeTMNode/sort',
    data,
    method: "POST",
  });
}
/**
 * 数据保存
 * @param data
 */
export function saveFieMap(data: any) {
  return httpRequest({
    url: '/knowledge-service//knowledgeFileMapData/save',
    data,
    method: "POST",
  });
}
/**
 * 知识树
 * @param data
 */
export function knowledgeTree(data: any) {
  return httpRequest({
    url: '/knowledge-service/knowledgeTree/list',
    data,
    method: "POST",
  });
}
/**
 * 知识地图管理数据的数据查询
 * @param data
 */
export function knowledgeFileMapData(data: any) {
  return httpRequest({
    url: '/knowledge-service/knowledgeFileMapData/list',
    data,
    method: "POST",
  });
}
/**
 * 标签
 * @param data
 */
export function queryByKey(data: any) {
  return httpRequest({
    url: '/knowledge-service/knowledgeDict/queryByKey',
    data,
    method: "POST",
  });
}
/**
 * 知识树添加编辑
 * @param data
 */
export function saveknowledgeTree(data: any) {
  return httpRequest({
    url: '/knowledge-service/knowledgeTree/save',
    data,
    method: "POST",
  });
}
/**
 * 知识树排序
 * @param data
 */
export function sortTree(data: any) {
  return httpRequest({
    url: '/knowledge-service/knowledgeTree/sort',
    data,
    method: "POST",
  });
}
/**
 * 知识树删除
 * @param data
 */
export function removeTree(data: any) {
  return httpRequest({
    url: '/knowledge-service/knowledgeTree/remove',
    data,
    method: "POST",
  });
}
/**
 * 知识树删除
 * @param data
 */
export function removeMapData(data: any) {
  return httpRequest({
    url: '/knowledge-service/knowledgeFileMapData/remove',
    data,
    method: "POST",
  })
}
/**
 * 知识文档获取列表
 * @param data
 */
export function knowledgeFileList(data: any) {
  return httpRequest({
    url: '/knowledge-service/knowledgeFile/list',
    data,
    method: "POST",
  })
}
/**
 * 知识文档删除文件
 * @param data
 */
export function removeFile(data: any) {
  return httpRequest({
    url: '/knowledge-service/knowledgeFile/remove',
    data,
    method: "POST",
  })
}
/**
 * 知识文档保存文件
 * @param data
 */
export function saveKnowledgeFile(data: any) {
  return httpRequest({
    url: '/knowledge-service/knowledgeFile/save',
    data,
    method: "POST",
  })
}