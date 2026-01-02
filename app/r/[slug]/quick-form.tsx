'use client';

import { useEffect, useMemo, useState } from 'react';
import { Restaurant } from '@prisma/client';
import Image from 'next/image';

interface Props {
  restaurant: Restaurant;
  table?: string;
  source?: string;
}

interface GenerationResult {
  optionA: { caption: string; hashtags: string[] };
  optionB: { caption: string; hashtags: string[] };
}

const vibes = ['舒服', '精緻', 'Casual', '親子', '快速午餐'];
const recommends = ['拍拖', '朋友', '家人', '商務午餐'];
const ratings = [
  { value: '😍 超鍾意', label: '😍 超鍾意' },
  { value: '😊 幾好', label: '😊 幾好' },
  { value: '😐 一般', label: '😐 一般' }
];

export default function QuickForm({ restaurant, table, source }: Props) {
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [rating, setRating] = useState(ratings[0].value);
  const [vibe, setVibe] = useState<string | undefined>('舒服');
  const [recommendFor, setRecommendFor] = useState<string | undefined>('朋友');
  const [orderTags, setOrderTags] = useState('');
  const [orderFreeText, setOrderFreeText] = useState('');
  const [language, setLanguage] = useState('zh-HK');
  const [toneChoice, setToneChoice] = useState(restaurant.tonePreset);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const start = async () => {
      const res = await fetch('/api/session/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: restaurant.slug, table, source })
      });
      if (res.ok) {
        const data = await res.json();
        setSessionId(data.sessionId);
      }
    };
    start();
  }, [restaurant.slug, source, table]);

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const shareText = async (text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (e) {
        console.error(e);
      }
    } else {
      copyText(text);
      alert('已複製，可直接貼上社交平台');
    }
  };

  const handleImage = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const captions = useMemo(() => {
    if (!result) return [];
    return [
      { label: 'Option A', caption: result.optionA.caption, hashtags: result.optionA.hashtags },
      { label: 'Option B', caption: result.optionB.caption, hashtags: result.optionB.hashtags }
    ];
  }, [result]);

  const onGenerate = async () => {
    if (!sessionId) {
      setError('未能建立 session，請稍後再試');
      return;
    }
    setError(null);
    setLoading(true);
    const form = new FormData();
    form.append('restaurantId', String(restaurant.id));
    form.append('sessionId', String(sessionId));
    form.append('rating', rating);
    if (vibe) form.append('vibe', vibe);
    if (recommendFor) form.append('recommendFor', recommendFor);
    form.append('orderTags', orderTags);
    form.append('orderFreeText', orderFreeText);
    form.append('language', language);
    form.append('toneChoice', toneChoice);
    if (imageFile) form.append('image', imageFile);

    const res = await fetch('/api/generate', {
      method: 'POST',
      body: form
    });

    if (res.ok) {
      const data = await res.json();
      setResult(data);
    } else {
      const err = await res.json().catch(() => ({ error: '出現問題' }));
      setError(err.error || '出現問題');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4 bg-white rounded-lg shadow-sm p-4">
      <div className="flex flex-col gap-2">
        <label className="font-semibold">影相 / 上載</label>
        <div className="flex gap-2">
          <label className="flex-1 bg-gray-100 rounded-md p-3 text-center cursor-pointer">
            📸 即刻影相
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => handleImage(e.target.files?.[0] || null)}
            />
          </label>
          <label className="flex-1 bg-gray-100 rounded-md p-3 text-center cursor-pointer">
            ⬆️ 上載相片
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImage(e.target.files?.[0] || null)}
            />
          </label>
        </div>
        {preview && (
          <div className="relative h-52 w-full overflow-hidden rounded-md">
            <Image src={preview} alt="預覽" fill className="object-cover" />
          </div>
        )}
        <p className="text-xs text-gray-500">上載相片代表你有權分享呢張相。</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <div>
          <p className="font-semibold mb-1">滿意度</p>
          <div className="flex gap-2">
            {ratings.map((r) => (
              <button
                key={r.value}
                className={`px-3 py-2 rounded-full border ${rating === r.value ? 'bg-black text-white' : 'bg-white'}`}
                onClick={() => setRating(r.value)}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="font-semibold mb-1">氣氛</p>
          <div className="flex gap-2 flex-wrap">
            {vibes.map((v) => (
              <button
                key={v}
                className={`px-3 py-2 rounded-full border ${vibe === v ? 'bg-black text-white' : 'bg-white'}`}
                onClick={() => setVibe(v)}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="font-semibold mb-1">推介俾</p>
          <div className="flex gap-2 flex-wrap">
            {recommends.map((v) => (
              <button
                key={v}
                className={`px-3 py-2 rounded-full border ${recommendFor === v ? 'bg-black text-white' : 'bg-white'}`}
                onClick={() => setRecommendFor(v)}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="font-semibold">你食咗咩? (可輸入)</label>
          <input
            className="w-full border rounded-md px-3 py-2"
            placeholder="例：叉燒飯、手打咖啡"
            value={orderTags}
            onChange={(e) => setOrderTags(e.target.value)}
          />
          <textarea
            className="w-full border rounded-md px-3 py-2"
            placeholder="自由補充"
            value={orderFreeText}
            onChange={(e) => setOrderFreeText(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-semibold mb-1 block">文案語言</label>
            <select
              className="w-full border rounded-md px-3 py-2"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="zh-HK">繁體中文（香港）</option>
              <option value="en">English</option>
            </select>
          </div>
          <div>
            <label className="font-semibold mb-1 block">口吻</label>
            <select
              className="w-full border rounded-md px-3 py-2"
              value={toneChoice}
              onChange={(e) => setToneChoice(e.target.value)}
            >
              <option value="港式貼地">港式貼地</option>
              <option value="比較正經">比較正經</option>
              <option value="Foodie認真">Foodie 認真</option>
              <option value="搞鬼得意">搞鬼得意</option>
            </select>
          </div>
        </div>
      </div>

      <button
        className="w-full bg-black text-white py-3 rounded-md text-lg"
        disabled={loading}
        onClick={onGenerate}
      >
        {loading ? '生成緊...' : '生成文案'}
      </button>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {captions.length > 0 && (
        <div className="space-y-3">
          <p className="font-semibold">生成結果</p>
          {captions.map((c) => (
            <div key={c.label} className="border rounded-md p-3 bg-gray-50">
              <p className="text-sm text-gray-500 mb-1">{c.label}</p>
              <pre className="whitespace-pre-wrap text-sm leading-relaxed">{c.caption}</pre>
              <p className="text-sm text-gray-700 mt-1">{c.hashtags.join(' ')}</p>
              <div className="flex gap-2 mt-2">
                <button
                  className="px-3 py-2 rounded-md border"
                  onClick={() => copyText(`${c.caption}\n${c.hashtags.join(' ')}`)}
                >
                  複製
                </button>
                <button
                  className="px-3 py-2 rounded-md border"
                  onClick={() => shareText(`${c.caption}\n${c.hashtags.join(' ')}`)}
                >
                  Share
                </button>
              </div>
            </div>
          ))}
          {restaurant.googleReviewUrl && (
            <div className="text-sm text-gray-700">
              想幫吓間店？
              <a className="text-blue-600 underline ml-1" href={restaurant.googleReviewUrl} target="_blank" rel="noreferrer">
                留個 Google Review 🙏
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
