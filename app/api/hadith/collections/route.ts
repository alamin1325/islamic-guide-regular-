import { NextResponse } from "next/server"

// Static export এর জন্য
export const dynamic = "force-static"

export async function GET() {
  try {
    // Hadith collections data with Bengali translations
    const hadithCollections = [
      {
        id: "bukhari",
        name: "সহীহ বুখারি",
        arabicName: "صحيح البخاري",
        englishName: "Sahih al-Bukhari",
        count: 7563,
        color: "bg-green-600",
        gradient: "from-green-500 to-green-700",
        author: "ইমাম বুখারি (রহ.)",
        authorArabic: "الإمام البخاري",
        authorEnglish: "Imam Bukhari",
        period: "৮১০-৮৭০ খ্রিস্টাব্দ",
        location: "বুখারা, উজবেকিস্তান",
        description: "সবচেয়ে নির্ভরযোগ্য হাদিস সংকলন। ইমাম বুখারি ১৬ বছর ধরে ৬ লক্ষ হাদিস থেকে বাছাই করে এই সংকলন তৈরি করেন।",
        features: ["সবচেয়ে নির্ভরযোগ্য", "সর্বাধিক গ্রহণযোগ্য", "৯৭টি অধ্যায়", "সুন্দর বিন্যাস"],
        rating: 5.0,
        readers: "১০০+ মিলিয়ন",
        language: "আরবি",
        translation: "বাংলা, ইংরেজি, উর্দু",
        apiUrl: "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ben-bukhari.json"
      },
      {
        id: "muslim",
        name: "সহীহ মুসলিম",
        arabicName: "صحيح مسلم",
        englishName: "Sahih Muslim",
        count: 7190,
        color: "bg-blue-600",
        gradient: "from-blue-500 to-blue-700",
        author: "ইমাম মুসলিম (রহ.)",
        authorArabic: "الإمام مسلم",
        authorEnglish: "Imam Muslim",
        period: "৮১৫-৮৭৫ খ্রিস্টাব্দ",
        location: "নিশাপুর, ইরান",
        description: "দ্বিতীয় সর্বোচ্চ নির্ভরযোগ্য হাদিস সংকলন। ইমাম মুসলিম ৩ লক্ষ হাদিস থেকে বাছাই করে এই সংকলন তৈরি করেন।",
        features: ["দ্বিতীয় সর্বোচ্চ নির্ভরযোগ্য", "সুন্দর বিন্যাস", "৫৪টি অধ্যায়", "বিস্তারিত ব্যাখ্যা"],
        rating: 4.9,
        readers: "৮০+ মিলিয়ন",
        language: "আরবি",
        translation: "বাংলা, ইংরেজি, উর্দু",
        apiUrl: "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ben-muslim.json"
      },
      {
        id: "tirmidhi",
        name: "সহীহ তিরমিজি",
        arabicName: "سنن الترمذي",
        englishName: "Sunan at-Tirmidhi",
        count: 3956,
        color: "bg-purple-600",
        gradient: "from-purple-500 to-purple-700",
        author: "ইমাম তিরমিজি (রহ.)",
        authorArabic: "الإمام الترمذي",
        authorEnglish: "Imam Tirmidhi",
        period: "৮২৪-৮৯২ খ্রিস্টাব্দ",
        location: "তিরমিজ, উজবেকিস্তান",
        description: "হাদিসের মান নির্ধারণে বিশেষ অবদান। প্রতিটি হাদিসের মান ও গ্রহণযোগ্যতা সম্পর্কে বিস্তারিত আলোচনা।",
        features: ["হাদিস মান নির্ধারণ", "বিস্তারিত আলোচনা", "৪৬টি অধ্যায়", "বিশেষ বৈশিষ্ট্য"],
        rating: 4.8,
        readers: "৬০+ মিলিয়ন",
        language: "আরবি",
        translation: "বাংলা, ইংরেজি, উর্দু",
        apiUrl: "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ben-tirmidhi.json"
      },
      {
        id: "abudawud",
        name: "সহীহ আবূ দাউদ",
        arabicName: "سنن أبي داود",
        englishName: "Sunan Abu Dawud",
        count: 5274,
        color: "bg-orange-600",
        gradient: "from-orange-500 to-orange-700",
        author: "ইমাম আবূ দাউদ (রহ.)",
        authorArabic: "الإمام أبو داود",
        authorEnglish: "Imam Abu Dawud",
        period: "৮১৭-৮৮৯ খ্রিস্টাব্দ",
        location: "সিজিস্তান, আফগানিস্তান",
        description: "ফিকহি হাদিসের বিশেষ সংকলন। আইনগত হাদিসগুলিকে অগ্রাধিকার দিয়ে সংকলিত।",
        features: ["ফিকহি হাদিস", "আইনগত গুরুত্ব", "৩৫টি অধ্যায়", "বিশেষ উদ্দেশ্য"],
        rating: 4.7,
        readers: "৫০+ মিলিয়ন",
        language: "আরবি",
        translation: "বাংলা, ইংরেজি, উর্দু",
        apiUrl: "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ben-abudawud.json"
      },
      {
        id: "nasai",
        name: "সহীহ নাসাঈ",
        arabicName: "سنن النسائي",
        englishName: "Sunan an-Nasai",
        count: 5761,
        color: "bg-pink-600",
        gradient: "from-pink-500 to-pink-700",
        author: "ইমাম নাসাঈ (রহ.)",
        authorArabic: "الإمام النسائي",
        authorEnglish: "Imam Nasai",
        period: "৮২৯-৯১৫ খ্রিস্টাব্দ",
        location: "নাসা, খোরাসান",
        description: "সুন্নাহর বিস্তারিত সংকলন। প্রতিটি হাদিসের সনদ ও মতন সম্পর্কে বিস্তারিত আলোচনা।",
        features: ["সুন্নাহ সংকলন", "বিস্তারিত সনদ", "৫১টি অধ্যায়", "গভীর বিশ্লেষণ"],
        rating: 4.8,
        readers: "৪৫+ মিলিয়ন",
        language: "আরবি",
        translation: "বাংলা, ইংরেজি, উর্দু",
        apiUrl: "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ben-nasai.json"
      },
      {
        id: "ibnmajah",
        name: "সহীহ ইবনে মাজাহ",
        arabicName: "سنن ابن ماجه",
        englishName: "Sunan Ibn Majah",
        count: 4341,
        color: "bg-teal-600",
        gradient: "from-teal-500 to-teal-700",
        author: "ইমাম ইবনে মাজাহ (রহ.)",
        authorArabic: "الإمام ابن ماجه",
        authorEnglish: "Imam Ibn Majah",
        period: "৮২৪-৮৮৭ খ্রিস্টাব্দ",
        location: "কাজভিন, ইরান",
        description: "সুন্নাহর ব্যাপক সংকলন। বিভিন্ন বিষয়ের হাদিস সমন্বিত একটি গুরুত্বপূর্ণ সংকলন।",
        features: ["ব্যাপক সংকলন", "বিভিন্ন বিষয়", "৩৭টি অধ্যায়", "সম্পূর্ণতা"],
        rating: 4.6,
        readers: "৪০+ মিলিয়ন",
        language: "আরবি",
        translation: "বাংলা, ইংরেজি, উর্দু",
        apiUrl: "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ben-ibnmajah.json"
      },
    ]

    return NextResponse.json({
      success: true,
      data: hadithCollections,
      total: hadithCollections.length,
    })
  } catch (error) {
    console.error("Hadith collections API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch hadith collections",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
} 