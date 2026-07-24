(() => {
  "use strict";

  const config = window.STOCK_CONFIG || {};
  // config.js가 브라우저 캐시에 남아도 API가 연결되도록 최종 주소를 한 번 더 보관합니다.
  const FALLBACK_API_URL = "https://script.google.com/macros/s/AKfycby0zG_ilwjf0WNeLthdNHyaX8SmuYMp89O44eGPIVPBIgaJMezLrWFC0N7UCDa4aQEH/exec";
  const params = new URLSearchParams(location.search);
  const storeCode = params.get("store") || config.DEFAULT_STORE_CODE || "851";

  const CATALOG = {
    phones: [
      {
        model: "Galaxy Z Flip8",
        image: "./assets/flip8.png?v=6",
        accent: "#ae67ff",
        accentRgb: "174, 103, 255",
        variants: [
          { itemCode: "696801", color: "핑크", swatch: "#ebbecf" },
          { itemCode: "696802", color: "그라파이트", swatch: "#44464c" },
          { itemCode: "696803", color: "크림", swatch: "#f0e9d8" }
        ]
      },
      {
        model: "Galaxy Z Fold8",
        image: "./assets/fold8.png?v=6",
        accent: "#479aff",
        accentRgb: "71, 154, 255",
        variants: [
          { itemCode: "696804", color: "라벤더", swatch: "#b8a4da" },
          { itemCode: "696805", color: "그라파이트", swatch: "#44464c" },
          { itemCode: "696806", color: "크림", swatch: "#f0e9d8" }
        ]
      },
      {
        model: "Galaxy Z Fold8 Ultra",
        image: "./assets/fold8-ultra.png?v=6",
        accent: "#f26395",
        accentRgb: "242, 99, 149",
        variants: [
          { itemCode: "696807", color: "그라파이트", swatch: "#44464c" },
          { itemCode: "696808", color: "바이올렛", swatch: "#7858a5" },
          { itemCode: "696809", color: "크림", swatch: "#f0e9d8" }
        ]
      }
    ],
    watches: [
      {
        model: "Galaxy Watch9 40mm",
        image: "./assets/watch9-40.png?v=6",
        accent: "#479aff",
        accentRgb: "71, 154, 255",
        variants: [
          { itemCode: "696911", color: "그라파이트", swatch: "#44464c" },
          { itemCode: "696912", color: "크림", swatch: "#f0e9d8" }
        ]
      },
      {
        model: "Galaxy Watch9 44mm",
        image: "./assets/watch9-44.png?v=6",
        accent: "#ae67ff",
        accentRgb: "174, 103, 255",
        variants: [
          { itemCode: "696913", color: "그라파이트", swatch: "#44464c" },
          { itemCode: "696914", color: "실버", swatch: "#c2c6cc" }
        ]
      },
      {
        model: "Galaxy Watch Ultra2",
        image: "./assets/watch-ultra2.png?v=6",
        accent: "#ff9e36",
        accentRgb: "255, 158, 54",
        variants: [
          { itemCode: "696915", color: "블랙", swatch: "#17171a" },
          { itemCode: "696916", color: "화이트", swatch: "#f2f2f0" }
        ]
      }
    ]
  };

  const DEMO_DATA = {
    ok: true,
    store_code: "851",
    store_name: "코스트코 대구점",
    updated_at: "화면 확인용 데모",
    items: [
      { item_code: "696801", quantity: 3 },
      { item_code: "696802", quantity: 2 },
      { item_code: "696803", quantity: 4 },
      { item_code: "696804", quantity: 2 },
      { item_code: "696805", quantity: 2 },
      { item_code: "696806", quantity: 1 },
      { item_code: "696807", quantity: 1 },
      { item_code: "696808", quantity: 1 },
      { item_code: "696809", quantity: 0 },
      { item_code: "696911", quantity: 2 },
      { item_code: "696912", quantity: 3 },
      { item_code: "696913", quantity: 2 },
      { item_code: "696914", quantity: 2 },
      { item_code: "696915", quantity: 1 },
      { item_code: "696916", quantity: 1 }
    ]
  };

  const phoneGrid = document.getElementById("phoneGrid");
  const watchGrid = document.getElementById("watchGrid");
  const storeNameEl = document.getElementById("storeName");
  const updatedAtEl = document.getElementById("updatedAt");
  const liveBadge = document.getElementById("liveBadge");
  const liveText = document.getElementById("liveText");

  function applyLayout() {
    document.body.classList.remove("layout-landscape", "layout-portrait");

    const isPortrait =
      window.matchMedia("(orientation: portrait)").matches ||
      document.documentElement.clientHeight > document.documentElement.clientWidth;

    document.body.classList.add(
      isPortrait ? "layout-portrait" : "layout-landscape"
    );
  }

  function quantityMap(payload) {
    const map = new Map();
    for (const item of payload.items || []) {
      const code = String(item.item_code ?? item.itemCode ?? "").trim();
      const qty = Number(item.quantity ?? 0);
      map.set(code, Number.isFinite(qty) ? Math.max(0, qty) : 0);
    }
    return map;
  }

  function stockState(total) {
    if (total <= 0) return { text: "품절", className: "is-danger" };
    if (total <= 2) return { text: "재고 얼마 남지 않았어요", className: "is-danger" };
    if (total <= 5) return { text: "재고 임박", className: "is-warning" };
    return { text: "재고 여유", className: "" };
  }

  function createCard(product, qtyMap) {
    const total = product.variants.reduce(
      (sum, variant) => sum + (qtyMap.get(variant.itemCode) || 0),
      0
    );
    const state = stockState(total);

    const card = document.createElement("article");
    card.className = "product-card";
    card.style.setProperty("--accent", product.accent);
    card.style.setProperty("--accent-rgb", product.accentRgb);

    const rows = product.variants.map((variant) => {
      const qty = qtyMap.get(variant.itemCode) || 0;
      return `
        <div class="variant-row">
          <span class="color-dot" style="--swatch:${variant.swatch}"></span>
          <span class="variant-name">${escapeHtml(variant.color)}</span>
          <span class="item-code">${escapeHtml(variant.itemCode)}</span>
          <span class="variant-qty">${qty}대</span>
        </div>
      `;
    }).join("");

    card.innerHTML = `
      <div class="card-title">${escapeHtml(product.model)}</div>
      <div class="card-body">
        <div class="product-summary">
          <div class="product-image-wrap">
            <img class="product-image" src="${product.image}" alt="${escapeHtml(product.model)}">
          </div>
          <div class="total-box">
            <div class="total-label">전체 재고</div>
            <div class="total-number-line">
              <span class="total-number">${total}</span>
              <span class="total-unit">대</span>
            </div>
            <div class="stock-state ${state.className}">${state.text}</div>
          </div>
        </div>
        <div class="variant-list">${rows}</div>
      </div>
    `;

    return card;
  }

  function render(payload) {
    const qtyMap = quantityMap(payload);

    storeNameEl.textContent =
      payload.store_name ||
      config.DEFAULT_STORE_NAME ||
      `코스트코 ${storeCode}점`;

    updatedAtEl.textContent = payload.updated_at
      ? `최종 업데이트 ${payload.updated_at}`
      : "최종 업데이트 시간 확인 중";

    phoneGrid.replaceChildren(
      ...CATALOG.phones.map((product) => createCard(product, qtyMap))
    );

    watchGrid.replaceChildren(
      ...CATALOG.watches.map((product) => createCard(product, qtyMap))
    );
  }

  function setConnectionState(ok, message) {
    liveBadge.classList.toggle("is-error", !ok);
    liveBadge.classList.toggle("is-live", ok);
    liveText.textContent = message;
  }

  function getApiUrl() {
    const configured = String(config.API_URL || "").trim();
    const fallback = String(FALLBACK_API_URL || "").trim();
    return configured || fallback;
  }

  function isConfigured() {
    const apiUrl = getApiUrl();
    return /^https:\/\/(script\.google\.com|script\.googleusercontent\.com)\//.test(apiUrl);
  }

  function loadJsonp(url, timeoutMs = 8000) {
    return new Promise((resolve, reject) => {
      const callbackName =
        `__stockCallback_${Date.now()}_${Math.random().toString(36).slice(2)}`;

      const script = document.createElement("script");
      const separator = url.includes("?") ? "&" : "?";
      let finished = false;

      const cleanup = () => {
        if (script.parentNode) script.parentNode.removeChild(script);
        try { delete window[callbackName]; } catch (_) { window[callbackName] = undefined; }
      };

      const timer = setTimeout(() => {
        if (finished) return;
        finished = true;
        cleanup();
        reject(new Error("재고 서버 응답 시간이 초과되었습니다."));
      }, timeoutMs);

      window[callbackName] = (data) => {
        if (finished) return;
        finished = true;
        clearTimeout(timer);
        cleanup();
        resolve(data);
      };

      script.onerror = () => {
        if (finished) return;
        finished = true;
        clearTimeout(timer);
        cleanup();
        reject(new Error("재고 서버에 연결하지 못했습니다."));
      };

      script.src =
        `${url}${separator}` +
        `action=stock&store=${encodeURIComponent(storeCode)}` +
        `&callback=${encodeURIComponent(callbackName)}` +
        `&_=${Date.now()}`;

      document.head.appendChild(script);
    });
  }

  async function refreshStock() {
    if (!isConfigured()) {
      render(DEMO_DATA);
      setConnectionState(false, "API 설정 확인");
      updatedAtEl.textContent = "config.js의 API_URL을 확인하세요";
      return;
    }

    try {
      const payload = await loadJsonp(getApiUrl());
      if (!payload || payload.ok !== true) {
        throw new Error(payload?.message || "재고 데이터를 읽지 못했습니다.");
      }

      render(payload);
      setConnectionState(true, "실시간 업데이트");
    } catch (error) {
      console.error(error);
      const shortMessage = String(error?.message || "API 연결 실패").slice(0, 38);
      setConnectionState(false, `API 연결 실패 · ${shortMessage}`);
      updatedAtEl.textContent = "Apps Script 배포 권한 또는 시트 구조 확인 필요";
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  applyLayout();

  let layoutTimer = null;
  const scheduleLayoutUpdate = () => {
    clearTimeout(layoutTimer);
    layoutTimer = setTimeout(applyLayout, 120);
  };

  addEventListener("resize", scheduleLayoutUpdate);
  addEventListener("orientationchange", scheduleLayoutUpdate);
  document.addEventListener("fullscreenchange", scheduleLayoutUpdate);

  const orientationQuery = window.matchMedia("(orientation: portrait)");
  if (typeof orientationQuery.addEventListener === "function") {
    orientationQuery.addEventListener("change", scheduleLayoutUpdate);
  } else if (typeof orientationQuery.addListener === "function") {
    orientationQuery.addListener(scheduleLayoutUpdate);
  }

  render(DEMO_DATA);
  setConnectionState(true, "실시간 업데이트");
  updatedAtEl.textContent = "재고 데이터를 불러오는 중";
  refreshStock();

  const refreshMs = Math.max(5000, Number(config.REFRESH_MS) || 10000);
  setInterval(refreshStock, refreshMs);
})();
