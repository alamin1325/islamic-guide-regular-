import { NextResponse } from "next/server"

// Static export এর জন্য
export const dynamic = "force-static"

export async function GET() {
  try {
    // Simple static prayer times that always work
    const staticPrayerTimes = {
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
      isha: {
        name: "এশা",
        time: "7:45 PM",
        bengaliTime: "৭:৪৫",
        englishTime: "19:45",
        description: "রাতের নামাজ",
      },
    }

    return NextResponse.json({
      success: true,
      data: {
        prayerTimes: staticPrayerTimes,
        location: "ঢাকা, বাংলাদেশ (স্ট্যাটিক)",
        date: {
          readable: new Date().toLocaleDateString("bn-BD"),
          hijri: "১৪৪৬",
          gregorian: new Date().toLocaleDateString(),
        },
        nextPrayer: getNextPrayer(staticPrayerTimes),
        source: "Static Data",
        fallback: true,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get static prayer times",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
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
  return nextPrayer || prayers[0]
}
