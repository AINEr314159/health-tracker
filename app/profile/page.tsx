/**
 * Profile Page - 个人资料设置
 */
'use client'

import { useState, useEffect } from 'react'
import { loadUserProfile, saveUserProfile, UserProfile } from '@/lib/storage'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { User, Save } from 'lucide-react'

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile>({
    nickname: '',
    gender: 'male',
    age: 30,
    height: 170,
    targetWeight: 70,
    updatedAt: new Date().toISOString(),
  })
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    const saved = loadUserProfile()
    if (saved) {
      setProfile(saved)
    }
  }, [])

  const handleSave = () => {
    saveUserProfile({
      ...profile,
      updatedAt: new Date().toISOString(),
    })
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">个人资料</h1>
        <p className="text-gray-600 mt-2">设置您的基本信息</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            基本信息
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Nickname */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              昵称
            </label>
            <Input
              value={profile.nickname}
              onChange={(e) => setProfile({ ...profile, nickname: e.target.value })}
              placeholder="请输入昵称"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              性别
            </label>
            <div className="flex gap-4">
              {[
                { value: 'male', label: '男' },
                { value: 'female', label: '女' },
                { value: 'other', label: '其他' },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-colors ${
                    profile.gender === option.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="gender"
                    value={option.value}
                    checked={profile.gender === option.value}
                    onChange={(e) => setProfile({ ...profile, gender: e.target.value as any })}
                    className="sr-only"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              年龄
            </label>
            <Input
              type="number"
              value={profile.age}
              onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || 0 })}
              min="1"
              max="150"
            />
          </div>

          {/* Height */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              身高 (cm)
            </label>
            <Input
              type="number"
              value={profile.height}
              onChange={(e) => setProfile({ ...profile, height: parseFloat(e.target.value) || 0 })}
              placeholder="170"
            />
          </div>

          {/* Target Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              目标体重 (kg)
            </label>
            <Input
              type="number"
              step="0.1"
              value={profile.targetWeight}
              onChange={(e) => setProfile({ ...profile, targetWeight: parseFloat(e.target.value) || 0 })}
              placeholder="70"
            />
          </div>

          {/* Save Button */}
          <Button 
            onClick={handleSave} 
            className="w-full flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaved ? '已保存！' : '保存资料'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}