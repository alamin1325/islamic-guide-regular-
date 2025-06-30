import { type NextRequest, NextResponse } from "next/server"

// Static export এর জন্য
export const dynamic = "force-static"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const city = searchParams.get("city") || "Dhaka"
    const country = searchParams.get("country") || "Bangladesh"
    const method = searchParams.get("method") || "1"

    console.log(`Fetching prayer times for ${city}, ${country}`)

    // Get current date
    const today = new Date()
    const day = today.getDate().toString().padStart(2, "0")
    const month = (today.getMonth() + 1).toString().padStart(2, "0")
    const year = today.getFullYear()
    const dateString = `${day}-${month}-${year}`

    // Try different API approaches with correct endpoints
    const apis = [
      {
        name: "Aladhan Timings by City",
        url: `https://api.aladhan.com/v1/timingsByCity/${dateString}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`,
      },
      {
        name: "Aladhan Timings by Address",
        url: `https://api.aladhan.com/v1/timingsByAddress/${dateString}?address=${encodeURIComponent(city + ", " + country)}&method=${method}`,
      },
      {
        name: "Prayer Times API",
        url: `https://api.pray.zone/v2/times/today.json?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`,
      },
    ]

    let lastError = null

    // Try each API
    for (const api of apis) {
      try {
        console.log(`Trying ${api.name}: ${api.url}`)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000)

        const response = await fetch(api.url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (compatible; Islamic-Guide-App/1.0)",
          },
          signal: controller.signal,
          redirect: "follow", // Handle redirects automatically
        })

        clearTimeout(timeoutId)

        console.log(`${api.name} response status:`, response.status)
        console.log(`${api.name} final URL:`, response.url)

        if (response.ok) {
          const responseText = await response.text()
          console.log(`${api.name} response length:`, responseText.length)

          // Check if response is JSON
          let data
          try {
            data = JSON.parse(responseText)
          } catch (parseError) {
            console.error(`${api.name} JSON parse error:`, parseError)
            console.log("Response preview:", responseText.substring(0, 200))
            lastError = new Error(`${api.name} returned non-JSON response`)
            continue
          }

          // Handle different API response formats
          if (api.name.includes("Aladhan")) {
            if (data.code === 200 && data.data && data.data.timings) {
              const timings = data.data.timings
              const date = data.data.date

              const prayerTimes = formatAladhanResponse(timings)

              return NextResponse.json({
                success: true,
                data: {
                  prayerTimes,
                  location: `${city}, ${country}`,
                  date: {
                    readable: date?.readable || new Date().toLocaleDateString(),
                    hijri: date?.hijri?.date || "১৪৪৬",
                    gregorian: date?.gregorian?.date || new Date().toLocaleDateString(),
                  },
                  nextPrayer: getNextPrayer(prayerTimes),
                  source: api.name,
                },
              })
            }
          } else if (api.name.includes("Prayer Times API")) {
            if (data.results && data.results.datetime) {
              const timings = data.results.datetime[0].times
              const prayerTimes = formatPrayZoneResponse(timings)

              return NextResponse.json({
                success: true,
                data: {
                  prayerTimes,
                  location: `${city}, ${country}`,
                  date: {
                    readable: new Date().toLocaleDateString(),
                    hijri: "১৪৪৬",
                    gregorian: new Date().toLocaleDateString(),
                  },
                  nextPrayer: getNextPrayer(prayerTimes),
                  source: api.name,
                },
              })
            }
          }

          lastError = new Error(`${api.name} returned unexpected data structure`)
        } else {
          const errorText = await response.text()
          console.error(`${api.name} HTTP error:`, response.status, errorText.substring(0, 200))
          lastError = new Error(`${api.name} HTTP ${response.status}`)
        }
      } catch (error) {
        console.error(`${api.name} failed:`, error)
        lastError = error
        continue
      }
    }

    // If all APIs failed, use enhanced local calculation
    console.log("All APIs failed, using enhanced local calculation")
    const localPrayerTimes = calculateEnhancedLocalPrayerTimes(city, country)

    return NextResponse.json({
      success: true,
      data: {
        prayerTimes: localPrayerTimes,
        location: `${city}, ${country} (উন্নত স্থানীয় গণনা)`,
        date: {
          readable: new Date().toLocaleDateString("bn-BD"),
          hijri: "১৪৪৬",
          gregorian: new Date().toLocaleDateString(),
        },
        nextPrayer: getNextPrayer(localPrayerTimes),
        fallback: true,
        source: "Enhanced Local Calculation",
        error: lastError?.message || "All APIs failed",
      },
    })
  } catch (error) {
    console.error("Prayer times API error:", error)

    // Return enhanced local calculation as ultimate fallback
    const localPrayerTimes = calculateEnhancedLocalPrayerTimes()

    return NextResponse.json({
      success: true,
      data: {
        prayerTimes: localPrayerTimes,
        location: "ঢাকা, বাংলাদেশ (জরুরি গণনা)",
        date: {
          readable: new Date().toLocaleDateString("bn-BD"),
          hijri: "১৪৪৬",
          gregorian: new Date().toLocaleDateString(),
        },
        nextPrayer: getNextPrayer(localPrayerTimes),
        fallback: true,
        source: "Emergency Calculation",
        error: error instanceof Error ? error.message : "Complete system failure",
      },
    })
  }
}

function formatAladhanResponse(timings: any) {
  return {
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
}

function formatPrayZoneResponse(timings: any) {
  return {
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
}

// Enhanced local prayer time calculation with proper Islamic formulas
function calculateEnhancedLocalPrayerTimes(city = "Dhaka", country = "Bangladesh") {
  const now = new Date()
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24))

  // Enhanced coordinates for major cities with more accuracy
  const cityCoordinates = {
    dhaka: { lat: 23.8103, lng: 90.4125, timezone: 6 },
    chittagong: { lat: 22.3569, lng: 91.7832, timezone: 6 },
    sylhet: { lat: 24.8949, lng: 91.8687, timezone: 6 },
    rajshahi: { lat: 24.3636, lng: 88.6241, timezone: 6 },
    khulna: { lat: 22.8456, lng: 89.5403, timezone: 6 },
    barisal: { lat: 22.701, lng: 90.3535, timezone: 6 },
    rangpur: { lat: 25.7439, lng: 89.2752, timezone: 6 },
    mymensingh: { lat: 24.7471, lng: 90.4203, timezone: 6 },
    comilla: { lat: 23.4607, lng: 91.1809, timezone: 6 },
    gazipur: { lat: 24.0022, lng: 90.4264, timezone: 6 },
  }

  const cityKey =
    Object.keys(cityCoordinates).find((key) => city.toLowerCase().includes(key) || key.includes(city.toLowerCase())) ||
    "dhaka"

  const coords = cityCoordinates[cityKey]

  // Enhanced prayer time calculation using proper Islamic astronomical formulas
  const times = calculateIslamicPrayerTimes(coords.lat, coords.lng, coords.timezone, dayOfYear)

  return {
    fajr: {
      name: "ফজর",
      time: convertTo12Hour(times.fajr),
      bengaliTime: convertToBengaliTime(times.fajr),
      englishTime: times.fajr,
      description: "সূর্যোদয়ের আগে",
    },
    dhuhr: {
      name: "যোহর",
      time: convertTo12Hour(times.dhuhr),
      bengaliTime: convertToBengaliTime(times.dhuhr),
      englishTime: times.dhuhr,
      description: "দুপুরের নামাজ",
    },
    asr: {
      name: "আসর",
      time: convertTo12Hour(times.asr),
      bengaliTime: convertToBengaliTime(times.asr),
      englishTime: times.asr,
      description: "বিকেলের নামাজ",
    },
    maghrib: {
      name: "মাগরিব",
      time: convertTo12Hour(times.maghrib),
      bengaliTime: convertToBengaliTime(times.maghrib),
      englishTime: times.maghrib,
      description: "সূর্যাস্তের পর",
    },
    isha: {
      name: "এশা",
      time: convertTo12Hour(times.isha),
      bengaliTime: convertToBengaliTime(times.isha),
      englishTime: times.isha,
      description: "রাতের নামাজ",
    },
  }
}

function calculateIslamicPrayerTimes(latitude: number, longitude: number, timezone: number, dayOfYear: number) {
  // More accurate Islamic prayer time calculation
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

  // Hour angles for different prayers
  const fajrAngle = 18 // 18 degrees below horizon
  const ishaAngle = 17 // 17 degrees below horizon

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
  const dhuhr = solarNoon + 0.5 / 60 // 30 seconds after solar noon

  // Asr calculation (Hanafi method - shadow length = object length + shadow at noon)
  const asrShadowFactor = 2 // Hanafi method
  const asrAngle = (Math.atan(1 / (asrShadowFactor + Math.tan(Math.abs(lat - decRad)))) * 180) / Math.PI
  const asrHourAngle =
    (Math.acos(
      (Math.sin((asrAngle * Math.PI) / 180) - Math.sin(lat) * Math.sin(decRad)) / (Math.cos(lat) * Math.cos(decRad)),
    ) *
      180) /
    Math.PI /
    15
  const asr = solarNoon + asrHourAngle

  const maghrib = solarNoon + sunriseHourAngle
  const isha = solarNoon + ishaHourAngle

  return {
    fajr: formatTime(Math.max(0, fajr)),
    dhuhr: formatTime(dhuhr),
    asr: formatTime(asr),
    maghrib: formatTime(maghrib),
    isha: formatTime(isha),
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
