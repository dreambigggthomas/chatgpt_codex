import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isCleanInput } from '@/lib/moderation';
import { buildUserPrompt, SYSTEM_PROMPT } from '@/lib/prompt';
import { rateLimit } from '@/lib/rateLimit';
import { formatHashtags } from '@/lib/slug';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export function validateGeneratePayload(formData: FormData) {
  const restaurantId = Number(formData.get('restaurantId'));
  const sessionId = Number(formData.get('sessionId'));
  return Boolean(restaurantId && sessionId);
}

async function saveImage(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadsDir, { recursive: true });
  const filename = `${uuidv4()}-${file.name.replace(/\s+/g, '-')}`;
  const filepath = path.join(uploadsDir, filename);
  await fs.writeFile(filepath, buffer);
  return `/uploads/${filename}`;
}

async function callModel(prompt: string, imageData?: Buffer) {
  if (!process.env.OPENAI_API_KEY) {
    return {
      optionA: { caption: '示範文案：好味又貼地，值得再嚟！', hashtags: ['#demo', '#quickbite'] },
      optionB: { caption: '另一個示範文案：氣氛舒服，bookmark 定先。', hashtags: ['#sample', '#hkfoodie'] }
    };
  }

  const response = await openai.responses.create({
    model: imageData ? 'gpt-4o-mini' : 'gpt-4o-mini',
    input: [
      { type: 'text', text: SYSTEM_PROMPT, role: 'system' as const },
      imageData
        ? { type: 'input_image', image_url: { url: `data:image/jpeg;base64,${imageData.toString('base64')}` } }
        : undefined,
      { type: 'text', text: prompt }
    ].filter(Boolean) as any
  });

  const text = response.output_text || '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  throw new Error('Invalid AI response');
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'local';
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
  const formData = await req.formData();
  const restaurantId = Number(formData.get('restaurantId'));
  const sessionId = Number(formData.get('sessionId'));
  const rating = formData.get('rating')?.toString();
  const vibe = formData.get('vibe')?.toString();
  const recommendFor = formData.get('recommendFor')?.toString();
  const orderTags = formData.get('orderTags')?.toString();
  const orderFreeText = formData.get('orderFreeText')?.toString();
  const language = formData.get('language')?.toString() || 'zh-HK';
  const toneChoice = formData.get('toneChoice')?.toString() || '港式貼地';
  const image = formData.get('image');

  if (!validateGeneratePayload(formData)) {
    return NextResponse.json({ error: 'missing data' }, { status: 400 });
  }

  if (!isCleanInput(orderTags) || !isCleanInput(orderFreeText)) {
    return NextResponse.json({ error: '內容包含受限制字眼' }, { status: 400 });
  }

  const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
  if (!restaurant) return NextResponse.json({ error: '餐廳未找到' }, { status: 404 });

  let imagePath: string | undefined;
  let imageBuffer: Buffer | undefined;
  if (image instanceof File) {
    imagePath = await saveImage(image);
    imageBuffer = Buffer.from(await image.arrayBuffer());
  }

  const prompt = buildUserPrompt({
    restaurantName: restaurant.name,
    tonePreset: toneChoice,
    rating,
    vibe,
    recommendFor,
    orderTags,
    orderFreeText,
    language,
    instagramHandle: restaurant.instagramHandle,
    defaultHashtags: restaurant.defaultHashtags,
    hasImage: Boolean(imagePath)
  });

  try {
    const aiResult = await callModel(prompt, imageBuffer);
    const hashtags = aiResult.optionA.hashtags || [];
    const mergedHashtags = hashtags.length ? hashtags : formatHashtags(restaurant.defaultHashtags);
    const stored = await prisma.generation.create({
      data: {
        sessionId,
        restaurantId,
        rating,
        vibe,
        recommendFor,
        orderTags,
        orderFreeText,
        language,
        toneChoice,
        hasImage: Boolean(imagePath),
        captionA: aiResult.optionA.caption,
        captionB: aiResult.optionB.caption,
        hashtags: (mergedHashtags || []).join(', '),
        imagePath
      }
    });
    return NextResponse.json({
      optionA: aiResult.optionA,
      optionB: aiResult.optionB,
      id: stored.id
    });
  } catch (error: any) {
    console.error('generate error', error);
    return NextResponse.json({ error: '生成失敗，請稍後再試' }, { status: 500 });
  }
}
