"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShareButton } from "@/components/share-button"
import { PrayerAlarm } from "@/components/prayer-alarm"
import { Clock, MapPin, Bell, Settings, Sunrise, Sun, Sunset, Moon, RefreshCw, Share2 } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { AutoLocationDetector } from "@/components/auto-location-detector"
import { PrayerInfoCard } from "@/components/prayer-info-card"

export default function PrayerTimesPage() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [prayerData, setPrayerData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAlarmModal, setShowAlarmModal] = useState(false)
  const [locationData, setLocationData] = useState({
    city: "দিমলা",
    district: "নীলফামারী",
    division: "রংপুর",
    postalCode: "5350",
    coordinates: { latitude: 25.6516, longitude: 88.6741 },
  })

  // Update current time every second
  useEffect(() => {
    setCurrentTime(new Date())
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Fetch prayer times when location changes
  useEffect(() => {
    fetchPrayerTimes()
  }, [locationData])

  // Auto-refresh prayer times every minute
  useEffect(() => {
    const refreshTimer = setInterval(() => {
      fetchPrayerTimes()
    }, 60000) // Refresh every minute

    return () => clearInterval(refreshTimer)
  }, [locationData])

  const fetchPrayerTimes = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        latitude: locationData.coordinates.latitude.toString(),
        longitude: locationData.coordinates.longitude.toString(),
        city: locationData.city,
        district: locationData.district,
        division: locationData.division,
        postalCode: locationData.postalCode,
      })

      const response = await fetch(`/api/prayer-times/location?${params}`)
      const data = await response.json()

      if (data.success) {
        setPrayerData(data.data)
      } else {
        setError(data.error || "নামাজের সময় লোড করতে সমস্যা হয়েছে")
      }
    } catch (err) {
      console.error("Prayer times fetch error:", err)
      setError("নামাজের সময় লোড করতে সমস্যা হয়েছে")
    } finally {
      setLoading(false)
    }
  }

  const handleLocationDetected = (newLocation) => {
    setLocationData(newLocation)
  }

  const getNextPrayerTimeRemaining = () => {
    if (!prayerData?.nextPrayer) return null

    const now = new Date()
    const [hours, minutes] = prayerData.nextPrayer.englishTime.split(":").map(Number)
    const nextPrayerTime = new Date()
    nextPrayerTime.setHours(hours, minutes, 0, 0)

    // If next prayer is tomorrow
    if (nextPrayerTime <= now) {
      nextPrayerTime.setDate(nextPrayerTime.getDate() + 1)
    }

    const timeDiff = nextPrayerTime - now
    const hoursRemaining = Math.floor(timeDiff / (1000 * 60 * 60))
    const minutesRemaining = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))

    return { hours: hoursRemaining, minutes: minutesRemaining }
  }

  const timeRemaining = getNextPrayerTimeRemaining()

  const prayerIcons = {
    ফজর: Sunrise,
    যোহর: Sun,
    আসর: Sun,
    মাগরিব: Sunset,
    এশা: Moon,
  }

  const prayerRules = [
    {
      title: "ওযুর নিয়ম",
      description: "নামাজের পূর্বে পবিত্রতা অর্জনের জন্য ওযু করা ফরজ।",
      steps: ["নিয়ত করা", "হাত ধোয়া", "কুলি করা", "নাক পরিষ্কার করা", "মুখ ধোয়া"],
    },
    {
      title: "নামাজের সময়",
      description: "প্রতিটি নামাজের নির্দিষ্ট সময় রয়েছে যা মেনে চলা আবশ্যক।",
      steps: ["সময়মতো আদায়", "জামাতে নামাজ", "কিবলামুখী হওয়া", "পবিত্র স্থানে আদায়"],
    },
    {
      title: "নামাজের রাকাত (৫ ওয়াক্ত)",
      description: "প্রতিটি নামাজের ফরজ ও সুন্নত রাকাতের সংখ্যা।",
      steps: [
        "ফজর: ২ রাকাত ফরজ + ২ রাকাত সুন্নত",
        "যোহর: ৪ রাকাত ফরজ + ৪ রাকাত সুন্নত",
        "আসর: ৪ রাকাত ফরজ + ৪ রাকাত সুন্নত",
        "মাগরিব: ৩ রাকাত ফরজ + ২ রাকাত সুন্নত",
        "এশা: ৪ রাকাত ফরজ + ২ রাকাত সুন্নত + ৩ রাকাত বিতর",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Clock className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold">ইসলামিক গাইড</span>
            </Link>
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-blue-600">নামাজের সময়</h1>
              <ShareButton
                title="নামাজের সময়"
                text="ইসলামিক গাইড অ্যাপে আপনার এলাকার নামাজের সময় দেখুন। সঠিক সময়ে নামাজ আদায় করুন।"
                url={typeof window !== 'undefined' ? `${window.location.origin}/prayer-times` : '/prayer-times'}
                variant="outline"
                size="sm"
              >
                <Share2 className="h-4 w-4 mr-2" />
                শেয়ার
              </ShareButton>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Auto Location Detector */}
        <div className="mb-6">
          <AutoLocationDetector onLocationDetected={handleLocationDetected} />
        </div>

        {/* Current Time & Location */}
        <Card className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <div className="text-4xl font-bold mb-2">
                  {currentTime ? currentTime.toLocaleTimeString("bn-BD", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  }) : "লোড হচ্ছে..."}
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {locationData.city}, {locationData.district}, {locationData.division} ({locationData.postalCode})
                  </span>
                </div>
                <div className="text-sm opacity-75 mt-1">
                  {currentTime ? currentTime.toLocaleDateString("bn-BD", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }) : ""}
                </div>
              </div>
              <div className="text-center">
                {prayerData?.nextPrayer && (
                  <>
                    <div className="text-2xl font-bold mb-2">পরবর্তী নামাজ</div>
                    <Badge variant="secondary" className="text-lg px-4 py-2 mb-2">
                      {prayerData.nextPrayer.name} - {prayerData.nextPrayer.bengaliTime}
                    </Badge>
                    {timeRemaining && (
                      <div className="text-sm opacity-90">
                        {timeRemaining.hours > 0 && `${timeRemaining.hours} ঘন্টা `}
                        {timeRemaining.minutes} মিনিট বাকি
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prayer Times */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>নামাজের সময় লোড হচ্ছে...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchPrayerTimes}>
              <RefreshCw className="h-4 w-4 mr-2" />
              পুনরায় চেষ্টা করুন
            </Button>
          </div>
        ) : prayerData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {Object.values(prayerData.prayerTimes).map((prayer, index) => {
              const IconComponent = prayerIcons[prayer.name] || Clock
              const isNext = prayerData.nextPrayer?.name === prayer.name

              return (
                <Card
                  key={index}
                  className={`relative overflow-hidden transition-all ${
                    isNext ? "ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20" : ""
                  }`}
                >
                  <CardContent className="p-6 text-center">
                    <IconComponent className={`h-8 w-8 mx-auto mb-3 ${isNext ? "text-green-600" : "text-blue-600"}`} />
                    <h3 className="text-xl font-bold mb-2">{prayer.name}</h3>
                    <div className={`text-2xl font-bold mb-1 ${isNext ? "text-green-600" : "text-blue-600"}`}>
                      {prayer.bengaliTime}
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">{prayer.time}</div>
                    <p className="text-xs text-muted-foreground">{prayer.description}</p>
                    {isNext && (
                      <Badge variant="default" className="mt-2">
                        পরবর্তী
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : null}

        {/* Real-time Status */}
        {prayerData && (
          <Card className="mb-8 bg-green-50 dark:bg-green-900/20 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="animate-pulse">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">রিয়েল-টাইম নামাজের সময়</p>
                    <p className="text-sm text-green-600 dark:text-green-300">
                      স্বয়ংক্রিয় আপডেট • {prayerData.source} • {prayerData.location}
                    </p>
                  </div>
                </div>
                <Badge variant="default" className="bg-green-600">
                  লাইভ
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Bell className="h-8 w-8 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">নামাজের অ্যালার্ম</h3>
              <p className="text-sm text-muted-foreground mb-4">নামাজের সময় রিমাইন্ডার সেট করুন</p>
              <Button 
                variant="outline" 
                className="w-full bg-transparent"
                onClick={() => setShowAlarmModal(true)}
              >
                সেটআপ করুন
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <MapPin className="h-8 w-8 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">অবস্থান পরিবর্তন</h3>
              <p className="text-sm text-muted-foreground mb-4">আপনার এলাকা অনুযায়ী সময় দেখুন</p>
              <Button 
                variant="outline" 
                className="w-full bg-transparent" 
                onClick={() => {
                  // Trigger location detection
                  const event = new CustomEvent('detectLocation')
                  window.dispatchEvent(event)
                }}
              >
                আপডেট করুন
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Settings className="h-8 w-8 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">সেটিংস</h3>
              <p className="text-sm text-muted-foreground mb-4">নামাজের সময়ের সেটিংস কাস্টমাইজ করুন</p>
              <Link href="/prayer-times/settings">
                <Button variant="outline" className="w-full bg-transparent">
                  সেটিংস
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Prayer Information - All 5 Prayers */}
        <PrayerInfoCard />

        {/* Alarm Modal */}
        {showAlarmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <PrayerAlarm 
                prayerTimes={prayerData?.prayerTimes} 
                nextPrayer={prayerData?.nextPrayer}
                onClose={() => setShowAlarmModal(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
