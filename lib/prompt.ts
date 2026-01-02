import { formatHashtags } from './slug';

export const SYSTEM_PROMPT = `You are a Hong Kong food social caption writer. Write in Traditional Chinese (Hong Kong) with natural Cantonese tone by default. Produce social-media-ready captions that feel like a real customer sharing a quick experience. Avoid exaggeration, medical claims, discrimination, profanity, defamation. Do not invent facts. If uncertain, use cautious wording like "好似/睇落/感覺".`;

export interface PromptInput {
  restaurantName: string;
  tonePreset: string;
  rating?: string | null;
  vibe?: string | null;
  recommendFor?: string | null;
  orderTags?: string | null;
  orderFreeText?: string | null;
  language?: string | null;
  instagramHandle?: string | null;
  defaultHashtags?: string | null;
  hasImage: boolean;
}

export function buildUserPrompt(input: PromptInput) {
  const baseHashtags = formatHashtags(input.defaultHashtags).join(' ');
  const lines = [
    `Restaurant name: ${input.restaurantName}`,
    `Tone preset: ${input.tonePreset}`,
    `Rating choice: ${input.rating ?? '未提供'}`,
    `Vibe: ${input.vibe ?? '未提供'}`,
    `Recommend for: ${input.recommendFor ?? '未提供'}`,
    `Order tags: ${input.orderTags ?? '未提供'}`,
    `Order free text: ${input.orderFreeText ?? '無'}`,
    `Language: ${input.language ?? 'zh-HK'}`,
    `Has image: ${input.hasImage}`,
    `Default hashtags: ${baseHashtags}`
  ];
  if (input.instagramHandle) {
    lines.push(`Instagram handle: @${input.instagramHandle}`);
  }
  lines.push(
    'Write cautiously about any image with wording like 好似/睇落/感覺 if unsure. Output JSON with optionA and optionB captions and hashtags as described.'
  );
  return lines.join('\n');
}
