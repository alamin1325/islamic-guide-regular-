"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShareButton } from "@/components/share-button"
import { BookOpen, Clock, Heart, Scroll, Compass, Calculator, Moon, Sun, Menu, Search, Share2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { fetchPrayerTimes, fetchVerseOfDay } from "@/lib/api"
import { OfflineIndicator } from "@/components/offline-indicator"
import { PrayerTimesStatus } from "@/components/prayer-times-status"
import { PrayerTimesDebug } from "@/components/prayer-times-debug"

interface PrayerTime {
  name: string
  time: string
  bengaliTime: string
  englishTime: string
  description: string
}

interface PrayerTimes {
  [key: string]: PrayerTime
}

interface PrayerData {
  prayerTimes: PrayerTimes
  location: string
  date?: {
    readable: string
    hijri: string
    gregorian: string
  }
  nextPrayer: {
    name: string
    bengaliTime: string
  }
  fallback?: boolean
  source?: string
  offline?: boolean
  error?: string
}

interface VerseOfDay {
  surahNumber: number
  surahName: string
  verseNumber: number
  arabic: string
  bengali: string
  reference: string
}

export default function HomePage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null)
  const [verseOfDay, setVerseOfDay] = useState<VerseOfDay | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      console.log("Starting to fetch data...")

      const [prayerResponse, verseResponse] = await Promise.allSettled([fetchPrayerTimes(), fetchVerseOfDay()])

      // Handle prayer times response
      if (prayerResponse.status === "fulfilled" && prayerResponse.value.success && prayerResponse.value.data) {
        setPrayerData(prayerResponse.value.data)
        console.log("Prayer data loaded successfully")
      } else {
        console.warn("Prayer times failed, using fallback")
        // Set fallback prayer data
        setPrayerData({
          prayerTimes: {
            fajr: {
              name: "ফজর",
              time: "5:15 AM",
              bengaliTime: "৫:১৫",
              englishTime: "05:15",
              description: "সূর্যোদয়ের আগে",
            },
            dhuhr: {
              name: "যোহর",
              time: "12:30 PM",
              bengaliTime: "১২:৩০",
              englishTime: "12:30",
              description: "দুপুরের নামাজ",
            },
            asr: {
              name: "আসর",
              time: "4:45 PM",
              bengaliTime: "৪:৪৫",
              englishTime: "16:45",
              description: "বিকেলের নামাজ",
            },
            maghrib: {
              name: "মাগরিব",
              time: "6:20 PM",
              bengaliTime: "৬:২০",
              englishTime: "18:20",
              description: "সূর্যাস্তের পর",
            },
            isha: { name: "এশা", time: "7:45 PM", bengaliTime: "৭:৪৫", englishTime: "19:45", description: "রাতের নামাজ" },
          },
          location: "ঢাকা, বাংলাদেশ (চূড়ান্ত ফলব্যাক)",
          nextPrayer: { name: "আসর", bengaliTime: "৪:৪৫" },
          fallback: true,
          source: "Ultimate Fallback",
          error: "All systems failed",
        })
      }

      // Handle verse of day response
      if (verseResponse.status === "fulfilled" && verseResponse.value.success && verseResponse.value.data) {
        setVerseOfDay(verseResponse.value.data)
        console.log("Verse of day loaded successfully")
      } else {
        console.warn("Verse of day failed, using fallback")
        setVerseOfDay({
          surahNumber: 1,
          surahName: "আল-ফাতিহা",
          verseNumber: 1,
          arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
          bengali: "পরম করুণাময় ও অসীম দয়ালু আল্লাহর নামে (শুরু করছি)।",
          reference: "সূরা আল-ফাতিহা, আয়াত ১",
        })
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
      // Set ultimate fallback data
      setPrayerData({
        prayerTimes: {
          fajr: {
            name: "ফজর",
            time: "5:15 AM",
            bengaliTime: "৫:১৫",
            englishTime: "05:15",
            description: "সূর্যোদয়ের আগে",
          },
          dhuhr: {
            name: "যোহর",
            time: "12:30 PM",
            bengaliTime: "১২:৩০",
            englishTime: "12:30",
            description: "দুপুরের নামাজ",
          },
          asr: {
            name: "আসর",
            time: "4:45 PM",
            bengaliTime: "৪:৪৫",
            englishTime: "16:45",
            description: "বিকেলের নামাজ",
          },
          maghrib: {
            name: "মাগরিব",
            time: "6:20 PM",
            bengaliTime: "৬:২০",
            englishTime: "18:20",
            description: "সূর্যাস্তের পর",
          },
          isha: { name: "এশা", time: "7:45 PM", bengaliTime: "৭:৪৫", englishTime: "19:45", description: "রাতের নামাজ" },
        },
        location: "ঢাকা, বাংলাদেশ (এমার্জেন্সি ফলব্যাক)",
        nextPrayer: { name: "আসর", bengaliTime: "৪:৪৫" },
        fallback: true,
        source: "Emergency Fallback",
        error: "Complete system failure",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const features = [
    {
      title: "পবিত্র কোরআন",
      description: "সম্পূর্ণ কোরআন আরবি, বাংলা অনুবাদ ও তাফসিরসহ",
      icon: BookOpen,
      href: "/quran",
      color: "bg-green-500",
    },
    {
      title: "নামাজের সময়",
      description: "আপনার এলাকার নামাজের সময়সূচি ও নিয়মাবলী",
      icon: Clock,
      href: "/prayer-times",
      color: "bg-blue-500",
    },
    {
      title: "সহীহ হাদিস",
      description: "বুখারি, মুসলিম ও অন্যান্য সহীহ হাদিস সংগ্রহ",
      icon: Scroll,
      href: "/hadith",
      color: "bg-purple-500",
    },
    {
      title: "দোয়া সমূহ",
      description: "দৈনন্দিন জীবনের গুরুত্বপূর্ণ দোয়া সংগ্রহ",
      icon: Heart,
      href: "/duas",
      color: "bg-pink-500",
    },
    {
      title: "কিবলার দিক",
      description: "আপনার অবস্থান থেকে কিবলার সঠিক দিক নির্ণয়",
      icon: Compass,
      href: "/qibla",
      color: "bg-orange-500",
    },
    {
      title: "যাকাত ক্যালকুলেটর",
      description: "যাকাতের পরিমাণ হিসাব করুন সহজেই",
      icon: Calculator,
      href: "/zakat",
      color: "bg-teal-500",
    },
  ]

  // getCurrentNextPrayer function যোগ করুন
  const getCurrentNextPrayer = (prayerTimes: PrayerTimes | null) => {
    if (!prayerTimes) return { name: "আসর", bengaliTime: "৪:৪৫" }

    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()

    const prayers = Object.values(prayerTimes).map((prayer: PrayerTime) => {
      const [hours, minutes] = prayer.englishTime.split(":").map(Number)
      const totalMinutes = hours * 60 + minutes

      return {
        ...prayer,
        totalMinutes,
      }
    })

    // Find next prayer
    const nextPrayer = prayers.find((prayer) => prayer.totalMinutes > currentTime)
    return nextPrayer || prayers[0] // If no prayer found, return first prayer of next day
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <OfflineIndicator />
      <div className="bg-background text-foreground">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-8 w-8 text-green-600" />
                  <h1 className="text-2xl font-bold text-green-600">ইসলামিক গাইড</h1>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" onClick={() => setIsDarkMode(!isDarkMode)}>
                  {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
                <ShareButton
                  title="ইসলামিক গাইড"
                  text="আপনার দৈনন্দিন ইসলামিক জীবনযাত্রার জন্য একটি সম্পূর্ণ গাইড। কোরআন, হাদিস, নামাজের সময়, দোয়া সহ সবকিছু।"
                  url={typeof window !== 'undefined' ? window.location.origin : ''}
                  variant="ghost"
                  size="sm"
                >
                  <Share2 className="h-5 w-5" />
                </ShareButton>
                <Button variant="ghost" size="icon">
                  <Search className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-4">আসসালামু আলাইকুম</h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90">আপনার দৈনন্দিন ইসলামিক জীবনযাত্রার সহায়ক</p>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {mounted ? currentTime.toLocaleTimeString("bn-BD", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  }) : "০০:০০:০০"}
                </div>
                <div className="text-sm opacity-75">বর্তমান সময়</div>
              </div>
              <div className="text-center">
                {/* Hero section এ Badge এর জায়গায় এটি ব্যবহার করুন: */}
                {prayerData && (
                  <>
                    {(() => {
                      const nextPrayer = getCurrentNextPrayer(prayerData?.prayerTimes)
                      return (
                        <Badge variant="secondary" className="text-lg px-4 py-2">
                          পরবর্তী নামাজ: {nextPrayer.name} {nextPrayer.bengaliTime}
                        </Badge>
                      )
                    })()}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Quick Prayer Times */}
        <section className="py-8 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <h3 className="text-2xl font-bold">আজকের নামাজের সময়</h3>
              <PrayerTimesStatus isLoading={loading} isFallback={prayerData?.fallback} source={prayerData?.source} />
            </div>
            {prayerData && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.values(prayerData.prayerTimes).map((prayer, index) => (
                  <Card key={index} className="text-center">
                    <CardContent className="p-4">
                      <div className="font-semibold text-lg">{prayer.name}</div>
                      <div className="text-2xl font-bold text-green-600">{prayer.bengaliTime}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Debug Component */}
            <div className="flex justify-center mt-4">
              <PrayerTimesDebug prayerData={prayerData} loading={loading} onRefresh={fetchData} />
            </div>
          </div>
        </section>

        {/* Main Features */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center mb-12">প্রধান বৈশিষ্ট্যসমূহ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Link key={index} href={feature.href}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader>
                      <div
                        className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                      >
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <CardDescription className="text-base">{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="ghost" className="w-full">
                        বিস্তারিত দেখুন →
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Islamic Quote */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              {verseOfDay && (
                <Card className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
                  <CardHeader>
                    <CardTitle>আজকের আয়াত</CardTitle>
                    <CardDescription>{verseOfDay.reference}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-right">
                      <p className="text-3xl font-arabic leading-loose text-green-700 dark:text-green-300">
                        {verseOfDay.arabic}
                      </p>
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-800 dark:text-gray-200">{verseOfDay.bengali}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
              <cite className="text-lg text-muted-foreground">- সহীহ তিরমিজি</cite>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-card border-t py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <BookOpen className="h-6 w-6 text-green-600" />
                  <span className="text-xl font-bold">ইসলামিক গাইড</span>
                </div>
                <p className="text-muted-foreground">আপনার দৈনন্দিন ইসলামিক জীবনযাত্রার জন্য একটি সম্পূর্ণ গাইড।</p>
              </div>

              <div>
                <h4 className="font-semibold mb-4">প্রধান বিভাগ</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <Link href="/quran" className="hover:text-foreground">
                      পবিত্র কোরআন
                    </Link>
                  </li>
                  <li>
                    <Link href="/hadith" className="hover:text-foreground">
                      সহীহ হাদিস
                    </Link>
                  </li>
                  <li>
                    <Link href="/prayer-times" className="hover:text-foreground">
                      নামাজের সময়
                    </Link>
                  </li>
                  <li>
                    <Link href="/duas" className="hover:text-foreground">
                      দোয়া সমূহ
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">ইসলামিক টুলস</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <Link href="/qibla" className="hover:text-foreground">
                      কিবলার দিক
                    </Link>
                  </li>
                  <li>
                    <Link href="/zakat" className="hover:text-foreground">
                      যাকাত ক্যালকুলেটর
                    </Link>
                  </li>
                  <li>
                    <Link href="/hajj" className="hover:text-foreground">
                      হজ গাইড
                    </Link>
                  </li>
                  <li>
                    <Link href="/masail" className="hover:text-foreground">
                      মাসায়েল
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">যোগাযোগ</h4>
                <div className="space-y-2 text-muted-foreground">
                  <p>ডেভেলপার: Md. Al-amin Islam</p>
                  <p>ইমেইল: alamindeploper@gmail.com</p>
                  <p>ফোন: ০১৭২৫৩২২৮৩৪</p>
                </div>
              </div>
            </div>

            <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
              <p>&copy; ২০২৫ ইসলামিক গাইড। সকল অধিকার সংরক্ষিত। | Developed by Md. Al-amin Islam</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
