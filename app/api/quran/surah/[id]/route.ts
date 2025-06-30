export function generateStaticParams() {
  return Array.from({ length: 114 }, (_, i) => ({ id: String(i + 1) }))
}
import { type NextRequest, NextResponse } from "next/server"

// Static export এর জন্য
export const dynamic = "force-static"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const surahId = id

    // Fetch Arabic text
    const arabicResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surahId}`, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    })

    // Fetch Bengali translation
    const bengaliResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surahId}/bn.bengali`, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    })

    if (!arabicResponse.ok || !bengaliResponse.ok) {
      throw new Error("Failed to fetch surah data")
    }

    const arabicData = await arabicResponse.json()
    const bengaliData = await bengaliResponse.json()

    if (arabicData.code !== 200 || bengaliData.code !== 200) {
      throw new Error("Invalid response from Quran API")
    }

    const surahInfo = arabicData.data
    const verses = surahInfo.ayahs.map((ayah: any, index: number) => ({
      number: ayah.number,
      numberInSurah: ayah.numberInSurah,
      arabic: ayah.text,
      bengali: bengaliData.data.ayahs[index]?.text || "",
      juz: ayah.juz,
      manzil: ayah.manzil,
      page: ayah.page,
      ruku: ayah.ruku,
      hizbQuarter: ayah.hizbQuarter,
      sajda: ayah.sajda,
    }))

    const response = {
      success: true,
      data: {
        number: surahInfo.number,
        name: surahInfo.name,
        englishName: surahInfo.englishName,
        englishNameTranslation: surahInfo.englishNameTranslation,
        numberOfAyahs: surahInfo.numberOfAyahs,
        revelationType: surahInfo.revelationType,
        verses,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Surah API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch surah data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
