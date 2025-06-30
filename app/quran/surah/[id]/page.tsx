import { Button } from "@/components/ui/button"
import Link from "next/link"
import SurahClientPage from "./surah-client-page"

export async function generateStaticParams() {
  // 114টি সুরার জন্য স্ট্যাটিক পেজ তৈরি হবে
  const surahs = Array.from({ length: 114 }, (_, i) => i + 1)
  return surahs.map((id) => ({
    id: String(id),
  }))
}

interface SurahPageProps {
  params: { id: string }
}

export default async function SurahPage({ params }: SurahPageProps) {
  const { id } = params

  let surahData = null
  let error = null

  try {
    const arabicRes = await fetch(`https://api.alquran.cloud/v1/surah/${id}`)
    const bengaliRes = await fetch(`https://api.alquran.cloud/v1/surah/${id}/bn.bengali`)

    if (!arabicRes.ok || !bengaliRes.ok) {
      throw new Error("Failed to fetch surah data")
    }

    const arabicData = await arabicRes.json()
    const bengaliData = await bengaliRes.json()

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

    surahData = {
      number: surahInfo.number,
      name: surahInfo.name,
      englishName: surahInfo.englishName,
      englishNameTranslation: surahInfo.englishNameTranslation,
      numberOfAyahs: surahInfo.numberOfAyahs,
      revelationType: surahInfo.revelationType,
      verses,
    }
  } catch (err: any) {
    error = err.message || "Failed to fetch surah"
  }

  if (!surahData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Failed to fetch surah"}</p>
          <Link href="/quran">
            <Button>কোরআনে ফিরে যান</Button>
          </Link>
        </div>
      </div>
    )
  }

  return <SurahClientPage initialData={surahData} />
}
