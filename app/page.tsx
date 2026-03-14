/**
 * Dashboard Page - 数据概览
 * 
 * This is the main dashboard showing:
 * - Latest measurements
 * - Trend charts
 * - Quick stats
 */
'use client'

import { useState, useEffect } from 'react'
import { HealthData, loadHealthData } from '@/lib/storage'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'
import { TrendingUp, Activity, Scale, Ruler, Calendar, Target, ArrowDown, ArrowUp, Minus, Plus } from 'lucide-react'

export default function Dashboard() {
  const [data, setData] = useState<HealthData[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setData(loadHealthData())
    setMounted(true)
  }, [])

  const latest = data[data.length - 1]
  const previous = data[data.length - 2]
  const first = data[0]

  const getTrend = (current: number, previous: number) => {
    if (!previous || !current) return null
    const diff = current - previous
    if (Math.abs(diff) < 0.01) return { type: 'same', value: 0 }
    return {
      type: diff > 0 ? 'up' : 'down',
      value: Math.abs(diff).toFixed(2),
    }
  }

  const getTotalTrend = (current: number, firstVal: number) => {
    if (!firstVal || !current) return null
    const diff = current - firstVal
    return {
      type: diff > 0 ? 'up' : 'down',
      value: Math.abs(diff).toFixed(2),
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }

  if (!mounted) return null

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">健康概览</h1>
          <p className="text-gray-500 mt-1">追踪您的健康趋势和数据</p>
        </div>
        {data.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-full border border-gray-200">
            <Calendar className="w-4 h-4" />
            <span>{data.length} 天数据</span>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="最新体重"
          value={latest?.weight ? `${latest.weight} kg` : '--'}
          subtitle={latest?.date ? formatDate(latest.date) : ''}
          icon={Scale}
          trend={latest && previous ? getTrend(latest.weight, previous.weight) : null}
          totalTrend={latest && first ? getTotalTrend(latest.weight, first.weight) : null}
          color="blue"
          isPositiveGood={false}
        />
        
        <StatCard
          title="最新腰围"
          value={latest?.waist ? `${latest.waist} cm` : '--'}
          subtitle={latest?.date ? formatDate(latest.date) : ''}
          icon={Ruler}
          trend={latest && previous ? getTrend(latest.waist, previous.waist) : null}
          totalTrend={latest && first ? getTotalTrend(latest.waist, first.waist) : null}
          color="emerald"
          isPositiveGood={false}
        />
        
        <StatCard
          title="血压 (收缩/舒张)"
          value={latest?.bpSystolic ? `${latest.bpSystolic}/${latest.bpDiastolic}` : '--'}
          subtitle={latest?.date ? formatDate(latest.date) : ''}
          icon={Activity}
          trend={null}
          totalTrend={null}
          color="rose"
        />
      </div>

      {/* Charts */}
      {data.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weight Chart */}
          <ChartCard 
            title="体重趋势" 
            icon={Scale}
            color="blue"
            data={data}
            dataKey="weight"
            unit="kg"
            domain={['dataMin - 1', 'dataMax + 1']}
          />

          {/* Blood Pressure Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
                  <Activity className="w-4 h-4" />
                </div>
                血压趋势
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatDate}
                      stroke="#94a3b8"
                      fontSize={12}
                    />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip 
                      labelFormatter={(date) => new Date(date).toLocaleDateString('zh-CN')}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="bpSystolic" 
                      name="收缩压"
                      stroke="#e11d48" 
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="bpDiastolic" 
                      name="舒张压"
                      stroke="#f97316" 
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Waist Chart - Full Width */}
          <div className="lg:col-span-2">
            <ChartCard 
              title="腰围趋势" 
              icon={Ruler}
              color="emerald"
              data={data}
              dataKey="waist"
              unit="cm"
              domain={['dataMin - 1', 'dataMax + 1']}
            />
          </div>
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  )
}

/**
 * Stat Card Component
 */
interface StatCardProps {
  title: string
  value: string
  subtitle: string
  icon: React.ElementType
  trend: { type: string; value: number | string } | null
  totalTrend: { type: string; value: number | string } | null
  color: 'blue' | 'emerald' | 'rose'
  isPositiveGood?: boolean
}

function StatCard({ title, value, subtitle, icon: Icon, trend, totalTrend, color, isPositiveGood }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
  }

  const getTrendIcon = (type: string, isGood: boolean) => {
    if (type === 'same') return <Minus className="w-3 h-3" />
    if (type === 'up') return isGood ? <ArrowDown className="w-3 h-3 rotate-180" /> : <ArrowUp className="w-3 h-3" />
    return isGood ? <ArrowDown className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
  }

  const getTrendColor = (type: string, isGood: boolean) => {
    if (type === 'same') return 'text-gray-500'
    if (type === 'up') return isGood ? 'text-emerald-600' : 'text-rose-600'
    return isGood ? 'text-emerald-600' : 'text-rose-600'
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
            <div className="flex items-center gap-4 mt-3">
              {subtitle && (
                <p className="text-sm text-gray-400">{subtitle}</p>
              )}
              
              {trend && (
                <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor(trend.type, isPositiveGood ?? false)}`}>
                  {getTrendIcon(trend.type, isPositiveGood ?? false)}
                  <span>{trend.value}</span>
                </div>
              )}
            </div>
            
            {totalTrend && (
              <div className={`mt-3 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTrendColor(totalTrend.type, isPositiveGood ?? false)} bg-gray-50`}>
                <Target className="w-3 h-3" />
                <span>较首{totalTrend.type === 'down' ? '降' : '增'} {totalTrend.value}</span>
              </div>
            )}
          </div>
          
          <div className={`p-3 rounded-xl border ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Chart Card Component
 */
interface ChartCardProps {
  title: string
  icon: React.ElementType
  color: 'blue' | 'emerald' | 'rose'
  data: HealthData[]
  dataKey: string
  unit: string
  domain?: [string | number, string | number]
}

function ChartCard({ title, icon: Icon, color, data, dataKey, unit, domain }: ChartCardProps) {
  const colorMap = {
    blue: '#3b82f6',
    emerald: '#10b981',
    rose: '#e11d48',
  }

  const bgMap = {
    blue: 'bg-blue-100 text-blue-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    rose: 'bg-rose-100 text-rose-600',
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className={`p-2 rounded-lg ${bgMap[color]}`}>
            <Icon className="w-4 h-4" />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colorMap[color]} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={colorMap[color]} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                stroke="#94a3b8"
                fontSize={12}
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={12}
                domain={domain}
              />
              <Tooltip 
                labelFormatter={(date) => new Date(date).toLocaleDateString('zh-CN')}
                formatter={(value) => [`${value} ${unit}`, title.replace('趋势', '')]}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area 
                type="monotone" 
                dataKey={dataKey}
                stroke={colorMap[color]}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#color${dataKey})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Empty State Component
 */
function EmptyState() {
  return (
    <Card>
      <CardContent className="p-16 text-center">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <TrendingUp className="w-10 h-10 text-blue-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">暂无数据</h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          开始记录您的健康数据，我们将为您生成可视化图表和趋势分析
        </p>
        <a 
          href="/entry" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          添加第一条记录
        </a>
      </CardContent>
    </Card>
  )
}