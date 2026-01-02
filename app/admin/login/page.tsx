'use client';

import { signIn } from 'next-auth/react';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [error, setError] = useState('');
  const router = useRouter();

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const password = form.get('password')?.toString() || '';
    const res = await signIn('credentials', {
      password,
      redirect: false
    });
    if (res?.error) {
      setError('密碼錯誤');
    } else {
      router.push('/admin');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-6 space-y-3">
      <h1 className="text-2xl font-bold">Admin Login</h1>
      <form onSubmit={submit} className="space-y-3">
        <input name="password" type="password" placeholder="Password" className="w-full border rounded-md px-3 py-2" />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="w-full bg-black text-white py-2 rounded-md">
          Login
        </button>
      </form>
    </div>
  );
}
