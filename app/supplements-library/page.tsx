/**
 * Supplements Library Page - 补剂库
 * 
 * Manage all available supplements and medications
 */
'use client'

import { useState, useEffect } from 'react'
import { 
  loadSupplements, 
  saveSupplement, 
  updateSupplement,
  deleteSupplement,
  Supplement 
} from '@/lib/storage'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Pill, Plus, Trash2, Edit2, Check, X } from 'lucide-react'

export default function SupplementsLibrary() {
  const [supplements, setSupplements] = useState<Supplement[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newSupplement, setNewSupplement] = useState({
    name: '',
    dosage: '',
    frequency: '',
    type: 'supplement' as 'supplement' | 'medication',
  })

  useEffect(() => {
    setSupplements(loadSupplements())
  }, [])

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

  const handleUpdate = (id: string) => {
    if (!newSupplement.name) return
    updateSupplement(id, newSupplement)
    setSupplements(loadSupplements())
    setEditingId(null)
    setNewSupplement({ name: '', dosage: '', frequency: '', type: 'supplement' })
  }

  const handleDelete = (id: string) => {
    if (confirm('确定要删除吗？')) {
      deleteSupplement(id)
      setSupplements(loadSupplements())
    }
  }

  const startEdit = (sup: Supplement) => {
    setEditingId(sup.id)
    setNewSupplement({
      name: sup.name,
      dosage: sup.dosage,
      frequency: sup.frequency,
      type: sup.type,
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setIsAdding(false)
    setNewSupplement({ name: '', dosage: '', frequency: '', type: 'supplement' })
  }

  const medications = supplements.filter(s => s.type === 'medication')
  const regularSupplements = supplements.filter(s => s.type === 'supplement')

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">补剂库</h1>
          <p className="text-gray-600 mt-2">管理所有药物和补剂，从库中选择添加到每日服用</p>
        </div>
        <Button 
          onClick={() => setIsAdding(true)} 
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          添加
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingId ? '编辑' : '添加'}补剂</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">名称</label>
                <Input
                  placeholder="如：维生素D"
                  value={newSupplement.name}
                  onChange={(e) => setNewSupplement({ ...newSupplement, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">剂量</label>
                <Input
                  placeholder="如：1000 IU"
                  value={newSupplement.dosage}
                  onChange={(e) => setNewSupplement({ ...newSupplement, dosage: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">服用频率</label>
                <Input
                  placeholder="如：每日一次"
                  value={newSupplement.frequency}
                  onChange={(e) => setNewSupplement({ ...newSupplement, frequency: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">类型</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newSupplement.type}
                  onChange={(e) => setNewSupplement({ ...newSupplement, type: e.target.value as 'supplement' | 'medication' })}
                >
                  <option value="supplement">营养补剂</option>
                  <option value="medication">药物</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={() => editingId ? handleUpdate(editingId) : handleAdd()}
              >
                <Check className="w-4 h-4 mr-1" />
                {editingId ? '保存' : '添加'}
              </Button>
              <Button variant="outline" onClick={cancelEdit}>
                <X className="w-4 h-4 mr-1" />
                取消
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Medications Section */}
      {medications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            药物 ({medications.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {medications.map((sup) => (
              <SupplementCard 
                key={sup.id} 
                sup={sup} 
                onEdit={() => startEdit(sup)}
                onDelete={() => handleDelete(sup.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Supplements Section */}
      {regularSupplements.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            营养补剂 ({regularSupplements.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {regularSupplements.map((sup) => (
              <SupplementCard 
                key={sup.id} 
                sup={sup} 
                onEdit={() => startEdit(sup)}
                onDelete={() => handleDelete(sup.id)}
              />
            ))}
          </div>
        </div>
      )}

      {supplements.length === 0 && !isAdding && (
        <Card>
          <CardContent className="p-12 text-center">
            <Pill className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">补剂库为空</p>
            <p className="text-sm text-gray-400 mt-2">添加您常用的药物和补剂，之后可在"今日服用"中记录</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function SupplementCard({ 
  sup, 
  onEdit, 
  onDelete 
}: { 
  sup: Supplement; 
  onEdit: () => void; 
  onDelete: () => void;
}) {
  return (
    <Card>
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
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="text-blue-600"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}