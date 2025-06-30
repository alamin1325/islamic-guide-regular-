"use client"

import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, WifiOff } from "lucide-react"

interface PrayerTimesStatusProps {
  isLoading: boolean
  isFallback?: boolean
  source?: string
  error?: string
}

export function PrayerTimesStatus({ isLoading, isFallback, source, error }: PrayerTimesStatusProps) {
  if (isLoading) {
    return (
      <Badge variant="outline" className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
        <span>লোড হচ্ছে...</span>
      </Badge>
    )
  }

  if (isFallback) {
    return (
      <Badge variant="secondary" className="flex items-center space-x-2">
        <WifiOff className="h-3 w-3" />
        <span>অফলাইন ডেটা</span>
      </Badge>
    )
  }

  if (source) {
    return (
      <Badge variant="default" className="flex items-center space-x-2">
        <CheckCircle className="h-3 w-3" />
        <span>লাইভ ডেটা</span>
      </Badge>
    )
  }

  if (error) {
    return (
      <Badge variant="destructive" className="flex items-center space-x-2">
        <AlertCircle className="h-3 w-3" />
        <span>এরর</span>
      </Badge>
    )
  }

  return null
}
