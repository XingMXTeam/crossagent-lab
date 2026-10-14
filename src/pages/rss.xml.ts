import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: { site?: URL }) {
  const cases = (await getCollection('cases')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );
  return rss({
    title: 'CrossAgent Lab',
    description: '跨境卖家真实在用的 AI Agent 用例目录（附 Prompt / 工作流）',
    site: context.site ?? 'https://crossagent.maoxunxing.com',
    items: cases.map((c) => ({
      title: c.data.title,
      description: c.data.summary,
      pubDate: c.data.date,
      link: `/cases/${c.slug}/`,
    })),
    customData: `<language>zh-CN</language>`,
  });
}
