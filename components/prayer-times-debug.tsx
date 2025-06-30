"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Info, RefreshCw } from "lucide-react"
import { useState } from "react"

interface PrayerTimesDebugProps {
  prayerData: any
  loading: boolean
  onRefresh: () => void
}

export function PrayerTimesDebug({ prayerData, loading, onRefresh }: PrayerTimesDebugProps) {
  const [showDebug, setShowDebug] = useState(false)

  // Hide debug info in production
  const isProduction = process.env.NODE_ENV === "production"

  if (isProduction) {
    return null // Don't show debug info in production
  }

  if (!showDebug) {
    return (
      <Button variant="ghost" size="sm" onClick={() => setShowDebug(true)} className="text-xs">
        <Info className="h-3 w-3 mr-1" />
        ডিবাগ তথ্য (ডেভেলপমেন্ট মোড)
      </Button>
    )
  }

  return (
    <Card className="mt-4 border-dashed border-orange-200 bg-orange-50/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm text-orange-800">ডিবাগ তথ্য (ডেভেলপমেন্ট মোড)</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={onRefresh} disabled={loading}>
              <RefreshCw className={`h-3 w-3 mr-1 ${loading ? "animate-spin" : ""}`} />
              রিফ্রেশ
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowDebug(false)}>
              ✕
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="text-xs space-y-2">
        <div className="flex items-center space-x-2">
          <span className="font-medium">স্ট্যাটাস:</span>
          {loading ? (
            <Badge variant="outline">লোড হচ্ছে...</Badge>
          ) : prayerData ? (
            <Badge variant="default" className="flex items-center space-x-1">
              <CheckCircle className="h-3 w-3" />
              <span>সফল</span>
            </Badge>
          ) : (
            <Badge variant="destructive" className="flex items-center space-x-1">
              <AlertCircle className="h-3 w-3" />
              <span>ব্যর্থ</span>
            </Badge>
          )}
        </div>

        {prayerData && (
          <>
            <div className="flex items-center space-x-2">
              <span className="font-medium">সোর্স:</span>
              <Badge variant="outline">{prayerData.source || "অজানা"}</Badge>
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-medium">ফলব্যাক:</span>
              <Badge variant={prayerData.fallback ? "secondary" : "default"}>{prayerData.fallback ? "হ্যাঁ" : "না"}</Badge>
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-medium">লোকেশন:</span>
              <span className="text-muted-foreground">{prayerData.location}</span>
            </div>

            {prayerData.error && (
              <div className="flex items-start space-x-2">
                <span className="font-medium">এরর:</span>
                <span className="text-red-600 text-xs">{prayerData.error}</span>
              </div>
            )}
          </>
        )}

        <div className="pt-2 border-t border-orange-200">
          <p className="text-orange-700 text-xs">
            ⚠️ এই তথ্য শুধুমাত্র ডেভেলপমেন্টের জন্য। প্রোডাকশনে এটি স্বয়ংক্রিয়ভাবে লুকানো থাকবে।
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
