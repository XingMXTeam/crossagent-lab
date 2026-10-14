/** Agent display helpers — short codes like agentusecases.ai */

export type AgentInfo = {
  name: string;
  code: string;
  color: string;
};

/** Bright fills + black type, same mark treatment as agentusecases.ai */
const KNOWN: Record<string, AgentInfo> = {
  'Grok Bot': { name: 'Grok Bot', code: 'GB', color: '#ffffff' },
  Claude: { name: 'Claude', code: 'CL', color: '#c4b5fd' },
  'Claude Code': { name: 'Claude Code', code: 'CC', color: '#a78bfa' },
  'Cursor Agent': { name: 'Cursor Agent', code: 'CA', color: '#93c5fd' },
  ChatGPT: { name: 'ChatGPT', code: 'GPT', color: '#34d399' },
  'ChatGPT Agent': { name: 'ChatGPT Agent', code: 'GA', color: '#4ade80' },
  Manus: { name: 'Manus', code: 'MA', color: '#7dd3fc' },
  n8n: { name: 'n8n', code: 'N8', color: '#fb7185' },
  'LLM via n8n': { name: 'LLM via n8n', code: 'N8', color: '#fb7185' },
  Shopify: { name: 'Shopify', color: '#bef264', code: 'SH' },
};

export function agentCode(name: string): string {
  if (KNOWN[name]) return KNOWN[name].code;
  const lower = name.toLowerCase();
  if (lower.includes('n8n')) return 'N8';
  if (lower.includes('chatgpt') || lower.includes('gpt')) return 'GPT';
  if (lower.includes('claude code')) return 'CC';
  if (lower.includes('claude')) return 'CL';
  if (lower.includes('shopify')) return 'SH';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function agentColor(name: string): string {
  if (KNOWN[name]) return KNOWN[name].color;
  const lower = name.toLowerCase();
  if (lower.includes('n8n')) return '#ea4b71';
  if (lower.includes('chatgpt') || lower.includes('gpt')) return '#10a37f';
  if (lower.includes('claude')) return '#d97706';
  const palette = ['#fde047', '#93c5fd', '#f9a8d4', '#86efac', '#fdba74', '#c4b5fd', '#67e8f9', '#fca5a5'];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}

export function primaryAgent(agents: string[]): string {
  return agents[0] || 'Agent';
}

export function formatDateShort(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function formatDateNice(d: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

/** Card meta: Mon YYYY (benchmark density) */
export function formatDateMonthYear(d: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** Feed subline: Tue, Oct 13 · 以下精选 */
export function formatFeedSubline(d: Date): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${days[d.getUTCDay()]}, ${months[d.getUTCMonth()]} ${d.getUTCDate()} · 以下精选`;
}

export function isNew(d: Date, days = 21): boolean {
  const ms = Date.now() - d.valueOf();
  return ms < days * 24 * 60 * 60 * 1000;
}
