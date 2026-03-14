/**
 * Daily Supplements Page - 今日服用记录
 * 
 * Track daily supplement and medication intake
 */
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  loadDailySupplements, 
  saveDailySupplement, 
  toggleDailySupplementTaken,
  deleteDailySupplement,
  loadSupplements,
  DailySupplement 
} from '@/lib/storage'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'
import { Button } from '@/components/Button'
import { Check, Plus, Trash2, Clock } from 'lucide-react'

export default function DailySupplements() {
  const router = useRouter()
  const [today] = useState(new Date().toISOString().split('T')[0])
  const [dailyRecords, setDailyRecords] = useState<DailySupplement[]>([])
  const [supplementLibrary] = useState(loadSupplements())
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedSupplement, setSelectedSupplement] = useState('')
  const [selectedTime, setSelectedTime] = useState('08:00')

  useEffect(() => {
    setDailyRecords(loadDailySupplements(today))
  }, [today])

  const handleAdd = () => {
    if (!selectedSupplement) return
    
    const sup = supplementLibrary.find(s => s.id === selectedSupplement)
    if (!sup) return

    const record: DailySupplement = {
      id: Date.now().toString(),
      supplementId: sup.id,
      name: sup.name,
      dosage: sup.dosage,
      type: sup.type,
      time: selectedTime,
      taken: false,
      date: today,
      createdAt: new Date().toISOString(),
    }

    saveDailySupplement(record)
    setDailyRecords(loadDailySupplements(today))
    setShowAddForm(false)
    setSelectedSupplement('')
  }

  const handleToggle = (id: string) => {
    toggleDailySupplementTaken(id)
    setDailyRecords(loadDailySupplements(today))
  }

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这条记录吗？')) {
      deleteDailySupplement(id)
      setDailyRecords(loadDailySupplements(today))
    }
  }

  const takenCount = dailyRecords.filter(r => r.taken).length
  const progress = dailyRecords.length > 0 ? (takenCount / dailyRecords.length) * 100 : 0

  // Group by time
  const grouped = dailyRecords.reduce((acc, record) => {
    if (!acc[record.time]) acc[record.time] = []
    acc[record.time].push(record)
    return acc
  }, {} as Record<string, DailySupplement[]>)

  const sortedTimes = Object.keys(grouped).sort()

  if (supplementLibrary.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">请先添加补剂到补剂库</p>
        <Button 
          onClick={() => router.push('/supplements-library.html')} 
          className="mt-4"
        >
          前往补剂库
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">今日服用</h1>
          <p className="text-gray-600 mt-2">{new Date().toLocaleDateString('zh-CN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)} 
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          添加记录
        </Button>
      </div>

      {/* Progress Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">今日完成度</span>
            <span className="text-sm font-bold text-blue-600">{takenCount}/{dailyRecords.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      {/* Add Form */}
      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>添加今日服用</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">选择补剂</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={selectedSupplement}
                onChange={(e) => setSelectedSupplement(e.target.value)}
              >
                <option value="">请选择...</option>
                {supplementLibrary.map((sup) => (
                  <option key={sup.id} value={sup.id}>
                    {sup.name} ({sup.dosage}) - {sup.type === 'medication' ? '药物' : '补剂'}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">服用时间</label>
              <input
                type="time"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd}>确认添加</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>取消</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Records by Time */}
      <div className="space-y-4">
        {sortedTimes.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>今日暂无服用记录</p>
              <p className="text-sm mt-2">点击"添加记录"开始记录</p>
            </CardContent>
          </Card>
        ) : (
          sortedTimes.map((time) => (
            <Card key={time}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {time}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {grouped[time].map((record) => (
                    <div 
                      key={record.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        record.taken 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggle(record.id)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                            record.taken
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-300 hover:border-blue-500'
                          }`}
                        >
                          {record.taken && <Check className="w-4 h-4 text-white" />}
                        </button>
                        <div>
                          <p className={`font-medium ${record.taken ? 'line-through text-gray-500' : ''}`}>
                            {record.name}
                          </p>
                          <p className="text-sm text-gray-500">{record.dosage}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(record.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}