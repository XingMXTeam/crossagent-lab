import { existsSync } from 'node:fs';
import path from 'node:path';
import type { CollectionEntry } from 'astro:content';

export const SKILL_INBOX = 'me@maoxunxing.com';

export function caseSlugFromUrl(url: string): string | null {
  try {
    const match = new URL(url).pathname.match(/\/cases\/([^/]+)\/?$/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

export function formatUsd(amount: number): string {
  return Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
}

export function skillMailto(title: string): string {
  const subject = `询购技能包：${title}`;
  return `mailto:${SKILL_INBOX}?subject=${encodeURIComponent(subject)}`;
}

export function assertSkillBindings(
  skills: CollectionEntry<'skills'>[],
  cases: CollectionEntry<'cases'>[],
): void {
  const slugs = new Set(cases.map((entry) => entry.slug));
  for (const skill of skills) {
    const urls = [...skill.data.bound_case_urls, ...skill.data.see_also_case_urls];
    for (const url of urls) {
      const slug = caseSlugFromUrl(url);
      if (!slug || !slugs.has(slug)) {
        throw new Error(`Skill "${skill.slug}" points at a missing case: ${url}`);
      }
    }
  }
}

/** Buy pages point at files in public/. Fail the build if one is missing. */
export function assertSkillAssets(skills: CollectionEntry<'skills'>[]): void {
  for (const skill of skills) {
    for (const rel of [skill.data.demo, skill.data.demo_video, skill.data.zip]) {
      if (!rel) continue;
      const file = path.join(process.cwd(), 'public', rel.replace(/^\//, ''));
      if (!existsSync(file)) {
        throw new Error(`Skill "${skill.slug}" asset missing: ${rel}`);
      }
    }
  }
}

export function skillsForCase(
  skills: CollectionEntry<'skills'>[],
  caseSlug: string,
): CollectionEntry<'skills'>[] {
  return skills.filter((skill) =>
    skill.data.status !== 'retired' &&
    skill.data.bound_case_urls.some((url) => caseSlugFromUrl(url) === caseSlug),
  );
}
