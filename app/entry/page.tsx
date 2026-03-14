/**
 * Daily Entry Page - 每日数据录入
 */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveHealthData, HealthData } from '@/lib/storage'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { PlusCircle, Activity } from 'lucide-react'

export default function DailyEntry() {
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    bpLeftSystolic: '',
    bpLeftDiastolic: '',
    bpRightSystolic: '',
    bpRightDiastolic: '',
    weight: '',
    waist: '',
    notes: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const calculateHigherBP = (left: number, right: number) => {
    return Math.max(left || 0, right || 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const leftSys = parseInt(formData.bpLeftSystolic) || 0
    const leftDia = parseInt(formData.bpLeftDiastolic) || 0
    const rightSys = parseInt(formData.bpRightSystolic) || 0
    const rightDia = parseInt(formData.bpRightDiastolic) || 0

    const higherSys = calculateHigherBP(leftSys, rightSys)
    const higherDia = calculateHigherBP(leftDia, rightDia)

    const healthData: HealthData = {
      id: Date.now().toString(),
      date: formData.date,
      bpLeftSystolic: leftSys,
      bpLeftDiastolic: leftDia,
      bpRightSystolic: rightSys,
      bpRightDiastolic: rightDia,
      bpSystolic: higherSys,
      bpDiastolic: higherDia,
      weight: parseFloat(formData.weight) || 0,
      waist: parseFloat(formData.waist) || 0,
      notes: formData.notes,
      createdAt: new Date().toISOString(),
    }

    saveHealthData(healthData)
    router.push('/')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const higherSys = calculateHigherBP(
    parseInt(formData.bpLeftSystolic) || 0,
    parseInt(formData.bpRightSystolic) || 0
  )
  const higherDia = calculateHigherBP(
    parseInt(formData.bpLeftDiastolic) || 0,
    parseInt(formData.bpRightDiastolic) || 0
  )

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">每日录入</h1>
        <p className="text-gray-600 mt-2">记录今天的健康数据</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            新建记录
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                日期
              </label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-xl">
              <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                左臂血压
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">收缩压 (mmHg)</label>
                  <Input
                    name="bpLeftSystolic"
                    type="number"
                    placeholder="120"
                    value={formData.bpLeftSystolic}
                    onChange={handleChange}
                    min="50"
                    max="250"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">舒张压 (mmHg)</label>
                  <Input
                    name="bpLeftDiastolic"
                    type="number"
                    placeholder="80"
                    value={formData.bpLeftDiastolic}
                    onChange={handleChange}
                    min="30"
                    max="150"
                  />
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 p-4 rounded-xl">
              <h3 className="text-sm font-semibold text-emerald-900 mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                右臂血压
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">收缩压 (mmHg)</label>
                  <Input
                    name="bpRightSystolic"
                    type="number"
                    placeholder="120"
                    value={formData.bpRightSystolic}
                    onChange={handleChange}
                    min="50"
                    max="250"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">舒张压 (mmHg)</label>
                  <Input
                    name="bpRightDiastolic"
                    type="number"
                    placeholder="80"
                    value={formData.bpRightDiastolic}
                    onChange={handleChange}
                    min="30"
                    max="150"
                  />
                </div>
              </div>
            </div>

            {(higherSys > 0 || higherDia > 0) && (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
                <p className="text-sm text-amber-800">
                  <strong>记录值（较高一侧）: </strong>
                  <span className="text-lg font-bold">{higherSys || '--'}/{higherDia || '--'}</span>
                  <span className="text-xs text-amber-600 ml-2">用于趋势分析</span>
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">体重 (kg)</label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  step="0.1"
                  placeholder="70.5"
                  value={formData.weight}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="waist" className="block text-sm font-medium text-gray-700 mb-1">腰围 (cm)</label>
                <Input
                  id="waist"
                  name="waist"
                  type="number"
                  step="0.1"
                  placeholder="85.0"
                  value={formData.waist}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">备注</label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例如：运动情况、饮食注意、身体感受..."
                value={formData.notes}
                onChange={handleChange}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? '保存中...' : '保存记录'}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push('/')}>
                取消
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}