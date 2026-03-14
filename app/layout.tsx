/**
 * Health Tracker - Main Application Layout
 */
import type { Metadata } from 'next'
import './globals.css'
import { Sidebar } from '@/components/Sidebar'

export const metadata: Metadata = {
  title: 'Health Tracker - 个人健康管理',
  description: '追踪血压、体重、腰围，管理补剂和体检报告',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-gray-50 min-h-screen">
        <Sidebar />
        <main className="lg:ml-64 min-h-screen p-4 lg:p-8">
          <div className="max-w-7xl mx-auto pt-16 lg:pt-0">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}