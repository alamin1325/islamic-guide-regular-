import { type NextRequest, NextResponse } from "next/server"

// Static export এর জন্য
export const dynamic = "force-static"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const latitude = searchParams.get("latitude")
    const longitude = searchParams.get("longitude")
    const method = searchParams.get("method") || "1"

    if (!latitude || !longitude) {
      return NextResponse.json(
        {
          success: false,
          error: "Latitude and longitude are required",
        },
        { status: 400 },
      )
    }

    console.log(`Fetching prayer times for coordinates: ${latitude}, ${longitude}`)

    // Use coordinates-based API
    const today = new Date()
    const dateString = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`

    const response = await fetch(
      `http://api.aladhan.com/v1/timings/${dateString}?latitude=${latitude}&longitude=${longitude}&method=${method}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "User-Agent": "Islamic-Guide-App/1.0",
        },
        redirect: "follow",
      },
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.code !== 200) {
      throw new Error(`API returned code: ${data.code}`)
    }

    const timings = data.data.timings
    const date = data.data.date

    // Format prayer times for Bengali
    const prayerTimes = {
      fajr: {
        name: "ফজর",
        time: convertTo12Hour(timings.Fajr),
        bengaliTime: convertToBengaliTime(timings.Fajr),
        englishTime: timings.Fajr,
        description: "সূর্যোদয়ের আগে",
      },
      dhuhr: {
        name: "যোহর",
        time: convertTo12Hour(timings.Dhuhr),
        bengaliTime: convertToBengaliTime(timings.Dhuhr),
        englishTime: timings.Dhuhr,
        description: "দুপুরের নামাজ",
      },
      asr: {
        name: "আসর",
        time: convertTo12Hour(timings.Asr),
        bengaliTime: convertToBengaliTime(timings.Asr),
        englishTime: timings.Asr,
        description: "বিকেলের নামাজ",
      },
      maghrib: {
        name: "মাগরিব",
        time: convertTo12Hour(timings.Maghrib),
        bengaliTime: convertToBengaliTime(timings.Maghrib),
        englishTime: timings.Maghrib,
        description: "সূর্যাস্তের পর",
      },
      isha: {
        name: "এশা",
        time: convertTo12Hour(timings.Isha),
        bengaliTime: convertToBengaliTime(timings.Isha),
        englishTime: timings.Isha,
        description: "রাতের নামাজ",
      },
    }

    return NextResponse.json({
      success: true,
      data: {
        prayerTimes,
        location: `${latitude}, ${longitude}`,
        date: {
          readable: date.readable,
          hijri: date.hijri.date,
          gregorian: date.gregorian.date,
        },
        nextPrayer: getNextPrayer(prayerTimes),
        source: "Coordinates API",
      },
    })
  } catch (error) {
    console.error("Coordinates prayer times API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch prayer times by coordinates",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
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

  // Find next prayer
  const nextPrayer = prayers.find((prayer) => prayer.totalMinutes > currentTime)
  return nextPrayer || prayers[0] // If no prayer found, return first prayer of next day
}
