# Hi-Fi Match

**Hi-Fi Match｜音響設備搭配顧問** 是一個以 HTML、CSS、JavaScript 製作的靜態網站，提供音響設備瀏覽、規格比較、系統搭配方向與入門知識。設計採精品 Hi-Fi 型錄風格，支援桌面與手機，適合部署於 GitHub Pages。

## 功能
- 首頁品牌介紹與導覽。
- 設備資料庫：分類篩選、關鍵字搜尋。
- 設備比較：最多同時比較三項設備。
- 搭配推薦：依總預算、喇叭預算、空間、訊源與聲音偏好產生三套系統方向。
- 音響知識：頻率響應、靈敏度、阻抗、擴大機功率。
- `AGENTS.md`：供 AI 延續開發的資料格式、設計與相容性規範。

## 專案結構
```text
hi-fi-match/
├── index.html
├── styles.css
├── app.js
├── AGENTS.md
├── README.md
├── AI-CONTINUATION-TEST.md
├── data/
│   └── products.json
└── tests/
    └── test.js
```

## 本機預覽
因瀏覽器安全限制，`fetch()` 讀取 JSON 時請使用本機 HTTP 伺服器，不要直接雙擊 `index.html`。

```bash
cd hi-fi-match
python -m http.server 8000
```
開啟 `http://localhost:8000`。

**直接雙擊 `index.html` 也能看到產品資料庫**：網站會先讀取內附的 `data/products.js`，不再只依賴瀏覽器可能封鎖的本機 JSON `fetch()`。

## 測試
需要 Node.js 18 或更新版本。於專案根目錄執行：

```bash
node tests/test.js
```
測試包含 JSON 格式、產品 id 唯一性、DALI SONIK 1 規格欄位、分類與推薦輸出邏輯。

## GitHub Pages 部署
1. 在 GitHub 建立一個新的 **Public** repository，例如 `hi-fi-match`。
2. 將本資料夾內所有檔案與 `data/`、`tests/` 資料夾上傳至 repository 根目錄。
3. 開啟 repository 的 **Settings → Pages**。
4. 在 **Build and deployment** 選擇 **Deploy from a branch**。
5. Branch 選 `main`，資料夾選 `/(root)`，按 Save。
6. 等待 GitHub Pages 部署完成。專案網址通常為 `https://你的GitHub帳號.github.io/hi-fi-match/`。

若 repository 名稱不是 `hi-fi-match`，公開網址中的路徑也要相應修改。網站使用相對路徑，可部署於 repository 子路徑。

## 產品資料與準確性
- 已核對的 DALI SONIK 1 規格取自 [DALI 官方產品頁](https://www.dali-speakers.com/en/products/sonik/sonik-1/)；評測參考 [What Hi-Fi?](https://www.whathifi.com/speakers/hi-fi-speakers/dali-sonik-1)。
- 其他示範產品的規格與價格尚未完成來源核對，網站會標示待查證，不會以猜測值填入。
- 台灣售價未確認時一律為 `null`，不會把外幣直接換標為台幣。
- 推薦結果是搭配方向；在擴大機型號與實際價格未確認前，不會宣稱相容性或總價已獲保證。

## AI 延續開發測試
本專案附有 DALI SONIK 1 資料紀錄，測試程式會驗證它可由資料庫載入、可搜尋、可加入比較且具備原廠來源。AI 後續新增產品時，應先閱讀 `AGENTS.md`，沿用 `data/products.json` 格式，並執行測試。實際測試結果請見 `AI-CONTINUATION-TEST.md`。

## 授權與圖片
網站程式碼可作為課程專案與個人作品修改。產品圖片及品牌商標仍屬原權利人；使用前請確認各來源網站的圖片授權與引用規範。外部圖片或字體服務需連網才能完整顯示。
