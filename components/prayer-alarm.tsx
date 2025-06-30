"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Bell, BellOff, CheckCircle, AlertCircle, X } from "lucide-react"

interface PrayerAlarmProps {
  prayerTimes: any
  nextPrayer: any
  onClose?: () => void
}

type PrayerName = 'ফজর' | 'যোহর' | 'আসর' | 'মাগরিব' | 'এশা'

interface AlarmsState {
  ফজর: boolean
  যোহর: boolean
  আসর: boolean
  মাগরিব: boolean
  এশা: boolean
}

export function PrayerAlarm({ prayerTimes, nextPrayer, onClose }: PrayerAlarmProps) {
  const [alarms, setAlarms] = useState<AlarmsState>({
    ফজর: false,
    যোহর: false,
    আসর: false,
    মাগরিব: false,
    এশা: false,
  })
  
  const [notificationPermission, setNotificationPermission] = useState('default')

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission)
    }
    // Load saved alarms
    const savedAlarms = localStorage.getItem('prayerAlarms')
    if (savedAlarms) {
      try {
        setAlarms(JSON.parse(savedAlarms))
      } catch (error) {
        console.error('Error loading alarms:', error)
      }
    }
  }, [])

  // Save alarms when they change
  useEffect(() => {
    localStorage.setItem('prayerAlarms', JSON.stringify(alarms))
  }, [alarms])

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)
    }
  }

  const toggleAlarm = (prayerName: string) => {
    if (prayerName in alarms) {
      setAlarms(prev => ({
        ...prev,
        [prayerName]: !prev[prayerName as keyof typeof prev]
      }))
    }
  }

  const showNotification = (prayerName: string, time: string) => {
    if (notificationPermission === 'granted' && 'Notification' in window) {
      new Notification('নামাজের সময়', {
        body: `${prayerName} নামাজের সময় হয়েছে (${time})`,
        icon: '/placeholder-logo.png',
        requireInteraction: true
      })
    }
  }

  const testAlarm = () => {
    showNotification('টেস্ট', '১২:০০')
  }

  const isPrayerName = (name: string): name is PrayerName => {
    return ['ফজর', 'যোহর', 'আসর', 'মাগরিব', 'এশা'].includes(name)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="h-6 w-6 text-blue-600" />
            <span>নামাজের অ্যালার্ম সেটিংস</span>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Notification Permission */}
        {notificationPermission !== 'granted' && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800 dark:text-yellow-200">
                  নোটিফিকেশন অনুমতি প্রয়োজন
                </p>
                <p className="text-sm text-yellow-600 dark:text-yellow-300">
                  অ্যালার্ম পেতে নোটিফিকেশন অনুমতি দিন
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={requestNotificationPermission}
              >
                অনুমতি দিন
              </Button>
            </div>
          </div>
        )}

        {/* Prayer Alarm Settings */}
        <div className="space-y-4">
          {Object.entries(prayerTimes || {}).map(([prayerName, prayer]: [string, any]) => {
            if (!isPrayerName(prayerName)) return null
            
            return (
              <Card key={prayerName} className="border-l-4 border-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={alarms[prayerName]}
                          onCheckedChange={() => toggleAlarm(prayerName)}
                        />
                        <Label className="font-semibold">{prayerName}</Label>
                      </div>
                      <Badge variant="outline">{prayer.bengaliTime}</Badge>
                    </div>
                    
                    {alarms[prayerName] && (
                      <Badge variant="default" className="bg-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        সক্রিয়
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Save Status */}
        <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-700 dark:text-green-300">
              অ্যালার্ম সেটিংস স্বয়ংক্রিয়ভাবে সেভ হচ্ছে
            </span>
          </div>
        </div>

        {/* Test Alarm */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div>
            <h4 className="font-semibold">টেস্ট অ্যালার্ম</h4>
            <p className="text-sm text-muted-foreground">
              অ্যালার্ম সেটিংস টেস্ট করুন
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={testAlarm}
          >
            <Bell className="h-4 w-4 mr-2" />
            টেস্ট করুন
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 