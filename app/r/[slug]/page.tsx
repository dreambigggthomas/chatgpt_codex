import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import QuickForm from './quick-form';

interface Props {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function RestaurantPage({ params, searchParams }: Props) {
  const restaurant = await prisma.restaurant.findUnique({ where: { slug: params.slug } });
  if (!restaurant) return notFound();
  const table = typeof searchParams.t === 'string' ? searchParams.t : undefined;
  const source = typeof searchParams.s === 'string' ? searchParams.s : 'qr';

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h1 className="text-2xl font-bold">{restaurant.name}</h1>
        <p className="text-sm text-gray-600 mt-1">掃完 QR 即刻分享，幫手打卡！</p>
      </div>
      <QuickForm restaurant={restaurant} table={table} source={source} />
    </div>
  );
}
