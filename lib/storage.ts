/**
 * Storage Library - 数据存储
 * 
 * Uses localStorage for persistence.
 */

// Types
export interface HealthData {
  id: string
  date: string
  // 左臂血压
  bpLeftSystolic: number
  bpLeftDiastolic: number
  // 右臂血压
  bpRightSystolic: number
  bpRightDiastolic: number
  // 计算值（较高一侧）
  bpSystolic: number
  bpDiastolic: number
  weight: number
  waist: number
  notes: string
  createdAt: string
}

export interface Supplement {
  id: string
  name: string
  dosage: string
  frequency: string
  type: 'supplement' | 'medication'
  createdAt: string
}

export interface DailySupplement {
  id: string
  supplementId: string
  name: string
  dosage: string
  type: 'supplement' | 'medication'
  time: string
  taken: boolean
  date: string
  createdAt: string
}

export interface MedicalReport {
  id: string
  title: string
  hospital: string
  date: string
  fileUrl?: string
  notes: string
  createdAt: string
}

export interface UserProfile {
  nickname: string
  gender: 'male' | 'female' | 'other'
  age: number
  height?: number
  targetWeight?: number
  updatedAt: string
}

// Storage keys
const STORAGE_KEYS = {
  healthData: 'health_tracker_data',
  supplements: 'health_tracker_supplements',
  dailySupplements: 'health_tracker_daily_supplements',
  reports: 'health_tracker_reports',
  userProfile: 'health_tracker_user_profile',
}

/**
 * User Profile Operations
 */
export function loadUserProfile(): UserProfile | null {
  if (typeof window === 'undefined') return null
  const data = localStorage.getItem(STORAGE_KEYS.userProfile)
  return data ? JSON.parse(data) : null
}

export function saveUserProfile(profile: UserProfile): void {
  localStorage.setItem(STORAGE_KEYS.userProfile, JSON.stringify(profile))
}

/**
 * Health Data Operations
 */
export function loadHealthData(): HealthData[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(STORAGE_KEYS.healthData)
  return data ? JSON.parse(data) : []
}

export function saveHealthData(record: HealthData): void {
  const existing = loadHealthData()
  const filtered = existing.filter(r => r.date !== record.date)
  const updated = [...filtered, record].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )
  localStorage.setItem(STORAGE_KEYS.healthData, JSON.stringify(updated))
}

export function updateHealthData(id: string, updates: Partial<HealthData>): void {
  const existing = loadHealthData()
  const updated = existing.map(r => 
    r.id === id ? { ...r, ...updates } : r
  )
  localStorage.setItem(STORAGE_KEYS.healthData, JSON.stringify(updated))
}

export function deleteHealthData(id: string): void {
  const existing = loadHealthData()
  const updated = existing.filter(r => r.id !== id)
  localStorage.setItem(STORAGE_KEYS.healthData, JSON.stringify(updated))
}

/**
 * Supplement Library Operations
 */
export function loadSupplements(): Supplement[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(STORAGE_KEYS.supplements)
  return data ? JSON.parse(data) : []
}

export function saveSupplement(supplement: Supplement): void {
  const existing = loadSupplements()
  const updated = [...existing, supplement]
  localStorage.setItem(STORAGE_KEYS.supplements, JSON.stringify(updated))
}

export function updateSupplement(id: string, updates: Partial<Supplement>): void {
  const existing = loadSupplements()
  const updated = existing.map(s => 
    s.id === id ? { ...s, ...updates } : s
  )
  localStorage.setItem(STORAGE_KEYS.supplements, JSON.stringify(updated))
}

export function deleteSupplement(id: string): void {
  const existing = loadSupplements()
  const updated = existing.filter(s => s.id !== id)
  localStorage.setItem(STORAGE_KEYS.supplements, JSON.stringify(updated))
}

/**
 * Daily Supplement Operations
 */
export function loadDailySupplements(date?: string): DailySupplement[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(STORAGE_KEYS.dailySupplements)
  const all = data ? JSON.parse(data) : []
  if (date) {
    return all.filter((d: DailySupplement) => d.date === date)
  }
  return all
}

export function saveDailySupplement(record: DailySupplement): void {
  const existing = loadDailySupplements()
  const updated = [...existing, record]
  localStorage.setItem(STORAGE_KEYS.dailySupplements, JSON.stringify(updated))
}

export function updateDailySupplement(id: string, updates: Partial<DailySupplement>): void {
  const existing = loadDailySupplements()
  const updated = existing.map(d => 
    d.id === id ? { ...d, ...updates } : d
  )
  localStorage.setItem(STORAGE_KEYS.dailySupplements, JSON.stringify(updated))
}

export function deleteDailySupplement(id: string): void {
  const existing = loadDailySupplements()
  const updated = existing.filter(d => d.id !== id)
  localStorage.setItem(STORAGE_KEYS.dailySupplements, JSON.stringify(updated))
}

export function toggleDailySupplementTaken(id: string): void {
  const existing = loadDailySupplements()
  const updated = existing.map(d => 
    d.id === id ? { ...d, taken: !d.taken } : d
  )
  localStorage.setItem(STORAGE_KEYS.dailySupplements, JSON.stringify(updated))
}

/**
 * Medical Reports Operations
 */
export function loadReports(): MedicalReport[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(STORAGE_KEYS.reports)
  return data ? JSON.parse(data) : []
}

export function saveReport(report: MedicalReport): void {
  const existing = loadReports()
  const updated = [...existing, report]
  localStorage.setItem(STORAGE_KEYS.reports, JSON.stringify(updated))
}

export function deleteReport(id: string): void {
  const existing = loadReports()
  const updated = existing.filter(r => r.id !== id)
  localStorage.setItem(STORAGE_KEYS.reports, JSON.stringify(updated))
}

/**
 * Export data for backup or AI analysis
 */
export function exportAllData() {
  return {
    userProfile: loadUserProfile(),
    healthData: loadHealthData(),
    supplements: loadSupplements(),
    dailySupplements: loadDailySupplements(),
    reports: loadReports(),
    exportedAt: new Date().toISOString(),
  }
}