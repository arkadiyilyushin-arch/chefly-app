import type { FeedPost } from '@/data/mockData';

export const FEED_FILTERS = [
  { id: 'all', label: 'Все' },
  { id: 'быстро', label: 'Быстро' },
  { id: 'завтрак', label: 'Завтрак' },
  { id: 'ужин', label: 'Ужин' },
  { id: 'веган', label: 'Веган' },
  { id: 'выпечка', label: 'Выпечка' },
] as const;

export type FeedFilterId = (typeof FEED_FILTERS)[number]['id'];

export function postTags(post: FeedPost): string[] {
  const tags = [...(post.tags ?? [])];
  if (post.recipe && post.recipe.cookTimeMin <= 25 && !tags.includes('быстро')) {
    tags.push('быстро');
  }
  return tags;
}

export function matchesFilter(post: FeedPost, filter: FeedFilterId): boolean {
  if (filter === 'all') return true;
  if (filter === 'быстро') {
    return postTags(post).includes('быстро') || (post.recipe?.cookTimeMin ?? 999) <= 25;
  }
  return postTags(post).includes(filter);
}

export function rankForYou(
  posts: FeedPost[],
  opts: { preferredTags: string[]; seenIds: string[]; savedIds: string[] }
): FeedPost[] {
  const preferred = new Set(opts.preferredTags);
  const seen = new Set(opts.seenIds);
  const saved = new Set(opts.savedIds);

  return [...posts].sort((a, b) => score(b) - score(a));

  function score(p: FeedPost): number {
    let s = Math.log10((p.likesCount || 1) + 10);
    const tags = postTags(p);
    for (const t of tags) {
      if (preferred.has(t)) s += 3;
    }
    if (p.recipe) s += 1.2;
    if (p.isVideo) s += 0.6;
    if (saved.has(p.id)) s -= 4;
    if (seen.has(p.id)) s -= 2.5;
    if (p.liked) s -= 1;
    return s;
  }
}

export function mediaUrls(post: FeedPost): string[] {
  if (post.images?.length) return post.images;
  return post.image ? [post.image] : [];
}
