export function getStatusStyle(status: string) {
  const styles: any = {};
  switch (status) {
    case '已提交':
      styles.color = '#4CAF50';
      break;
    case '待提交':
      styles.color = '#b4b4b4';
      break;
    case '进行中':
      styles.color = '#cd7517';
      break;
    case '已办':
      styles.color = '#4CAF50';
      break;
    case '待办': //待办
      styles.color = '#b4b4b4';
      break;
    case 'RME_ANALYZED': //RME已分析/待处理
      styles.color = '#0d8888';
      break;
    case 'DRAFT': //草稿
      styles.color = '#b4b4b4';
      break;
    case 'RME_AP': //待RME分析
      styles.color = '#0d8888';
      break;
    case 'RME_ANALYZING': //RME分析中
      styles.color = '#cd7517';
      break;
    case 'RAT_ANALYZING': //RAT分析中
      styles.color = '#cd7517';
      break;
    case 'RAT_AC': //RAT分析完成
      styles.color = '#4CAF50';
      break;
    case 'IPMT_PD': //IPMT待决策
      styles.color = '#0d8888';
      break;
    case 'IPMT_DEC': //IPMT已决策
      styles.color = '#4CAF50';
      break;
    case 'DISPATCHED': //已分发
      styles.color = '#4CAF50';
      break;
    case 'IMPLEMENTATION_PENDING': //开发中
      styles.color = '#cd7517';
      break;
    case 'ACCEPTANCE_PENDING': //待验收
      styles.color = '#008080';
      break;
    case 'COMPLETED': //已关闭
      styles.color = '#4CAF50';
      break;
    case 'INIT': //初始变更
      styles.color = '#27c2b0ff';
      break;
    case 'ORIGINAL': //原始变更
      styles.color = '#02a7f0';
      break;
    case 'TRANSFER': //转办
      styles.color = '#02a7f0';
      break;
    case 'TRANSFERFINISH': //完成
      styles.color = '#4CAF50';
      break;
    case '通过': //通过
      styles.color = '#4CAF50';
      break;
    case '驳回': //驳回
      styles.color = '#cd7517';
      break;
    case '待启动': //待启动
      styles.color = '#b4b4b4';
      break;
    case '工作中': //工作中
      styles.color = '#cd7517';
      break;
    case '正在工作': //正在工作
      styles.color = '#cd7517';
      break;
    case '变更中': //变更中
      styles.color = '#9370db';
      break;
    case '已完成': //已完成
      styles.color = '#4CAF50';
      break;
  }
  return styles;
}

export function getProductgroupingStyle(status: string) {
  const styles: any = {};
  switch (status) {
    case '1':
      styles.color = '#a30821';
      break;
    case '2':
      styles.color = '#9f6702';
      break;
    case '3':
      styles.color = '#0c6e1c';
      break;
    case '4':
      styles.color = '#05b050';
      break;
  }
  styles.fontWeight = 'bold';
  return styles;
}

export function getplanQuarterStyle(status: string) {
  const styles: any = {};
  switch (status) {
    case 'Q1':
      styles.color = '#8FD974';
      break;
    case 'Q2':
      styles.color = '#FF7A00';
      break;
    case 'Q3':
      styles.color = '#F5D660';
      break;
    case 'Q4':
      styles.color = '#1890ff';
      break;
  }
  styles.fontWeight = 'bold';
  return styles;
}
