// 靜態成員數據
const memberData = [
  {
    "id": "fZKGVxSc9WiJuzKVO8aI",
    "name": "測試會員",
    "tag": "監事,一般會員,授課講師",
    "updatetime": "2025-03-07T06:27:52.289Z",
    "introduction": "會員內文介紹"
  }
];

// 將數據顯式附加到 window 對象
window.member = memberData;

// 在控制台輸出確認信息
console.log("member.js 已加載，靜態數據包含 " + memberData.length + " 條成員資料");