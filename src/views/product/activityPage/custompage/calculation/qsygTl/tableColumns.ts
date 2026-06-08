import type { LegacyColumn } from '@/views/product/activityPage/custompage/_shared/components/ProcessRxTable.types';

export function createQsygTlCylinderColumns(): LegacyColumn[] {
  return [
    {
      title: '序号',
      key: 'rowIndex',
      width: 80,
      align: 'center',
      render: (h, params) =>
        h('span', { title: String(params.index + 1) }, String(params.index + 1)),
    },
    { title: '油缸级数', key: 'ygjs', width: 220, align: 'center' },
    { title: '收缩长度', key: 'sscd', width: 180, align: 'center' },
    { title: '展开长度', key: 'zkcd', minWidth: 180, align: 'center' },
    { title: '最大推力', key: 'zdtl', minWidth: 180, align: 'center' },
    { title: '最大拉力', key: 'zdll', minWidth: 180, align: 'center' },
    { title: '上支点x轴', key: 'szdXz', minWidth: 180, align: 'center' },
    { title: '上支点z轴', key: 'szdZz', minWidth: 180, align: 'center' },
    { title: '下至点x轴', key: 'xzdXz', minWidth: 180, align: 'center' },
    { title: '下至点z轴', key: 'xzdZz', minWidth: 180, align: 'center' },
  ];
}
