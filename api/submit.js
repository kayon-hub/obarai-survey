const NOTIFY = "hello@obarai.com";

function formatText(payload) {
  const d = payload.data || {};
  const rec = payload.recommendation || {};
  const ind = rec.industry || {};
  const c = d.contact || {};
  const lines = [
    "ORBIT 企業經營診斷 — 新填答",
    "────────────────────────",
    "送出時間：" + (payload.submittedAt || new Date().toISOString()),
    "",
    "【聯絡】",
    "公司：" + (c.company || "—"),
    "聯絡人：" + (c.name || "—"),
    "Email：" + (c.email || "—"),
    "電話：" + (c.phone || "—"),
    "",
    "【組織】",
    "產業：" + (ind.name || d.industryId || "—"),
    "人力：" + (d.headcount || "—") + " 人",
    "帳號數：" + (d.accounts || "—"),
    "據點：" + ((d.sites || []).join("、") || "—"),
    "導入：" + (d.rollout || "—"),
    "現有系統：" + (d.integration || "—"),
    "",
    "【建議】",
    "規模：" + (rec.scale ? rec.scale.label : "—"),
    "Phase 1：" + ((rec.phase1 || []).join("、") || "—"),
    "Phase 2：" + ((rec.phase2 || []).join("、") || "—"),
    "客製：" + ((rec.custom || []).join("、") || "—"),
    "",
    "【負責人補充】",
    d.note || "—",
    "",
    "【報價假設】",
    payload.assumptions || "—",
    "",
    "【完整 JSON】",
    JSON.stringify(payload, null, 2),
  ];
  return lines.join("\n");
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "method_not_allowed" });

  const key = process.env.RESEND_API_KEY;
  if (!key) return res.status(503).json({ ok: false, error: "mail_not_configured" });

  let payload = req.body;
  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload);
    } catch {
      return res.status(400).json({ ok: false, error: "invalid_json" });
    }
  }

  const company = payload?.data?.contact?.company || "未填公司";
  const industry = payload?.recommendation?.industry?.name || payload?.data?.industryId || "";
  const subject = "【ORBIT 診斷】" + company + (industry ? " · " + industry : "");

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "ORBIT <hello@obarai.com>",
      to: [NOTIFY],
      subject,
      text: formatText(payload),
    }),
  });

  if (!r.ok) {
    const err = await r.text();
    console.error("Resend error:", err);
    return res.status(502).json({ ok: false, error: "send_failed" });
  }

  return res.status(200).json({ ok: true });
}