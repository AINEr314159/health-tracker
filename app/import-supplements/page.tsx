/**
 * Import Supplements Page - 批量导入补剂和药物
 * 
 * Import from Excel/text format
 */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveSupplement } from '@/lib/storage'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'
import { Button } from '@/components/Button'
import { Upload, FileText, CheckCircle, Pill } from 'lucide-react'

export default function ImportSupplements() {
  const router = useRouter()
  const [inputData, setInputData] = useState('')
  const [parsedData, setParsedData] = useState<any[]>([])
  const [message, setMessage] = useState('')

  // Parse Excel/text format
  const parseData = () => {
    const lines = inputData.trim().split('\n')
    const data: { name: string; dosage: string; frequency: string; type: string; raw: string }[] = []
    
    for (const line of lines) {
      // Skip empty lines and headers
      if (!line.trim() || line.includes('时间') || line.includes('药物') || line.includes('--------')) continue
      
      // Try to parse different formats
      
      // Format 1: 时间 | 补剂 | 药物 (tab or | separated)
      if (line.includes('|') || line.includes('\t')) {
        const parts = line.split(/[|\t]+/).map(p => p.trim()).filter(p => p)
        
        // Look for supplement in the line
        const timeMatch = parts.find(p => /(早餐|午餐|晚餐|睡前|晨起|午后|上午|下午|早晚)/.test(p))
        const supplementMatch = parts.find(p => 
          /(AKG|NMN|鱼油|辅酶|Q10|D3|K2|叶酸|镁|维生素|叶黄素|益生菌|氨糖|软骨素)/i.test(p)
        )
        
        if (supplementMatch) {
          data.push({
            name: supplementMatch,
            dosage: extractDosage(supplementMatch) || '按说明',
            frequency: timeMatch || '每日',
            type: /(他汀|地平|沙坦|普利|洛尔|降压药|降糖药)/.test(supplementMatch) ? 'medication' : 'supplement',
            raw: line,
          })
        }
      }
      
      // Format 2: 简单列表 - 名称 剂量 频率
      else {
        // Try to extract supplement names
        const knownSupplements = [
          { name: '瑞舒伐他汀', pattern: /瑞舒伐他汀|他汀/i, dosage: '10mg' },
          { name: '苯磺酸氨氯地平', pattern: /氨氯地平|地平/i, dosage: '5mg' },
          { name: 'AKG', pattern: /AKG/i, dosage: '按说明' },
          { name: 'NMN', pattern: /NMN/i, dosage: '按说明' },
          { name: '辅酶Q10', pattern: /辅酶|CoQ10|Q10/i, dosage: '100mg' },
          { name: '鱼油', pattern: /鱼油|EPA|DHA|Omega/i, dosage: '1-2粒' },
          { name: '维生素D3', pattern: /维生素D|D3/i, dosage: '按说明' },
          { name: '维生素K2', pattern: /K2/i, dosage: '按说明' },
          { name: 'L-苏糖酸镁', pattern: /苏糖酸镁|镁/i, dosage: '144mg' },
          { name: '叶酸', pattern: /叶酸/i, dosage: '按说明' },
          { name: '叶黄素', pattern: /叶黄素/i, dosage: '按说明' },
          { name: 'TMG', pattern: /TMG|甜菜碱/i, dosage: '按说明' },
          { name: '综合维生素', pattern: /综合维生素|复合维生素/i, dosage: '按说明' },
          { name: '护肝片', pattern: /护肝|水飞蓟/i, dosage: '按说明' },
          { name: '氨糖软骨素', pattern: /氨糖|软骨素/i, dosage: '按说明' },
          { name: '益生菌', pattern: /益生菌/i, dosage: '按说明' },
        ]
        
        for (const sup of knownSupplements) {
          if (sup.pattern.test(line)) {
            // Check if not already added
            if (!data.find(d => d.name === sup.name)) {
              data.push({
                name: sup.name,
                dosage: extractDosage(line) || sup.dosage,
                frequency: extractFrequency(line),
                type: /(他汀|地平|沙坦|普利|洛尔)/.test(sup.name) ? 'medication' : 'supplement',
                raw: line,
              })
            }
            break
          }
        }
      }
    }
    
    setParsedData(data)
    setMessage(`解析成功！共 ${data.length} 条记录`)
  }

  // Extract dosage from text
  function extractDosage(text: string): string {
    const match = text.match(/(\d+\s*(mg|g|μg|mcg|IU|粒|片|粒|mg\/.*))/i)
    return match ? match[0] : ''
  }

  // Extract frequency from text
  function extractFrequency(text: string): string {
    if (/晨起|早晨|早上|早餐前|早餐/.test(text)) return '晨起'
    if (/睡前|晚上|晚间/.test(text)) return '睡前'
    if (/午餐|中午|午后/.test(text)) return '午餐时'
    if (/晚餐|晚饭/.test(text)) return '晚餐时'
    if (/每日|每天/.test(text)) return '每日'
    if (/早晚/.test(text)) return '早晚各一次'
    return '每日'
  }

  // Import data
  const importData = () => {
    for (const item of parsedData) {
      saveSupplement({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: item.name,
        dosage: item.dosage,
        frequency: item.frequency,
        type: item.type,
        createdAt: new Date().toISOString(),
      })
    }
    
    alert(`✅ 成功导入 ${parsedData.length} 条记录！`)
    router.push('/supplements')
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">导入补剂计划</h1>
        <p className="text-gray-600 mt-2">从Excel或其他格式批量导入</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            复制粘贴导入
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            打开Excel文件，复制内容，粘贴到下方文本框：
          </p>
          
          <textarea
            className="w-full h-80 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder="在此粘贴Excel内容...\n\n例如：\n晨起 | AKG + NMN\n早餐后 | 鱼油 2粒\n睡前 | 瑞舒伐他汀 10mg"
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
          />
          
          <div className="flex gap-4">
            <Button onClick={parseData} variant="outline">
              解析数据
            </Button>
            {parsedData.length > 0 && (
              <Button onClick={importData} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                导入 {parsedData.length} 条记录
              </Button>
            )}
          </div>          
          {message && (
            <p className="text-sm text-green-600">{message}</p>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>支持的补剂列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600">
            {[
              '瑞舒伐他汀 (药物)',
              '苯磺酸氨氯地平 (药物)',
              'AKG',
              'NMN',
              '辅酶Q10',
              '鱼油 / Omega-3',
              '维生素D3',
              '维生素K2',
              'L-苏糖酸镁',
              '叶酸',
              '叶黄素',
              'TMG (甜菜碱)',
              '综合维生素',
              '护肝片',
              '氨糖软骨素',
              '益生菌',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Pill className="w-3 h-3 text-blue-500" />
                {item}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      {parsedData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>数据预览</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">名称</th>
                    <th className="px-4 py-2 text-left">剂量</th>
                    <th className="px-4 py-2 text-left">频率</th>
                    <th className="px-4 py-2 text-left">类型</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {parsedData.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 font-medium">{item.name}</td>
                      <td className="px-4 py-2 text-gray-600">{item.dosage}</td>
                      <td className="px-4 py-2 text-gray-600">{item.frequency}</td>
                      <td className="px-4 py-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          item.type === 'medication' 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {item.type === 'medication' ? '💊 药物' : '🌿 补剂'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}