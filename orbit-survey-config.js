/* ORBIT 企業經營診斷 — 產業變形與模組建議邏輯
 * 名詞對齊 ERP.POS/lib/industry-config.ts，並擴充物業／物流／製造 */
(function (global) {
  "use strict";

  var SCALE_BANDS = [
    { id: "L1", min: 2, max: 20, label: "精簡組織（2～20 人）" },
    { id: "L2", min: 21, max: 200, label: "成長型（21～200 人）" },
    { id: "L3", min: 201, max: 2000, label: "區域型（201～2,000 人）" },
    { id: "L4", min: 2001, max: 20000, label: "集團型（2,001～20,000 人）" },
    { id: "L5", min: 20001, max: Infinity, label: "企業型（20,000 人以上）" }
  ];

  var INDUSTRIES = {
    generic: {
      id: "generic",
      name: "一般／專業服務",
      erpKey: "generic",
      labels: {
        customer: "客戶",
        customers: "客戶管理",
        reservation: "預約",
        tableOrRoom: "資源",
        checkoutLabel: "結帳收款",
        inventory: "品項／資產",
        staff: "員工",
        order: "交易紀錄"
      },
      chains: [
        { id: "c1", text: "預約 → 服務 → 結帳 → 客戶紀錄" },
        { id: "c2", text: "客戶建檔 → 消費追蹤 → 通知提醒" },
        { id: "c3", text: "出勤打卡 → 請假 → 薪資試算" },
        { id: "c4", text: "庫存／採購 → 財務可視化" },
        { id: "c5", text: "多據點總覽 → 調撥／調人" }
      ]
    },
    hotel: {
      id: "hotel",
      name: "旅宿／民宿",
      erpKey: "hotel",
      labels: {
        customer: "房客",
        customers: "房客管理",
        reservation: "訂房",
        tableOrRoom: "房號",
        checkoutLabel: "退房結帳",
        inventory: "客房備品",
        staff: "房務／櫃檯",
        order: "消費紀錄"
      },
      chains: [
        { id: "c1", text: "訂房 → 入住 → 房務 → 退房結帳" },
        { id: "c2", text: "房客檔案 → 消費紀錄 → 回訪經營" },
        { id: "c3", text: "房務排班 → 出勤 → 任務派工" },
        { id: "c4", text: "備品庫存 → 採購 → 營運報表" },
        { id: "c5", text: "多館總覽 → 人力／備品調度" }
      ]
    },
    property: {
      id: "property",
      name: "社區／物業管理",
      erpKey: "generic",
      labels: {
        customer: "住戶",
        customers: "住戶管理",
        reservation: "公設預約",
        tableOrRoom: "公設／單位",
        checkoutLabel: "費用代收",
        inventory: "維修物料／備品",
        staff: "禮賓／保全",
        order: "服務紀錄"
      },
      chains: [
        { id: "c1", text: "公設預約 → 核准 → 通知住戶" },
        { id: "c2", text: "包裹代收 → 簽收 → 取件通知" },
        { id: "c3", text: "訪客登記 → 查核 → 放行紀錄" },
        { id: "c4", text: "報修受理 → 派工 → 結案追蹤" },
        { id: "c5", text: "多社區總覽 → 人員調度" }
      ]
    },
    logistics: {
      id: "logistics",
      name: "物流／倉儲",
      erpKey: "generic",
      labels: {
        customer: "客戶",
        customers: "客戶管理",
        reservation: "裝卸／會議預約",
        tableOrRoom: "月台／倉別",
        checkoutLabel: "出貨收款",
        inventory: "物料／庫存",
        staff: "倉務／調度",
        order: "出貨單"
      },
      chains: [
        { id: "c1", text: "採購 → 入倉 → 庫存更新" },
        { id: "c2", text: "調撥申請 → 核准 → 到貨確認" },
        { id: "c3", text: "盤點 → 差異校正 → 報表" },
        { id: "c4", text: "多倉總覽 → 低庫存警示" },
        { id: "c5", text: "出勤 → 排班 → 薪資" }
      ]
    },
    manufacturing: {
      id: "manufacturing",
      name: "製造／傳產",
      erpKey: "generic",
      labels: {
        customer: "客戶",
        customers: "客戶管理",
        reservation: "產線／會議預約",
        tableOrRoom: "產線／工站",
        checkoutLabel: "出貨結帳",
        inventory: "原料／成品",
        staff: "產線／倉務",
        order: "出貨紀錄"
      },
      chains: [
        { id: "c1", text: "採購 → 入庫 → 生產扣帳" },
        { id: "c2", text: "多倉調撥 → 盤點 → 差異報表" },
        { id: "c3", text: "財務總覽 → 毛利分析" },
        { id: "c4", text: "多廠總覽 → 調貨／調人" },
        { id: "c5", text: "出勤 → 請假 → 薪資" }
      ]
    },
    salon: {
      id: "salon",
      name: "美髮／美容",
      erpKey: "salon",
      labels: {
        customer: "客人",
        customers: "客人管理",
        reservation: "預約",
        tableOrRoom: "設計師",
        checkoutLabel: "收費作業",
        inventory: "耗材／產品",
        staff: "設計師／助理",
        order: "服務紀錄"
      },
      chains: [
        { id: "c1", text: "預約 → 服務 → 結帳 → 消費紀錄" },
        { id: "c2", text: "客戶回訪 → 通知提醒" },
        { id: "c3", text: "設計師排班 → 出勤" },
        { id: "c4", text: "庫存耗材 → 補貨提醒" },
        { id: "c5", text: "多門市總覽" }
      ]
    },
    tutoring: {
      id: "tutoring",
      name: "補教／教育",
      erpKey: "tutoring",
      labels: {
        customer: "學員",
        customers: "學員管理",
        reservation: "課程預約",
        tableOrRoom: "班級",
        checkoutLabel: "學費收取",
        inventory: "教材",
        staff: "教師／助教",
        order: "課程紀錄"
      },
      chains: [
        { id: "c1", text: "試聽預約 → 報名 → 繳費紀錄" },
        { id: "c2", text: "出缺勤 → 請假 → 家長通知" },
        { id: "c3", text: "排課 → 教師排班" },
        { id: "c4", text: "多分校總覽" },
        { id: "c5", text: "學員分級 → 回訪經營" }
      ]
    },
    medspa: {
      id: "medspa",
      name: "醫美／診所",
      erpKey: "medspa",
      labels: {
        customer: "會員",
        customers: "會員管理",
        reservation: "療程預約",
        tableOrRoom: "診間",
        checkoutLabel: "收費作業",
        inventory: "耗材／藥材",
        staff: "醫療人員／顧問",
        order: "療程紀錄"
      },
      chains: [
        { id: "c1", text: "預約 → 報到 → 療程 → 結帳" },
        { id: "c2", text: "療程紀錄 → 回診提醒" },
        { id: "c3", text: "候診通知 → 減少空等" },
        { id: "c4", text: "庫存耗材 → 採購" },
        { id: "c5", text: "多診所總覽" }
      ]
    },
    retail: {
      id: "retail",
      name: "零售／生活通路",
      erpKey: "retail",
      labels: {
        customer: "顧客",
        customers: "顧客管理",
        reservation: "門市預約服務",
        tableOrRoom: "櫃位",
        checkoutLabel: "櫃檯結帳",
        inventory: "商品庫存",
        staff: "店員／櫃檯",
        order: "銷售訂單"
      },
      chains: [
        { id: "c1", text: "銷售 → 庫存扣帳 → 會員累點" },
        { id: "c2", text: "採購 → 入庫 → 補貨警示" },
        { id: "c3", text: "多店庫存查詢 → 調撥" },
        { id: "c4", text: "退換貨授權 → 紀錄" },
        { id: "c5", text: "多店營收總覽" }
      ]
    },
    cafe: {
      id: "cafe",
      name: "餐飲",
      erpKey: "cafe",
      labels: {
        customer: "顧客",
        customers: "顧客管理",
        reservation: "訂位",
        tableOrRoom: "桌號",
        checkoutLabel: "結帳",
        inventory: "食材／耗材",
        staff: "服務人員",
        order: "訂單"
      },
      chains: [
        { id: "c1", text: "點餐 → 出餐 → 結帳" },
        { id: "c2", text: "訂位／候位 → 通知" },
        { id: "c3", text: "食材庫存 → 採購" },
        { id: "c4", text: "外送單接單 → 備餐 → 完成" },
        { id: "c5", text: "多分店業績總覽" }
      ]
    },
    mixed: {
      id: "mixed",
      name: "混合型",
      erpKey: "generic",
      labels: {
        customer: "客戶",
        customers: "客戶管理",
        reservation: "預約／排程",
        tableOrRoom: "資源",
        checkoutLabel: "結帳收款",
        inventory: "品項／資產",
        staff: "員工",
        order: "交易紀錄"
      },
      chains: [
        { id: "c1", text: "排程 → 服務 → 結帳 → 紀錄留存" },
        { id: "c2", text: "客戶／對象建檔 → 歷程追蹤" },
        { id: "c3", text: "庫存／資產 → 採購 → 報表" },
        { id: "c4", text: "多據點協作 → 總部可視化" },
        { id: "c5", text: "通知自動化 → 減少人工回覆" }
      ]
    }
  };

  var MODULES = [
    {
      id: "pos",
      tag: "ORBIT POS",
      name: "智慧收銀",
      baseline: true,
      hint: function (L) { return L.checkoutLabel + "與交易入帳"; },
      hide: function () { return false; }
    },
    {
      id: "rsvp",
      tag: "ORBIT RSVP",
      name: "預約與排程",
      hint: function (L) { return L.reservation + "與" + L.tableOrRoom + "管理"; },
      hide: function (ind) {
        return ind === "logistics" || ind === "manufacturing";
      }
    },
    {
      id: "crm",
      tag: "ORBIT CRM",
      name: "關係經營",
      baseline: true,
      hint: function (L) { return L.customers + "與" + L.spendRecord; },
      hide: function () { return false; }
    },
    {
      id: "erp",
      tag: "ORBIT ERP",
      name: "資源規劃",
      hint: function (L) { return L.inventory + "、採購與財務總覽"; },
      hide: function () { return false; }
    },
    {
      id: "hr",
      tag: "ORBIT HR",
      name: "人事考勤",
      hint: function (L) { return L.staff + "打卡、請假與薪資"; },
      hide: function () { return false; }
    },
    {
      id: "wms",
      tag: "ORBIT WMS",
      name: "倉儲管理",
      hint: function () { return "多倉庫存、盤點與調撥"; },
      hide: function (ind) {
        return ind === "salon" || ind === "tutoring" || ind === "medspa" || ind === "cafe";
      }
    },
    {
      id: "flow",
      tag: "ORBIT FLOW",
      name: "營運管理",
      hint: function () { return "多據點總覽、調貨與人員調度"; },
      hide: function (ind, ctx) {
        if (ctx.singleSite) return true;
        return false;
      }
    },
    {
      id: "line",
      tag: "ORBIT LINE",
      name: "LINE 整合",
      hint: function (L) { return "自動通知" + L.customer; },
      hide: function () { return false; }
    },
    {
      id: "auth",
      tag: "ORBIT AUTH",
      name: "權限管控",
      hint: function () { return "分權、授權碼與操作稽核"; },
      hide: function () { return false; }
    },
    {
      id: "ai",
      tag: "ORBIT AI",
      name: "智慧自動化",
      hint: function () { return "用對話查營運數字、回覆常見問題"; },
      hide: function () { return false; }
    },
    {
      id: "qr",
      tag: "ORBIT QR Shop",
      name: "掃碼商務",
      hint: function (L) { return L.customer + "自助下單（免登入）"; },
      hide: function (ind) {
        return ind !== "cafe" && ind !== "retail" && ind !== "mixed";
      }
    },
    {
      id: "pms",
      tag: "ORBIT PMS",
      name: "旅宿管理",
      custom: true,
      hint: function () { return "房態、訂房、房務一體"; },
      hide: function (ind) { return ind !== "hotel" && ind !== "mixed"; }
    },
    {
      id: "estate",
      tag: "ORBIT Estate",
      name: "豪宅管家",
      custom: true,
      hint: function () { return "公設、包裹、訪客、報修"; },
      hide: function (ind) { return ind !== "property" && ind !== "mixed"; }
    }
  ];

  var MODULE_MATURITY = {
    flow: "phase2",
    estate: "custom",
    auth: "partial"
  };

  function getScaleBand(headcount) {
    var n = parseInt(headcount, 10) || 2;
    for (var i = 0; i < SCALE_BANDS.length; i++) {
      if (n >= SCALE_BANDS[i].min && n <= SCALE_BANDS[i].max) return SCALE_BANDS[i];
    }
    return SCALE_BANDS[0];
  }

  function getIndustry(id) {
    return INDUSTRIES[id] || INDUSTRIES.generic;
  }

  function getVisibleModules(industryId, ctx) {
    return MODULES.filter(function (m) {
      return !m.hide(industryId, ctx || {});
    });
  }

  function modulePhase(score, scaleId, custom) {
    if (custom) return "專案洽談";
    if (score >= 5) return "Phase 1";
    if (score === 4) return scaleId === "L1" || scaleId === "L2" ? "Phase 1" : "Phase 2";
    if (score === 3) return "Phase 2";
    return "暫不建議";
  }

  function buildRecommendation(input) {
    var industry = getIndustry(input.industryId);
    var scale = getScaleBand(input.headcount);
    var sites = input.sites || [];
    var singleSite = sites.indexOf("single") >= 0 && sites.indexOf("multi2") < 0 && sites.indexOf("multi11") < 0 && sites.indexOf("multi51") < 0;
    var hasWarehouse = sites.indexOf("warehouse") >= 0 || sites.indexOf("multiwh") >= 0;
    var ctx = { singleSite: singleSite, hasWarehouse: hasWarehouse };
    var scores = input.moduleScores || {};
    var visible = getVisibleModules(input.industryId, ctx);
    var rows = [];
    var phase1 = [];
    var phase2 = [];
    var custom = [];
    var skip = [];

    visible.forEach(function (m) {
      var s = parseInt(scores[m.id], 10) || 0;
      if (s <= 0) return;
      var phase = modulePhase(s, scale.id, m.custom);
      var maturity = MODULE_MATURITY[m.id];
      var note = "";
      if (m.custom) note = "客製報價";
      else if (maturity === "phase2") note = "建議第二階段評估";
      else if (maturity === "partial") note = "核心分權可用";
      if (m.baseline && s >= 3) note = (note ? note + "；" : "") + "基礎方案已含";

      var row = {
        id: m.id,
        tag: m.tag,
        name: m.name,
        score: s,
        phase: phase,
        inYourWords: m.hint(industry.labels),
        note: note
      };
      rows.push(row);
      if (phase === "Phase 1") phase1.push(m.tag);
      else if (phase === "Phase 2") phase2.push(m.tag);
      else if (phase === "專案洽談") custom.push(m.tag);
      else if (phase === "暫不建議") skip.push(m.tag);
    });

    if (!singleSite && (parseInt(scores.erp, 10) >= 3 || parseInt(scores.wms, 10) >= 3) && scores.flow === undefined) {
      var flowMod = MODULES.filter(function (x) { return x.id === "flow"; })[0];
      if (flowMod && !flowMod.hide(input.industryId, ctx)) {
        rows.push({
          id: "flow",
          tag: flowMod.tag,
          name: flowMod.name,
          score: 4,
          phase: "Phase 2",
          inYourWords: flowMod.hint(industry.labels),
          note: "依多據點／庫存需求自動建議"
        });
        phase2.push(flowMod.tag);
      }
    }

    rows.sort(function (a, b) {
      var order = { "Phase 1": 0, "Phase 2": 1, "專案洽談": 2, "暫不建議": 3 };
      return (order[a.phase] - order[b.phase]) || (b.score - a.score);
    });

    var chains = industry.chains.filter(function (c) {
      return (input.priorityChains || []).indexOf(c.id) >= 0;
    });

    return {
      industry: industry,
      scale: scale,
      ctx: ctx,
      rows: rows,
      phase1: phase1,
      phase2: phase2,
      custom: custom,
      skip: skip,
      priorityChains: chains,
      quoteAssumptions: {
        headcount: input.headcount,
        accounts: input.accounts || "",
        industry: industry.name,
        scale: scale.label,
        sites: sites,
        rollout: input.rollout || "",
        integration: input.integration || "",
        phase1Modules: phase1,
        phase2Modules: phase2,
        customModules: custom,
        contact: input.contact || {}
      }
    };
  }

  global.ORBIT_SURVEY = {
    INDUSTRIES: INDUSTRIES,
    MODULES: MODULES,
    SCALE_BANDS: SCALE_BANDS,
    getIndustry: getIndustry,
    getVisibleModules: getVisibleModules,
    getScaleBand: getScaleBand,
    buildRecommendation: buildRecommendation
  };
})(typeof window !== "undefined" ? window : global);