import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: { site?: URL }) {
  const cases = (await getCollection('cases')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );
  return rss({
    title: 'CrossAgent Lab',
    description: '别人正在用的跨境 Agent 做法。偷一个灵感。',
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
