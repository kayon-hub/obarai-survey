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

在 `obarai.com`  zone 新增：

| 類型 | 名稱 | 內容 | Proxy |
|------|------|------|-------|
| `CNAME` | `survey` | `cname.vercel-dns.com` | DNS only（灰雲）建議 |

若 Vercel 後台顯示 `A` 記錄，則改為：`A` · `survey` · `76.76.21.21`

## 本機預覽

```bash
npx serve . -p 3456
# http://localhost:3456/
```