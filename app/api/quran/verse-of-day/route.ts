import { NextResponse } from "next/server"

// Static export এর জন্য
export const dynamic = "force-static"

export async function GET() {
  try {
    // Get a random verse for "Verse of the Day"
    const randomSurah = Math.floor(Math.random() * 114) + 1

    const response = await fetch(`https://api.alquran.cloud/v1/surah/${randomSurah}/editions/quran-simple,bn.bengali`, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    })

    if (!response.ok) {
      throw new Error("Failed to fetch verse of the day")
    }

    const data = await response.json()

    if (data.code !== 200) {
      throw new Error("Invalid response from Quran API")
    }

    const arabicSurah = data.data[0]
    const bengaliSurah = data.data[1]

    // Get a random verse from the surah
    const randomVerseIndex = Math.floor(Math.random() * arabicSurah.ayahs.length)
    const arabicVerse = arabicSurah.ayahs[randomVerseIndex]
    const bengaliVerse = bengaliSurah.ayahs[randomVerseIndex]

    const verseOfDay = {
      surahNumber: arabicSurah.number,
      surahName: arabicSurah.englishName,
      verseNumber: arabicVerse.numberInSurah,
      arabic: arabicVerse.text,
      bengali: bengaliVerse.text,
      reference: `সূরা ${arabicSurah.englishName}, আয়াত ${arabicVerse.numberInSurah}`,
    }

    return NextResponse.json({
      success: true,
      data: verseOfDay,
    })
  } catch (error) {
    console.error("Verse of day API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch verse of the day",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
