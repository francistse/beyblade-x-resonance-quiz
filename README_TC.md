# Beyblade X 共鳴測驗

[English](https://github.com/francistse/beyblade-x-resonance-quiz/blob/main/README.md) | 繁體中文

透過向量匹配演算法，找出與你靈魂共鳴的 Beyblade X。回答 12 道問題，發掘你的戰鬥類型，找到屬於你的共鳴陀螺。

🎨 此專案使用 TRAE IDE 開發 — 讓網頁開發更輕鬆愉快。

## 概覽

| 功能 | 說明 |
|---|---|
| **性格測驗** | 12 道精心設計的問題，涵蓋攻擊、防禦、持久三大軸心 |
| **向量匹配** | 餘弦距離演算法，將你的特質與 144 款 Beyblade X 產品進行配對 |
| **覺醒關鍵字** | 根據你的戰鬥類型，隨機賦予共鳴關鍵字 |
| **雷達圖** | 視覺化比較你的能力值與匹配陀螺的差異 |
| **多語言** | English、繁體中文、日本語 |
| **分享結果** | 下載結果圖片、複製連結、原生分享 API |
| **音效** | 沉浸式音效反饋 |
| **粒子背景** | 動態波浪粒子 Canvas 背景 |

### 戰鬥類型

| 類型 | 說明 |
|---|---|
| ⚔️ **攻擊型** | 積極、直接、高衝擊 — 正面迎擊 |
| 🛡️ **防禦型** | 冷靜、分析、堅韌 — 穩如磐石 |
| 🌀 **持久型** | 耐心、持久、策略 — 笑到最後 |
| ⚖️ **平衡型** | 靈活、適應、全面 — 見招拆招 |

## 運作原理

1. **回答 12 道問題** — 每個選項對應攻擊 / 防禦 / 持久的分數
2. **正規化向量** — 將原始分數正規化為單位向量
3. **餘弦距離匹配** — 將你的向量與 144 款陀螺的能力向量進行比較
4. **平衡加成** — 平衡型使用者優先匹配平衡型陀螺
5. **前 3 名結果** — 顯示最接近的匹配及適配百分比
6. **覺醒關鍵字** — 根據你的類型隨機賦予共鳴語句

## 快速開始

### 系統需求

- Node.js 18+
- npm 9+

### 安裝

```bash
git clone https://github.com/francistse/beyblade-x-resonance-quiz.git
cd beyblade-x-resonance-quiz
npm install
```

### 開發模式

```bash
npm run dev
```

### 建置

```bash
npm run build
```

### 預覽正式建置

```bash
npm run preview
```

### 執行測試

```bash
npm test
```

## 環境變數

在專案根目錄建立 `.env` 檔案：

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

（若仍使用舊版 anon key，可設定 `VITE_SUPABASE_ANON_KEY`。）
```

> **注意：** Supabase 僅用於選擇性的分析追蹤。測驗功能在沒有 Supabase 的情況下仍可完整運作。

## 技術棧

| 類別 | 技術 |
|---|---|
| 框架 | React 19 + TypeScript |
| 建置工具 | Vite 8 |
| 樣式 | Tailwind CSS 4 |
| 圖表 | Recharts 3 |
| 國際化 | i18next + react-i18next |
| 分析 | Supabase |
| 圖片匯出 | html2canvas |
| 測試 | Vitest + Testing Library |
| 程式碼檢查 | ESLint + typescript-eslint |

## 專案結構

- **`public/`** — 原樣提供的靜態檔案
  - `images/products/` — 陀螺產品圖片
  - `sounds/` — 介面音效
- **`src/`** — 應用程式原始碼
  - `assets/` — 會被打包的圖片與 Logo
  - `components/` — React 介面
    - `Quiz/` — 首頁、基本資料、題目與導覽（`QuizForm.tsx`、`QuestionCard.tsx` 等）
    - `Results/` — 雷達圖、配對結果、覺醒關鍵字、分享卡片
    - `Share/` — 分享與下載
    - `ui/` — `NavBar`、`Button`、`WaveParticleBackground` 等共用元件
  - `context/` — 測驗與頁面導覽狀態
  - `data/` — `beyblades.json`、題目、數值區間
  - `hooks/` — 測驗狀態、語系、分析、音效等
  - `i18n/` — i18next 設定
  - `lib/` — Supabase 用戶端輔助
  - `locales/` — `en-US`、`zh-TW`、`ja-JP` 翻譯 JSON
  - `pages/` — `ResultPage` 等頁面級元件
  - `types/` — 共用 TypeScript 型別
  - `utils/` — 配對演算法、正規化、分享圖、`supabase` 再匯出
- **`.github/workflows/`** — GitHub Actions（Pages 部署）
- **專案根目錄設定** — `index.html`、`vite.config.ts`、`package.json`、`tsconfig*.json`、`tailwind.config.js`、`postcss.config.js`、`vitest.config.ts`、`.env.example`

## 部署

**線上網址（GitHub Pages）：** [https://francistse.github.io/beyblade-x-resonance-quiz/](https://francistse.github.io/beyblade-x-resonance-quiz/)

推送到 `main` 會觸發 [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)，以 Vite 建置（已設定此 repo 路徑的 `base`）並透過 GitHub Actions 部署。

也可在本機手動發佈（會建立／更新 `gh-pages` 分支）：

```bash
npm run deploy
```

## 貢獻

歡迎貢獻！請隨時提交 Pull Request。

### 貢獻方式

- 新增測驗題目或改善現有題目
- 新增語言支援
- 改善匹配演算法
- 新增陀螺產品資料
- 修復 Bug 或改善 UI/UX

## 授權

MIT License — 詳見 [LICENSE](https://github.com/francistse/beyblade-x-resonance-quiz/blob/main/LICENSE)。

## 致謝

- **TAKARA TOMY** — Beyblade X 產品線與系列
- **[BEYBLADE X Viewer (beyblade.phstudy.org)](https://beyblade.phstudy.org/)** — Beyblade X 產品資料庫與能力值參考，為本測驗之數據來源
- **TRAE IDE** — 此專案使用 TRAE IDE 開發
- 音效來自 [Freesound](https://freesound.org/) 社群貢獻者

## 聯絡方式

**專案維護者：** Francis Tse

- Email: [francis.tse.mc@gmail.com](mailto:francis.tse.mc@gmail.com)
- LinkedIn: [https://www.linkedin.com/in/francis-tse-6a399a47/](https://www.linkedin.com/in/francis-tse-6a399a47/)
