# QuickBite Review

MVP web app for餐廳食客，用手機掃 QR 即刻生成廣東話繁中文案，方便分享社交平台。

## 功能
- 客戶掃 QR 進入 `/r/[slug]` 流程，影相/上載、快速按鈕、選語言/口吻，一鍵生成兩個文案選項＋ hashtags。
- 文案風格：香港廣東話、自然貼地，遵從安全提示，不胡亂猜測相片內容（使用好似/睇落）。
- OpenAI Responses API（如無 API key 會用 fallback demo 文案）。
- 圖片本地存 `/public/uploads`（可改用 S3）。
- Admin 簡易密碼登入，建立/更新餐廳資料、下載 QR code。
- Prisma + SQLite 數據表：Restaurant、Session、Generation。
- 基本 rate limit、簡易 blocklist 過濾。

## 環境變數
複製 `.env.example`：
```
DATABASE_URL="file:./dev.db"
OPENAI_API_KEY="你的key"  # 沒有亦可，會用示範文案
ADMIN_PASSWORD="自訂管理密碼"
NEXTAUTH_SECRET="隨機字串"
```

## 安裝 & 運行
1. `npm install`
2. `npx prisma migrate dev`（建立 SQLite）
3. `npm run dev`
4. （可選）`npm run test`

## 建立示範餐廳
```
npx ts-node scripts/seed.ts
```
建立 slug 為 `demo-restaurant` 的示範餐廳，直接瀏覽 `/r/demo-restaurant`。

## 開發筆記
- 圖片存本地，未有 EXIF 清除，如需請加處理。改用 S3 可在 `saveImage` 改寫。
- 生成 API：`POST /api/generate`（multipart form），保存選項和生成內容。
- Session API：`POST /api/session/start` 用於統計來源。
- QR code：`GET /api/qr/[slug]` 返回 PNG。
- Admin 密碼登入，Creds provider，登入頁 `/admin/login`。

## 測試
- `tests/slug.test.ts`：slug 驗證。
- `tests/generate-route.test.ts`：/api/generate 缺少必要欄位時回 400。
