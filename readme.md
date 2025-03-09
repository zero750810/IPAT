# 國際遊戲協會台灣分會官方網站

本專案是國際遊戲協會台灣分會 (IPAT) 的官方網站，使用 HTML、Bootstrap 5 和 Firebase 構建。

## 專案結構

- **首頁 (index.html)**: 網站主頁，展示協會基本資訊、最新消息和課程概覽
- **關於我們 (about.html)**: 介紹協會宗旨、歷史和組織架構
- **成員介紹 (member.html)**: 展示協會的成員資訊（動態從 Firebase 獲取）
- **最新消息 (news.html)**: 顯示協會的最新動態和公告（動態從 Firebase 獲取）
- **課程介紹 (course.html)**: 展示協會提供的課程資訊，含報名功能（動態從 Firebase 獲取）
- **聯絡我們 (contact.html)**: 提供聯絡表單和協會聯絡資訊
- **後台管理 (Backstage.html)**: 管理員後台，用於管理網站內容
- **js/firebase-data.js**: 處理 Firebase 資料獲取和管理的 JavaScript 檔案

## 技術架構

- **前端技術**: HTML5, CSS3, Bootstrap 5, JavaScript
- **後端服務**: Firebase (Firestore, Authentication)
- **資料管理**: 使用 Firebase Firestore 儲存和獲取動態資料
- **使用者認證**: 使用 Firebase Authentication 進行後台管理登入

## 資料流程

下面的流程圖解釋了網站的數據流和使用者互動流程：

```mermaid
graph TD
    A[訪客] --> B[瀏覽網站]
    B --> C1[首頁]
    B --> C2[關於我們]
    B --> C3[成員介紹]
    B --> C4[最新消息]
    B --> C5[課程介紹]
    B --> C6[聯絡我們]
    
    C3 --> D1[獲取成員資料]
    C4 --> D2[獲取最新消息]
    C5 --> D3[獲取課程資料]
    C5 --> E1[課程報名]
    C6 --> E2[傳送聯絡表單]
    
    D1 --> F[Firebase 資料庫]
    D2 --> F
    D3 --> F
    E1 --> F
    E2 --> F
    
    G[管理員] --> H[登入後台]
    H --> I[後台管理介面]
    I --> J1[管理成員資料]
    I --> J2[管理消息資料]
    I --> J3[管理課程資料]
    I --> J4[檢視報名資料]
    
    J1 --> F
    J2 --> F
    J3 --> F
    J4 --> F
```

## 資料獲取流程

```mermaid
sequenceDiagram
    participant User as 使用者
    participant Page as 網頁
    participant Cache as 本地快取
    participant DataManager as DataManager
    participant Firebase as Firebase

    User->>Page: 訪問頁面
    activate Page
    Page->>DataManager: 初始化資料檢查
    activate DataManager
    
    DataManager->>Cache: 檢查本地快取
    alt 有快取資料
        Cache-->>DataManager: 返回快取資料
        DataManager->>DataManager: 檢查快取時間
        alt 快取有效（<1小時）
            DataManager-->>Page: 使用快取資料
        else 快取過期
            DataManager->>Firebase: 獲取新資料
            Firebase-->>DataManager: 返回資料
            DataManager->>Cache: 更新快取
            DataManager-->>Page: 返回新資料
        end
    else 無快取資料
        DataManager->>Firebase: 獲取初始資料
        Firebase-->>DataManager: 返回資料
        DataManager->>Cache: 儲存到快取
        DataManager-->>Page: 返回新資料
    end
    
    deactivate DataManager
    Page->>User: 顯示資料
    deactivate Page
```

## 後台管理流程

```mermaid
stateDiagram-v2
    [*] --> 登入頁面
    登入頁面 --> 驗證
    
    驗證 --> 登入失敗 : 無效憑證
    登入失敗 --> 登入頁面
    
    驗證 --> 後台管理介面 : 有效憑證
    
    後台管理介面 --> 儀表板
    後台管理介面 --> 最新消息管理
    後台管理介面 --> 課程管理
    後台管理介面 --> 成員管理
    後台管理介面 --> 報名資料管理
    
    最新消息管理 --> 新增消息
    最新消息管理 --> 編輯消息
    最新消息管理 --> 刪除消息
    
    課程管理 --> 新增課程
    課程管理 --> 編輯課程
    課程管理 --> 刪除課程
    
    成員管理 --> 新增成員
    成員管理 --> 編輯成員
    成員管理 --> 刪除成員
    
    報名資料管理 --> 查看報名詳情
    報名資料管理 --> 刪除報名
    
    後台管理介面 --> 登出
    登出 --> [*]
```

## 快取資料管理機制

```mermaid
flowchart TD
    A[頁面載入] --> B{檢查本地快取}
    
    B -->|存在快取| C{檢查快取時間}
    B -->|無快取| D[從 Firebase 獲取資料]
    
    C -->|快取有效| E[使用快取資料]
    C -->|快取過期| D
    
    D --> F[更新本地快取]
    F --> G[使用新獲取的資料]
    
    E --> H[檢查是否有更新]
    H --> I{有更新資料}
    
    I -->|是| J[合併資料並更新快取]
    I -->|否| K[保持現有資料]
    
    J --> L[顯示更新後資料]
    K --> M[顯示現有資料]
```

## 安裝和使用

1. 克隆此儲存庫
2. 配置 Firebase 專案（Firestore 和 Authentication）
3. 更新 `firebase-data.js` 中的 Firebase 配置
4. 將檔案部署到網頁伺服器

## 後台管理使用說明

1. 訪問 `Backstage.html` 進入後台登入頁面
2. 使用管理員帳號和密碼登入
3. 登入後可以管理網站的各項內容：
   - 最新消息管理
   - 課程管理
   - 成員管理
   - 報名資料查看

## 授權和版權

© Copyright 2025. 國際遊戲協會台灣分會 (IPAT)。網頁設計 By Zero.Lin

## 專案簡介
這是國際遊戲協會台灣分會的官方網站，包含以下主要功能：
- 協會介紹與最新消息
- 課程報名與管理
- 成員介紹
- 後台管理系統

## 開發環境設置

### 1. 安裝依賴
本專案為純靜態網站，不需要安裝依賴套件。

### 2. Firebase 設定
專案使用 Firebase 服務進行資料存儲和身份驗證。您需要設置 Firebase 配置：

1. 複製 `.env-sample` 文件為 `.env`
2. 在 `.env` 文件中填入您的 Firebase 專案配置

```
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_DATABASE_URL=your_database_url
...等等
```

**重要說明：** `.env` 文件包含敏感資訊，已在 `.gitignore` 中設定為不上傳至版本控制系統。

### 3. 啟動本地開發環境
可以使用任何靜態檔案伺服器啟動專案，例如：

```bash
# 使用 Python 啟動簡易伺服器
python -m http.server 8000

# 或使用 Node.js 的 http-server
npx http-server
```

## 部署說明

### Firebase Hosting 部署（推薦）
使用 Firebase Hosting 部署時，可以安全地處理環境變數：

1. 安裝 Firebase CLI：
```bash
npm install -g firebase-tools
```

2. 登入 Firebase：
```bash
firebase login
```

3. 初始化專案：
```bash
firebase init hosting
```

4. 在部署前替換環境變數：
建立一個部署腳本 `deploy.sh`：

```bash
#!/bin/bash
# 從 .env 檔案讀取環境變數
source .env

# 替換 firebase-data.js 中的配置
sed -i '' "s/process.env.FIREBASE_API_KEY/\"$FIREBASE_API_KEY\"/g" js/firebase-data.js
sed -i '' "s/process.env.FIREBASE_AUTH_DOMAIN/\"$FIREBASE_AUTH_DOMAIN\"/g" js/firebase-data.js
# ...其他環境變數

# 部署到 Firebase
firebase deploy

# 還原檔案（以便本地開發）
git checkout js/firebase-data.js
```

5. 執行部署腳本：
```bash
chmod +x deploy.sh
./deploy.sh
```

### 其他靜態托管服務部署
如果使用其他靜態網站托管服務，請確保：

1. 不要直接上傳包含實際 API 金鑰的檔案
2. 使用部署平台提供的環境變數功能
3. 部署時使用腳本替換配置變數

## 資料結構說明
Firebase Firestore 資料庫結構：

- `news`: 最新消息資料
- `course`: 課程資料
- `member`: 成員資料
- `Registration`: 報名資料
- `delectlog`: 資料刪除日誌

## 安全性注意事項
1. **絕不** 將真實的 Firebase 配置提交到版本控制系統
2. 請妥善設置 Firebase 安全規則，限制未授權訪問
3. 後台管理頁面需要管理員登入才能訪問

## 前台頁面資料獲取流程

### 資料獲取核心邏輯
所有頁面的核心數據獲取邏輯如下：
1. 靜態數據來自對應的 JS 文件（news.js, course.js, member.js）
2. 動態數據從 Firebase 獲取，只請求今天 0 時之後更新的記錄（通過 updatetime 字段篩選）
3. 合併兩種數據，優先顯示今天從 Firebase 獲取的最新數據，然後是靜態數據
4. 利用數據 ID 進行去重處理，確保不顯示重複內容

### 首頁 (index.html)
首頁從 Firebase 獲取最新消息和課程資料，並顯示在頁面上。

1. 頁面載入時觸發 `DOMContentLoaded` 事件
2. 調用 `window.dataManager.getNewsForIndex()` 獲取最新 3 則新聞
   - 讀取 `news.js` 中的靜態數據作為基礎數據
   - 從 Firebase 的 `news` 集合獲取 `updatetime` 為今天 0 時之後的記錄
   - 將這兩部分數據合併（Firebase 數據優先），基於 ID 去重
   - 返回前 3 則合併後的新聞
3. 調用 `window.dataManager.getCoursesForIndex()` 獲取最新 4 個課程
   - 讀取 `course.js` 中的靜態數據作為基礎數據
   - 從 Firebase 的 `courses` 集合獲取 `updatetime` 為今天 0 時之後的記錄
   - 將這兩部分數據合併（Firebase 數據優先），基於 ID 去重
   - 返回前 4 個合併後的課程
4. 獲取到資料後分別調用 `updateNewsSection()` 和 `updateCoursesSection()` 更新頁面內容

### 成員介紹頁面 (member.html)
成員介紹頁面從 Firebase 獲取成員資料，並按職位順序顯示。

1. 頁面載入時觸發 `DOMContentLoaded` 事件
2. 調用 `window.dataManager.getMembers()` 獲取所有成員資料
   - 讀取 `member.js` 中的靜態數據作為基礎數據
   - 從 Firebase 的 `member` 集合獲取 `updatetime` 為今天 0 時之後的記錄
   - 將這兩部分數據合併（Firebase 數據優先），基於 ID 去重
3. 獲取到資料後調用 `renderMembers()` 將成員資料渲染到頁面
   - 渲染時會先按職稱對成員進行排序，領導職位優先顯示

### 最新消息頁面 (news.html)
最新消息頁面從 Firebase 獲取所有新聞資料，並提供按月份篩選功能。

1. 頁面載入時觸發 `DOMContentLoaded` 事件
2. 調用 `window.dataManager.getNews()` 獲取所有新聞資料
   - 讀取 `news.js` 中的靜態數據作為基礎數據
   - 從 Firebase 的 `news` 集合獲取 `updatetime` 為今天 0 時之後的記錄
   - 將這兩部分數據合併（Firebase 數據優先），基於 ID 去重
3. 將獲取的資料保存在 `window.allNewsItems` 中
4. 預設調用 `filterNews('current')` 顯示本月的新聞
5. 用戶可以點擊「本月消息」或「過往消息」進行篩選

### 課程介紹頁面 (course.html)
課程介紹頁面從 Firebase 獲取所有課程資料，並提供課程詳情查看和報名功能。

1. 頁面載入時觸發 `DOMContentLoaded` 事件
2. 調用 `window.dataManager.getCourses()` 獲取所有課程資料
   - 讀取 `course.js` 中的靜態數據作為基礎數據
   - 從 Firebase 的 `courses` 集合獲取 `updatetime` 為今天 0 時之後的記錄
   - 將這兩部分數據合併（Firebase 數據優先），基於 ID 去重
3. 獲取到資料後調用 `renderCourses()` 將課程資料渲染到頁面
4. 點擊課程卡片時調用 `showCourseDetail(courseId)` 顯示課程詳情
5. 點擊「報名課程」按鈕時開啟報名表單
6. 提交報名表單時調用 `submitEnrollment()` 將報名資料保存到 Firebase

### 資料獲取流程圖

```mermaid
flowchart TD
    A[頁面載入] --> B{讀取對應的靜態JS文件}
    B --> C[調用相應的 dataManager 方法]
    
    C --> D[讀取靜態數據]
    C --> E[計算今天 0 時的時間戳]
    E --> F[從 Firebase 獲取今天更新的資料]
    
    D --> G[整合數據]
    F --> G
    
    G --> H[根據ID去重，優先保留今天更新的數據]
    H --> I[快取處理]
    I --> J[將資料返回頁面顯示]
```

### DataManager 資料獲取實現原理

所有頁面使用的 `DataManager` 類中，資料獲取方法的實現原理如下：

```javascript
async getXXX() {
    // 1. 計算今天 0 時的時間戳
    const todayStart = this.getTodayStartTimestamp();
    
    // 2. 獲取靜態數據
    let staticData = [];
    if (window.xxx) {  // 對應的 JS 文件中的數據 (news.js, course.js, member.js)
        staticData = window.xxx;
    }
    
    // 3. 從 Firebase 獲取今天更新的數據
    const snapshot = await window.db.collection('xxx')
        .where('updatetime', '>=', new Date(todayStart))
        .orderBy('updatetime', 'desc')
        .get();
    
    // 4. 處理 Firebase 獲取的數據
    const firestoreData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    
    // 5. 合併數據（避免重複的 ID）
    const existingIds = new Set(firestoreData.map(item => item.id));
    const filteredStaticData = staticData.filter(item => !existingIds.has(item.id));
    
    // 6. 返回合併結果（Firebase 數據優先）
    return [...firestoreData, ...filteredStaticData];
}
```

### 共用的資料管理函數

所有頁面共用的 `DataManager` 類包含以下關鍵函數：

1. `getTodayStartTimestamp()` - 計算今天 0 時的時間戳
2. `setCache(key, data)` - 設置資料快取
3. `getFromCache(key)` - 從快取獲取資料
4. `hasValidCache(key)` - 檢查快取是否有效（30 分鐘內）
5. `hasCache(key)` - 檢查是否存在快取
6. `getLastUpdateTime(key)` - 獲取最後更新時間