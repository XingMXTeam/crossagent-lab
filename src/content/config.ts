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
  'Hacker News',
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

/** Skill shelf categories. Not a cross-industry directory. */
export const skillCategories = ['logistics', 'storefront', 'after-sales'] as const;

export const skillCategoryMeta: Record<(typeof skillCategories)[number], { zh: string }> = {
  logistics: { zh: '物流合规' },
  storefront: { zh: 'Shopify 店面' },
  'after-sales': { zh: '售后闸门' },
};

export const verificationLevels = ['lab_probed', 'docs_cited', 'hybrid'] as const;

export const verificationMeta: Record<
  (typeof verificationLevels)[number],
  { zh: string; hint: string }
> = {
  lab_probed: {
    zh: '本站探针',
    hint: '本站对端点做过 initialize／tools 级探针并写进用例',
  },
  docs_cited: {
    zh: '文档采编',
    hint: '仅采编公开文档／模板，未 live 工具调用',
  },
  hybrid: {
    zh: '探针 + 文档',
    hint: '主路径有探针，辅路径仅文档',
  },
};

export const skillStatuses = ['draft', 'listed', 'retired'] as const;

export const skillCtas = ['mailto', 'buy'] as const;

const casePageUrl = z.string().url().refine((value) => {
  try {
    return /\/cases\/[^/]+\/?$/.test(new URL(value).pathname);
  } catch {
    return false;
  }
}, 'must be an absolute /cases/… URL');

const skills = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    // URL slug is the markdown filename. Astro reserves the `slug` field, so it is not part of this schema.
    summary: z.string(),
    bound_case_urls: z.array(casePageUrl).min(1),
    clients: z.array(z.string()).min(1),
    requires_own_keys: z.array(z.string()).min(1),
    verification_level: z.enum(verificationLevels),
    price_usd: z.number().positive(),
    price_note: z.string(),
    library_included: z.boolean(),
    deliverables: z.array(z.string()).min(1),
    human_gates: z.array(z.string()).min(1),
    changelog: z
      .array(
        z.object({
          date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
          note: z.string(),
        }),
      )
      .min(1),
    status: z.enum(skillStatuses),
    // Stay null until a later explicit go-ahead to add a payment link.
    stripe_payment_link: z
      .string()
      .url()
      .nullable()
      .refine((value) => value === null, 'stripe_payment_link must stay null'),
    category: z.enum(skillCategories),
    verification_facts: z.array(z.string()).min(1).max(3),
    install_steps: z.array(z.string()).min(3).max(7),
    see_also_case_urls: z.array(casePageUrl).default([]),
    /** `buy` renders the short detail page. `mailto` keeps the essay shelf page. */
    cta: z.enum(skillCtas).default('mailto'),
    /** Site path of the hero GIF, e.g. /demos/logistics-hs-demo.gif */
    demo: z.string().regex(/^\/\S+\.gif$/).optional(),
    /** Optional hero MP4. The GIF stays the poster and the fallback frame. */
    demo_video: z.string().regex(/^\/\S+\.mp4$/).optional(),
    demo_caption: z.string().min(1).optional(),
    /** Site path of the skill pack ZIP. */
    zip: z.string().regex(/^\/\S+\.zip$/).optional(),
    result_en: z.string().min(1).optional(),
    install_prompt: z.string().min(1).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.cta !== 'buy') return;
    for (const key of ['demo', 'zip', 'install_prompt', 'demo_caption'] as const) {
      if (!data[key]) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [key],
          message: `${key} is required when cta is buy`,
        });
      }
    }
    const lines = data.clients.length + data.requires_own_keys.length;
    if (lines > 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['requires_own_keys'],
        message: 'buy pages keep client + key lines to 6',
      });
    }
  }),
});

export const collections = { cases, skills };
