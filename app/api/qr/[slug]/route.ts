import { NextRequest } from 'next/server';
import QRCode from 'qrcode';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const restaurant = await prisma.restaurant.findUnique({ where: { slug: params.slug } });
  if (!restaurant) return new Response('Not found', { status: 404 });
  const { searchParams } = new URL(req.url);
  const baseUrl = `${req.nextUrl.protocol}//${req.nextUrl.host}`;
  const t = searchParams.get('t');
  const url = `${baseUrl}/r/${restaurant.slug}${t ? `?t=${t}` : ''}`;
  const png = await QRCode.toBuffer(url);
  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': 'inline; filename="qr.png"'
    }
  });
}
