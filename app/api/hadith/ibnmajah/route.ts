import { NextResponse } from 'next/server'

// Static export এর জন্য
export const dynamic = "force-static"

// Comprehensive Ibn Majah hadiths data
const ibnmajahHadiths = [
  {
    id: 1,
    bookNumber: "১",
    hadithNumber: "১",
    bookName: "কিতাবুল তাহারাত",
    chapterName: "পবিত্রতা",
    arabic: "الطُّهُورُ شَطْرُ الإِيمَانِ",
    bengali: "পবিত্রতা ঈমানের অর্ধেক।",
    narrator: "আবূ মালিক আশআরি (রা.)",
    grade: "সহীহ",
    explanation: "এই হাদিসে পবিত্রতার গুরুত্ব বর্ণনা করা হয়েছে।"
  },
  {
    id: 2,
    bookNumber: "১",
    hadithNumber: "২৫৫",
    bookName: "কিতাবুল সালাত",
    chapterName: "নামাজের আদব",
    arabic: "إِذَا قُمْتَ إِلَى الصَّلاَةِ فَأَسْبِغِ الْوُضُوءَ ثُمَّ اسْتَقْبِلِ الْقِبْلَةَ فَكَبِّرْ",
    bengali: "যখন তুমি নামাজের জন্য দাঁড়াবে তখন পূর্ণাঙ্গ অজু করবে, তারপর কিবলার দিকে মুখ করবে এবং তাকবীর বলবে।",
    narrator: "আবূ হুরায়রা (রা.)",
    grade: "সহীহ",
    explanation: "নামাজের আদব এবং এর গুরুত্ব বর্ণনা করা হয়েছে।"
  },
  {
    id: 3,
    bookNumber: "১",
    hadithNumber: "৪৫৬",
    bookName: "কিতাবুল যাকাত",
    chapterName: "যাকাতের বিধান",
    arabic: "فِي كُلِّ أَرْبَعِينَ شَاةً شَاةٌ",
    bengali: "প্রতি চল্লিশটি বকরি থেকে একটি বকরি যাকাত।",
    narrator: "আনাস (রা.)",
    grade: "সহীহ",
    explanation: "যাকাতের বিধান এবং এর গুরুত্ব বর্ণনা করা হয়েছে।"
  },
  {
    id: 4,
    bookNumber: "১",
    hadithNumber: "৭৮৯",
    bookName: "কিতাবুল সিয়াম",
    chapterName: "রোজার আদব",
    arabic: "إِذَا أَفْطَرَ أَحَدُكُمْ فَلْيُفْطِرْ عَلَى تَمْرٍ فَإِنَّهُ بَرَكَةٌ",
    bengali: "তোমাদের কেউ যখন ইফতার করবে তখন খেজুর দিয়ে ইফতার করবে, কেননা এতে বরকত আছে।",
    narrator: "আনাস (রা.)",
    grade: "সহীহ",
    explanation: "ইফতারের আদব এবং এর ফজিলত বর্ণনা করা হয়েছে।"
  },
  {
    id: 5,
    bookNumber: "১",
    hadithNumber: "১২৩৪",
    bookName: "কিতাবুল হজ",
    chapterName: "হজের আদব",
    arabic: "الْحَجُّ عَرَفَةُ",
    bengali: "হজ হল আরাফা।",
    narrator: "আব্দুর রহমান ইবনে ইয়ামার (রা.)",
    grade: "সহীহ",
    explanation: "হজের মূল বিষয় এবং এর গুরুত্ব বর্ণনা করা হয়েছে।"
  },
  {
    id: 6,
    bookNumber: "১",
    hadithNumber: "১৫৬৭",
    bookName: "কিতাবুল নিকাহ",
    chapterName: "বিবাহের আদব",
    arabic: "إِذَا خَطَبَ أَحَدُكُمُ الْمَرْأَةَ فَإِنِ اسْتَطَاعَ أَنْ يَنْظُرَ مِنْهَا إِلَى مَا يَدْعُوهُ إِلَى نِكَاحِهَا فَلْيَفْعَلْ",
    bengali: "তোমাদের কেউ যখন কোন মহিলাকে বিবাহের প্রস্তাব দেয়, তখন যদি সে তার থেকে এমন কিছু দেখতে পারে যা তাকে বিবাহ করতে উৎসাহিত করে, তাহলে সে যেন তা করে।",
    narrator: "জাবির (রা.)",
    grade: "সহীহ",
    explanation: "বিবাহের আগে দেখার বিধান বর্ণনা করা হয়েছে।"
  },
  {
    id: 7,
    bookNumber: "১",
    hadithNumber: "১৮৯০",
    bookName: "কিতাবুল তালাক",
    chapterName: "তালাকের বিধান",
    arabic: "أَبْغَضُ الْحَلاَلِ إِلَى اللَّهِ الطَّلاَقُ",
    bengali: "আল্লাহর কাছে সবচেয়ে অপছন্দনীয় হালাল কাজ হল তালাক।",
    narrator: "আব্দুল্লাহ ইবনে উমর (রা.)",
    grade: "সহীহ",
    explanation: "তালাকের অপছন্দনীয়তা বর্ণনা করা হয়েছে।"
  },
  {
    id: 8,
    bookNumber: "১",
    hadithNumber: "২২৩৪",
    bookName: "কিতাবুল বাইয়াহ",
    chapterName: "ব্যবসার আদব",
    arabic: "التَّاجِرُ الصَّدُوقُ الأَمِينُ مَعَ النَّبِيِّينَ وَالصِّدِّيقِينَ وَالشُّهَدَاءِ",
    bengali: "সত্যবাদী ও বিশ্বস্ত ব্যবসায়ী নবী, সিদ্দীক ও শহীদদের সাথে থাকবে।",
    narrator: "আবূ সাঈদ খুদরী (রা.)",
    grade: "সহীহ",
    explanation: "ব্যবসায় সততা ও বিশ্বস্ততার গুরুত্ব বর্ণনা করা হয়েছে।"
  },
  {
    id: 9,
    bookNumber: "১",
    hadithNumber: "২৫৬৭",
    bookName: "কিতাবুল আদব",
    chapterName: "ভালো আচরণ",
    arabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    bengali: "যে ব্যক্তি আল্লাহ ও পরকালে বিশ্বাস রাখে, সে যেন ভালো কথা বলে অথবা চুপ থাকে।",
    narrator: "আবূ হুরায়রা (রা.)",
    grade: "সহীহ",
    explanation: "মুমিনের জন্য আদব শিক্ষা দেওয়া হয়েছে।"
  },
  {
    id: 10,
    bookNumber: "১",
    hadithNumber: "২৮৯০",
    bookName: "কিতাবুল জিহাদ",
    chapterName: "জিহাদের ফজিলত",
    arabic: "مَنْ مَاتَ وَلَمْ يَغْزُ وَلَمْ يُحَدِّثْ نَفْسَهُ بِالْغَزْوِ مَاتَ عَلَى شُعْبَةٍ مِنْ نِفَاقٍ",
    bengali: "যে ব্যক্তি মারা গেল অথচ সে জিহাদ করেনি এবং জিহাদের কথা চিন্তাও করেনি, সে মুনাফিকের একটি শাখার উপর মারা গেল।",
    narrator: "আবূ হুরায়রা (রা.)",
    grade: "সহীহ",
    explanation: "জিহাদের গুরুত্ব এবং এর ফজিলত বর্ণনা করা হয়েছে।"
  },
  {
    id: 11,
    bookNumber: "১",
    hadithNumber: "৩২১০",
    bookName: "কিতাবুল ইলম",
    chapterName: "জ্ঞান অর্জনের ফজিলত",
    arabic: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ",
    bengali: "যে ব্যক্তি জ্ঞান অর্জনের পথে চলবে, আল্লাহ তার জন্য জান্নাতের পথ সহজ করে দিবেন।",
    narrator: "আনাস (রা.)",
    grade: "সহীহ",
    explanation: "জ্ঞান অর্জন ইসলামে অত্যন্ত গুরুত্বপূর্ণ। এই হাদিসে জ্ঞান অর্জনের ফজিলত বর্ণনা করা হয়েছে।"
  },
  {
    id: 12,
    bookNumber: "১",
    hadithNumber: "৩৫৬৭",
    bookName: "কিতাবুল তাফসীর",
    chapterName: "কুরআনের তাফসীর",
    arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    bengali: "তোমাদের মধ্যে সর্বোত্তম সেই ব্যক্তি যে কুরআন শিখে এবং অন্যকে শেখায়।",
    narrator: "উসমান (রা.)",
    grade: "সহীহ",
    explanation: "কুরআন শিক্ষা ও শিক্ষাদানের গুরুত্ব বর্ণনা করা হয়েছে।"
  },
  {
    id: 13,
    bookNumber: "১",
    hadithNumber: "৩৮৯০",
    bookName: "কিতাবুল রিকাক",
    chapterName: "দুনিয়ার মোহ",
    arabic: "مَنْ كَانَتِ الآخِرَةُ هَمَّهُ جَعَلَ اللَّهُ غِنَاهُ فِي قَلْبِهِ وَجَمَعَ لَهُ شَمْلَهُ وَأَتَتْهُ الدُّنْيَا وَهِيَ رَاغِمَةٌ",
    bengali: "যার চিন্তা পরকাল নিয়ে, আল্লাহ তার অন্তরে সম্পদ দান করেন, তার কাজ সুসংহত করেন এবং দুনিয়া তার কাছে অপমানিত হয়ে আসে।",
    narrator: "আনাস (রা.)",
    grade: "সহীহ",
    explanation: "পরকালের চিন্তার গুরুত্ব এবং এর ফজিলত বর্ণনা করা হয়েছে।"
  },
  {
    id: 14,
    bookNumber: "১",
    hadithNumber: "৪১২৩",
    bookName: "কিতাবুল শুরুত",
    chapterName: "চুক্তির শর্ত",
    arabic: "الْمُسْلِمُونَ عَلَى شُرُوطِهِمْ إِلاَّ شَرْطًا حَرَّمَ حَلاَلاً أَوْ أَحَلَّ حَرَامًا",
    bengali: "মুসলমানরা তাদের চুক্তির শর্ত অনুযায়ী বাধ্য, তবে এমন শর্ত যা হালালকে হারাম করে বা হারামকে হালাল করে।",
    narrator: "আবূ হুরায়রা (রা.)",
    grade: "সহীহ",
    explanation: "চুক্তি পালনের গুরুত্ব বর্ণনা করা হয়েছে।"
  },
  {
    id: 15,
    bookNumber: "১",
    hadithNumber: "৪৩৪৫",
    bookName: "কিতাবুল ওয়াসায়া",
    chapterName: "ওসিয়তের বিধান",
    arabic: "مَا حَقُّ امْرِئٍ مُسْلِمٍ لَهُ شَيْءٌ يُوصِي فِيهِ يَبِيتُ لَيْلَتَيْنِ إِلاَّ وَوَصِيَّتُهُ مَكْتُوبَةٌ عِنْدَهُ",
    bengali: "যে মুসলমানের কাছে ওসিয়ত করার মতো কিছু আছে, সে দু'রাত কাটানোর আগে তার ওসিয়ত লিখে রাখা উচিত।",
    narrator: "আব্দুল্লাহ ইবনে উমর (রা.)",
    grade: "সহীহ",
    explanation: "ওসিয়তের গুরুত্ব বর্ণনা করা হয়েছে।"
  },
  {
    id: 16,
    bookNumber: "১",
    hadithNumber: "৪৫৬৭",
    bookName: "কিতাবুল জিহাদ",
    chapterName: "জিহাদের প্রকার",
    arabic: "رِبَاطُ يَوْمٍ فِي سَبِيلِ اللَّهِ خَيْرٌ مِنَ الدُّنْيَا وَمَا فِيهَا",
    bengali: "আল্লাহর পথে এক দিনের সীমান্ত পাহারা দুনিয়া ও তার মধ্যে যা কিছু আছে তার চেয়ে উত্তম।",
    narrator: "সাহল ইবনে সাদ (রা.)",
    grade: "সহীহ",
    explanation: "জিহাদের ফজিলত বর্ণনা করা হয়েছে।"
  },
  {
    id: 17,
    bookNumber: "১",
    hadithNumber: "৪৭৮৯",
    bookName: "কিতাবুল তাওবাহ",
    chapterName: "তাওবার ফজিলত",
    arabic: "إِنَّ اللَّهَ يَفْرَحُ بِتَوْبَةِ عَبْدِهِ أَكْثَرَ مِمَّا يَفْرَحُ أَحَدُكُمْ بِرَاحِلَتِهِ",
    bengali: "নিশ্চয়ই আল্লাহ তাঁর বান্দার তাওবায় এত বেশি খুশি হন যতটা তোমাদের কেউ তার উট খুঁজে পেয়ে খুশি হয়।",
    narrator: "আনাস (রা.)",
    grade: "সহীহ",
    explanation: "তাওবার গুরুত্ব এবং এর ফজিলত বর্ণনা করা হয়েছে।"
  },
  {
    id: 18,
    bookNumber: "১",
    hadithNumber: "৪৯০১",
    bookName: "কিতাবুল যিকর",
    chapterName: "যিকরের ফজিলত",
    arabic: "أَلاَ أُنَبِّئُكُمْ بِخَيْرِ أَعْمَالِكُمْ وَأَزْكَاهَا عِنْدَ مَلِيكِكُمْ وَأَرْفَعِهَا فِي دَرَجَاتِكُمْ",
    bengali: "আমি কি তোমাদেরকে তোমাদের সর্বোত্তম ও সর্বাধিক পবিত্র আমল এবং তোমাদের মালিকের কাছে সর্বোচ্চ মর্যাদার কথা বলব না?",
    narrator: "আবূ দারদা (রা.)",
    grade: "সহীহ",
    explanation: "যিকরের গুরুত্ব এবং এর ফজিলত বর্ণনা করা হয়েছে।"
  },
  {
    id: 19,
    bookNumber: "১",
    hadithNumber: "৫০১২",
    bookName: "কিতাবুল সালাম",
    chapterName: "সালামের আদব",
    arabic: "لاَ تَدْخُلُوا الْجَنَّةَ حَتَّى تُؤْمِنُوا وَلاَ تُؤْمِنُوا حَتَّى تَحَابُّوا",
    bengali: "তোমরা জান্নাতে প্রবেশ করবে না যতক্ষণ না ঈমান আনবে, আর তোমরা ঈমান আনবে না যতক্ষণ না পরস্পর ভালোবাসবে।",
    narrator: "আবূ হুরায়রা (রা.)",
    grade: "সহীহ",
    explanation: "পরস্পর ভালোবাসার গুরুত্ব বর্ণনা করা হয়েছে।"
  },
  {
    id: 20,
    bookNumber: "১",
    hadithNumber: "৫১২৩",
    bookName: "কিতাবুল দুআ",
    chapterName: "দোয়ার ফজিলত",
    arabic: "إِنَّ اللَّهَ حَيِيٌّ كَرِيمٌ يَسْتَحْيِي إِذَا رَفَعَ الرَّجُلُ إِلَيْهِ يَدَيْهِ أَنْ يَرُدَّهُمَا صِفْرًا خَائِبَتَيْنِ",
    bengali: "নিশ্চয়ই আল্লাহ লজ্জাশীল ও মহানুভব। যখন কোন ব্যক্তি তাঁর দিকে হাত তুলে দোয়া করে, তখন তিনি লজ্জিত হন যে, সেই হাত দুটি খালি ও ব্যর্থ করে ফিরিয়ে দেন।",
    narrator: "সালমান (রা.)",
    grade: "সহীহ",
    explanation: "দোয়ার গুরুত্ব এবং এর ফজিলত বর্ণনা করা হয়েছে।"
  }
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const search = searchParams.get('search') || ''

  let filteredHadiths = ibnmajahHadiths

  // Search functionality
  if (search) {
    filteredHadiths = ibnmajahHadiths.filter(hadith =>
      hadith.arabic.toLowerCase().includes(search.toLowerCase()) ||
      hadith.bengali.toLowerCase().includes(search.toLowerCase()) ||
      hadith.narrator.toLowerCase().includes(search.toLowerCase()) ||
      hadith.chapterName.toLowerCase().includes(search.toLowerCase())
    )
  }

  // Pagination
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedHadiths = filteredHadiths.slice(startIndex, endIndex)

  return NextResponse.json({
    hadiths: paginatedHadiths,
    total: filteredHadiths.length,
    page,
    limit,
    totalPages: Math.ceil(filteredHadiths.length / limit)
  })
} 