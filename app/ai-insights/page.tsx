/**
 * AI Insights Page - AI 健康指导
 * 
 * Analyze health data and provide personalized insights
 */
'use client'

import { useState, useEffect } from 'react'
import { 
  loadHealthData, 
  loadUserProfile, 
  loadSupplements,
  exportAllData,
  HealthData,
  UserProfile 
} from '@/lib/storage'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'
import { Button } from '@/components/Button'
import { Sparkles, ClipboardCopy, Download, TrendingUp, Activity, Scale } from 'lucide-react'

export default function AIInsights() {
  const [insights, setInsights] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasData, setHasData] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [healthData, setHealthData] = useState<HealthData[]>([])

  useEffect(() => {
    const data = loadHealthData()
    const userProfile = loadUserProfile()
    setHealthData(data)
    setProfile(userProfile)
    setHasData(data.length > 0)
  }, [])

  const generateInsights = () => {
    setIsGenerating(true)
    
    if (healthData.length === 0) {
      setInsights('暂无数据。请先添加一些健康记录，AI 将为您分析趋势。')
      setIsGenerating(false)
      return
    }

    const latest = healthData[healthData.length - 1]
    const first = healthData[0]
    const supplements = loadSupplements()
    
    // Calculate trends
    const weightChange = latest.weight - first.weight
    const waistChange = latest.waist - first.waist
    const bpAvgSystolic = healthData.reduce((a, b) => a + b.bpSystolic, 0) / healthData.length
    const bpAvgDiastolic = healthData.reduce((a, b) => a + b.bpDiastolic, 0) / healthData.length
    
    // BMI calculation
    const height = profile?.height || 170
    const bmi = latest.weight / ((height / 100) ** 2)
    
    // Analysis
    const analysis = `# ${profile?.nickname || '用户'}的健康数据分析报告

## 📊 基础信息
- **监测天数**: ${healthData.length} 天
- **数据范围**: ${new Date(first.date).toLocaleDateString('zh-CN')} 至 ${new Date(latest.date).toLocaleDateString('zh-CN')}
${profile ? `- **性别**: ${profile.gender === 'male' ? '男' : profile.gender === 'female' ? '女' : '其他'}` : ''}
${profile ? `- **年龄**: ${profile.age} 岁` : ''}
${profile ? `- **身高**: ${height} cm` : ''}

## 🎯 关键指标分析

### 体重变化
- **最新体重**: ${latest.weight.toFixed(1)} kg
- **起始体重**: ${first.weight.toFixed(1)} kg
- **总体变化**: ${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)} kg
- **BMI**: ${bmi.toFixed(1)} (${getBMIStatus(bmi)})
${profile?.targetWeight ? `- **目标体重**: ${profile.targetWeight} kg (还需 ${(latest.weight - profile.targetWeight).toFixed(1)} kg)` : ''}

**分析**: ${getWeightAnalysis(weightChange, healthData.length)}

### 血压状况
- **平均血压**: ${Math.round(bpAvgSystolic)}/${Math.round(bpAvgDiastolic)} mmHg
- **最新血压**: ${latest.bpSystolic}/${latest.bpDiastolic} mmHg
- **状态评估**: ${getBPStatus(latest.bpSystolic, latest.bpDiastolic)}

**分析**: ${getBPAnalysis(bpAvgSystolic, bpAvgDiastolic)}

### 腰围变化
- **最新腰围**: ${latest.waist.toFixed(1)} cm
- **起始腰围**: ${first.waist.toFixed(1)} cm
- **变化**: ${waistChange > 0 ? '+' : ''}${waistChange.toFixed(1)} cm

**分析**: ${getWaistAnalysis(waistChange, profile?.gender || 'male')}

## 💊 当前服用方案
${supplements.length > 0 
  ? supplements.map(s => `- **${s.name}** (${s.dosage}) - ${s.frequency}`).join('\n')
  : '暂无补剂记录'}

## 📈 7天趋势
${generate7DayTrend(healthData)}

## 🔔 健康提醒
${generateReminders(healthData, supplements, bmi, profile)}

## 🤖 AI 建议

${generateAIAdvice(healthData, weightChange, bpAvgSystolic, bpAvgDiastolic, bmi, profile)}

---
*本分析仅供参考，具体健康建议请咨询专业医生。*

**数据导出时间**: ${new Date().toLocaleString('zh-CN')}
`

    setInsights(analysis)
    setIsGenerating(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(insights)
    alert('已复制到剪贴板')
  }

  const handleExport = () => {
    const data = exportAllData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `health-data-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">AI 健康指导</h1>
        <p className="text-gray-600 mt-2">基于您的数据生成个性化健康分析</p>
      </div>

      {!hasData ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">暂无数据</p>
            <p className="text-sm text-gray-400 mt-2">请先添加一些健康记录</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={generateInsights}
              disabled={isGenerating}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {isGenerating ? '分析中...' : '生成健康分析'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleExport}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              导出数据
            </Button>
          </div>

          {insights && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-500" />
                    分析报告
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={copyToClipboard}
                    className="flex items-center gap-2"
                  >
                    <ClipboardCopy className="w-4 h-4" />
                    复制
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg overflow-auto max-h-96">
                  {insights}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

// Helper functions
function getBMIStatus(bmi: number): string {
  if (bmi < 18.5) return '偏瘦'
  if (bmi < 24) return '正常'
  if (bmi < 28) return '偏胖'
  return '肥胖'
}

function getBPStatus(sys: number, dia: number): string {
  if (sys < 120 && dia < 80) return '✅ 理想血压'
  if (sys < 130 && dia < 85) return '⚠️ 正常高值'
  if (sys < 140 && dia < 90) return '⚠️ 轻度高血压'
  return '❗ 建议就医'
}

function getWeightAnalysis(change: number, days: number): string {
  const weeklyChange = (change / days) * 7
  if (Math.abs(change) < 0.5) return '体重保持稳定，这是很好的维持阶段。'
  if (change < 0 && weeklyChange > -0.5) return '体重稳步下降，减重速度健康适中。继续保持！'
  if (change < 0) return '体重下降较快，请注意营养均衡，避免过度节食。'
  return '体重有所上升，建议关注饮食控制和运动频率。'
}

function getBPAnalysis(sys: number, dia: number): string {
  if (sys < 120 && dia < 80) return '血压控制优秀！请继续保持健康的生活方式。'
  if (sys < 130 && dia < 85) return '血压基本正常，但接近上限，建议适当运动、低盐饮食。'
  return '血压偏高，建议规律服药、监测血压、定期复查。'
}

function getWaistAnalysis(change: number, gender: string): string {
  const threshold = gender === 'male' ? 90 : 85
  if (change < -2) return '腰围明显减少，内脏脂肪在减少，非常棒！'
  if (change < 0) return '腰围在缓慢下降，趋势良好。'
  if (change > 2) return '腰围增加，建议加强核心训练和有氧运动。'
  return '腰围变化不大，可以尝试针对性的腹部训练。'
}

function generate7DayTrend(data: HealthData[]): string {
  const recent = data.slice(-7)
  if (recent.length < 3) return '数据不足，无法生成趋势分析。'
  
  const weights = recent.map(d => d.weight).filter(w => w > 0)
  const first = weights[0]
  const last = weights[weights.length - 1]
  const change = last - first
  
  return `- 最近7天体重${change <= 0 ? '下降' : '变化'}: ${Math.abs(change).toFixed(2)} kg\n- 趋势: ${change < 0 ? '⬇️ 下降' : change > 0 ? '⬆️ 上升' : '➡️ 平稳'}`
}

function generateReminders(data: HealthData[], supplements: any[], bmi: number, profile: UserProfile | null): string {
  const reminders = []
  
  // Check data frequency
  const daysSinceLastRecord = data.length > 0 
    ? Math.floor((Date.now() - new Date(data[data.length - 1].date).getTime()) / (1000 * 60 * 60 * 24))
    : 999
  
  if (daysSinceLastRecord > 2) {
    reminders.push(`⚠️ 已有 ${daysSinceLastRecord} 天未记录数据，建议恢复每日记录习惯。`)
  }
  
  // BMI reminder
  if (bmi > 28) {
    reminders.push('🎯 BMI 超过 28，建议制定减重计划，每周减重 0.5-1kg 为宜。')
  }
  
  // Supplement reminder
  if (supplements.length === 0) {
    reminders.push('💊 未设置补剂/药物，如有服用请在"补剂库"中添加。')
  }
  
  // Age-specific reminders
  if (profile?.age && profile.age > 40) {
    reminders.push('📋 建议每年进行全面体检，重点关注血脂、血糖、血压指标。')
  }
  
  return reminders.length > 0 ? reminders.join('\n') : '✅ 当前无明显健康提醒，请继续保持！'
}

function generateAIAdvice(data: HealthData[], weightChange: number, sys: number, dia: number, bmi: number, profile: UserProfile | null): string {
  const advices = []
  
  // Weight advice
  if (weightChange > 0) {
    advices.push('1. **体重管理**: 建议控制每日热量摄入，增加蔬菜比例，减少精制碳水。每周进行 3-5 次有氧运动，每次 30 分钟以上。')
  } else if (weightChange < -1) {
    advices.push('1. **体重管理**: 减重速度适中，请确保蛋白质摄入充足（每公斤体重 1-1.2g），避免肌肉流失。')
  }
  
  // BP advice
  if (sys > 130 || dia > 85) {
    advices.push('2. **血压控制**: 建议低盐饮食（每日 < 6g），戒烟限酒，规律作息。如已服药请按时服用，勿擅自停药。')
  }
  
  // BMI advice
  if (bmi > 24) {
    advices.push(`3. **BMI 优化**: 当前 BMI ${bmi.toFixed(1)} 属于${bmi > 28 ? '肥胖' : '超重'}范围。建议将目标设定为 BMI 24 以下（约 ${(((profile?.height || 170) / 100) ** 2 * 24).toFixed(1)} kg）。`)
  }
  
  // General advice
  advices.push(`${advices.length + 1}. **生活习惯**: 保持规律作息，每晚 7-8 小时睡眠。每天喝足够的水（体重 kg × 30ml）。定期监测体重和血压，建立长期健康档案。`)
  
  return advices.join('\n\n')
}