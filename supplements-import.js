// supplements-import.js
// 在浏览器控制台执行此代码导入补剂

const supplements = [
  // 药物
  {
    name: '瑞舒伐他汀',
    dosage: '10mg',
    frequency: '每晚10点',
    type: 'medication',
  },
  {
    name: '苯磺酸氨氯地平',
    dosage: '5mg',
    frequency: '上午',
    type: 'medication',
  },
  // 补剂
  {
    name: 'AKG',
    dosage: '按说明',
    frequency: '早上随餐',
    type: 'supplement',
  },
  {
    name: 'NMN',
    dosage: '按说明',
    frequency: '早上空腹',
    type: 'supplement',
  },
  {
    name: '辅酶Q10',
    dosage: '100mg',
    frequency: '午餐后',
    type: 'supplement',
  },
  {
    name: '鱼油',
    dosage: 'EPA+DHA ~1.8g',
    frequency: '午餐后',
    type: 'supplement',
  },
  {
    name: '维生素D3+K2',
    dosage: '按说明',
    frequency: '早上随餐',
    type: 'supplement',
  },
  {
    name: 'L-苏糖酸镁',
    dosage: '144mg',
    frequency: '晚上',
    type: 'supplement',
  },
  {
    name: '叶黄素',
    dosage: '按说明',
    frequency: '每周2次',
    type: 'supplement',
  },
  {
    name: 'TMG（甜菜碱）',
    dosage: '按说明',
    frequency: '早上空腹',
    type: 'supplement',
  },
  {
    name: '综合维生素',
    dosage: '按说明',
    frequency: '每周2次',
    type: 'supplement',
  },
  {
    name: '益生菌',
    dosage: '按说明',
    frequency: '午餐后',
    type: 'supplement',
  },
]

// 导入函数
function importSupplements() {
  const STORAGE_KEY = 'health_tracker_supplements'
  
  // 加载现有数据
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  
  // 转换新数据
  const newRecords = supplements.map((item, index) => ({
    id: `sup_${Date.now()}_${index}`,
    ...item,
    createdAt: new Date().toISOString(),
  }))
  
  // 合并（避免重复）
  const merged = [...existing, ...newRecords]
  
  // 保存
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
  
  console.log(`✅ 成功导入 ${newRecords.length} 条补剂/药物记录！`)
  console.log('📋 导入清单：')
  
  const meds = newRecords.filter(r => r.type === 'medication')
  const sups = newRecords.filter(r => r.type === 'supplement')
  
  if (meds.length > 0) {
    console.log('\n💊 药物：')
    meds.forEach(m => console.log(`   - ${m.name} (${m.dosage}) - ${m.frequency}`))
  }
  
  if (sups.length > 0) {
    console.log('\n🌿 补剂：')
    sups.forEach(s => console.log(`   - ${s.name} (${s.dosage}) - ${s.frequency}`))
  }
  
  return merged
}

// 执行导入
importSupplements()
