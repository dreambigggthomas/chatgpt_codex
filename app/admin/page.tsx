import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/authOptions';
import Link from 'next/link';
import RestaurantForm from './restaurant-form';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const restaurants = await prisma.restaurant.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">餐廳管理</h1>
        <Link className="text-blue-600 underline" href="/">回到首頁</Link>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h2 className="font-semibold mb-2">新增餐廳</h2>
        <RestaurantForm />
      </div>
      <div className="space-y-3">
        {restaurants.map((r) => (
          <div key={r.id} className="bg-white p-4 rounded-lg shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{r.name}</p>
                <p className="text-sm text-gray-600">/{r.slug}</p>
              </div>
              <Link className="text-blue-600 underline" href={`/r/${r.slug}`}>
                客戶頁面
              </Link>
            </div>
            <RestaurantForm restaurant={r} />
            <div className="text-sm text-gray-700">
              QR Code: <Link className="text-blue-600 underline" href={`/api/qr/${r.slug}`}>
                下載
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
