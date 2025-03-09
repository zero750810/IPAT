// firebase-data.js - 放入網站公共 JS 資料夾
// Firebase 配置
const firebaseConfig = {
    apiKey: "AIzaSyDzmZch9uiJA1GISW-WVBhduIbpbmNqPqo",
    authDomain: "ipat-database.firebaseapp.com",
    databaseURL: "https://ipat-database-default-rtdb.firebaseio.com",
    projectId: "ipat-database",
    storageBucket: "ipat-database.firebasestorage.app",
    messagingSenderId: "19326282915",
    appId: "1:19326282915:web:b132ebba12d1b9889ce316"
};

// 初始化 Firebase - 增加錯誤處理
console.log("Firebase 初始化開始");

let auth, db;
try {
    if (!firebase.apps.length) {
        console.log("初始化 Firebase 應用");
        firebase.initializeApp(firebaseConfig);
    }
    auth = firebase.auth();
    db = firebase.firestore();

} catch (error) {
}
// 暴露給全局使用
window.auth = auth;
window.db = db;
// 資料管理類 - 統一處理不同頁面的數據獲取邏輯
class DataManager {
    constructor() {
        console.log("DataManager 初始化開始");
        this.cachedData = {};
        this.CACHE_EXPIRY = 30 * 60 * 1000; // 快取有效期：30分鐘
        this.isAdmin = false; // 管理員狀態標記

        // 監聽登入狀態變化
        try {
            if (window.auth) {
                console.log("設置 auth 狀態監聽器");
                window.auth.onAuthStateChanged(user => {
                    this.isAdmin = !!user;
                    console.log("身份驗證狀態變更:", this.isAdmin ? "已登入" : "未登入");
                });
            } else {
                console.warn("window.auth 未定義，跳過狀態監聽");
            }

            // 如果有靜態數據且 Firebase 可用，檢查今日更新
            if (window.db) {
                console.log("檢查今日更新");
                // 執行增量更新檢查
                if (typeof window.checkForUpdates === 'function') {
                    window.checkForUpdates();
                }
            }

            console.log("DataManager 初始化完成");
        } catch (error) {
            console.error("DataManager 初始化錯誤:", error);
        }
    }

    // 設置快取
    setCache(key, data) {
        console.log(`設置快取: ${key}, 包含 ${data.length} 項資料`);
        this.cachedData[key] = {
            data: data,
            timestamp: new Date().getTime()
        };
        return data;
    }

    // 獲取快取
    getFromCache(key) {
        console.log(`獲取快取: ${key}`);
        return this.cachedData[key];
    }

    // 檢查是否有效快取
    hasValidCache(key) {
        const cache = this.getFromCache(key);
        if (!cache) {
            console.log(`無快取: ${key}`);
            return false;
        }

        const now = new Date().getTime();
        const isValid = (now - cache.timestamp) < this.CACHE_EXPIRY;
        console.log(`快取有效性檢查: ${key}, ${isValid ? '有效' : '已過期'}`);
        return isValid;
    }

    // 檢查是否有快取
    hasCache(key) {
        const hasCache = !!this.getFromCache(key);
        console.log(`檢查快取存在: ${key}, ${hasCache ? '存在' : '不存在'}`);
        return hasCache;
    }

    // 獲取最後更新時間
    getLastUpdateTime(key) {
        const cache = this.getFromCache(key);
        const time = cache ? cache.timestamp : 0;
        console.log(`獲取更新時間: ${key}, ${new Date(time).toLocaleString()}`);
        return time;
    }

    // 在 DataManager 類中添加一個新方法來獲取今天 0 時的時間戳
    getTodayStartTimestamp() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today.getTime();
    }

    // 新聞頁面 (news.html): 獲取全部新聞資料
    async getNews() {
        console.log("getNews 開始執行");

        // 調試信息
        console.log("檢查 window.news 是否存在:", window.news ? "存在" : "不存在");
        if (window.news) {
            console.log("window.news 類型:", typeof window.news);
            console.log("window.news 長度:", window.news.length);
        }

        // 獲取今天 0 時的時間戳
        const todayStart = this.getTodayStartTimestamp();
        console.log(`今天 0 時的時間戳: ${todayStart}, ${new Date(todayStart).toLocaleString()}`);

        // 1. 從 news.js 獲取靜態數據
        let staticNewsData = [];
        if (window.news && window.news.length > 0) {
            staticNewsData = window.news;
            console.log(`讀取到 ${staticNewsData.length} 條靜態新聞數據`);
        } else {
            console.warn("無法從 window.news 獲取靜態數據");
        }

        try {
            console.log("從 Firebase 獲取今天 0 時之後的所有新聞");
            if (!window.db) {
                console.error("window.db 未定義，無法獲取資料");
                return staticNewsData; // 返回所有靜態數據
            }

            // 2. 從 Firestore 獲取今天 0 時之後的新聞
            const todayTimestamp = new Date(todayStart);
            const snapshot = await window.db.collection('news')
                .where('updatetime', '>=', todayTimestamp)
                .orderBy('updatetime', 'desc')
                .get();

            console.log(`獲取到 ${snapshot.size} 條今天更新的新聞記錄`);

            // 3. 處理 Firestore 數據
            let firestoreNews = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                updatetime: doc.data().updatetime ?
                    doc.data().updatetime.toDate().getTime() : Date.now()
            }));

            // 4. 去重合併（Firebase 數據優先）
            const existingIds = new Set(firestoreNews.map(item => item.id));
            const filteredStaticNews = staticNewsData.filter(item => !existingIds.has(item.id));

            // 5. 合併數據並返回
            const combinedNews = [...firestoreNews, ...filteredStaticNews];
            console.log(`新聞頁面：合併了 ${firestoreNews.length} 條 Firestore 數據和 ${filteredStaticNews.length} 條靜態數據`);

            return combinedNews;
        } catch (error) {
            console.error('獲取新聞資料失敗:', error);
            // 出錯時返回靜態數據
            return staticNewsData;
        }
    }

    // 課程頁面 (course.html): 獲取全部課程資料
    async getCourses() {
        console.log("getCourses 開始執行");

        // 獲取今天 0 時的時間戳
        const todayStart = this.getTodayStartTimestamp();
        console.log(`今天 0 時的時間戳: ${todayStart}, ${new Date(todayStart).toLocaleString()}`);

        // 1. 從 course.js 獲取靜態數據
        let staticCourseData = [];
        if (window.course && window.course.length > 0) {
            staticCourseData = window.course;
            console.log(`讀取到 ${staticCourseData.length} 條靜態課程數據`);
        }

        try {
            console.log("從 Firebase 獲取今天 0 時之後的所有課程");
            if (!window.db) {
                console.error("window.db 未定義，無法獲取資料");
                return staticCourseData; // 返回所有靜態數據
            }

            // 2. 從 Firestore 獲取今天 0 時之後的課程
            const todayTimestamp = new Date(todayStart);
            const snapshot = await window.db.collection('courses')
                .where('updatetime', '>=', todayTimestamp)
                .orderBy('updatetime', 'desc')
                .get();

            console.log(`獲取到 ${snapshot.size} 條今天更新的課程記錄`);

            // 3. 處理 Firestore 數據
            let firestoreCourses = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                updatetime: doc.data().updatetime ?
                    doc.data().updatetime.toDate().getTime() : Date.now()
            }));

            // 4. 去重合併（Firebase 數據優先）
            const existingIds = new Set(firestoreCourses.map(item => item.id));
            const filteredStaticCourses = staticCourseData.filter(item => !existingIds.has(item.id));

            // 5. 合併數據並返回
            const combinedCourses = [...firestoreCourses, ...filteredStaticCourses];
            console.log(`課程頁面：合併了 ${firestoreCourses.length} 條 Firestore 數據和 ${filteredStaticCourses.length} 條靜態數據`);

            return combinedCourses;
        } catch (error) {
            console.error('獲取課程資料失敗:', error);
            // 出錯時返回靜態數據
            return staticCourseData;
        }
    }

    // 成員頁面 (member.html): 獲取成員資料
    async getMembers() {
        console.log("getMembers 開始執行");

        // 獲取今天 0 時的時間戳
        const todayStart = this.getTodayStartTimestamp();
        console.log(`今天 0 時的時間戳: ${todayStart}, ${new Date(todayStart).toLocaleString()}`);

        // 1. 從 member.js 獲取靜態數據
        let staticMemberData = [];
        if (window.member && window.member.length > 0) {
            staticMemberData = window.member;
            console.log(`讀取到 ${staticMemberData.length} 條靜態成員數據`);
        }

        try {
            console.log("從 Firebase 獲取今天 0 時之後的所有成員");
            if (!window.db) {
                console.error("window.db 未定義，無法獲取資料");
                return staticMemberData; // 返回所有靜態數據
            }

            // 2. 從 Firestore 獲取今天 0 時之後的成員
            const todayTimestamp = new Date(todayStart);
            const snapshot = await window.db.collection('member')
                .where('updatetime', '>=', todayTimestamp)
                .orderBy('updatetime', 'desc')
                .get();

            console.log(`獲取到 ${snapshot.size} 條今天更新的成員記錄`);

            // 3. 處理 Firestore 數據
            let firestoreMembers = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                updatetime: doc.data().updatetime ?
                    doc.data().updatetime.toDate().getTime() : Date.now()
            }));

            // 4. 去重合併（Firebase 數據優先）
            const existingIds = new Set(firestoreMembers.map(item => item.id));
            const filteredStaticMembers = staticMemberData.filter(item => !existingIds.has(item.id));

            // 5. 合併數據並返回
            const combinedMembers = [...firestoreMembers, ...filteredStaticMembers];
            console.log(`成員頁面：合併了 ${firestoreMembers.length} 條 Firestore 數據和 ${filteredStaticMembers.length} 條靜態數據`);

            return combinedMembers;
        } catch (error) {
            console.error('獲取成員資料失敗:', error);
            // 出錯時返回靜態數據
            return staticMemberData;
        }
    }
}
// 為全局提供數據管理實例
try {
    console.log("初始化全局 dataManager");
    window.dataManager = new DataManager();
    console.log("全局 dataManager 初始化完成");
} catch (error) {
    console.error("初始化全局 dataManager 時出錯:", error);
}
// 後台管理快取功能，使用 localStorage
const CacheManager = {
    // 更新時間儲存的鍵名
    UPDATE_TIME_KEY: 'updatetime',

    // 儲存快取資料到 localStorage
    saveToCache: function (key, data) {
        const cacheData = {
            data: data,
            timestamp: new Date().getTime()
        };
        localStorage.setItem(key, JSON.stringify(cacheData));
    },

    // 從 localStorage 取得快取資料
    getFromCache: function (key) {
        const cacheData = localStorage.getItem(key);
        if (!cacheData) return null;
        return JSON.parse(cacheData);
    },

    // 檢查是否有快取資料
    hasCache: function (key) {
        return localStorage.getItem(key) !== null;
    },

    // 獲取資料的最後更新時間
    getLastUpdateTime: function (key) {
        if (this.hasCache(this.UPDATE_TIME_KEY)) {
            const times = JSON.parse(localStorage.getItem(this.UPDATE_TIME_KEY));
            return times[key] || 0;
        }
        return 0;
    },

    // 更新最後更新時間
    setLastUpdateTime: function (key, time) {
        const times = this.hasCache(this.UPDATE_TIME_KEY) ?
            JSON.parse(localStorage.getItem(this.UPDATE_TIME_KEY)) : {};
        times[key] = time;
        localStorage.setItem(this.UPDATE_TIME_KEY, JSON.stringify(times));
    },

    // 獲取最新消息資料 - 公開資料，任何人都可以訪問
    getNews: async function () {
        try {
            // 檢查用戶是否已登入，如果登入則處理刪除記錄
            if (window.auth.currentUser) {
                await this.processDeleteLogs();
            }

            // 獲取上次更新時間
            const lastUpdateTime = this.getLastUpdateTime('news');
            const currentTime = new Date().getTime();

            // 檢查是否有快取
            if (this.hasCache('news')) {
                // 從資料庫中獲取新的資料
                const snapshot = await window.db.collection('news')
                    .orderBy('updatetime', 'desc')
                    .get();

                // 如果有新資料，更新快取
                if (!snapshot.empty) {
                    // 將快取後的資料按時間戳過濾
                    const newData = snapshot.docs
                        .filter(doc => {
                            const updateTime = doc.data().updatetime ?
                                doc.data().updatetime.toDate().getTime() : 0;
                            return updateTime > lastUpdateTime;
                        })
                        .map(doc => ({
                            id: doc.id,
                            ...doc.data(),
                            updatetime: doc.data().updatetime ?
                                doc.data().updatetime.toDate().getTime() : currentTime
                        }));

                    if (newData.length > 0) {
                        const cachedData = this.getFromCache('news').data;

                        // 合併新舊資料
                        const mergedData = [...cachedData, ...newData];

                        // 按時間排序
                        mergedData.sort((a, b) => b.updatetime - a.updatetime);

                        // 更新快取
                        this.saveToCache('news', mergedData);

                        // 更新時間戳
                        this.setLastUpdateTime('news', currentTime);

                        console.log(`新聞: 已同步 ${newData.length} 條記錄`);
                        return mergedData;
                    }
                }

                console.log('新聞: 沒有新資料');
                return this.getFromCache('news').data;
            } else {
                // 沒有快取，從資料庫取得最新10筆資料
                const snapshot = await window.db.collection('news')
                    .orderBy('updatetime', 'desc')
                    .limit(10)
                    .get();

                const newsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    updatetime: doc.data().updatetime ?
                        doc.data().updatetime.toDate().getTime() : currentTime
                }));

                // 儲存到快取
                this.saveToCache('news', newsData);

                // 更新時間戳
                this.setLastUpdateTime('news', currentTime);

                console.log(`新聞: 首次載入 ${newsData.length} 條記錄`);
                return newsData;
            }
        } catch (error) {
            console.error('獲取最新消息失敗：', error);

            // 如果有快取，返回快取資料
            if (this.hasCache('news')) {
                return this.getFromCache('news').data;
            }
            return [];
        }
    },

    // 獲取課程資料 - 公開資料，任何人都可以訪問
    getCourses: async function () {
        try {
            // 檢查用戶是否已登入，如果登入則處理刪除記錄
            if (window.auth.currentUser) {
                await this.processDeleteLogs();
            }

            // 獲取上次更新時間
            const lastUpdateTime = this.getLastUpdateTime('course');
            const currentTime = new Date().getTime();

            // 檢查是否有快取
            if (this.hasCache('course')) {
                // 從資料庫中獲取新的資料
                const snapshot = await window.db.collection('course')
                    .orderBy('updatetime', 'desc')
                    .get();

                // 將快取後的資料按時間戳過濾
                const newData = snapshot.docs
                    .filter(doc => {
                        const updateTime = doc.data().updatetime ?
                            doc.data().updatetime.toDate().getTime() : 0;
                        return updateTime > lastUpdateTime;
                    })
                    .map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        updatetime: doc.data().updatetime ?
                            doc.data().updatetime.toDate().getTime() : currentTime
                    }));

                if (newData.length > 0) {
                    const cachedData = this.getFromCache('course').data;

                    // 合併新舊資料
                    const mergedData = [...cachedData, ...newData];

                    // 按時間排序
                    mergedData.sort((a, b) => b.updatetime - a.updatetime);

                    // 更新快取
                    this.saveToCache('course', mergedData);

                    // 更新時間戳
                    this.setLastUpdateTime('course', currentTime);

                    console.log(`課程: 已同步 ${newData.length} 條記錄`);
                    return mergedData;
                }

                console.log('課程: 沒有新資料');
                return this.getFromCache('course').data;
            } else {
                // 沒有快取，從資料庫取得最新10筆資料
                const snapshot = await window.db.collection('course')
                    .orderBy('updatetime', 'desc')
                    .limit(10)
                    .get();

                const courseData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    updatetime: doc.data().updatetime ?
                        doc.data().updatetime.toDate().getTime() : currentTime
                }));

                // 儲存到快取
                this.saveToCache('course', courseData);

                // 更新時間戳
                this.setLastUpdateTime('course', currentTime);

                console.log(`課程: 首次載入 ${courseData.length} 條記錄`);
                return courseData;
            }
        } catch (error) {
            console.error('獲取課程資料失敗：', error);

            // 如果有快取，返回快取資料
            if (this.hasCache('course')) {
                return this.getFromCache('course').data;
            }
            return [];
        }
    },

    // 獲取成員資料 - 需要登入權限
    getMembers: async function () {
        // 如果用戶未登入，則不進行操作
        if (!window.auth.currentUser) {
            console.log('未登入，無法獲取成員資料');
            return [];
        }
        try {
            // 處理刪除記錄
            await this.processDeleteLogs();

            // 獲取上次更新時間
            const lastUpdateTime = this.getLastUpdateTime('member');
            const currentTime = new Date().getTime();

            // 檢查是否有快取
            if (this.hasCache('member')) {
                // 從資料庫中獲取新的資料
                const snapshot = await window.db.collection('member')
                    .orderBy('updatetime', 'desc')
                    .get();

                // 將快取後的資料按時間戳過濾
                const newData = snapshot.docs
                    .filter(doc => {
                        const updateTime = doc.data().updatetime ?
                            doc.data().updatetime.toDate().getTime() : 0;
                        return updateTime > lastUpdateTime;
                    })
                    .map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        updatetime: doc.data().updatetime ?
                            doc.data().updatetime.toDate().getTime() : currentTime
                    }));

                if (newData.length > 0) {
                    const cachedData = this.getFromCache('member').data;

                    // 合併新舊資料
                    const mergedData = [...cachedData, ...newData];

                    // 按名字排序
                    mergedData.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hant'));

                    // 更新快取
                    this.saveToCache('member', mergedData);

                    // 更新時間戳
                    this.setLastUpdateTime('member', currentTime);

                    console.log(`成員: 已同步 ${newData.length} 條記錄`);
                    return mergedData;
                }

                console.log('成員: 沒有新資料');
                return this.getFromCache('member').data;
            } else {
                // 沒有快取，從資料庫取得所有資料
                const snapshot = await window.db.collection('member')
                    .orderBy('name')
                    .get();

                const memberData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    updatetime: doc.data().updatetime ?
                        doc.data().updatetime.toDate().getTime() : currentTime
                }));

                // 儲存到快取
                this.saveToCache('member', memberData);

                // 更新時間戳
                this.setLastUpdateTime('member', currentTime);

                console.log(`成員: 首次載入 ${memberData.length} 條記錄`);
                return memberData;
            }
        } catch (error) {
            console.error('獲取成員資料失敗：', error);

            // 如果有快取，返回快取資料
            if (this.hasCache('member')) {
                return this.getFromCache('member').data;
            }
            return [];
        }
    },

    // 處理刪除記錄 - 需要登入權限
    processDeleteLogs: async function () {
        // 如果用戶未登入，則不進行操作
        if (!window.auth.currentUser) {
            console.log('未登入，跳過處理刪除記錄');
            return;
        }

        try {
            // 獲取刪除日誌的上次更新時間
            const lastUpdateTime = this.getLastUpdateTime('delectlog');
            const currentTime = new Date().getTime();

            // 查詢新的刪除記錄
            const snapshot = await window.db.collection('delectlog')
                .where('updatetime', '>', new Date(lastUpdateTime))
                .orderBy('updatetime', 'desc')
                .get();

            if (snapshot.empty) {
                console.log('刪除日誌: 沒有新記錄');
                return;
            }

            // 處理刪除記錄
            snapshot.forEach(doc => {
                const deleteInfo = doc.data();
                const targetTable = deleteInfo.name;
                const targetId = deleteInfo.id;

                if (targetTable && targetId && this.hasCache(targetTable)) {
                    // 從對應表的快取中刪除記錄
                    const cacheData = this.getFromCache(targetTable);
                    if (cacheData && cacheData.data) {
                        const updatedData = cacheData.data.filter(item => item.id !== targetId);
                        this.saveToCache(targetTable, updatedData);
                        console.log(`已從 ${targetTable} 中刪除 ID 為 ${targetId} 的記錄`);
                    }
                }
            });

            // 更新刪除日誌的時間戳
            this.setLastUpdateTime('delectlog', currentTime);

            console.log(`刪除日誌: 已處理 ${snapshot.size} 條記錄`);
        } catch (error) {
            console.error('處理刪除記錄失敗：', error);
        }
    },

    // 獲取報名資料 - 需要登入權限
    getRegistrations: async function () {
        // 如果用戶未登入，則不進行操作
        if (!window.auth.currentUser) {
            console.log('未登入，無法獲取報名資料');
            return [];
        }

        try {
            // 處理刪除記錄
            await this.processDeleteLogs();

            // 獲取上次更新時間
            const lastUpdateTime = this.getLastUpdateTime('Registration');
            const currentTime = new Date().getTime();

            // 檢查是否有快取
            if (this.hasCache('Registration')) {
                // 從資料庫中獲取新的資料
                const snapshot = await window.db.collection('Registration')
                    .orderBy('enrollDate', 'desc')
                    .get();

                // 將快取後的資料按時間戳過濾
                const newData = snapshot.docs
                    .filter(doc => {
                        const enrollDate = doc.data().enrollDate ?
                            doc.data().enrollDate.toDate().getTime() : 0;
                        return enrollDate > lastUpdateTime;
                    })
                    .map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        enrollDate: doc.data().enrollDate ?
                            doc.data().enrollDate.toDate().getTime() : currentTime
                    }));

                if (newData.length > 0) {
                    const cachedData = this.getFromCache('Registration').data;

                    // 合併新舊資料
                    const mergedData = [...cachedData, ...newData];

                    // 按報名時間排序
                    mergedData.sort((a, b) => b.enrollDate - a.enrollDate);

                    // 更新快取
                    this.saveToCache('Registration', mergedData);

                    // 更新時間戳
                    this.setLastUpdateTime('Registration', currentTime);

                    console.log(`報名: 已同步 ${newData.length} 條記錄`);
                    return mergedData;
                }

                console.log('報名: 沒有新資料');
                return this.getFromCache('Registration').data;
            } else {
                // 沒有快取，從資料庫取得最新20筆資料
                const snapshot = await window.db.collection('Registration')
                    .orderBy('enrollDate', 'desc')
                    .limit(20)
                    .get();

                const RegistrationData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    enrollDate: doc.data().enrollDate ?
                        doc.data().enrollDate.toDate().getTime() : currentTime
                }));

                // 儲存到快取
                this.saveToCache('Registration', RegistrationData);

                // 更新時間戳
                this.setLastUpdateTime('Registration', currentTime);

                console.log(`報名: 首次載入 ${RegistrationData.length} 條記錄`);
                return RegistrationData;
            }
        } catch (error) {
            console.error('獲取報名資料失敗：', error);

            // 如果有快取，返回快取資料
            if (this.hasCache('Registration')) {
                return this.getFromCache('Registration').data;
            }
            return [];
        }
    },

    // 清除所有快取
    clearAllCache: function () {
        localStorage.removeItem('news');
        localStorage.removeItem('course');
        localStorage.removeItem('member');
        localStorage.removeItem('Registration');
        localStorage.removeItem(this.UPDATE_TIME_KEY);
        console.log('已清除所有快取');
    },

    // 初始化函數，頁面載入時調用
    init: async function () {
        console.log('初始化資料管理器...');

        try {
            // 延遲載入公開資料，以確保頁面已經完全載入
            setTimeout(async () => {
                try {
                    // 只載入公開資料
                    await this.getNews();
                    await this.getCourses();
                    console.log('公開資料載入完成');
                } catch (error) {
                    console.error('載入公開資料失敗：', error);
                }
            }, 1000);

            // 監聽認證狀態變化
            window.auth.onAuthStateChanged(async (user) => {
                if (user) {
                    // 使用者已登入，載入需要權限的資料
                    console.log('用戶已登入，載入敏感資料');
                    try {
                        await this.processDeleteLogs();
                        await this.getMembers();
                        await this.getRegistrations();
                        console.log('敏感資料載入完成');
                    } catch (error) {
                        console.error('載入敏感資料失敗：', error);
                    }
                } else {
                    console.log('用戶未登入，跳過載入敏感資料');
                }
            });

            // 設置定期檢查公開資料更新（每30分鐘）
            setInterval(async () => {
                try {
                    await this.getNews();
                    await this.getCourses();

                    // 如果用戶已登入，也更新敏感資料
                    if (window.auth.currentUser) {
                        await this.processDeleteLogs();
                        await this.getMembers();
                        await this.getRegistrations();
                    }

                    console.log('定期資料更新完成');
                } catch (error) {
                    console.error('定期資料更新失敗：', error);
                }
            }, 30 * 60 * 1000);
        } catch (error) {
            console.error('初始化資料管理器失敗：', error);
        }
    }
};

// 確保 login 函數在全局作用域可用
window.login = function () {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    window.auth.signInWithEmailAndPassword(email, password)
        .catch(function (error) {
            const loginError = document.getElementById('loginError');
            if (loginError) {
                loginError.textContent = `錯誤: ${error.message}`;
            }
        });
};

// 確保 logout 函數在全局作用域可用
window.logout = function () {
    window.auth.signOut();
};