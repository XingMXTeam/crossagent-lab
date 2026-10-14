import { defineCollection, z } from 'astro:content';

export const categories = [
  'sourcing',
  'listing',
  'customer-service',
  'ads',
  'ops-finance',
  'logistics',
] as const;

export const categoryMeta: Record<(typeof categories)[number], { zh: string; en: string; desc: string }> = {
  sourcing: { zh: '选品与调研', en: 'Sourcing & Research', desc: '竞品拆解、关键词、趋势与供应商初筛' },
  listing: { zh: '刊登与素材', en: 'Listing & Creative', desc: '标题、五点、主图文案、A+ 与多语言素材' },
  'customer-service': { zh: '客服与售后', en: 'Customer Service', desc: '询盘回复、差评挽回、退货话术' },
  ads: { zh: '广告投放', en: 'Ads', desc: '关键词否词、出价、报表解读与周复盘' },
  'ops-finance': { zh: '中后台 / 对账 / 运营', en: 'Ops & Finance', desc: '多平台对账、库存、日报与异常排查' },
  logistics: { zh: '物流与合规', en: 'Logistics & Compliance', desc: '头程、清关、禁限运与标签合规' },
};

/** Editorial sources (seed) + platform-style tags (public cites) */
export const sourceLabels = [
  '编辑撰写',
  '示例/编辑合成',
  '公开分享',
  '博客',
  'Reddit',
  'X',
  'GitHub',
  'n8n',
  '官网',
  '掘金',
  '知乎',
] as const;

const cases = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    titleEn: z.string().optional(),
    summary: z.string(),
    summaryEn: z.string().optional(),
    category: z.enum(categories),
    agents: z.array(z.string()),
    tools: z.array(z.string()).default([]),
    source: z.enum(sourceLabels),
    sourceUrl: z.string().url().optional(),
    sourceType: z.enum(['public', 'editorial', 'synthetic']).optional(),
    date: z.coerce.date(),
    dateNote: z.string().optional(),
    featured: z.boolean().default(false),
    prompt: z.string(),
  }),
});

export const collections = { cases };
