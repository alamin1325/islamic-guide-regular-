"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Settings, ArrowLeft, Save, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function PrayerSettingsPage() {
  const [settings, setSettings] = useState({
    notifications: true,
    sound: true,
    vibration: false,
    showSeconds: false,
    showEnglish: true,
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // Load saved settings
    const savedSettings = localStorage.getItem('prayerSettings')
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (error) {
        console.error('Error loading settings:', error)
      }
    }
  }, [])

  const saveSettings = () => {
    localStorage.setItem('prayerSettings', JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/prayer-times" className="flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5" />
              <span>ফিরে যান</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Settings className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-blue-600">নামাজের সময়ের সেটিংস</h1>
            </div>
            <Button onClick={saveSettings} className="flex items-center space-x-2">
              <Save className="h-4 w-4" />
              <span>সেভ করুন</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Save Status */}
        {saved && (
          <Card className="mb-6 bg-green-50 dark:bg-green-900/20 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-green-700 dark:text-green-300">সেটিংস সফলভাবে সেভ হয়েছে!</span>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-purple-600" />
                <span>নোটিফিকেশন সেটিংস</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>নোটিফিকেশন সক্রিয় করুন</Label>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, notifications: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>শব্দ</Label>
                <Switch
                  checked={settings.sound}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, sound: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>কম্পন</Label>
                <Switch
                  checked={settings.vibration}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, vibration: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Display Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-orange-600" />
                <span>প্রদর্শন সেটিংস</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>সেকেন্ড দেখান</Label>
                <Switch
                  checked={settings.showSeconds}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showSeconds: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>ইংরেজি সময় দেখান</Label>
                <Switch
                  checked={settings.showEnglish}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showEnglish: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reset Button */}
        <div className="mt-8 text-center">
          <Button 
            variant="outline" 
            onClick={() => {
              localStorage.removeItem('prayerSettings')
              window.location.reload()
            }}
          >
            ডিফল্ট সেটিংসে ফিরে যান
          </Button>
        </div>
      </div>
    </div>
  )
} 