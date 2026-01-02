'use client';

import { Restaurant } from '@prisma/client';
import { useState } from 'react';
import { createRestaurant, updateRestaurant } from './actions';

export default function RestaurantForm({ restaurant }: { restaurant?: Restaurant }) {
  const [message, setMessage] = useState('');

  const onSubmit = async (formData: FormData) => {
    try {
      if (restaurant) {
        await updateRestaurant(restaurant.id, formData);
        setMessage('已更新');
      } else {
        await createRestaurant(formData);
        setMessage('已建立');
      }
    } catch (e: any) {
      setMessage('出現問題，請檢查輸入');
    }
  };

  return (
    <form action={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="space-y-1">
          <span className="text-sm">名稱</span>
          <input
            name="name"
            defaultValue={restaurant?.name}
            className="w-full border rounded-md px-3 py-2"
            required
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm">Slug</span>
          <input
            name="slug"
            pattern="[a-z0-9-]+"
            defaultValue={restaurant?.slug}
            className="w-full border rounded-md px-3 py-2"
            required
          />
        </label>
      </div>
      <label className="space-y-1">
        <span className="text-sm">地址（可選）</span>
        <input name="address" defaultValue={restaurant?.address || ''} className="w-full border rounded-md px-3 py-2" />
      </label>
      <label className="space-y-1">
        <span className="text-sm">Google Review 連結</span>
        <input
          name="googleReviewUrl"
          defaultValue={restaurant?.googleReviewUrl || ''}
          className="w-full border rounded-md px-3 py-2"
        />
      </label>
      <label className="space-y-1">
        <span className="text-sm">IG Handle</span>
        <input
          name="instagramHandle"
          defaultValue={restaurant?.instagramHandle || ''}
          className="w-full border rounded-md px-3 py-2"
        />
      </label>
      <label className="space-y-1">
        <span className="text-sm">預設 Hashtags (逗號分隔)</span>
        <input
          name="defaultHashtags"
          defaultValue={restaurant?.defaultHashtags || ''}
          className="w-full border rounded-md px-3 py-2"
        />
      </label>
      <label className="space-y-1">
        <span className="text-sm">Tone</span>
        <select name="tonePreset" defaultValue={restaurant?.tonePreset || '港式貼地'} className="w-full border rounded-md px-3 py-2">
          <option value="港式貼地">港式貼地</option>
          <option value="比較正經">比較正經</option>
          <option value="Foodie認真">Foodie 認真</option>
          <option value="搞鬼得意">搞鬼得意</option>
        </select>
      </label>
      <div className="col-span-2 flex items-center gap-2">
        <button type="submit" className="bg-black text-white px-4 py-2 rounded-md">
          {restaurant ? '更新' : '新增'}
        </button>
        {message && <p className="text-sm text-green-700">{message}</p>}
      </div>
    </form>
  );
}
