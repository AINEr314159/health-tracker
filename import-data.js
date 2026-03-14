// health-data-import.js
// 将此代码复制到浏览器控制台执行，即可导入数据

const healthData = [
  { date: '2026-03-01', bpSystolic: 116, bpDiastolic: 74, waist: 92.0, weight: 80.80, notes: '早晚各一次测量，取平均值' },
  { date: '2026-03-02', bpSystolic: 118, bpDiastolic: 75, waist: 93.0, weight: 80.65, notes: '' },
  { date: '2026-03-03', bpSystolic: 116, bpDiastolic: 71, waist: 92.0, weight: 80.30, notes: '' },
  { date: '2026-03-04', bpSystolic: 112, bpDiastolic: 72, waist: 92.0, weight: 79.90, notes: '' },
  { date: '2026-03-05', bpSystolic: 116, bpDiastolic: 72, waist: 91.4, weight: 80.00, notes: '' },
  { date: '2026-03-06', bpSystolic: 116, bpDiastolic: 74, waist: 92.0, weight: 80.00, notes: '' },
  { date: '2026-03-07', bpSystolic: 115, bpDiastolic: 69, waist: 91.0, weight: 78.80, notes: '' },
  { date: '2026-03-08', bpSystolic: 122, bpDiastolic: 78, waist: 90.5, weight: 79.40, notes: '' },
  { date: '2026-03-09', bpSystolic: 120, bpDiastolic: 73, waist: 90.0, weight: 79.25, notes: '' },
  { date: '2026-03-10', bpSystolic: 121, bpDiastolic: 74, waist: 90.5, weight: 79.20, notes: '' },
  { date: '2026-03-11', bpSystolic: 120, bpDiastolic: 76, waist: 90.5, weight: 79.30, notes: '' },
  { date: '2026-03-12', bpSystolic: 118, bpDiastolic: 70, waist: 90.5, weight: 79.40, notes: '' },
  { date: '2026-03-13', bpSystolic: 0, bpDiastolic: 0, waist: 90.0, weight: 79.05, notes: '今日未测量血压' },
];

// 导入函数
function importData() {
  const STORAGE_KEY = 'health_tracker_data';
  
  // 加载现有数据
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  
  // 转换新数据格式
  const newRecords = healthData.map((item, index) => ({
    id: `import_${Date.now()}_${index}`,
    ...item,
    createdAt: new Date(item.date).toISOString(),
  }));
  
  // 合并数据（新数据会覆盖同日期的旧数据）
  const merged = [...existing.filter(e => !healthData.find(h => h.date === e.date)), ...newRecords];
  
  // 按日期排序
  merged.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // 保存
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  
  console.log(`✅ 成功导入 ${newRecords.length} 条记录！`);
  console.log('📊 数据概览：');
  console.log(`   最早: ${merged[0]?.date}`);
  console.log(`   最新: ${merged[merged.length - 1]?.date}`);
  console.log(`   总计: ${merged.length} 条记录`);
  
  return merged;
}

// 执行导入
importData();
