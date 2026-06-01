export enum Knowledgebase {
  DESIGNING = '0', // 设计中
  COMPILING = '1', // 编制中
  REVIEWING = '2', // 审核中
  PUBLISHED = '3', // 已发布
}

export const KnowledgebaseLabel = {
  [Knowledgebase.DESIGNING]: '设计中',
  [Knowledgebase.COMPILING]: '编制中',
  [Knowledgebase.REVIEWING]: '审核中',
  [Knowledgebase.PUBLISHED]: '已发布',
};

export const KnowledgebaseColor: Record<Knowledgebase, string> = {
  [Knowledgebase.DESIGNING]: '#1890ff',
  [Knowledgebase.COMPILING]: '#2e8702',
  [Knowledgebase.REVIEWING]: '#faad14',
  [Knowledgebase.PUBLISHED]: '#52c41a',
};

export const getKnowledgebaseLabel = (status: string | Knowledgebase): string => {
  return KnowledgebaseLabel[status as Knowledgebase] || '';
};

export const getKnowledgebaseColor = (status: string | Knowledgebase): string => {
  return KnowledgebaseColor[status as Knowledgebase] || '';
};

export const KnowledgeCardType = {
  TEXT: '文档',
  VIDEO: '视频',
  IMAGE: '图片',
} as const;

export type KnowledgeCardTypeValue = (typeof KnowledgeCardType)[keyof typeof KnowledgeCardType];

export const KNOWLEDGE_CARD_TYPE_MAP: Record<number, KnowledgeCardTypeValue> = {
  1: KnowledgeCardType.TEXT,
  2: KnowledgeCardType.VIDEO,
  3: KnowledgeCardType.IMAGE,
};
