import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isValidSlug } from '@/lib/slug';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { slug, table, source, locale } = body;
  if (!slug || !isValidSlug(slug)) {
    return NextResponse.json({ error: 'invalid slug' }, { status: 400 });
  }
  const restaurant = await prisma.restaurant.findUnique({ where: { slug } });
  if (!restaurant) return NextResponse.json({ error: 'not found' }, { status: 404 });
  const session = await prisma.session.create({
    data: {
      restaurantId: restaurant.id,
      table,
      source: source || 'qr',
      userAgent: req.headers.get('user-agent') || undefined,
      locale: locale || 'zh-HK'
    }
  });
  return NextResponse.json({ sessionId: session.id });
}
