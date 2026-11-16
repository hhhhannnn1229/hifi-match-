# AI 延續開發測試紀錄

## 測試目的
模擬另一位 AI 閱讀 `AGENTS.md` 後，依既有資料格式新增 DALI SONIK 1，並驗證搜尋、比較與既有功能未被破壞。

## 測試操作
1. 檢查 `AGENTS.md` 對產品資料欄位、來源與未知值的規定。
2. 檢查 `data/products.json` 中 `dali-sonik-1` 的格式與原廠來源。
3. 執行 `node tests/test.js`，驗證產品 ID 唯一、DALI 規格欄位、台灣售價未確認時為 `null`，並測試三套推薦輸出及相容性提醒。
4. 於網站介面搜尋 `SONIK 1`，將 DALI SONIK 1 加入比較，確認規格列與來源連結存在。

## DALI SONIK 1 資料
- 品牌／型號：DALI SONIK 1
- 頻率響應：51–26,000 Hz（±3 dB）
- 靈敏度：86 dB（2.83V/1m）
- 標稱阻抗：6 Ω
- 建議擴大機功率：25–100 W
- 官方來源：[DALI SONIK 1](https://www.dali-speakers.com/en/products/sonik/sonik-1/)
- 評測參考：[What Hi-Fi? DALI SONIK 1](https://www.whathifi.com/speakers/hi-fi-speakers/dali-sonik-1)
- 台灣售價：未確認，故標記為待查證。

## 自動測試結果
執行命令：`node tests/test.js`

測試涵蓋：
- JSON 可正常解析。
- 所有產品 ID 唯一。
- DALI SONIK 1 存在且必要規格與來源正確。
- 未確認售價不會被填入推測數字。
- 推薦引擎輸出三套方向，並考慮使用者訊源。
- 擴大機未指定時，不會錯誤宣稱相容性已確認。

## 手動驗收清單
- [ ] 本機 HTTP 伺服器開啟首頁正常。
- [ ] 搜尋 `SONIK 1` 可找到 DALI SONIK 1。
- [ ] 分類篩選「喇叭」可找到 DALI SONIK 1。
- [ ] 加入比較後顯示頻率響應、靈敏度、阻抗與擴大機建議功率。
- [ ] 移除／清除比較可正常操作。
- [ ] 推薦表單產生三套搭配方向。
- [ ] 手機寬度下導覽可展開，頁面無明顯水平溢出。

## 測試範圍聲明
自動測試可在 Node.js 執行；手動驗收清單需由使用者在瀏覽器實際操作後勾選。本文件不把尚未實際執行的瀏覽器測試或 GitHub Pages 部署宣稱為已通過。GitHub Repository 與公開網址需由擁有 GitHub 帳號者建立及部署。
