/**
 * Supplements Page - 补剂和药物管理
 * 
 * Track daily supplements and medications
 */
'use client'

import { useState, useEffect } from 'react'
import { loadSupplements, saveSupplement, deleteSupplement, Supplement } from '@/lib/storage'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Pill, Plus, Trash2 } from 'lucide-react'

export default function Supplements() {
  const [supplements, setSupplements] = useState<Supplement[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [newSupplement, setNewSupplement] = useState({
    name: '',
    dosage: '',
    frequency: '',
    type: 'supplement' as 'supplement' | 'medication',
  })

  // Load supplements on mount
  useEffect(() => {
    setSupplements(loadSupplements())
  }, [])

  // Handle add
  const handleAdd = () => {
    if (!newSupplement.name) return

    const supplement: Supplement = {
      id: Date.now().toString(),
      ...newSupplement,
      createdAt: new Date().toISOString(),
    }

    saveSupplement(supplement)
    setSupplements(loadSupplements())
    setIsAdding(false)
    setNewSupplement({ name: '', dosage: '', frequency: '', type: 'supplement' })
  }

  // Handle delete
  const handleDelete = (id: string) => {
    if (confirm('确定要删除吗？')) {
      deleteSupplement(id)
      setSupplements(loadSupplements())
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">补剂 & 药物</h1>
          <p className="text-gray-600 mt-2">管理您的营养补剂和药物</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          添加
        </Button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="名称（如：维生素D）"
                value={newSupplement.name}
                onChange={(e) => setNewSupplement({ ...newSupplement, name: e.target.value })}
              />
              <Input
                placeholder="剂量（如：1000 IU）"
                value={newSupplement.dosage}
                onChange={(e) => setNewSupplement({ ...newSupplement, dosage: e.target.value })}
              />
              <Input
                placeholder="频率（如：每日一次）"
                value={newSupplement.frequency}
                onChange={(e) => setNewSupplement({ ...newSupplement, frequency: e.target.value })}
              />
              <div className="flex gap-2">
                <select
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  value={newSupplement.type}
                  onChange={(e) => setNewSupplement({ ...newSupplement, type: e.target.value as 'supplement' | 'medication' })}
                >
                  <option value="supplement">营养补剂</option>
                  <option value="medication">药物</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleAdd}>保存</Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>取消</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Supplements List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {supplements.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-gray-500">
              <Pill className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>暂无补剂或药物</p>
            </CardContent>
          </Card>
        ) : (
          supplements.map((sup) => (
            <Card key={sup.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      sup.type === 'medication' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      <Pill className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{sup.name}</h3>
                      <p className="text-sm text-gray-600">{sup.dosage}</p>
                      <p className="text-xs text-gray-500 mt-1">{sup.frequency}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(sup.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}