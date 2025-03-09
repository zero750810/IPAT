// 靜態課程數據
const courseData = [
  {
    "id": "CjQxhrLJLlBwPMzstpmJ",
    "title": "課程測試",
    "content": "內文",
    "teacher": "測試老師",
    "add": "測試地址",
    "price": 500,
    "date": "10月30 1200～1300",
    "updatetime": "2025-03-07T13:32:29.497Z"
  }
];

// 將數據顯式附加到 window 對象
window.course = courseData;

// 在控制台輸出確認信息
console.log("course.js 已加載，靜態數據包含 " + courseData.length + " 條課程");