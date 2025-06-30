import { type NextRequest, NextResponse } from "next/server"

// Static export এর জন্য
export const dynamic = "force-static"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const latitude = searchParams.get("latitude")
    const longitude = searchParams.get("longitude")
    const city = searchParams.get("city") || "Dimla"
    const district = searchParams.get("district") || "Nilphamari"
    const division = searchParams.get("division") || "Rangpur"
    const postalCode = searchParams.get("postalCode") || "5350"

    console.log(`Fetching prayer times for ${city}, ${district}, ${division} (${postalCode})`)

    // Enhanced location-based prayer time calculation
    const prayerTimes = await calculateLocationBasedPrayerTimes(
      latitude ? Number.parseFloat(latitude) : 25.6516, // Dimla coordinates
      longitude ? Number.parseFloat(longitude) : 88.6741,
      city,
      district,
      division,
      postalCode,
    )

    return NextResponse.json({
      success: true,
      data: prayerTimes,
    })
  } catch (error) {
    console.error("Location-based prayer times error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch location-based prayer times",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

async function calculateLocationBasedPrayerTimes(
  lat: number,
  lng: number,
  city: string,
  district: string,
  division: string,
  postalCode: string,
) {
  const now = new Date()
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24))

  // Enhanced coordinates for Bangladesh locations
  const bangladeshLocations = {
    dimla: { lat: 25.6516, lng: 88.6741, timezone: 6, name: "দিমলা" },
    nilphamari: { lat: 25.9317, lng: 88.856, timezone: 6, name: "নীলফামারী" },
    rangpur: { lat: 25.7439, lng: 89.2752, timezone: 6, name: "রংপুর" },
    dhaka: { lat: 23.8103, lng: 90.4125, timezone: 6, name: "ঢাকা" },
    chittagong: { lat: 22.3569, lng: 91.7832, timezone: 6, name: "চট্টগ্রাম" },
    sylhet: { lat: 24.8949, lng: 91.8687, timezone: 6, name: "সিলেট" },
    rajshahi: { lat: 24.3636, lng: 88.6241, timezone: 6, name: "রাজশাহী" },
    khulna: { lat: 22.8456, lng: 89.5403, timezone: 6, name: "খুলনা" },
    barisal: { lat: 22.701, lng: 90.3535, timezone: 6, name: "বরিশাল" },
    mymensingh: { lat: 24.7471, lng: 90.4203, timezone: 6, name: "ময়মনসিংহ" },
  }

  // Use provided coordinates or default to Dimla
  const coords = {
    lat: lat || bangladeshLocations.dimla.lat,
    lng: lng || bangladeshLocations.dimla.lng,
    timezone: 6,
  }

  // Calculate Islamic prayer times using astronomical formulas
  const times = calculateIslamicPrayerTimes(coords.lat, coords.lng, coords.timezone, dayOfYear)

  // Get next prayer
  const nextPrayer = getNextPrayer(times)

  // Format location string
  const locationString = `${city}, ${district}, ${division} (${postalCode})`

  return {
    prayerTimes: times,
    location: locationString,
    coordinates: {
      latitude: coords.lat,
      longitude: coords.lng,
    },
    date: {
      readable: now.toLocaleDateString("bn-BD"),
      hijri: getHijriDate(),
      gregorian: now.toLocaleDateString(),
      dayOfYear,
    },
    nextPrayer,
    source: "Enhanced Location Calculation",
    realTime: true,
    autoLocation: true,
    postalCode,
    division,
    district,
    city,
  }
}

function calculateIslamicPrayerTimes(latitude: number, longitude: number, timezone: number, dayOfYear: number) {
  const lat = (latitude * Math.PI) / 180
  const lng = longitude

  // Solar declination angle
  const declination = 23.45 * Math.sin((((360 * (284 + dayOfYear)) / 365) * Math.PI) / 180)
  const decRad = (declination * Math.PI) / 180

  // Equation of time
  const B = ((360 / 365) * (dayOfYear - 81) * Math.PI) / 180
  const E = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B)

  // Solar noon
  const solarNoon = 12 - (lng - timezone * 15) / 15 - E / 60

  // Hour angles for different prayers (Bangladesh standard)
  const fajrAngle = 18.5 // 18.5 degrees for Bangladesh
  const ishaAngle = 17.5 // 17.5 degrees for Bangladesh

  // Calculate hour angles
  const fajrHourAngle =
    (Math.acos(
      (-Math.sin((fajrAngle * Math.PI) / 180) - Math.sin(lat) * Math.sin(decRad)) / (Math.cos(lat) * Math.cos(decRad)),
    ) *
      180) /
    Math.PI /
    15

  const sunriseHourAngle = (Math.acos(-Math.tan(lat) * Math.tan(decRad)) * 180) / Math.PI / 15

  const ishaHourAngle =
    (Math.acos(
      (-Math.sin((ishaAngle * Math.PI) / 180) - Math.sin(lat) * Math.sin(decRad)) / (Math.cos(lat) * Math.cos(decRad)),
    ) *
      180) /
    Math.PI /
    15

  // Calculate prayer times
  const fajr = solarNoon - fajrHourAngle
  const sunrise = solarNoon - sunriseHourAngle
  const dhuhr = solarNoon + 2 / 60 // 2 minutes after solar noon

  // Asr calculation (Hanafi method - shadow length = object length + shadow at noon)
  const asrShadowFactor = 2 // Hanafi method used in Bangladesh
  const asrAngle = (Math.atan(1 / (asrShadowFactor + Math.tan(Math.abs(lat - decRad)))) * 180) / Math.PI
  const asrHourAngle =
    (Math.acos(
      (Math.sin((asrAngle * Math.PI) / 180) - Math.sin(lat) * Math.sin(decRad)) / (Math.cos(lat) * Math.cos(decRad)),
    ) *
      180) /
    Math.PI /
    15
  const asr = solarNoon + asrHourAngle

  const maghrib = solarNoon + sunriseHourAngle + 3 / 60 // 3 minutes after sunset
  const isha = solarNoon + ishaHourAngle

  return {
    fajr: {
      name: "ফজর",
      time: convertTo12Hour(formatTime(Math.max(0, fajr))),
      bengaliTime: convertToBengaliTime(formatTime(Math.max(0, fajr))),
      englishTime: formatTime(Math.max(0, fajr)),
      description: "সূর্যোদয়ের আগে",
    },
    dhuhr: {
      name: "যোহর",
      time: convertTo12Hour(formatTime(dhuhr)),
      bengaliTime: convertToBengaliTime(formatTime(dhuhr)),
      englishTime: formatTime(dhuhr),
      description: "দুপুরের নামাজ",
    },
    asr: {
      name: "আসর",
      time: convertTo12Hour(formatTime(asr)),
      bengaliTime: convertToBengaliTime(formatTime(asr)),
      englishTime: formatTime(asr),
      description: "বিকেলের নামাজ",
    },
    maghrib: {
      name: "মাগরিব",
      time: convertTo12Hour(formatTime(maghrib)),
      bengaliTime: convertToBengaliTime(formatTime(maghrib)),
      englishTime: formatTime(maghrib),
      description: "সূর্যাস্তের পর",
    },
    isha: {
      name: "এশা",
      time: convertTo12Hour(formatTime(isha)),
      bengaliTime: convertToBengaliTime(formatTime(isha)),
      englishTime: formatTime(isha),
      description: "রাতের নামাজ",
    },
  }
}

function formatTime(decimalHours: number): string {
  const hours = Math.floor(decimalHours) % 24
  const minutes = Math.round((decimalHours - Math.floor(decimalHours)) * 60)
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
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

function getHijriDate(): string {
  // Simplified Hijri date calculation
  const gregorianDate = new Date()
  const hijriYear = gregorianDate.getFullYear() - 579 // Approximate conversion
  return `${hijriYear} হিজরি`
}
