function addNews() {
    const form = document.getElementById('addNewsForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // 處理圖片上傳
    handleImageUpload('news', null, document.getElementById('newsImageUpload'))
        .then(docId => {
            // 處理內容中的換行
            const content = processTextareaContent(document.getElementById('newsDescription').value);

            // 收集URL資料
            const urls = collectUrlData('newsUrlContainer');

            // 建立資料物件
            const newsData = {
                title: document.getElementById('newsTitle').value,
                content: content,
                urls: urls,
                updatetime: firebase.firestore.FieldValue.serverTimestamp()
            };

            // 使用返回的docId或生成新的
            const finalDocId = docId || firebase.firestore().collection('news').doc().id;

            // 保存到Firestore
            window.db.collection('news').doc(finalDocId).set(newsData)
                .then(() => {
                    const modal = bootstrap.Modal.getInstance(document.getElementById('addNewsModal'));
                    modal.hide();

                    // 完整清除表單
                    TableManager.resetForm('news');

                    // 清除圖片預覽
                    document.getElementById('newsImagePreview').src = '#';
                    document.getElementById('newsImagePreview').style.display = 'none';

                    // 清空URL容器
                    TableManager.clearUrlContainer('news');

                    // 同步數據後重新加載
                    AdminDataManager.syncTable('news').then(() => {
                        TableManager.load('news');
                        loadDashboard();
                    });

                    alert('新增消息成功！');
                })
                .catch(error => {
                    alert(`新增失敗: ${error.message}`);
                });
        })
        .catch(error => {
            alert(`圖片上傳失敗: ${error.message}`);
        });
}

function searchNews() {
    TableManager.search('news');
}

function addCourse() {
    const form = document.getElementById('addCourseForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // 處理圖片上傳
    handleImageUpload('course', null, document.getElementById('courseImageUpload'))
        .then(docId => {
            // 處理內容中的換行
            const description = processTextareaContent(document.getElementById('courseDescription').value);

            // 收集URL資料
            const urls = collectUrlData('courseUrlContainer');

            // 取得日期資料
            const startDate = document.getElementById('courseStartDate').value;
            const endDate = document.getElementById('courseEndDate').value;

            // 建立資料物件
            const courseData = {
                title: document.getElementById('courseTitle').value,
                teacher: document.getElementById('courseTeacher').value,
                price: parseInt(document.getElementById('coursePrice').value),
                location: document.getElementById('courseLocation').value,
                description: description,
                startdate: startDate,
                enddate: endDate,
                capacity: parseInt(document.getElementById('courseCapacity').value) || 0,
                active: true, // 預設為開課中
                urls: urls,
                updatetime: firebase.firestore.FieldValue.serverTimestamp()
            };

            // 使用返回的docId或生成新的
            const finalDocId = docId || firebase.firestore().collection('course').doc().id;

            // 保存到Firestore
            window.db.collection('course').doc(finalDocId).set(courseData)
                .then(() => {
                    const modal = bootstrap.Modal.getInstance(document.getElementById('addCourseModal'));
                    modal.hide();

                    // 完整清除表單
                    TableManager.resetForm('course');

                    // 清除圖片預覽
                    document.getElementById('courseImagePreview').src = '#';
                    document.getElementById('courseImagePreview').style.display = 'none';

                    // 清空URL容器
                    TableManager.clearUrlContainer('course');

                    // 同步數據後重新加載
                    AdminDataManager.syncTable('course').then(() => {
                        TableManager.load('course');
                        loadDashboard();
                    });

                    alert('新增課程成功！');
                })
                .catch(error => {
                    alert(`新增失敗: ${error.message}`);
                });
        })
        .catch(error => {
            alert(`圖片上傳失敗: ${error.message}`);
        });
}

function searchCourses() {
    TableManager.search('course');
}

function addMember() {
    const form = document.getElementById('addMemberForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // 處理圖片上傳
    handleImageUpload('member', null, document.getElementById('memberImageUpload'))
        .then(docId => {
            // 處理內容中的換行
            const introduction = processTextareaContent(document.getElementById('memberDescription').value);

            // 收集URL資料
            const urls = collectUrlData('memberUrlContainer');

            // 獲取選中的標籤
            const selectedTags = [];
            document.querySelectorAll('#memberTagsContainer input[type="checkbox"]:checked').forEach(checkbox => {
                selectedTags.push(checkbox.value);
            });

            // 建立資料物件
            const memberData = {
                name: document.getElementById('memberName').value,
                tag: selectedTags, // 保存為數組
                mail: document.getElementById('memberEmail').value,
                phone: document.getElementById('memberPhone').value,
                introduction: introduction,
                urls: urls,
                updatetime: firebase.firestore.FieldValue.serverTimestamp()
            };

            // 使用返回的docId或生成新的
            const finalDocId = docId || firebase.firestore().collection('member').doc().id;

            // 保存到Firestore
            window.db.collection('member').doc(finalDocId).set(memberData)
                .then(() => {
                    const modal = bootstrap.Modal.getInstance(document.getElementById('addMemberModal'));
                    modal.hide();

                    // 完整清除表單
                    TableManager.resetForm('member');

                    // 清除圖片預覽
                    document.getElementById('memberImagePreview').src = '#';
                    document.getElementById('memberImagePreview').style.display = 'none';

                    // 清空URL容器
                    TableManager.clearUrlContainer('member');

                    // 重置標籤選擇
                    initMemberTags([]);

                    // 同步數據後重新加載
                    AdminDataManager.syncTable('member').then(() => {
                        TableManager.load('member');
                        loadDashboard();
                    });

                    alert('新增成員成功！');
                })
                .catch(error => {
                    alert(`新增失敗: ${error.message}`);
                });
        })
        .catch(error => {
            alert(`圖片上傳失敗: ${error.message}`);
        });
}

function searchMembers() {
    TableManager.search('member');
}

function searchRegistrations() {
    TableManager.search('registration');
}

function addPhotoAlbum() {
    
    const form = document.getElementById('addPhotoAlbumForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // 處理圖片上傳
    handleImageUpload('photo_album', null, document.getElementById('photoAlbumImageUpload'))
        .then(docId => {
            // 建立資料物件
            const photoAlbumData = {
                title: document.getElementById('photoAlbumTitle').value,
                url: document.getElementById('photoAlbumUrl').value,
                updatetime: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            const inputDocId = document.getElementById('photoAlbumId').value;
            // 使用返回的docId、表單中的ID或生成新的
            const finalDocId = inputDocId || docId || firebase.firestore().collection('photo_album').doc().id;

            // 保存到Firestore
            window.db.collection('photo_album').doc(finalDocId).set(photoAlbumData)
                .then(() => {
                    const modal = bootstrap.Modal.getInstance(document.getElementById('addPhotoAlbumModal'));
                    modal.hide();

                    // 完整清除表單
                    document.getElementById('addPhotoAlbumForm').reset();
                    // 清除圖片預覽
                    document.getElementById('photoAlbumImagePreview').src = '#';
                    document.getElementById('photoAlbumImagePreview').style.display = 'none';

                    // 同步數據後重新加載
                    AdminDataManager.syncTable('photo_album').then(() => {
                        TableManager.load('photoAlbum');
                        loadDashboard();
                    });

                    alert('活動花絮新增/更新成功！');
                })
                .catch(error => {
                    alert(`新增/更新失敗: ${error.message}`);
                });
        })
        .catch(error => {
            alert(`圖片上傳失敗: ${error.message}`);
        });
}

function searchPhotoAlbums() {
    TableManager.search('photoAlbum');
}


