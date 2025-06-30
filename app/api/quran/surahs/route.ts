import { NextResponse } from "next/server"

// Static export এর জন্য
export const dynamic = "force-static"

export async function GET() {
  try {
    // Al-Quran Cloud API for Quran data
    const response = await fetch("https://api.alquran.cloud/v1/surah", {
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 86400 }, // Cache for 24 hours
    })

    if (!response.ok) {
      throw new Error("Failed to fetch Quran surahs")
    }

    const data = await response.json()

    if (data.code !== 200) {
      throw new Error("Invalid response from Quran API")
    }

    // Complete Bengali names for all 114 surahs
    const bengaliNames: { [key: number]: { name: string; meaning: string } } = {
      1: { name: "আল-ফাতিহা", meaning: "সূচনা" },
      2: { name: "আল-বাকারা", meaning: "গাভী" },
      3: { name: "আল-ইমরান", meaning: "ইমরানের পরিবার" },
      4: { name: "আন-নিসা", meaning: "নারী" },
      5: { name: "আল-মায়িদা", meaning: "খাদ্য পরিবেশিত টেবিল" },
      6: { name: "আল-আনআম", meaning: "গবাদি পশু" },
      7: { name: "আল-আরাফ", meaning: "উচ্চভূমি" },
      8: { name: "আল-আনফাল", meaning: "যুদ্ধলব্ধ সম্পদ" },
      9: { name: "আত-তাওবা", meaning: "অনুশোচনা" },
      10: { name: "ইউনুস", meaning: "ইউনুস" },
      11: { name: "হুদ", meaning: "হুদ" },
      12: { name: "ইউসুফ", meaning: "ইউসুফ" },
      13: { name: "আর-রাদ", meaning: "বজ্রধ্বনি" },
      14: { name: "ইবরাহিম", meaning: "ইবরাহিম" },
      15: { name: "আল-হিজর", meaning: "পাথুরে এলাকা" },
      16: { name: "আন-নাহল", meaning: "মৌমাছি" },
      17: { name: "আল-ইসরা", meaning: "রাত্রি ভ্রমণ" },
      18: { name: "আল-কাহফ", meaning: "গুহা" },
      19: { name: "মারইয়াম", meaning: "মারইয়াম" },
      20: { name: "ত্বা-হা", meaning: "ত্বা-হা" },
      21: { name: "আল-আম্বিয়া", meaning: "নবীগণ" },
      22: { name: "আল-হাজ্জ", meaning: "হজ" },
      23: { name: "আল-মুমিনুন", meaning: "মুমিনগণ" },
      24: { name: "আন-নূর", meaning: "আলো" },
      25: { name: "আল-ফুরকান", meaning: "সত্য-মিথ্যার পার্থক্যকারী" },
      26: { name: "আশ-শুআরা", meaning: "কবিগণ" },
      27: { name: "আন-নামল", meaning: "পিপীলিকা" },
      28: { name: "আল-কাসাস", meaning: "কাহিনী" },
      29: { name: "আল-আনকাবুত", meaning: "মাকড়সা" },
      30: { name: "আর-রূম", meaning: "রোমানরা" },
      31: { name: "লুকমান", meaning: "লুকমান" },
      32: { name: "আস-সাজদা", meaning: "সিজদা" },
      33: { name: "আল-আহযাব", meaning: "সম্মিলিত বাহিনী" },
      34: { name: "সাবা", meaning: "সাবা" },
      35: { name: "ফাতির", meaning: "স্রষ্টা" },
      36: { name: "ইয়াসিন", meaning: "ইয়াসিন" },
      37: { name: "আস-সাফফাত", meaning: "সারিবদ্ধ" },
      38: { name: "সোয়াদ", meaning: "সোয়াদ" },
      39: { name: "আয-যুমার", meaning: "দলসমূহ" },
      40: { name: "গাফির", meaning: "ক্ষমাশীল" },
      41: { name: "ফুসসিলাত", meaning: "বিস্তারিত" },
      42: { name: "আশ-শূরা", meaning: "পরামর্শ" },
      43: { name: "আয-যুখরুফ", meaning: "স্বর্ণালংকার" },
      44: { name: "আদ-দুখান", meaning: "ধোঁয়া" },
      45: { name: "আল-জাসিয়া", meaning: "নতজানু" },
      46: { name: "আল-আহকাফ", meaning: "বালুকাময় ভূমি" },
      47: { name: "মুহাম্মাদ", meaning: "মুহাম্মাদ" },
      48: { name: "আল-ফাতহ", meaning: "বিজয়" },
      49: { name: "আল-হুজুরাত", meaning: "কক্ষসমূহ" },
      50: { name: "কাফ", meaning: "কাফ" },
      51: { name: "আয-যারিয়াত", meaning: "বায়ুপ্রবাহ" },
      52: { name: "আত-তূর", meaning: "তূর পর্বত" },
      53: { name: "আন-নাজম", meaning: "নক্ষত্র" },
      54: { name: "আল-কামার", meaning: "চাঁদ" },
      55: { name: "আর-রহমান", meaning: "পরম করুণাময়" },
      56: { name: "আল-ওয়াকিয়া", meaning: "ঘটনা" },
      57: { name: "আল-হাদিদ", meaning: "লোহা" },
      58: { name: "আল-মুজাদালা", meaning: "বিতর্ককারিণী" },
      59: { name: "আল-হাশর", meaning: "সমাবেশ" },
      60: { name: "আল-মুমতাহিনা", meaning: "পরীক্ষিতা" },
      61: { name: "আস-সাফ", meaning: "সারি" },
      62: { name: "আল-জুমুআ", meaning: "জুমুআ" },
      63: { name: "আল-মুনাফিকুন", meaning: "মুনাফিকগণ" },
      64: { name: "আত-তাগাবুন", meaning: "পারস্পরিক ক্ষতি" },
      65: { name: "আত-তালাক", meaning: "তালাক" },
      66: { name: "আত-তাহরিম", meaning: "নিষেধাজ্ঞা" },
      67: { name: "আল-মুলক", meaning: "রাজত্ব" },
      68: { name: "আল-কালাম", meaning: "কলম" },
      69: { name: "আল-হাক্কা", meaning: "নিশ্চিত সত্য" },
      70: { name: "আল-মাআরিজ", meaning: "ঊর্ধ্বগামী পথ" },
      71: { name: "নূহ", meaning: "নূহ" },
      72: { name: "আল-জিন", meaning: "জিন" },
      73: { name: "আল-মুযযাম্মিল", meaning: "বস্ত্রাবৃত" },
      74: { name: "আল-মুদ্দাস্সির", meaning: "চাদরাবৃত" },
      75: { name: "আল-কিয়ামা", meaning: "কিয়ামত" },
      76: { name: "আল-ইনসান", meaning: "মানুষ" },
      77: { name: "আল-মুরসালাত", meaning: "প্রেরিতগণ" },
      78: { name: "আন-নাবা", meaning: "মহাসংবাদ" },
      79: { name: "আন-নাযিআত", meaning: "নিষ্কাশনকারী" },
      80: { name: "আবাসা", meaning: "ভ্রুকুঞ্চন" },
      81: { name: "আত-তাকভির", meaning: "অন্ধকারাচ্ছন্ন" },
      82: { name: "আল-ইনফিতার", meaning: "বিদীর্ণ" },
      83: { name: "আল-মুতাফফিফিন", meaning: "প্রতারকগণ" },
      84: { name: "আল-ইনশিকাক", meaning: "খণ্ডবিখণ্ড" },
      85: { name: "আল-বুরুজ", meaning: "নক্ষত্রপুঞ্জ" },
      86: { name: "আত-তারিক", meaning: "রাত্রিগামী" },
      87: { name: "আল-আলা", meaning: "সর্বোচ্চ" },
      88: { name: "আল-গাশিয়া", meaning: "আচ্ছাদনকারী" },
      89: { name: "আল-ফাজর", meaning: "ভোর" },
      90: { name: "আল-বালাদ", meaning: "নগর" },
      91: { name: "আশ-শামস", meaning: "সূর্য" },
      92: { name: "আল-লাইল", meaning: "রাত্রি" },
      93: { name: "আদ-দুহা", meaning: "পূর্বাহ্ন" },
      94: { name: "আল-ইনশিরাহ", meaning: "উন্মোচন" },
      95: { name: "আত-তিন", meaning: "ডুমুর" },
      96: { name: "আল-আলাক", meaning: "জমাট রক্ত" },
      97: { name: "আল-কদর", meaning: "মহিমান্বিত রাত্রি" },
      98: { name: "আল-বাইয়িনা", meaning: "সুস্পষ্ট প্রমাণ" },
      99: { name: "আয-যিলযাল", meaning: "ভূমিকম্প" },
      100: { name: "আল-আদিয়াত", meaning: "দ্রুতগামী" },
      101: { name: "আল-কারিয়া", meaning: "মহাপ্রলয়" },
      102: { name: "আত-তাকাসুর", meaning: "প্রাচুর্যের প্রতিযোগিতা" },
      103: { name: "আল-আসর", meaning: "যুগ" },
      104: { name: "আল-হুমাযা", meaning: "পরনিন্দাকারী" },
      105: { name: "আল-ফিল", meaning: "হাতি" },
      106: { name: "কুরাইশ", meaning: "কুরাইশ" },
      107: { name: "আল-মাউন", meaning: "সাহায্য" },
      108: { name: "আল-কাউসার", meaning: "প্রাচুর্য" },
      109: { name: "আল-কাফিরুন", meaning: "অবিশ্বাসীগণ" },
      110: { name: "আন-নাসর", meaning: "সাহায্য" },
      111: { name: "আল-মাসাদ", meaning: "পাম ফাইবার" },
      112: { name: "আল-ইখলাস", meaning: "একত্ব" },
      113: { name: "আল-ফালাক", meaning: "ভোর" },
      114: { name: "আন-নাস", meaning: "মানুষ" },
    }

    const surahs = data.data.map((surah: any) => ({
      id: surah.number,
      name: bengaliNames[surah.number]?.name || surah.englishName,
      arabicName: surah.name,
      englishName: surah.englishName,
      verses: surah.numberOfAyahs,
      revelation: surah.revelationType === "Meccan" ? "মক্কি" : "মাদানি",
      meaning: bengaliNames[surah.number]?.meaning || surah.englishNameTranslation,
      audioUrl: `https://server8.mp3quran.net/afs/${surah.number.toString().padStart(3, "0")}.mp3`, // Audio URL
    }))

    return NextResponse.json({
      success: true,
      data: surahs,
      total: surahs.length,
    })
  } catch (error) {
    console.error("Quran surahs API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch Quran surahs",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
