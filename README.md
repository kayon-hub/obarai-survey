# obarai-survey

ORBIT 企業經營診斷問卷——依產業變形產出模組分階段建議書。

- 部署：Vercel 靜態站
- 網域：`survey.obarai.com`

## 檔案

| 檔案 | 說明 |
|------|------|
| `index.html` | 問卷與建議書 UI |
| `orbit-survey-config.js` | 產業名詞變形、模組建議邏輯 |

## DNS（Cloudflare）

在 `obarai.com` zone 新增一筆（Vercel 建議）：

| 類型 | 名稱 | 內容 | Proxy |
|------|------|------|-------|
| `A` | `survey` | `76.76.21.21` | DNS only（灰雲）|

部署後網址：https://survey.obarai.com

暫時可用：https://obarai-survey.vercel.app

## 填答寄信

客戶填完建議書後，會依序嘗試寄到 **hello@obarai.com**：

1. Vercel `/api/submit`（Resend，需有效的 `RESEND_API_KEY`）
2. FormSubmit.co（瀏覽器端備援，首次可能需到信箱點啟用連結）
3. Google Apps Script（`survey-mailer.gs` 部署後填入 `survey-endpoint.js`）

**建議**：到 [Resend](https://resend.com) 確認 API Key 仍有效，並更新 Vercel `obarai-survey` 的 `RESEND_API_KEY`。

## 本機預覽

```bash
npx serve . -p 3456
# http://localhost:3456/
```