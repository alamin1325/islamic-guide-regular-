import { NextResponse } from "next/server"

// Static export এর জন্য
export const dynamic = "force-static"

export async function GET() {
  try {
    // Completely offline prayer times that work without any external dependencies
    const now = new Date()
    const month = now.getMonth() + 1
    const day = now.getDate()

    // Seasonal prayer times for Bangladesh (more accurate)
    const seasonalTimes = getSeasonalPrayerTimes(month, day)

    return NextResponse.json({
      success: true,
      data: {
        prayerTimes: seasonalTimes,
        location: "বাংলাদেশ (অফলাইন সিস্টেম)",
        date: {
          readable: now.toLocaleDateString("bn-BD"),
          hijri: "১৪৪৬",
          gregorian: now.toLocaleDateString(),
        },
        nextPrayer: getNextPrayer(seasonalTimes),
        source: "Offline System",
        fallback: true,
        offline: true,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Offline system failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

function getSeasonalPrayerTimes(month: number, day: number) {
  // More accurate seasonal adjustment for Bangladesh
  let fajrTime = "05:15"
  const dhuhrTime = "12:30"
  let asrTime = "16:45"
  let maghribTime = "18:20"
  let ishaTime = "19:45"

  // Winter months (November to February)
  if (month >= 11 || month <= 2) {
    fajrTime = "05:45"
    asrTime = "16:15"
    maghribTime = "17:45"
    ishaTime = "19:15"
  }
  // Summer months (April to September)
  else if (month >= 4 && month <= 9) {
    fajrTime = "04:45"
    asrTime = "17:15"
    maghribTime = "18:45"
    ishaTime = "20:15"
  }
  // Transition months (March, October)
  else {
    fajrTime = "05:00"
    asrTime = "16:30"
    maghribTime = "18:00"
    ishaTime = "19:30"
  }

  return {
    fajr: {
      name: "ফজর",
      time: convertTo12Hour(fajrTime),
      bengaliTime: convertToBengaliTime(fajrTime),
      englishTime: fajrTime,
      description: "সূর্যোদয়ের আগে",
    },
    dhuhr: {
      name: "যোহর",
      time: convertTo12Hour(dhuhrTime),
      bengaliTime: convertToBengaliTime(dhuhrTime),
      englishTime: dhuhrTime,
      description: "দুপুরের নামাজ",
    },
    asr: {
      name: "আসর",
      time: convertTo12Hour(asrTime),
      bengaliTime: convertToBengaliTime(asrTime),
      englishTime: asrTime,
      description: "বিকেলের নামাজ",
    },
    maghrib: {
      name: "মাগরিব",
      time: convertTo12Hour(maghribTime),
      bengaliTime: convertToBengaliTime(maghribTime),
      englishTime: maghribTime,
      description: "সূর্যাস্তের পর",
    },
    isha: {
      name: "এশা",
      time: convertTo12Hour(ishaTime),
      bengaliTime: convertToBengaliTime(ishaTime),
      englishTime: ishaTime,
      description: "রাতের নামাজ",
    },
  }
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

function getNextPrayer(prayerTimes: any) {
  const now = new Date()
  const currentTime = now.getHours() * 60 + now.getMinutes()

  const prayers = Object.values(prayerTimes).map((prayer: any) => {
    const [hours, minutes] = prayer.englishTime.split(":").map(Number)
    const totalMinutes = hours * 60 + minutes

    return {
      ...prayer,
      totalMinutes,
    }
  })

  const nextPrayer = prayers.find((prayer) => prayer.totalMinutes > currentTime)
  return nextPrayer || prayers[0]
}
