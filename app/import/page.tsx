/**
 * Import Page - 批量数据导入
 * 
 * Import health data from text format with left/right arm BP
 */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveHealthData } from '@/lib/storage'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'
import { Button } from '@/components/Button'
import { Upload, FileText, CheckCircle } from 'lucide-react'

export default function Import() {
  const router = useRouter()
  const [inputData, setInputData] = useState('')
  const [parsedData, setParsedData] = useState<any[]>([])
  const [message, setMessage] = useState('')

  const parseData = () => {
    const lines = inputData.trim().split('\n')
    const data = []
    
    for (const line of lines) {
      // Match pattern: 2026.3.1 左113/73 右119/75 92.0 80.80
      // Or: 2026.3.1 113/73 92.0 80.80 (single measurement)
      const match = line.match(/(\d{4})\.(\d{1,2})\.(\d{1,2})\s+((?:左|右)?[\d/；;\s]+)\s+([\d.]+)\s+([\d.]+)/)
      
      if (match) {
        const [, year, month, day, bpSection, waist, weight] = match
        
        let leftSys = 0, leftDia = 0, rightSys = 0, rightDia = 0
        
        // Check if has left/right markers
        if (bpSection.includes('左') || bpSection.includes('右')) {
          // Parse with left/right markers
          const leftMatch = bpSection.match(/左(\d+)\/(\d+)/)
          const rightMatch = bpSection.match(/右(\d+)\/(\d+)/)
          
          if (leftMatch) {
            leftSys = parseInt(leftMatch[1])
            leftDia = parseInt(leftMatch[2])
          }
          if (rightMatch) {
            rightSys = parseInt(rightMatch[1])
            rightDia = parseInt(rightMatch[2])
          }
        } else {
          // Single measurement - treat as both arms same
          const bpMatch = bpSection.match(/(\d+)\/(\d+)/)
          if (bpMatch) {
            leftSys = rightSys = parseInt(bpMatch[1])
            leftDia = rightDia = parseInt(bpMatch[2])
          }
        }
        
        const higherSys = Math.max(leftSys, rightSys)
        const higherDia = Math.max(leftDia, rightDia)
        
        data.push({
          date: `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`,
          bpLeftSystolic: leftSys,
          bpLeftDiastolic: leftDia,
          bpRightSystolic: rightSys,
          bpRightDiastolic: rightDia,
          bpSystolic: higherSys,
          bpDiastolic: higherDia,
          waist: parseFloat(waist),
          weight: parseFloat(weight),
        })
      }
    }
    
    setParsedData(data)
    setMessage(`解析成功！共 ${data.length} 条记录`)
  }

  const importData = () => {
    for (const item of parsedData) {
      saveHealthData({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        ...item,
        notes: '',
        createdAt: new Date().toISOString(),
      })
    }
    
    alert(`✅ 成功导入 ${parsedData.length} 条记录！`)
    router.push('/')
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">批量导入</h1>
        <p className="text-gray-600 mt-2">从文本格式批量导入历史数据（支持左右臂血压）</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            数据格式说明
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            每行一条记录，支持左右臂分别记录：
          </p>
          <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm space-y-2">
            <div>格式1（左右臂分别记录）：</div>
            <div>日期 左收缩/舒张 右收缩/舒张 腰围 体重</div>
            <div className="text-blue-600">2026.3.1 左113/73 右119/75 92.0 80.80</div>
            <div className="mt-2">格式2（单臂记录）：</div>
            <div className="text-emerald-600">2026.3.2 118/76 93.0 80.65</div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            💡 系统将自动取较高一侧的数值用于趋势分析
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            粘贴数据
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <textarea
            className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder="在此粘贴你的数据..."
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

      {/* Preview */}
      {parsedData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>数据预览（较高一侧用于趋势）</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">日期</th>
                    <th className="px-4 py-2 text-left">左臂</th>
                    <th className="px-4 py-2 text-left">右臂</th>
                    <th className="px-4 py-2 text-left text-amber-600">记录值</th>
                    <th className="px-4 py-2 text-left">腰围</th>
                    <th className="px-4 py-2 text-left">体重</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {parsedData.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">{item.date}</td>
                      <td className="px-4 py-2 text-blue-600">
                        {item.bpLeftSystolic > 0 ? `${item.bpLeftSystolic}/${item.bpLeftDiastolic}` : '--'}
                      </td>
                      <td className="px-4 py-2 text-emerald-600">
                        {item.bpRightSystolic > 0 ? `${item.bpRightSystolic}/${item.bpRightDiastolic}` : '--'}
                      </td>
                      <td className="px-4 py-2 font-bold text-amber-700">
                        {item.bpSystolic}/{item.bpDiastolic}
                      </td>
                      <td className="px-4 py-2">{item.waist} cm</td>
                      <td className="px-4 py-2">{item.weight} kg</td>
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