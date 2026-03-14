/**
 * Reports Page - 体检报告管理
 * 
 * Upload and manage medical examination reports
 */
'use client'

import { useState, useEffect } from 'react'
import { loadReports, saveReport, deleteReport, MedicalReport } from '@/lib/storage'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { FileText, Plus, Trash2, ExternalLink } from 'lucide-react'

export default function Reports() {
  const [reports, setReports] = useState<MedicalReport[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [newReport, setNewReport] = useState({
    title: '',
    hospital: '',
    date: new Date().toISOString().split('T')[0],
    fileUrl: '',
    notes: '',
  })

  // Load reports on mount
  useEffect(() => {
    setReports(loadReports())
  }, [])

  // Handle add
  const handleAdd = () => {
    if (!newReport.title) return

    const report: MedicalReport = {
      id: Date.now().toString(),
      ...newReport,
      createdAt: new Date().toISOString(),
    }

    saveReport(report)
    setReports(loadReports())
    setIsAdding(false)
    setNewReport({
      title: '',
      hospital: '',
      date: new Date().toISOString().split('T')[0],
      fileUrl: '',
      notes: '',
    })
  }

  // Handle delete
  const handleDelete = (id: string) => {
    if (confirm('确定要删除这份报告吗？')) {
      deleteReport(id)
      setReports(loadReports())
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">体检报告</h1>
          <p className="text-gray-600 mt-2">管理您的医院和体检报告</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          添加报告
        </Button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>新建报告记录</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">报告名称</label>
                <Input
                  placeholder="如：2024年度体检"
                  value={newReport.title}
                  onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">医院/机构</label>
                <Input
                  placeholder="如：协和医院"
                  value={newReport.hospital}
                  onChange={(e) => setNewReport({ ...newReport, hospital: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">检查日期</label>
                <Input
                  type="date"
                  value={newReport.date}
                  onChange={(e) => setNewReport({ ...newReport, date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">文件链接（可选）</label>
                <Input
                  placeholder="PDF链接或云盘地址"
                  value={newReport.fileUrl}
                  onChange={(e) => setNewReport({ ...newReport, fileUrl: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">关键指标摘要</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="记录关键指标，如：血压 120/80，血糖 5.2，胆固醇..."
                value={newReport.notes}
                onChange={(e) => setNewReport({ ...newReport, notes: e.target.value })}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAdd}>保存</Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>取消</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reports List */}
      <div className="space-y-4">
        {reports.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>暂无体检报告</p>
            </CardContent>
          </Card>
        ) : (
          [...reports].reverse().map((report) => (
            <Card key={report.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{report.title}</h3>
                      <p className="text-sm text-gray-600">{report.hospital}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(report.date).toLocaleDateString('zh-CN')}
                      </p>
                      {report.notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-md text-sm text-gray-700">
                          {report.notes}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {report.fileUrl && (
                      <a
                        href={report.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(report.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}