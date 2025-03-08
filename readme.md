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