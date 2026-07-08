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

客戶填完建議書後，系統會自動 POST 至 `/api/submit`，經 **Resend** 寄到 **hello@obarai.com**。

- Vercel 專案需設定環境變數 `RESEND_API_KEY`（與 ERP.POS 相同）
- 備援：`survey-mailer.gs` 部署後將網址填入 `survey-endpoint.js`

## 本機預覽

```bash
npx serve . -p 3456
# http://localhost:3456/
```