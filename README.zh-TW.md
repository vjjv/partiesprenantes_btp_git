# Camera Kit 網頁示範（含錄影功能）🎥

> 由 [gowaaa](https://www.gowaaa.com) 開發 🚀
> 專注於 AR 體驗的創意科技工作室

### 最新版本重要更新 [8 月 12 日 2025 年]

- **遠端 API 整合** 📡
  - 新增完整的遠端 API 指南，用於偵測來自 Lens 的按鈕點擊
  - 新增 `remoteAPI.js` 來處理來自 Lens 的遠端 API 請求
  - 包含雙語設定指南：[remoteAPIGuide.md](src/remoteAPIGuide.md)（英文版）和 [remoteAPIGuide.zh-tw.md](src/remoteAPIGuide.zh-tw.md)（繁體中文版）

### 最新版本重要更新 [8 月 7 日 2025 年]

- 新增 launchParams 功能，可在啟動時傳送資料到 Lens
- Capture & Live render target 現在的運作方式與你在 Lens Studio 中按下錄製按鈕時完全相同
- 要錄製 captureRenderTarget，請在 settings.js 中將 recordCaptureRenderTarget 設為 true
- 停止錄製後新增影片預覽功能
- **音訊錄製功能提升**：現在可以錄製來自濾鏡的音訊與影片和麥克風輸入，但如果濾鏡內的音軌有任何變化，變化部分將不會被錄製
- JavaScript 檔案模組化，提升程式碼組織：
  - `camera.js`：處理相機初始化和管理
  - `recorder.js`：管理影片錄製功能
  - `ui.js`：控制使用者介面元素和互動
  - `videoProcessor.js`：處理影片處理操作
  - `settings.js`：集中管理設定

一個展示 Snap Camera Kit 整合的網頁應用程式，允許使用者套用 Snap 濾鏡並錄製影片。

> ⚠️ **安全警告**  
> **如何安全使用此專案**  
> 請依照以下步驟確保應用程式安全：
>
> 1. 本地開發時：
>
>    - 複製 `.env.example` 來建立你的 `.env` 檔案
>    - 在 `.env` 中填入你的 Camera Kit 憑證
>    - 切勿分享或提交 `.env` 檔案
>    - ⚠️ **切勿**直接將憑證寫在程式碼檔案中
>
> 2. 部署時：
>    - 使用 Vercel（推薦的託管平台）
>    - 在 Vercel 的 Settings → Environment Variables 中加入憑證
>    - 依照我們的[部署指南](#部署到-vercel-)操作
>    - 請注意，憑證仍然有可能被暴露，但 Snapchat 本身具有內建的 CORS 原始來源檢查機制，只允許經核准的網址存取應用程式金鑰。你可以在提交 Camera Kit 應用程式審核時設定允許的網址。
>    - 為了提升安全性，建議將金鑰儲存在 AWS Secret Manager，並透過 AWS Lambda 搭配 API Gateway 來安全地取得金鑰。

> ✅ 這樣設定可確保你的憑證和應用程式安全！

🔗 [線上示範](https://camerakit.gowaaa.com/)

## 功能特點 ✨

- **Snap 濾鏡整合** 🎭
- **影片錄製** 📹
- **前後鏡頭切換** 🔄
- **影片分享** 📤
- **影片下載** ⬇️
- **載入動畫** ⌛
- **響應式設計** 📱

## 技術架構 🛠️

- Camera Kit for Web V1.8.0
- FFmpeg.wasm（影片處理）
- Webpack 5
- MediaRecorder API
- Web Share API

## 專案結構 📁

```
camerakit-web-w-recordfeature/
├── LICENSE                    # MIT 授權條款
├── README.md                  # 英文說明文件
├── README.zh-TW.md           # 繁體中文說明文件
├── build/                    # 建置輸出目錄（自動產生）
├── node_modules/             # Node.js 依賴項目（自動產生）
├── package-lock.json         # 依賴項目鎖定檔案
├── package.json              # 專案依賴項目和腳本
├── public/
│   └── ffmpeg/              # FFmpeg WebAssembly 檔案
│       ├── ffmpeg-core.js
│       └── ffmpeg-core.wasm
├── src/
│   ├── assets/              # 圖片和圖示
│   │   ├── BackButton.png
│   │   ├── DownloadButton.png
│   │   ├── LoadingIcon.png
│   │   ├── Powered_bysnap.png
│   │   ├── RecordButton.png
│   │   ├── RecordOutline.png
│   │   ├── RecordStop.png
│   │   ├── ShareButton.png
│   │   └── SwitchButton.png
│   ├── styles/              # CSS 檔案
│   │   └── index.v3.css
│   ├── camera.js            # 相機功能與管理
│   ├── recorder.js          # 影片錄製功能
│   ├── ui.js               # 使用者介面管理與互動
│   ├── videoProcessor.js   # 影片處理邏輯
│   ├── settings.js         # 設定檔案
│   ├── launchParams.js     # Lens 資料啟動參數處理
│   ├── remoteAPI.js        # 與 Lens 的遠端 API 通訊
│   ├── remoteAPIGuide.md   # 遠端 API 設定指南（英文版）
│   ├── remoteAPIGuide.zh-tw.md # 遠端 API 設定指南（繁體中文版）
│   ├── index.html          # 主要 HTML 檔案
│   └── main.js             # 主要 JavaScript 進入點
├── vercel.json             # Vercel 部署設定
└── webpack.config.js       # Webpack 建置設定
```

## 開始使用 🚀

### 系統需求 📋

- Node.js（v14 或更高版本）- [下載連結](https://nodejs.org/)
- npm（Node.js 安裝時會一併安裝）
- Camera Kit 憑證（從 Snap 取得）

> 💡 **第一次使用 Node.js？**
>
> 1. 從 [nodejs.org](https://nodejs.org/) 下載並安裝 Node.js
> 2. 安裝完成後，開啟終端機/命令提示字元
> 3. 輸入以下指令確認安裝成功：
>    ```bash
>    node --version
>    npm --version
>    ```
>    兩個指令都應該顯示版本號碼

### 安裝步驟 💿

1. 複製專案：

   > 💡 **第一次使用 GitHub？**  
   > 選擇以下其中一種方式：
   >
   > **方式 A：使用 GitHub Desktop（推薦新手使用）**
   >
   > - 下載 [GitHub Desktop](https://desktop.github.com/)
   > - 點擊上方綠色的「Code」按鈕
   > - 點擊「Open with GitHub Desktop」
   > - 選擇要儲存在電腦的位置
   >
   > **方式 B：使用 Git 命令列**

   ```bash
   git clone https://github.com/gowaaa/camerakit-web-w-recordfeature.git
   cd camerakit-web-w-recordfeature
   ```

2. 安裝依賴：

```bash
npm ci
```

> 💡 **注意**: 建議使用 `npm ci` 進行首次安裝，因為它：
>
> - 確保使用 package-lock.json 中的精確版本
> - 速度更快且更可靠
> - 在所有環境中提供一致的安裝結果
>
> 僅在需要修改依賴項目（添加新的或更新現有的）時才使用 `npm install`。

3. 設定 Camera Kit 憑證：
   在根目錄建立 `.env` 檔案：

```
LENS_ID=__LENS_ID__
GROUP_ID=__GROUP_ID__
API_TOKEN=__API_TOKEN__
```

### 開發環境 🔧

啟動開發伺服器：

```bash
npm run serve
```

Webpack 將啟動支援 HTTPS 的開發伺服器。
終端機會顯示兩個網址：

- 本機：`https://localhost:9000`
- 網路：`https://你的IP地址:9000`（用於手機測試）

使用終端機顯示的網路網址在手機上測試。

⚠️ **注意事項**：

- 手機必須與電腦連接同一個 WiFi 網路
- 在瀏覽器中接受自簽憑證警告
- 需要 HTTPS 才能存取相機

### 生產環境建置 🏗️

建置專案：

```bash
npm run build
```

輸出檔案將在 `build` 目錄中。

### 部署到 Vercel 🚀

> 💡 **第一次使用 Vercel？**  
> Vercel 是一個讓網站部署變得簡單的平台。你需要：
>
> 1. GitHub 帳號 - [在此註冊](https://github.com/signup)
> 2. 將專案程式碼上傳到 GitHub
> 3. Vercel 帳號（可以用 GitHub 帳號註冊）

在 Vercel 上安全部署：

1. 在 [vercel.com](https://vercel.com) 建立帳號

   - 點擊「Sign Up」
   - 選擇「Continue with GitHub」
   - 依照指示完成授權

2. 匯入你的 GitHub 儲存庫：

   - 前往 [vercel.com/new](https://vercel.com/new)
   - 選擇你的儲存庫
   - 點擊「Import」

3. 新增 Camera Kit 憑證作為環境變數：

   - 在專案儀表板中，前往「Settings」→「Environment Variables」
   - 依照以下格式新增三個變數：
     ```
     LENS_ID=你的實際_lens_id
     GROUP_ID=你的實際_group_id
     API_TOKEN=你的實際_api_token
     ```

4. 部署專案：
   - Vercel 會自動偵測並使用環境變數
   - 你的憑證會被安全地儲存並在建置時使用

⚠️ **安全注意事項**：

- 使用 Vercel 環境變數可確保憑證安全
- 切勿將實際憑證提交到儲存庫
- 本機開發時複製 `.env.example` 為 `.env` 並填入憑證
- 將 `.env` 檔案加入 `.gitignore`

## 瀏覽器支援 🌐

- Chrome（最新版）✅
- Firefox（最新版）🦊
- Safari（iOS 14.5+）📱
- Edge（最新版）🌍

## 常見問題 🔧

### 問題排解 ⚠️

1. **建置錯誤**：

   - 確認所有依賴已安裝
   - 檢查 webpack 設定
   - 驗證檔案路徑

2. **相機問題**：

   - 使用 HTTPS
   - 授予相機權限
   - 檢查瀏覽器相容性

3. **錄影問題**：
   - 確保裝置有足夠儲存空間
   - 檢查 MediaRecorder 支援
   - 驗證權限設定

## 授權條款 📄

MIT 授權

Copyright (c) 2024

特此免費授予任何取得本軟體及相關文件檔案（「軟體」）複本的人，不受限制地處理本軟體的權利，
包括但不限於使用、複製、修改、合併、發布、散布、再授權和/或販售本軟體複本的權利，
以及允許獲得本軟體的人這樣做，但須符合以下條件：

上述版權聲明和本許可聲明應包含在本軟體的所有複本或重要部分中。

本軟體按「原樣」提供，不提供任何形式的明示或暗示保證，包括但不限於對適銷性、
特定用途適用性和非侵權性的保證。在任何情況下，作者或版權持有人均不對任何索賠、
損害或其他責任負責，無論是在合約、侵權或其他方面，與本軟體或本軟體的使用或其他交易有關。

## 致謝 👏

- 基於 Vincent Trastour 的 Camera Kit 教學：[觀看 YouTube](https://www.youtube.com/watch?v=ZQM9Ua_JKMY)
- 使用 [Snap Camera Kit](https://kit.snapchat.com/camera-kit) 建置
- 使用 [FFmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm)
- 專案改進由 Hong Wei ([@hongweitangcom](https://www.instagram.com/hongweitangcom/)) 協助
- 濾鏡音訊錄製方法由 [@newyellow](https://github.com/newyellow/CameraKit-Record-Template) 發現
- Remote API 指南在 [@bastiensaro](https://www.filtre-experience.fr/) 的協助下得以實現

---

祝編程愉快！🎥✨

## ⚠️ 依賴項目注意事項

本專案需要特定版本的依賴項目才能正常運作。請：

- 不要修改 `package-lock.json`
- 使用 `npm ci` 而不是 `npm install`，因為：
  - 速度更快且更可靠
  - 確保使用 package-lock.json 中的精確版本
  - 會在安裝前移除 node_modules
  - 不會更新 package.json 或 package-lock.json

Camera Kit 整合對依賴版本很敏感。修改這些可能會導致功能失效。
