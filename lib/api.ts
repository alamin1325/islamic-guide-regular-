// API utility functions with enhanced error handling

export interface PrayerTimesResponse {
  success: boolean
  data?: {
    prayerTimes: {
      [key: string]: {
        name: string
        time: string
        bengaliTime: string
        englishTime: string
        description: string
      }
    }
    location: string
    date: {
      readable: string
      hijri: string
      gregorian: string
    }
    nextPrayer: any
    fallback?: boolean
    source?: string
    offline?: boolean
  }
  error?: string
  message?: string
}

export interface QuranSurahsResponse {
  success: boolean
  data?: Array<{
    id: number
    name: string
    arabicName: string
    englishName: string
    verses: number
    revelation: string
    meaning: string
  }>
  total?: number
  error?: string
  message?: string
}

export interface SurahDetailResponse {
  success: boolean
  data?: {
    number: number
    name: string
    englishName: string
    englishNameTranslation: string
    numberOfAyahs: number
    revelationType: string
    verses: Array<{
      number: number
      numberInSurah: number
      arabic: string
      bengali: string
      juz: number
      manzil: number
      page: number
      ruku: number
      hizbQuarter: number
      sajda: boolean | object
    }>
  }
  error?: string
  message?: string
}

export interface VerseOfDayResponse {
  success: boolean
  data?: {
    surahNumber: number
    surahName: string
    verseNumber: number
    arabic: string
    bengali: string
    reference: string
  }
  error?: string
  message?: string
}

// Enhanced API functions with multiple fallback layers
export async function fetchPrayerTimes(city = "Dhaka", country = "Bangladesh"): Promise<PrayerTimesResponse> {
  const apis = [
    `/api/prayer-times?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`,
    "/api/prayer-times/offline",
  ]

  for (const apiUrl of apis) {
    try {
      console.log(`Trying API: ${apiUrl}`)

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(15000), // 15 second timeout
      })

      if (!response.ok) {
        console.warn(`API ${apiUrl} returned ${response.status}`)
        continue
      }

      const data = await response.json()

      if (data.success) {
        console.log(`API ${apiUrl} succeeded with source: ${data.data?.source}`)
        return data
      }
    } catch (error) {
      console.error(`API ${apiUrl} failed:`, error)
      continue
    }
  }

  // Ultimate client-side fallback with enhanced calculation
  console.log("All APIs failed, using enhanced client fallback")
  return {
    success: true,
    data: {
      prayerTimes: getEnhancedClientFallback(city),
      location: `${city}, ${country} (ক্লায়েন্ট ইমার্জেন্সি)`,
      date: {
        readable: new Date().toLocaleDateString("bn-BD"),
        hijri: "১৪৪৬",
        gregorian: new Date().toLocaleDateString(),
      },
      nextPrayer: {
        name: "আসর",
        time: "4:45 PM",
        bengaliTime: "৪:৪৫",
        englishTime: "16:45",
        description: "বিকেলের নামাজ",
      },
      fallback: true,
      source: "Enhanced Client Emergency",
      offline: true,
    },
    error: "All systems failed - using emergency offline calculation",
  }
}

function getEnhancedClientFallback(city: string) {
  const now = new Date()
  const month = now.getMonth() + 1
  const hour = now.getHours()

  // Enhanced city-specific and time-aware calculation
  const cityData = {
    dhaka: { base: { fajr: "05:15", dhuhr: "12:30", asr: "16:45", maghrib: "18:20", isha: "19:45" }, offset: 0 },
    chittagong: { base: { fajr: "05:10", dhuhr: "12:25", asr: "16:40", maghrib: "18:15", isha: "19:40" }, offset: -5 },
    sylhet: { base: { fajr: "05:05", dhuhr: "12:20", asr: "16:35", maghrib: "18:10", isha: "19:35" }, offset: -10 },
    rajshahi: { base: { fajr: "05:20", dhuhr: "12:35", asr: "16:50", maghrib: "18:25", isha: "19:50" }, offset: 5 },
    khulna: { base: { fajr: "05:18", dhuhr: "12:33", asr: "16:48", maghrib: "18:23", isha: "19:48" }, offset: 3 },
  }

  const cityKey =
    Object.keys(cityData).find((key) => city.toLowerCase().includes(key) || key.includes(city.toLowerCase())) || "dhaka"

  const data = cityData[cityKey]

  // Seasonal adjustment
  let seasonalOffset = 0
  if (month >= 11 || month <= 2) {
    // Winter
    seasonalOffset = -20 // 20 minutes earlier
  } else if (month >= 4 && month <= 9) {
    // Summer
    seasonalOffset = 20 // 20 minutes later
  }

  const adjustedTimes = {
    fajr: adjustTime(data.base.fajr, data.offset + seasonalOffset),
    dhuhr: adjustTime(data.base.dhuhr, data.offset),
    asr: adjustTime(data.base.asr, data.offset + seasonalOffset),
    maghrib: adjustTime(data.base.maghrib, data.offset + seasonalOffset),
    isha: adjustTime(data.base.isha, data.offset + seasonalOffset),
  }

  return {
    fajr: {
      name: "ফজর",
      time: convertTo12Hour(adjustedTimes.fajr),
      bengaliTime: convertToBengaliTime(adjustedTimes.fajr),
      englishTime: adjustedTimes.fajr,
      description: "সূর্যোদয়ের আগে",
    },
    dhuhr: {
      name: "যোহর",
      time: convertTo12Hour(adjustedTimes.dhuhr),
      bengaliTime: convertToBengaliTime(adjustedTimes.dhuhr),
      englishTime: adjustedTimes.dhuhr,
      description: "দুপুরের নামাজ",
    },
    asr: {
      name: "আসর",
      time: convertTo12Hour(adjustedTimes.asr),
      bengaliTime: convertToBengaliTime(adjustedTimes.asr),
      englishTime: adjustedTimes.asr,
      description: "বিকেলের নামাজ",
    },
    maghrib: {
      name: "মাগরিব",
      time: convertTo12Hour(adjustedTimes.maghrib),
      bengaliTime: convertToBengaliTime(adjustedTimes.maghrib),
      englishTime: adjustedTimes.maghrib,
      description: "সূর্যাস্তের পর",
    },
    isha: {
      name: "এশা",
      time: convertTo12Hour(adjustedTimes.isha),
      bengaliTime: convertToBengaliTime(adjustedTimes.isha),
      englishTime: adjustedTimes.isha,
      description: "রাতের নামাজ",
    },
  }
}

function adjustTime(timeStr: string, minutes: number): string {
  const [hours, mins] = timeStr.split(":").map(Number)
  const totalMinutes = hours * 60 + mins + minutes
  const newHours = Math.floor(totalMinutes / 60) % 24
  const newMins = totalMinutes % 60
  return `${newHours.toString().padStart(2, "0")}:${Math.abs(newMins).toString().padStart(2, "0")}`
}

function convertTo12Hour(time24: string): string {
  const [hours, minutes] = time24.split(":")
  const hour = Number.parseInt(hours)
  const ampm = hour >= 12 ? "PM" : "AM"
  const hour12 = hour % 12 || 12
  return `${hour12}:${minutes} ${ampm}`
}

function convertToBengaliTime(time24: string): string {
  const [hours, minutes] = time24.split(":")
  const hour = Number.parseInt(hours)
  const bengaliHour = convertToBengaliNumber(hour.toString())
  const bengaliMinutes = convertToBengaliNumber(minutes)
  return `${bengaliHour}:${bengaliMinutes}`
}

function convertToBengaliNumber(num: string): string {
  const bengaliNumbers = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"]
  return num.replace(/\d/g, (digit) => bengaliNumbers[Number.parseInt(digit)])
}

export async function fetchQuranSurahs(): Promise<QuranSurahsResponse> {
  try {
    const response = await fetch("/api/quran/surahs")
    return await response.json()
  } catch (error) {
    return {
      success: false,
      error: "Failed to fetch Quran surahs",
      message: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function fetchSurahDetail(surahId: number): Promise<SurahDetailResponse> {
  try {
    const response = await fetch(`/api/quran/surah/${surahId}`)
    return await response.json()
  } catch (error) {
    return {
      success: false,
      error: "Failed to fetch surah detail",
      message: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function fetchVerseOfDay(): Promise<VerseOfDayResponse> {
  try {
    const response = await fetch("/api/quran/verse-of-day")
    return await response.json()
  } catch (error) {
    return {
      success: false,
      error: "Failed to fetch verse of the day",
      message: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Location utilities
export function getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      (error) => {
        reject(error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    )
  })
}

export async function getCityFromCoordinates(lat: number, lon: number): Promise<{ city: string; country: string }> {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
    )
    const data = await response.json()

    return {
      city: data.city || data.locality || "Unknown",
      country: data.countryName || "Unknown",
    }
  } catch (error) {
    console.error("Failed to get city from coordinates:", error)
    return { city: "Dhaka", country: "Bangladesh" }
  }
}
