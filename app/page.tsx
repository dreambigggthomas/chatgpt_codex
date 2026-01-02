import Link from 'next/link';

export default function Home() {
  return (
    <main className="space-y-4">
      <h1 className="text-3xl font-bold">QuickBite Review</h1>
      <p className="text-gray-700">掃 QR 即刻生成貼地美食分享，幫餐廳快速出圈。</p>
      <div className="bg-white shadow-sm rounded-lg p-4 space-y-3">
        <p>示範餐廳：</p>
        <Link className="text-blue-600 underline" href="/r/demo-restaurant">
          /r/demo-restaurant
        </Link>
      </div>
      <Link
        href="/admin"
        className="inline-flex items-center rounded-md bg-black text-white px-4 py-2"
      >
        Admin Panel
      </Link>
    </main>
  );
}
