const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidSlug(slug: string): boolean {
  return slugRegex.test(slug);
}

export function formatHashtags(defaultHashtags?: string | null) {
  if (!defaultHashtags) return [] as string[];
  return defaultHashtags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
    .map((tag) => (tag.startsWith('#') ? tag : `#${tag}`));
}
