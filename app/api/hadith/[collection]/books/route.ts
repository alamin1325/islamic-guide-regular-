import { NextResponse } from "next/server"

// Static export এর জন্য
export const dynamic = "force-static"

export async function GET(
  request: Request,
  { params }: { params: { collection: string } }
) {
  try {
    const { collection } = params

    // Map collection IDs to their Bengali names and book data
    const collectionData: { [key: string]: any } = {
      bukhari: {
        name: "সহীহ বুখারি",
        arabicName: "صحيح البخاري",
        books: [
          { id: 1, name: "কিতাবুল ওয়াহী", arabicName: "كتاب الوحي", bengaliName: "ওহীর কিতাব" },
          { id: 2, name: "কিতাবুল ঈমান", arabicName: "كتاب الإيمان", bengaliName: "ঈমানের কিতাব" },
          { id: 3, name: "কিতাবুল ইলম", arabicName: "كتاب العلم", bengaliName: "জ্ঞানের কিতাব" },
          { id: 4, name: "কিতাবুল ওযু", arabicName: "كتاب الوضوء", bengaliName: "ওযুর কিতাব" },
          { id: 5, name: "কিতাবুল গোসল", arabicName: "كتاب الغسل", bengaliName: "গোসলের কিতাব" },
          { id: 6, name: "কিতাবুল হায়েয", arabicName: "كتاب الحيض", bengaliName: "হায়েযের কিতাব" },
          { id: 7, name: "কিতাবুত তাইয়াম্মুম", arabicName: "كتاب التيمم", bengaliName: "তাইয়াম্মুমের কিতাব" },
          { id: 8, name: "কিতাবুস সালাত", arabicName: "كتاب الصلاة", bengaliName: "নামাজের কিতাব" },
          { id: 9, name: "কিতাবুল মাওয়াকীত", arabicName: "كتاب المواقيت", bengaliName: "নামাজের সময়ের কিতাব" },
          { id: 10, name: "কিতাবুল আযান", arabicName: "كتاب الأذان", bengaliName: "আযানের কিতাব" },
          { id: 11, name: "কিতাবুল জুমুআ", arabicName: "كتاب الجمعة", bengaliName: "জুমুআর কিতাব" },
          { id: 12, name: "কিতাবুল জানাযা", arabicName: "كتاب الجنائز", bengaliName: "জানাযার কিতাব" },
          { id: 13, name: "কিতাবুল যাকাত", arabicName: "كتاب الزكاة", bengaliName: "যাকাতের কিতাব" },
          { id: 14, name: "কিতাবুল হজ্জ", arabicName: "كتاب الحج", bengaliName: "হজ্জের কিতাব" },
          { id: 15, name: "কিতাবুল উমরাহ", arabicName: "كتاب العمرة", bengaliName: "উমরাহর কিতাব" },
          { id: 16, name: "কিতাবুল মুহসার", arabicName: "كتاب المحصر", bengaliName: "মুহসারের কিতাব" },
          { id: 17, name: "কিতাবুল কাসামাহ", arabicName: "كتاب القسامة", bengaliName: "কাসামার কিতাব" },
          { id: 18, name: "কিতাবুল জিহাদ", arabicName: "كتاب الجهاد", bengaliName: "জিহাদের কিতাব" },
          { id: 19, name: "কিতাবুল ফিতান", arabicName: "كتاب الفتن", bengaliName: "ফিতনার কিতাব" },
          { id: 20, name: "কিতাবুল মানাকিব", arabicName: "كتاب المناقب", bengaliName: "মানাকিবের কিতাব" },
          { id: 21, name: "কিতাবুল আদাব", arabicName: "كتاب الأدب", bengaliName: "আদবের কিতাব" },
          { id: 22, name: "কিতাবুল কুরআন", arabicName: "كتاب القرآن", bengaliName: "কুরআনের কিতাব" },
          { id: 23, "name": "কিতাবুল নিকাহ", arabicName: "كتاب النكاح", bengaliName: "বিবাহের কিতাব" },
          { id: 24, name: "কিতাবুত তালাক", arabicName: "كتاب الطلاق", bengaliName: "তালাকের কিতাব" },
          { id: 25, name: "কিতাবুল খারাজ", arabicName: "كتاب الخراج", bengaliName: "খারাজের কিতাব" },
          { id: 26, name: "কিতাবুল ওয়াসায়া", arabicName: "كتاب الوصايا", bengaliName: "ওয়াসিয়তের কিতাব" },
          { id: 27, name: "কিতাবুল নাযর", arabicName: "كتاب النذر", bengaliName: "মানতের কিতাব" },
          { id: 28, name: "কিতাবুল আইমান", arabicName: "كتاب الأيمان", bengaliName: "শপথের কিতাব" },
          { id: 29, name: "কিতাবুল কাসামাহ", arabicName: "كتاب القسامة", bengaliName: "কাসামার কিতাব" },
          { id: 30, name: "কিতাবুল দিয়াত", arabicName: "كتاب الديات", bengaliName: "দিয়াতের কিতাব" },
        ]
      },
      muslim: {
        name: "সহীহ মুসলিম",
        arabicName: "صحيح مسلم",
        books: [
          { id: 1, name: "কিতাবুল ঈমান", arabicName: "كتاب الإيمان", bengaliName: "ঈমানের কিতাব" },
          { id: 2, name: "কিতাবুত তাহারাহ", arabicName: "كتاب الطهارة", bengaliName: "পবিত্রতার কিতাব" },
          { id: 3, name: "কিতাবুল হায়েয", arabicName: "كتاب الحيض", bengaliName: "হায়েযের কিতাব" },
          { id: 4, name: "কিতাবুস সালাত", arabicName: "كتاب الصلاة", bengaliName: "নামাজের কিতাব" },
          { id: 5, name: "কিতাবুল মাসাজিদ", arabicName: "كتاب المساجد", bengaliName: "মসজিদের কিতাব" },
          { id: 6, name: "কিতাবুস সাওম", arabicName: "كتاب الصوم", bengaliName: "রোজার কিতাব" },
          { id: 7, name: "কিতাবুস সাদাকাত", arabicName: "كتاب الصدقات", bengaliName: "সদকার কিতাব" },
          { id: 8, name: "কিতাবুল হজ্জ", arabicName: "كتاب الحج", bengaliName: "হজ্জের কিতাব" },
          { id: 9, name: "কিতাবুন নিকাহ", arabicName: "كتاب النكاح", bengaliName: "বিবাহের কিতাব" },
          { id: 10, name: "কিতাবুর রাদা", arabicName: "كتاب الرضاع", bengaliName: "স্তন্যপানের কিতাব" },
          { id: 11, name: "কিতাবুত তালাক", arabicName: "كتاب الطلاق", bengaliName: "তালাকের কিতাব" },
          { id: 12, name: "কিতাবুল লিয়ান", arabicName: "كتاب اللعان", bengaliName: "লিয়ানের কিতাব" },
          { id: 13, name: "কিতাবুল আদাব", arabicName: "كتاب الأدب", bengaliName: "আদবের কিতাব" },
          { id: 14, name: "কিতাবুল সালাম", arabicName: "كتاب السلام", bengaliName: "সালামের কিতাব" },
          { id: 15, name: "কিতাবুল আম্বিয়া", arabicName: "كتاب الأنبياء", bengaliName: "নবীগণের কিতাব" },
        ]
      },
      tirmidhi: {
        name: "সহীহ তিরমিজি",
        arabicName: "سنن الترمذي",
        books: [
          { id: 1, name: "কিতাবুত তাহারাহ", arabicName: "كتاب الطهارة", bengaliName: "পবিত্রতার কিতাব" },
          { id: 2, name: "কিতাবুস সালাত", arabicName: "كتاب الصلاة", bengaliName: "নামাজের কিতাব" },
          { id: 3, name: "কিতাবুস সাওম", arabicName: "كتاب الصوم", bengaliName: "রোজার কিতাব" },
          { id: 4, name: "কিতাবুস সাদাকাত", arabicName: "كتاب الصدقات", bengaliName: "সদকার কিতাব" },
          { id: 5, name: "কিতাবুল হজ্জ", arabicName: "كتاب الحج", bengaliName: "হজ্জের কিতাব" },
          { id: 6, name: "কিতাবুল জানায়েয", arabicName: "كتاب الجنائز", bengaliName: "জানাযার কিতাব" },
          { id: 7, name: "কিতাবুল মানাকিব", arabicName: "كتاب المناقب", bengaliName: "মানাকিবের কিতাব" },
          { id: 8, name: "কিতাবুল ফিতান", arabicName: "كتاب الفتن", bengaliName: "ফিতনার কিতাব" },
          { id: 9, name: "কিতাবুল কিয়ামাহ", arabicName: "كتاب القيامة", bengaliName: "কিয়ামতের কিতাব" },
          { id: 10, name: "কিতাবুল আদাব", arabicName: "كتاب الأدب", bengaliName: "আদবের কিতাব" },
          { id: 11, name: "কিতাবুল ইলম", arabicName: "كتاب العلم", bengaliName: "জ্ঞানের কিতাব" },
          { id: 12, name: "কিতাবুস শাহাদাত", arabicName: "كتاب الشهادات", bengaliName: "সাক্ষ্যের কিতাব" },
          { id: 13, name: "কিতাবুল জিহাদ", arabicName: "كتاب الجهاد", bengaliName: "জিহাদের কিতাব" },
          { id: 14, name: "কিতাবুল সিয়ার", arabicName: "كتاب السير", bengaliName: "সিরাতের কিতাব" },
          { id: 15, name: "কিতাবুল কুরআন", arabicName: "كتاب القرآن", bengaliName: "কুরআনের কিতাব" },
        ]
      },
      abudawud: {
        name: "সহীহ আবূ দাউদ",
        arabicName: "سنن أبي داود",
        books: [
          { id: 1, name: "কিতাবুত তাহারাহ", arabicName: "كتاب الطهارة", bengaliName: "পবিত্রতার কিতাব" },
          { id: 2, name: "কিতাবুস সালাত", arabicName: "كتاب الصلاة", bengaliName: "নামাজের কিতাব" },
          { id: 3, name: "কিতাবুস সাওম", arabicName: "كتاب الصوم", bengaliName: "রোজার কিতাব" },
          { id: 4, name: "কিতাবুল মানাসিক", arabicName: "كتاب المناسك", bengaliName: "মানাসিকের কিতাব" },
          { id: 5, name: "কিতাবুন নিকাহ", arabicName: "كتاب النكاح", bengaliName: "বিবাহের কিতাব" },
          { id: 6, name: "কিতাবুত তালাক", arabicName: "كتاب الطلاق", bengaliName: "তালাকের কিতাব" },
          { id: 7, name: "কিতাবুল খারাজ", arabicName: "كتاب الخراج", bengaliName: "খারাজের কিতাব" },
          { id: 8, name: "কিতাবুল আদাব", arabicName: "كتاب الأدب", bengaliName: "আদবের কিতাব" },
          { id: 9, name: "কিতাবুল ইলম", arabicName: "كتاب العلم", bengaliName: "জ্ঞানের কিতাব" },
          { id: 10, name: "কিতাবুল ফিতান", arabicName: "كتاب الفتن", bengaliName: "ফিতনার কিতাব" },
          { id: 11, name: "কিতাবুল মালাহিম", arabicName: "كتاب الملاحم", bengaliName: "মালাহিমের কিতাব" },
          { id: 12, name: "কিতাবুল মাহদি", arabicName: "كتاب المهدي", bengaliName: "মাহদির কিতাব" },
          { id: 13, name: "কিতাবুল কুরআন", arabicName: "كتاب القرآن", bengaliName: "কুরআনের কিতাব" },
          { id: 14, name: "কিতাবুল হুদুদ", arabicName: "كتاب الحدود", bengaliName: "হুদুদের কিতাব" },
          { id: 15, name: "কিতাবুল দিয়াত", arabicName: "كتاب الديات", bengaliName: "দিয়াতের কিতাব" },
        ]
      },
      nasai: {
        name: "সহীহ নাসাঈ",
        arabicName: "سنن النسائي",
        books: [
          { id: 1, name: "কিতাবুত তাহারাহ", arabicName: "كتاب الطهارة", bengaliName: "পবিত্রতার কিতাব" },
          { id: 2, name: "কিতাবুস সালাত", arabicName: "كتاب الصلاة", bengaliName: "নামাজের কিতাব" },
          { id: 3, name: "কিতাবুল মাওয়াকীত", arabicName: "كتاب المواقيت", bengaliName: "নামাজের সময়ের কিতাব" },
          { id: 4, name: "কিতাবুল আযান", arabicName: "كتاب الأذان", bengaliName: "আযানের কিতাব" },
          { id: 5, name: "কিতাবুল মাসাজিদ", arabicName: "كتاب المساجد", bengaliName: "মসজিদের কিতাব" },
          { id: 6, name: "কিতাবুস সাওম", arabicName: "كتاب الصوم", bengaliName: "রোজার কিতাব" },
          { id: 7, name: "কিতাবুস সাদাকাত", arabicName: "كتاب الصدقات", bengaliName: "সদকার কিতাব" },
          { id: 8, name: "কিতাবুল মানাসিক", arabicName: "كتاب المناسك", bengaliName: "মানাসিকের কিতাব" },
          { id: 9, name: "কিতাবুল জানায়েয", arabicName: "كتاب الجنائز", bengaliName: "জানাযার কিতাব" },
          { id: 10, name: "কিতাবুল আদাব", arabicName: "كتاب الأدب", bengaliName: "আদবের কিতাব" },
          { id: 11, name: "কিতাবুল ইলম", arabicName: "كتاب العلم", bengaliName: "জ্ঞানের কিতাব" },
          { id: 12, name: "কিতাবুল জিহাদ", arabicName: "كتاب الجهاد", bengaliName: "জিহাদের কিতাব" },
          { id: 13, name: "কিতাবুল কুরআন", arabicName: "كتاب القرآن", bengaliName: "কুরআনের কিতাব" },
          { id: 14, name: "কিতাবুল নিকাহ", arabicName: "كتاب النكاح", bengaliName: "বিবাহের কিতাব" },
          { id: 15, name: "কিতাবুত তালাক", arabicName: "كتاب الطلاق", bengaliName: "তালাকের কিতাব" },
        ]
      },
      ibnmajah: {
        name: "সহীহ ইবনে মাজাহ",
        arabicName: "سنن ابن ماجه",
        books: [
          { id: 1, name: "কিতাবুত তাহারাহ", arabicName: "كتاب الطهارة", bengaliName: "পবিত্রতার কিতাব" },
          { id: 2, name: "কিতাবুস সালাত", arabicName: "كتاب الصلاة", bengaliName: "নামাজের কিতাব" },
          { id: 3, name: "কিতাবুস সাওম", arabicName: "كتاب الصوم", bengaliName: "রোজার কিতাব" },
          { id: 4, name: "কিতাবুস সাদাকাত", arabicName: "كتاب الصدقات", bengaliName: "সদকার কিতাব" },
          { id: 5, name: "কিতাবুল মানাসিক", arabicName: "كتاب المناسك", bengaliName: "মানাসিকের কিতাব" },
          { id: 6, name: "কিতাবুন নিকাহ", arabicName: "كتاب النكاح", bengaliName: "বিবাহের কিতাব" },
          { id: 7, name: "কিতাবুত তালাক", arabicName: "كتاب الطلاق", bengaliName: "তালাকের কিতাব" },
          { id: 8, name: "কিতাবুল আদাব", arabicName: "كتاب الأدب", bengaliName: "আদবের কিতাব" },
          { id: 9, name: "কিতাবুল ইলম", arabicName: "كتاب العلم", bengaliName: "জ্ঞানের কিতাব" },
          { id: 10, name: "কিতাবুল ফিতান", arabicName: "كتاب الفتن", bengaliName: "ফিতনার কিতাব" },
          { id: 11, name: "কিতাবুল জিহাদ", arabicName: "كتاب الجهاد", bengaliName: "জিহাদের কিতাব" },
          { id: 12, name: "কিতাবুল কুরআন", arabicName: "كتاب القرآن", bengaliName: "কুরআনের কিতাব" },
          { id: 13, name: "কিতাবুল হুদুদ", arabicName: "كتاب الحدود", bengaliName: "হুদুদের কিতাব" },
          { id: 14, name: "কিতাবুল দিয়াত", arabicName: "كتاب الديات", bengaliName: "দিয়াতের কিতাব" },
          { id: 15, name: "কিতাবুল মানাকিব", arabicName: "كتاب المناقب", bengaliName: "মানাকিবের কিতাব" },
        ]
      }
    }

    const collectionInfo = collectionData[collection]

    if (!collectionInfo) {
      return NextResponse.json(
        {
          success: false,
          error: "Collection not found",
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        collection: {
          name: collectionInfo.name,
          arabicName: collectionInfo.arabicName,
        },
        books: collectionInfo.books,
        total: collectionInfo.books.length,
      },
    })
  } catch (error) {
    console.error("Hadith books API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch hadith books",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
} 