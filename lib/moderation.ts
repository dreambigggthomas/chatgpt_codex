const blocked = ['hate', 'violence', 'terror'];

export function isCleanInput(text?: string | null) {
  if (!text) return true;
  const lower = text.toLowerCase();
  return !blocked.some((w) => lower.includes(w));
}
