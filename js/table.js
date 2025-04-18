        // 表格配置信息
        const TableConfig = {
            // 新聞配置
            news: {
                collectionName: 'news',    // Firestore 集合名稱
                cacheName: 'news',         // 快取名稱
                tableId: 'newsTableBody',  // HTML 表格 ID
                searchInputId: 'newsSearchInput',  // 搜尋輸入框 ID
                modalId: 'addNewsModal',   // Modal ID
                formId: 'addNewsForm',     // 表單 ID
                modalLabelId: 'addNewsModalLabel', // Modal 標題 ID
                defaultImage: 'img/news-default.jpg',  // 默認圖片
                deleteLogName: 'news',     // 刪除記錄名稱
                addBtnId: 'addNewsBtn',    // 添加按鈕 ID

                // 表單字段映射
                formFields: {
                    title: 'newsTitle',
                    content: 'newsDescription'
                },

                // 表格行生成函數
                createTableRow: (item) => {
                    const updateDate = item.updatetime ?
                        new Date(item.updatetime.seconds * 1000).toLocaleDateString() : '無日期';
                    return `
                        <td>${item.title}</td>
                        <td>${updateDate}</td>
                        <td>
                            <button class="btn btn-sm btn-primary" onclick="TableManager.edit('news', '${item.id}')">編輯</button>
                            <button class="btn btn-sm btn-danger" onclick="TableManager.delete('news', '${item.id}')">刪除</button>
                        </td>
                    `;
                },

                // 排序函數
                sortFunc: (a, b) => {
                    // 使用 Firebase Timestamp 格式正確排序
                    if (a.updatetime && b.updatetime) {
                        if (a.updatetime.seconds !== b.updatetime.seconds) {
                            return b.updatetime.seconds - a.updatetime.seconds;
                        }
                        return b.updatetime.nanoseconds - a.updatetime.nanoseconds;
                    }
                    return 0;
                },

                // 搜尋過濾函數
                filterFunc: (item, searchTerm) => {
                    return item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase());
                },

                // 從表單獲取數據的函數
                getFormData: () => {
                    return {
                        title: document.getElementById('newsTitle').value,
                        content: processTextareaContent(document.getElementById('newsDescription').value),
                        updatetime: firebase.firestore.FieldValue.serverTimestamp(),
                        urls: collectUrlData('newsUrlContainer')
                    };
                }
            },

            // 課程配置
            course: {
                collectionName: 'course',
                cacheName: 'course',
                tableId: 'coursesTableBody',
                searchInputId: 'courseSearchInput',
                teacherSearchId: 'teacherSearchSelect',
                modalId: 'addCourseModal',
                formId: 'addCourseForm',
                modalLabelId: 'addCourseModalLabel',
                defaultImage: 'img/course-default.jpg',
                deleteLogName: 'course',
                addBtnId: 'addCourseBtn',

                formFields: {
                    title: 'courseTitle',
                    teacher: 'courseTeacher',
                    startdate: 'courseStartDate',
                    enddate: 'courseEndDate',
                    price: 'coursePrice',
                    location: 'courseLocation',
                    description: 'courseDescription',
                    capacity: 'courseCapacity'
                },

                createTableRow: (item) => {
                    // 日期格式化顯示
                    console.log(item);
                    let dateDisplay = '無時間';
                    if (item.startdate) {
                        const startDate = new Date(item.startdate);
                        const formattedStart = startDate.toLocaleDateString('zh-TW');
                        if (item.enddate) {
                            const endDate = new Date(item.enddate);
                            const formattedEnd = endDate.toLocaleDateString('zh-TW');
                            dateDisplay = `${formattedStart} 至 ${formattedEnd}`;
                        } else {
                            dateDisplay = formattedStart;
                        }
                    }

                    // 設定開課狀態顯示
                    const isActive = item.active !== false; // 如果 active 不存在或為 true，則視為開課中
                    const statusBtnClass = isActive ? 'btn-success' : 'btn-danger';
                    const statusText = isActive ? '開課中' : '已取消';

                    return `
                        <td>${item.title || '無標題'}</td>
                        <td>${item.teacher || '無教師'}</td>
                        <td>${dateDisplay}</td>
                        <td>${item.price || 0}</td>
                        <td>${item.capacity || '無限制'}</td>
                        <td><span class="badge ${isActive ? 'bg-success' : 'bg-danger'}">${statusText}</span></td>
                        <td>
                            <button class="btn btn-sm btn-primary" onclick="TableManager.edit('course', '${item.id}')">編輯</button>
                            <button class="btn btn-sm btn-danger" onclick="TableManager.delete('course', '${item.id}')">刪除</button>
                            <button class="btn btn-sm ${statusBtnClass}" onclick="toggleCourseStatus('${item.id}', ${!isActive})">${isActive ? '取消開課' : '恢復開課'}</button>
                        </td>
                    `;
                },

                sortFunc: (a, b) => {
                    if (a.startdate && b.startdate) {
                        if (a.startdate.seconds !== b.startdate.seconds) {
                            return b.startdate.seconds - a.startdate.seconds;
                        }
                        return b.startdate.nanoseconds - a.startdate.nanoseconds;
                    }
                    return 0;
                },

                filterFunc: (item, searchTerm, teacherTerm) => {
                    const titleMatch = item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase());
                    const teacherMatch = !teacherTerm || (item.teacher && item.teacher === teacherTerm);
                    return titleMatch && teacherMatch;
                },

                getFormData: () => {
                    return {
                        title: document.getElementById('courseTitle').value,
                        teacher: document.getElementById('courseTeacher').value,
                        startdate: document.getElementById('courseStartDate').value,
                        enddate: document.getElementById('courseEndDate').value,
                        price: parseInt(document.getElementById('coursePrice').value),
                        location: document.getElementById('courseLocation').value,
                        description: processTextareaContent(document.getElementById('courseDescription').value),
                        capacity: parseInt(document.getElementById('courseCapacity').value) || 0,
                        active: true, // 預設為開課中
                        updatetime: firebase.firestore.FieldValue.serverTimestamp(),
                        urls: collectUrlData('courseUrlContainer')
                    };
                }
            },

            // 成員配置
            member: {
                collectionName: 'member',
                cacheName: 'member',
                tableId: 'membersTableBody',
                searchInputId: 'memberSearchInput',
                titleSearchId: 'titleSearchSelect',
                modalId: 'addMemberModal',
                formId: 'addMemberForm',
                modalLabelId: 'addMemberModalLabel',
                defaultImage: 'img/member-default.jpg',
                deleteLogName: 'member',
                addBtnId: 'addMemberBtn',

                formFields: {
                    name: 'memberName',
                    tag: 'memberTitle',
                    mail: 'memberEmail',
                    phone: 'memberPhone',
                    introduction: 'memberDescription'
                },

                createTableRow: (item) => {
                    // 將標籤數組轉換為顯示用字串
                    const tagDisplay = Array.isArray(item.tag) ? item.tag.join(', ') : (item.tag || '-');

                    return `
                        <td>${item.name}</td>
                        <td>${tagDisplay}</td>
                        <td>${item.mail || '-'}</td>
                        <td>${item.phone || '-'}</td>
                        <td>
                            <button class="btn btn-sm btn-primary" onclick="TableManager.edit('member', '${item.id}')">編輯</button>
                            <button class="btn btn-sm btn-danger" onclick="TableManager.delete('member', '${item.id}')">刪除</button>
                        </td>
                    `;
                },

                sortFunc: (a, b) => {
                    // 職位排序
                    const positionOrder = {
                        '理事長': 1,
                        '副理事長': 2,
                        '秘書長': 3,
                        '顧問': 4,
                        '常務監事': 5,
                        '常務理事': 6,
                        '理事': 7,
                        '監事': 8,
                        '會員': 9
                    };

                    const tagA = Array.isArray(a.tag) ? a.tag[0] : a.tag;
                    const tagB = Array.isArray(b.tag) ? b.tag[0] : b.tag;

                    const orderA = positionOrder[tagA] || 99;
                    const orderB = positionOrder[tagB] || 99;

                    return orderA - orderB;
                },

                filterFunc: (item, searchTerm, titleTerm) => {
                    const nameMatch = item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase());

                    // 修改標籤篩選邏輯，支持數組形式的標籤
                    const titleMatch = !titleTerm || (Array.isArray(item.tag) && item.tag.includes(titleTerm));

                    return nameMatch && titleMatch;
                },

                getFormData: () => {
                    // 獲取選中的標籤
                    const selectedTags = [];
                    document.querySelectorAll('#memberTagsContainer input[type="checkbox"]:checked').forEach(checkbox => {
                        selectedTags.push(checkbox.value);
                    });
                    return {
                        name: document.getElementById('memberName').value,
                        tag: selectedTags, // 保存為數組
                        mail: document.getElementById('memberEmail').value,
                        phone: document.getElementById('memberPhone').value,
                        introduction: processTextareaContent(document.getElementById('memberDescription').value),
                        updatetime: firebase.firestore.FieldValue.serverTimestamp(),
                        urls: collectUrlData('memberUrlContainer')
                    };
                }
            },

            // 報名資料配置
            registration: {
                collectionName: 'enrollments',
                cacheName: 'Registration',
                tableId: 'registrationsTableBody',
                courseSelectId: 'registrationCourseSelect',
                deleteLogName: 'enrollments',


                createTableRow: (item) => {
                    const updateDate = item.updatetime ?
                        new Date(item.updatetime.seconds * 1000).toLocaleDateString() : '無日期';

                    // 取得報到狀態並設定不同的按鈕樣式
                    const isCheckedIn = item.check_in === true;
                    const checkInBtnClass = isCheckedIn ? 'btn-success' : 'btn-outline-success';
                    const checkInBtnText = isCheckedIn ? '已報到' : '未報到';

                    // 取得匯款狀態並設定不同的按鈕樣式
                    const isPaid = item.paid === true;
                    const paidBtnClass = isPaid ? 'btn-success' : 'btn-outline-secondary';
                    const paidBtnText = isPaid ? '已匯款' : '未匯款';

                    return `
                        <td>${item.courseName || '未知課程'}</td>
                        <td>${item.name || '未知'}</td>
                        <td>${item.phone || '無'}</td>
                        <td>${item.email || '無'}</td>
                        <td>${updateDate}</td>
                        <td>${item.participants || 1}</td>
                        <td>${item.totalFee || '未知'}</td>
                        <td>
                            <button class="btn btn-sm ${checkInBtnClass}" onclick="toggleCheckIn('${item.id}', ${!isCheckedIn})">
                                ${checkInBtnText}
                            </button>
                        </td>
                        <td>
                            <button class="btn btn-sm ${paidBtnClass}" onclick="togglePaidStatus('${item.id}', ${!isPaid})">
                                ${paidBtnText}
                            </button>
                        </td>
                        <td>
                            <button class="btn btn-sm btn-danger" onclick="TableManager.delete('registration', '${item.id}')">刪除</button>
                        </td>
                    `;
                },

                sortFunc: (a, b) => {
                    if (a.updatetime && b.updatetime) {
                        if (a.updatetime.seconds !== b.updatetime.seconds) {
                            return b.updatetime.seconds - a.updatetime.seconds;
                        }
                        return b.updatetime.nanoseconds - a.updatetime.nanoseconds;
                    } else if (a.enrollDate && b.enrollDate) {
                        return new Date(b.enrollDate) - new Date(a.enrollDate);
                    }
                    return 0;
                },

                filterFunc: (item, courseTerm) => {
                    return !courseTerm || (item.courseName && item.courseName === courseTerm);
                }
            },

            // 活動花絮配置
            photoAlbum: {
                collectionName: 'photo_album',
                cacheName: 'photo_album',
                tableId: 'photoAlbumsTableBody',
                searchInputId: 'photoAlbumSearchInput',
                modalId: 'addPhotoAlbumModal',
                formId: 'addPhotoAlbumForm',
                modalLabelId: 'addPhotoAlbumModalLabel',
                deleteLogName: 'photo_album',

                formFields: {
                    id: 'photoAlbumId',
                    title: 'photoAlbumTitle',
                    url: 'photoAlbumUrl'
                },

                createTableRow: (item) => {
                    const updateDate = item.updatetime ?
                        new Date(item.updatetime.seconds * 1000).toLocaleDateString() : '無日期';
                    const shortenedUrl = item.url ? (item.url.length > 30 ? item.url.substring(0, 30) + '...' : item.url) : '無連結';
                    
                    return `
                        <td>${item.title || '無標題'}</td>
                        <td>${updateDate}</td>
                        <td><a href="${item.url}" target="_blank" title="${item.url}">${shortenedUrl}</a></td>
                        <td>
                            <button class="btn btn-sm btn-primary" onclick="TableManager.edit('photoAlbum', '${item.id}')">編輯</button>
                            <button class="btn btn-sm btn-danger" onclick="TableManager.delete('photoAlbum', '${item.id}')">刪除</button>
                        </td>
                    `;
                },

                sortFunc: (a, b) => {
                    if (a.updatetime && b.updatetime) {
                        if (a.updatetime.seconds !== b.updatetime.seconds) {
                            return b.updatetime.seconds - a.updatetime.seconds;
                        }
                        return b.updatetime.nanoseconds - a.updatetime.nanoseconds;
                    }
                    return 0;
                },

                filterFunc: (item, searchTerm) => {
                    return !searchTerm || (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase()));
                },

                getFormData: () => {
                    return {
                        title: document.getElementById('photoAlbumTitle').value,
                        url: document.getElementById('photoAlbumUrl').value,
                        updatetime: firebase.firestore.FieldValue.serverTimestamp()
                    };
                }
            }
        };

        // 表格管理器 - 統一處理所有表格的增刪改查操作
        const TableManager = {
            // 加載表格數據
            load: function (tableType) {
                const config = TableConfig[tableType];
                if (!config) return;

                const data = AdminDataManager.getTableCache(config.cacheName);
                const tableBody = document.getElementById(config.tableId);
                tableBody.innerHTML = '';

                // 特殊處理 - 報名表不自動加載數據
                if (tableType === 'registration') {
                    this.updateDropdowns(tableType);
                    tableBody.innerHTML = '<tr><td colspan="7" class="text-center">請使用上方的搜尋功能查詢報名資料</td></tr>';
                    return;
                }

                // 確保有資料且為陣列
                if (!data || !Array.isArray(data) || data.length === 0) {
                    console.log(`沒有${tableType}資料或資料格式不正確`);
                    return;
                }

                // 更新下拉選單
                this.updateDropdowns(tableType);

                // 按設定排序
                const sortedData = [...data].sort(config.sortFunc);

                // 生成表格行
                sortedData.forEach(item => {
                    const row = document.createElement('tr');
                    row.innerHTML = config.createTableRow(item);
                    tableBody.appendChild(row);
                });
            },

            // 搜尋表格數據
            search: function (tableType) {
                const config = TableConfig[tableType];
                if (!config) return;

                const data = AdminDataManager.getTableCache(config.cacheName);
                const tableBody = document.getElementById(config.tableId);
                tableBody.innerHTML = '';

                // 確保有資料且為陣列
                if (!data || !Array.isArray(data) || data.length === 0) {
                    console.log(`沒有${tableType}資料或資料格式不正確`);
                    return;
                }

                // 獲取搜尋條件
                let searchTerm = '';
                let secondaryTerm = '';

                if (tableType === 'news') {
                    searchTerm = document.getElementById(config.searchInputId).value;
                } else if (tableType === 'course') {
                    searchTerm = document.getElementById(config.searchInputId).value;
                    secondaryTerm = document.getElementById(config.teacherSearchId).value;
                } else if (tableType === 'member') {
                    searchTerm = document.getElementById(config.searchInputId).value;
                    secondaryTerm = document.getElementById(config.titleSearchId).value;
                } else if (tableType === 'registration') {
                    searchTerm = document.getElementById(config.courseSelectId).value;
                    // 如果未選擇課程
                    if (!searchTerm) {
                        tableBody.innerHTML = '<tr><td colspan="7" class="text-center">請選擇課程以查詢報名資料</td></tr>';
                        return;
                    }
                }

                // 按設定排序
                const sortedData = [...data].sort(config.sortFunc);

                // 過濾搜尋結果
                const filteredData = sortedData.filter(item => config.filterFunc(item, searchTerm, secondaryTerm));

                if (filteredData.length === 0 && tableType === 'registration') {
                    tableBody.innerHTML = '<tr><td colspan="7" class="text-center">沒有找到符合條件的報名資料</td></tr>';
                    return;
                }

                // 生成表格行
                filteredData.forEach(item => {
                    const row = document.createElement('tr');
                    row.innerHTML = config.createTableRow(item);
                    tableBody.appendChild(row);
                });
            },

            // 更新下拉選單
            updateDropdowns: function (tableType) {
                if (tableType === 'course') {
                    this.updateTeacherDropdown();
                } else if (tableType === 'member') {
                    this.updateTitleDropdown();
                } else if (tableType === 'registration') {
                    this.updateRegistrationCourseDropdown();
                }
            },

            // 更新授課老師下拉選單
            updateTeacherDropdown: function () {
                const teacherSelect = document.getElementById('teacherSearchSelect');
                teacherSelect.innerHTML = '<option value="">選擇授課老師</option>';

                // 從member資料中獲取具有授課講師標籤的成員
                const membersData = AdminDataManager.getTableCache('member');

                // 收集所有有授課講師標籤的成員
                const teachers = new Set();
                membersData.forEach(member => {
                    if (member.tag && Array.isArray(member.tag) && member.tag.includes('授課講師')) {
                        teachers.add(member.name);
                    }
                });

                // 將授課老師添加到下拉選單
                teachers.forEach(teacher => {
                    const option = document.createElement('option');
                    option.value = teacher;
                    option.textContent = teacher;
                    teacherSelect.appendChild(option);
                });
            },

            // 更新職稱下拉選單
            updateTitleDropdown: function () {
                const titleSelect = document.getElementById('titleSearchSelect');
                titleSelect.innerHTML = '<option value="">選擇職稱</option>';

                // 使用固定的職稱列表
                const titles = ['會長', '理事長', '副理事長', '常務理事', '常務監事', '理事', '監事', '一般會員', '授課講師'];

                // 將職稱添加到下拉選單
                titles.forEach(title => {
                    const option = document.createElement('option');
                    option.value = title;
                    option.textContent = title;
                    titleSelect.appendChild(option);
                });
            },

            // 更新報名課程下拉選單
            updateRegistrationCourseDropdown: function () {
                const courseSelect = document.getElementById('registrationCourseSelect');
                courseSelect.innerHTML = '<option value="">選擇課程</option>';

                // 從課程資料中獲取課程標題
                const coursesData = AdminDataManager.getTableCache('course');

                // 按時間排序，最新的在前面
                const sortedCourses = [...coursesData].sort((a, b) => {
                    if (a.updatetime && b.updatetime) {
                        if (a.updatetime.seconds !== b.updatetime.seconds) {
                            return b.updatetime.seconds - a.updatetime.seconds;
                        }
                        return b.updatetime.nanoseconds - a.updatetime.nanoseconds;
                    }
                    return 0;
                });

                // 收集所有唯一的課程名稱
                const courses = new Set();
                sortedCourses.forEach(course => {
                    if (course.title) {
                        courses.add(course.title);
                    }
                });

                // 將課程名稱添加到下拉選單
                courses.forEach(courseTitle => {
                    const option = document.createElement('option');
                    option.value = courseTitle;
                    option.textContent = courseTitle;
                    courseSelect.appendChild(option);
                });
            },

            // 添加新記錄
            add: function (tableType) {
                const config = TableConfig[tableType];
                if (!config) return;

                const form = document.getElementById(config.formId);

                if (!form.checkValidity()) {
                    form.reportValidity();
                    return;
                }

                // 獲取文件上傳元素
                const fileInput = document.getElementById(`${tableType}ImageUpload`);

                // 處理圖片上傳
                handleImageUpload(config.collectionName, null, fileInput)
                    .then(docId => {
                        // 獲取表單數據
                        const data = config.getFormData();

                        // 使用返回的docId或生成新的
                        const finalDocId = docId || firebase.firestore().collection(config.collectionName).doc().id;

                        // 保存到Firestore
                        window.db.collection(config.collectionName).doc(finalDocId).set(data)
                            .then(() => {
                                const modal = bootstrap.Modal.getInstance(document.getElementById(config.modalId));
                                modal.hide();
                                form.reset();

                                // 同步數據後重新加載
                                AdminDataManager.syncTable(config.cacheName).then(() => {
                                    this.load(tableType);
                                    loadDashboard();
                                });

                                alert(`新增${tableType}成功！`);
                            })
                            .catch(error => {
                                alert(`新增失敗: ${error.message}`);
                            });
                    })
                    .catch(error => {
                        alert(`圖片上傳失敗: ${error.message}`);
                    });
            },

            // 編輯記錄
            edit: function (tableType, id) {
                console.log(`開始編輯 ${tableType} 文檔，ID: ${id}`);
                
                const config = TableConfig[tableType];
                if (!config) {
                    console.error(`找不到 ${tableType} 的配置信息`);
                    return;
                }

                // 從 Firestore 獲取資料
                window.db.collection(config.collectionName).doc(id).get()
                    .then(doc => {
                        if (doc.exists) {
                            const data = doc.data();
                            data.id = doc.id;
                            
                            console.log(`獲取到文檔資料:`, data);
                            
                            // 設置要編輯的資料
                            TableManager.currentEditId = id;
                            
                            // 獲取表單和模態窗口
                            const form = document.getElementById(config.formId);
                            const modal = document.getElementById(config.modalId);
                            const modalLabel = document.getElementById(config.modalLabelId);
                            
                            if (!form || !modal || !modalLabel) {
                                console.error('找不到必要的DOM元素');
                                return;
                            }
                            
                            // 更新表單元素
                            for (const [fieldName, elementId] of Object.entries(config.formFields)) {
                                const element = document.getElementById(elementId);
                                if (element) {
                                    element.value = data[fieldName] || '';
                                }
                            }

                            // 特殊處理 - 成員標籤
                            if (tableType === 'member' && Array.isArray(data.tag)) {
                                initMemberTags(data.tag);
                            }

                            // 特殊處理 - URL
                            if (data.urls && Array.isArray(data.urls)) {
                                // 清空現有的URL欄位
                                this.clearUrlContainer(tableType);
                                
                                // 添加每個URL
                                data.urls.forEach(urlItem => {
                                    const parts = urlItem.split('|||');
                                    if (parts.length === 2) {
                                        this.addUrlFieldWithValues(`${tableType}UrlContainer`, parts[0], parts[1]);
                                    }
                                });
                            }
                            
                            // 更新標題
                            modalLabel.textContent = `編輯${tableType}`;
                            
                            // 更新提交按鈕
                            const submitButton = form.querySelector('button[type="submit"]') || 
                                              modal.querySelector('.modal-footer .btn-primary');
                            if (submitButton) {
                                submitButton.textContent = '更新';
                                
                                // 移除現有的事件監聽器
                                const newSubmitButton = submitButton.cloneNode(true);
                                submitButton.parentNode.replaceChild(newSubmitButton, submitButton);
                                
                                // 添加新的事件監聽器
                                if (tableType === 'photoAlbum') {
                                    newSubmitButton.onclick = function(e) {
                                        e.preventDefault();
                                        addPhotoAlbum(id);
                                    };
                                } else {
                                    newSubmitButton.onclick = () => this.update(tableType, id);
                                }
                            }
                            
                            // 顯示模態窗口
                            const modalInstance = new bootstrap.Modal(modal);
                            modalInstance.show();
                            
                            // 設置焦點
                            modal.addEventListener('shown.bs.modal', function() {
                                const firstInput = form.querySelector('input, textarea, select');
                                if (firstInput) {
                                    firstInput.focus();
                                }
                            }, { once: true });
                            
                        } else {
                            console.error('找不到要編輯的文檔');
                            alert('找不到要編輯的資料');
                        }
                    })
                    .catch(error => {
                        console.error('獲取資料失敗:', error);
                        alert(`獲取資料失敗: ${error.message}`);
                    });
            },

            // 清空URL容器
            clearUrlContainer: function (tableType) {
                const containerId = `${tableType}UrlContainer`;
                const container = document.getElementById(containerId);
                if (container) {
                    // 保留第一個URL項目，清空其中的值
                    const firstItem = container.querySelector('.url-item');
                    if (firstItem) {
                        const textInput = firstItem.querySelector('.url-text');
                        const linkInput = firstItem.querySelector('.url-link');
                        if (textInput) textInput.value = '';
                        if (linkInput) linkInput.value = '';

                        // 刪除其他所有項目
                        Array.from(container.querySelectorAll('.url-item:not(:first-child)')).forEach(item => {
                            container.removeChild(item);
                        });
                    }
                }
            },

            // 添加帶有預設值的URL字段
            addUrlFieldWithValues: function (containerId, text, link) {
                const urlContainer = document.getElementById(containerId);

                // 如果第一個項目是空的，填充它而不是添加新項目
                const firstItem = urlContainer.querySelector('.url-item');
                if (firstItem) {
                    const textInput = firstItem.querySelector('.url-text');
                    const linkInput = firstItem.querySelector('.url-link');

                    if (textInput && linkInput && textInput.value === '' && linkInput.value === '') {
                        textInput.value = text;
                        linkInput.value = link;
                        return;
                    }
                }

                // 否則添加新項目
                const newUrlItem = document.createElement('div');
                newUrlItem.className = 'url-item row mb-2';
                newUrlItem.innerHTML = `
                    <div class="col-4">
                        <input type="text" class="form-control url-text" placeholder="顯示文字" value="${text}">
                    </div>
                    <div class="col-6">
                        <input type="url" class="form-control url-link" placeholder="連結地址" value="${link}">
                    </div>
                    <div class="col-1">
                        <button type="button" class="btn btn-danger btn-sm remove-url">×</button>
                    </div>
                `;

                urlContainer.appendChild(newUrlItem);

                // 綁定刪除按鈕事件
                newUrlItem.querySelector('.remove-url').addEventListener('click', function () {
                    urlContainer.removeChild(newUrlItem);
                });
            },

            // 更新記錄
            update: function (tableType, id) {
                const config = TableConfig[tableType];
                if (!config) return;

                const form = document.getElementById(config.formId);

                if (!form.checkValidity()) {
                    form.reportValidity();
                    return;
                }

                // 獲取文件上傳元素
                const fileInput = document.getElementById(`${tableType}ImageUpload`);

                // 檢查是否有新上傳的圖片
                if (fileInput.files && fileInput.files[0]) {
                    // 處理圖片上傳
                    handleImageUpload(config.collectionName, id, fileInput)
                        .then(() => {
                            // 獲取表單數據
                            const data = config.getFormData();

                            // 保存到Firestore
                            this.saveUpdate(tableType, id, data);
                        })
                        .catch(error => {
                            alert(`圖片上傳失敗: ${error.message}`);
                        });
                } else {
                    // 沒有新圖片，直接獲取表單數據
                    const data = config.getFormData();

                    // 保存到Firestore
                    this.saveUpdate(tableType, id, data);
                }
            },

            // 保存更新
            saveUpdate: function (tableType, id, data) {
                const config = TableConfig[tableType];

                window.db.collection(config.collectionName).doc(id).update(data)
                    .then(() => {
                        const modal = bootstrap.Modal.getInstance(document.getElementById(config.modalId));
                        modal.hide();

                        // 徹底清空表單
                        this.resetForm(tableType);

                        // 還原Modal標題和按鈕
                        document.getElementById(config.modalLabelId).textContent = `新增${tableType}`;
                        const submitButton = document.querySelector(`#${config.modalId} .modal-footer .btn-primary`);
                        submitButton.textContent = '儲存';
                        submitButton.onclick = () => this.add(tableType);

                        // 同步數據後重新加載
                        AdminDataManager.syncTable(config.cacheName).then(() => {
                            this.load(tableType);
                            loadDashboard();
                        });

                        alert(`更新${tableType}成功！`);
                    })
                    .catch(error => {
                        alert(`更新失敗: ${error.message}`);
                    });
            },

            // 新增方法：重置表單
            resetForm: function (tableType) {
                const config = TableConfig[tableType];
                if (!config) return;

                // 重置表單基本欄位
                const form = document.getElementById(config.formId);
                form.reset();

                // 處理特殊欄位
                if (tableType === 'member') {
                    // 清空標籤選擇
                    initMemberTags([]);
                }

                // 還原Modal標題和按鈕
                document.getElementById(config.modalLabelId).textContent = `新增${tableType}`;
                const submitButton = document.querySelector(`#${config.modalId} .modal-footer .btn-primary`);
                submitButton.textContent = '儲存';
                submitButton.onclick = () => this.add(tableType);

                console.log(`已重置${tableType}表單`);
            },

            // 刪除記錄
            delete: function (tableType, id) {
                const config = TableConfig[tableType];
                if (!config) return;

                if (confirm(`確定要刪除這個${tableType}嗎？`)) {
                    // 首先添加一條刪除記錄
                    window.db.collection('delectlog').add({
                        name: config.deleteLogName,
                        id: id,
                        updatetime: firebase.firestore.FieldValue.serverTimestamp()
                    })
                        .then(() => {
                            // 然後刪除實際記錄
                            return window.db.collection(config.collectionName).doc(id).delete();
                        })
                        .then(() => {
                            // 同步刪除日誌和表格數據
                            return Promise.all([
                                AdminDataManager.syncTable('delectlog'),
                                AdminDataManager.syncTable(config.cacheName)
                            ]);
                        })
                        .then(() => {
                            this.load(tableType);
                            loadDashboard();
                            alert('刪除成功！');
                        })
                        .catch(error => {
                            alert(`刪除失敗: ${error.message}`);
                        });
                }
            },

            // 更新授課老師下拉選單 (新增一個方法用於Modal)
            updateTeacherSelect: function () {
                const teacherSelect = document.getElementById('courseTeacher');
                teacherSelect.innerHTML = '<option value="">選擇授課老師</option>';

                // 從member資料中獲取具有授課講師標籤的成員
                const membersData = AdminDataManager.getTableCache('member');

                // 收集所有有授課講師標籤的成員
                const teachers = new Set();
                membersData.forEach(member => {
                    if (member.tag && Array.isArray(member.tag) && member.tag.includes('授課講師')) {
                        teachers.add(member.name);
                    }
                });

                // 將授課老師添加到下拉選單
                teachers.forEach(teacher => {
                    const option = document.createElement('option');
                    option.value = teacher;
                    option.textContent = teacher;
                    teacherSelect.appendChild(option);
                });
            }
        };
