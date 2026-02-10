import { useUserStore } from '@/store/modules/user';
const userStore = useUserStore();
export function Isiteditable(row: any) {
  if (row.changingFlag) {
    return true;
  } else if (!row.rmeUserId) {
    return false;
  } else if (row.rmeUserId == userStore.getUser.id) {
    return false;
  } else {
    return true;
  }
}

export function periodicAttributemedth(periodicAttribute: any) {
  let str = '';
  if (periodicAttribute == 1) {
    str = '小于1年';
  } else if (periodicAttribute == 2) {
    str = '1-3年';
  } else if (periodicAttribute == 3) {
    str = '大于3年';
  }
  return str;
}

export function Productgroupingdisplay(productGroup: any) {
  let str = '';
  if (productGroup == 1) {
    str = '第一组：市场渗透';
  } else if (productGroup == 2) {
    str = '第二组：产品开发';
  } else if (productGroup == 3) {
    str = '第三组：开拓市场';
  } else if (productGroup == 4) {
    str = '第四组：多元化';
  }
  return str;
}
