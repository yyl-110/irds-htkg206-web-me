import type { LegacyColumn } from '@/views/product/activityPage/custompage/_shared/components/ProcessRxTable.types';

export function createQsygXcResultColumns(): LegacyColumn[] {
  return [
    { title: '角度变化', key: 'jdbh', width: 220, align: 'center' },
    { title: 'a(°)', key: 'a1', width: 180, align: 'center' },
    { title: '油缸行程L(mm)', key: 'ygxc', minWidth: 180, align: 'center' },
    { title: '油缸推力F(KN)', key: 'ygtl', minWidth: 180, align: 'center' },
  ];
}
