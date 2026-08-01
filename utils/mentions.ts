import { chefs } from '@/data/mockData';

export type TextPart =
  | { type: 'text'; value: string }
  | { type: 'mention'; value: string; chefId: string };

export function parseMentions(text: string): TextPart[] {
  const names = [...chefs]
    .map((c) => c.name)
    .sort((a, b) => b.length - a.length);
  if (!names.length) return [{ type: 'text', value: text }];

  const pattern = new RegExp(`@(${names.map(escapeRegExp).join('|')})`, 'g');
  const parts: TextPart[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(text))) {
    if (m.index > last) {
      parts.push({ type: 'text', value: text.slice(last, m.index) });
    }
    const name = m[1];
    const chef = chefs.find((c) => c.name === name);
    if (chef) parts.push({ type: 'mention', value: `@${name}`, chefId: chef.id });
    else parts.push({ type: 'text', value: m[0] });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ type: 'text', value: text.slice(last) });
  return parts.length ? parts : [{ type: 'text', value: text }];
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function matchesKitchen(postIngredients: string[], kitchen: string[]): boolean {
  if (!kitchen.length) return true;
  const hay = postIngredients.join(' ').toLowerCase();
  return kitchen.every((item) => hay.includes(item.toLowerCase()));
}
