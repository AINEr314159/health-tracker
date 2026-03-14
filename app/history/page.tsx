/**
 * History Page - 历史记录
 */
'use client'

import { useState, useEffect } from 'react'
import { loadHealthData, updateHealthData, deleteHealthData, HealthData } from '@/lib/storage'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Trash2, Calendar, Edit2, Check, X } from 'lucide-react'

export default function History() {
  const [data, setData] = useState<HealthData[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<HealthData>>({})

  useEffect(() => {
    setData(loadHealthData())
  }, [])

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这条记录吗？')) {
      deleteHealthData(id)
      setData(loadHealthData())
    }
  }

  const handleEdit = (record: HealthData) => {
    setEditingId(record.id)
    setEditForm(record)
  }

  const handleSave = () => {
    if (editingId && editForm) {
      // 重新计算较高一侧
      const leftSys = editForm.bpLeftSystolic || 0
      const leftDia = editForm.bpLeftDiastolic || 0
      const rightSys = editForm.bpRightSystolic || 0
      const rightDia = editForm.bpRightDiastolic || 0
      
      const updates = {
        ...editForm,
        bpSystolic: Math.max(leftSys, rightSys),
        bpDiastolic: Math.max(leftDia, rightDia),
      }
      
      updateHealthData(editingId, updates)
      setData(loadHealthData())
      setEditingId(null)
      setEditForm({})
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditForm({})
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">历史记录</h1>
        <p className="text-gray-600 mt-2">查看和管理所有健康数据</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            所有记录 ({data.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>暂无记录</p>
              <p className="text-sm mt-2">点击"每日录入"添加第一条数据</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left font-medium text-gray-700">日期</th>
                    <th className="px-3 py-3 text-left font-medium text-gray-700">左臂血压</th>
                    <th className="px-3 py-3 text-left font-medium text-gray-700">右臂血压</th>
                    <th className="px-3 py-3 text-left font-medium text-gray-700">记录值</th>
                    <th className="px-3 py-3 text-left font-medium text-gray-700">体重</th>
                    <th className="px-3 py-3 text-left font-medium text-gray-700">腰围</th>
                    <th className="px-3 py-3 text-right font-medium text-gray-700">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[...data].reverse().map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      {editingId === record.id ? (
                        <>
                          <td className="px-3 py-3">
                            <Input
                              type="date"
                              value={editForm.date}
                              onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                            />
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex gap-1">
                              <Input
                                type="number"
                                placeholder="左收"
                                value={editForm.bpLeftSystolic || ''}
                                onChange={(e) => setEditForm({ ...editForm, bpLeftSystolic: parseInt(e.target.value) || 0 })}
                                className="w-14 px-1"
                              />
                              <span className="self-center">/</span>
                              <Input
                                type="number"
                                placeholder="左舒"
                                value={editForm.bpLeftDiastolic || ''}
                                onChange={(e) => setEditForm({ ...editForm, bpLeftDiastolic: parseInt(e.target.value) || 0 })}
                                className="w-14 px-1"
                              />
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex gap-1">
                              <Input
                                type="number"
                                placeholder="右收"
                                value={editForm.bpRightSystolic || ''}
                                onChange={(e) => setEditForm({ ...editForm, bpRightSystolic: parseInt(e.target.value) || 0 })}
                                className="w-14 px-1"
                              />
                              <span className="self-center">/</span>
                              <Input
                                type="number"
                                placeholder="右舒"
                                value={editForm.bpRightDiastolic || ''}
                                onChange={(e) => setEditForm({ ...editForm, bpRightDiastolic: parseInt(e.target.value) || 0 })}
                                className="w-14 px-1"
                              />
                            </div>
                          </td>
                          <td className="px-3 py-3 text-amber-600 font-semibold">
                            {Math.max(editForm.bpLeftSystolic || 0, editForm.bpRightSystolic || 0)}/
                            {Math.max(editForm.bpLeftDiastolic || 0, editForm.bpRightDiastolic || 0)}
                          </td>
                          <td className="px-3 py-3">
                            <Input
                              type="number"
                              step="0.1"
                              value={editForm.weight}
                              onChange={(e) => setEditForm({ ...editForm, weight: parseFloat(e.target.value) || 0 })}
                              className="w-20"
                            />
                          </td>
                          <td className="px-3 py-3">
                            <Input
                              type="number"
                              step="0.1"
                              value={editForm.waist}
                              onChange={(e) => setEditForm({ ...editForm, waist: parseFloat(e.target.value) || 0 })}
                              className="w-20"
                            />
                          </td>
                          <td className="px-3 py-3 text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="sm" onClick={handleSave} className="text-green-600">
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={handleCancel} className="text-gray-600">
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-3 py-3">
                            {new Date(record.date).toLocaleDateString('zh-CN')}
                          </td>
                          <td className="px-3 py-3 text-blue-600">
                            {record.bpLeftSystolic && record.bpLeftDiastolic
                              ? `${record.bpLeftSystolic}/${record.bpLeftDiastolic}`
                              : '--'}
                          </td>
                          <td className="px-3 py-3 text-emerald-600">
                            {record.bpRightSystolic && record.bpRightDiastolic
                              ? `${record.bpRightSystolic}/${record.bpRightDiastolic}`
                              : '--'}
                          </td>
                          <td className="px-3 py-3 font-bold text-amber-700">
                            {record.bpSystolic && record.bpDiastolic
                              ? `${record.bpSystolic}/${record.bpDiastolic}`
                              : '--'}
                          </td>
                          <td className="px-3 py-3">
                            {record.weight ? `${record.weight} kg` : '--'}
                          </td>
                          <td className="px-3 py-3">
                            {record.waist ? `${record.waist} cm` : '--'}
                          </td>
                          <td className="px-3 py-3 text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(record)} className="text-blue-600">
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(record.id)} className="text-red-600">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}