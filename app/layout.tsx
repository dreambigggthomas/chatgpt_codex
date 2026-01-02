import './globals.css';
import { ReactNode } from 'react';
import SessionWrapper from '../components/session-provider';

export const metadata = {
  title: 'QuickBite Review',
  description: '快速生成食店分享文案'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-HK">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <SessionWrapper>
          <div className="max-w-3xl mx-auto p-4">{children}</div>
        </SessionWrapper>
      </body>
    </html>
  );
}
