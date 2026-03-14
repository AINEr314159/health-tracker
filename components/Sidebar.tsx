/**
 * Sidebar Component - 侧边导航
 */
'use client'

import { useState } from 'react'
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  Pill, 
  FileText, 
  Sparkles,
  Heart,
  User,
  Menu,
  X,
  Calendar
} from 'lucide-react'

const navItems = [
  { href: 'index.html', label: '概览', icon: LayoutDashboard },
  { href: 'entry.html', label: '每日录入', icon: PlusCircle },
  { href: 'daily-supplements.html', label: '今日服用', icon: Calendar },
  { href: 'supplements-library.html', label: '补剂库', icon: Pill },
  { href: 'history.html', label: '历史记录', icon: History },
  { href: 'reports.html', label: '体检报告', icon: FileText },
  { href: 'ai-insights.html', label: 'AI 指导', icon: Sparkles },
  { href: 'profile.html', label: '个人资料', icon: User },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  const handleLinkClick = () => {
    // Close sidebar on mobile when clicking a link
    if (window.innerWidth < 1024) {
      setIsOpen(false)
    }
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-white rounded-lg shadow-md border border-gray-200"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-50 flex flex-col
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="p-5 border-b border-gray-100">
          <a href="index.html" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Health Tracker</h1>
              <p className="text-xs text-gray-500">个人健康管理</p>
            </div>
          </a>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon

              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <Icon className="w-5 h-5 text-gray-400" />
                    <span>{item.label}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">© 2024 Health Tracker</p>
        </div>
      </aside>

      {/* Spacer for desktop */}
      <div className="hidden lg:block w-64 flex-shrink-0" />
    </>
  )
}