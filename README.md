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

## Quick preview (English)
If you just want to see the screens quickly, follow these steps:

1. Copy env file: `cp .env.example .env` and set at least `ADMIN_PASSWORD`; add `OPENAI_API_KEY` if you want real AI output.
2. Install deps: `npm install`.
3. Set up DB: `npx prisma migrate dev` (creates `dev.db` in `prisma`).
4. Seed sample restaurant (recommended): `npx ts-node scripts/seed.ts`.
5. Run dev server: `npm run dev`.
6. Open customer flow at `http://localhost:3000/r/demo-restaurant` to view the photo/upload + quick-pick UI.
7. Open admin at `http://localhost:3000/admin/login` and sign in with your `ADMIN_PASSWORD` to manage restaurants / QR codes.

## 安裝 & 運行（超詳細步驟）
1. 安裝 Node.js 18+（推介用 nvm）。
2. 於專案根目錄複製環境檔：`cp .env.example .env`，填好 `OPENAI_API_KEY`（沒有亦可，會用 fallback 文案）、`ADMIN_PASSWORD`、`NEXTAUTH_SECRET`。
3. 安裝依賴：`npm install`。
4. 初始化資料庫：`npx prisma migrate dev`（會在 `prisma` 資料夾生成 `dev.db`）。
5. 建立示範餐廳（可選但建議）：`npx ts-node scripts/seed.ts`。
6. 本地啟動：`npm run dev`，然後開瀏覽器到 `http://localhost:3000/r/demo-restaurant` 體驗客戶流程。
7. Admin 登入：`http://localhost:3000/admin/login`，用你設定的 `ADMIN_PASSWORD`，可在後台建立 QR code、管理餐廳資料。
8. 測試：`npm run test`（使用 Vitest，涵蓋 slug 驗證及 /api/generate 基本驗證）。
9. （可選）程式碼檢查：`npm run lint`。

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

## GitHub Actions 持續整合
Repo 內已附 `CI` 工作流程（`.github/workflows/ci.yml`）：

1. 把程式推上 GitHub，進入 repo 的 **Actions** 分頁，確保 workflow 已啟用。
2. 預設使用 Node.js 18，會執行：
   - `npm install`
   - `npm run lint`
   - `npm run test`
3. 如需使用真實 OpenAI key（非必須，因測試僅做驗證），可在 GitHub repo 設定 **Settings → Secrets and variables → Actions** 加入：
   - `OPENAI_API_KEY`
   - （如有需要）自訂 `ADMIN_PASSWORD`、`NEXTAUTH_SECRET`；不設定則使用 workflow 內的安全預設值。
4. Workflow 會在 `pull_request` 及 `push` 觸發，確保基本驗證通過後才合併。
