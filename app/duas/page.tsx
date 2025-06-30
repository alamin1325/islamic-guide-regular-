"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ShareButton } from "@/components/share-button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Heart, Search, Volume2, Copy, Share2, BookOpen, X } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

interface PopularDua {
  id: string
  title: string
  arabic: string
  pronunciation: string
  bengali: string
  reference: string
  benefits: string
  category: string
}

interface SampleDua {
  id: number
  title: string
  category: string
  arabic: string
  pronunciation: string
  bengali: string
  reference: string
  benefits: string
}

export default function DuasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDua, setSelectedDua] = useState<PopularDua | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [showToast, setShowToast] = useState(false)
  const [currentUrl, setCurrentUrl] = useState("")

  const duaCategories = [
    { id: "daily", name: "দৈনন্দিন দোয়া", count: 25, color: "bg-blue-600" },
    { id: "prayer", name: "নামাজের দোয়া", count: 15, color: "bg-green-600" },
    { id: "eating", name: "খাওয়ার দোয়া", count: 8, color: "bg-orange-600" },
    { id: "travel", name: "সফরের দোয়া", count: 12, color: "bg-purple-600" },
    { id: "protection", name: "সুরক্ষার দোয়া", count: 18, color: "bg-red-600" },
    { id: "forgiveness", name: "ক্ষমার দোয়া", count: 10, color: "bg-pink-600" },
  ]

  const popularDuasData: PopularDua[] = [
    {
      id: "ayatul-kursi",
      title: "আয়াতুল কুরসি",
      arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
      pronunciation: "আল্লাহু লা ইলাহা ইল্লা হুয়াল হাইয়ুল কাইয়্যুম, লা তা'খুযুহু সিনাতুং ওয়ালা নাউম, লাহু মা ফিস সামাওয়াতি ওয়ামা ফিল আরদ, মান যাল্লাজি ইয়াশফাউ ইন্দাহু ইল্লা বিইজনিহ, ইয়া'লামু মা বাইনা আইদিহিম ওয়ামা খালফাহুম, ওয়ালা ইউহিতুনা বিশাইয়িম মিন ইলমিহি ইল্লা বিমা শা, ওয়াসিয়া কুরসিয়্যুহুস সামাওয়াতি ওয়াল আরদ, ওয়ালা ইয়াউদুহু হিফজুহুমা, ওয়াহুয়াল আলিয়্যুল আজিম",
      bengali: "আল্লাহ - তিনি ছাড়া কোন ইলাহ নেই, তিনি চিরঞ্জীব, সবকিছুর ধারক। তাঁকে তন্দ্রাও স্পর্শ করে না, নিদ্রাও নয়। আকাশমণ্ডলী ও পৃথিবীতে যা কিছু আছে সবই তাঁর। কে এমন আছে যে তাঁর অনুমতি ছাড়া তাঁর কাছে সুপারিশ করবে? তিনি জানেন তাদের সামনে যা আছে এবং তাদের পিছনে যা আছে। তারা তাঁর জ্ঞানের কোন কিছুকেই পরিবেষ্টন করতে পারে না, যা তিনি চান তা ছাড়া। তাঁর কুরসী আকাশমণ্ডলী ও পৃথিবী পরিবেষ্টন করে আছে। আর এ দুটিকে ধারণ করা তাঁকে ক্লান্ত করে না। তিনি সর্বোচ্চ, মহান।",
      reference: "সূরা আল-বাকারা, আয়াত ২৫৫",
      benefits: "এই আয়াত পড়লে আল্লাহর সুরক্ষা লাভ হয়, শয়তান দূরে থাকে, এবং ঘরে শান্তি বিরাজ করে। রাতে পড়লে সকাল পর্যন্ত সুরক্ষা থাকে।",
      category: "সুরক্ষার দোয়া"
    },
    {
      id: "surah-fatiha",
      title: "সূরা আল-ফাতিহা",
      arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿١﴾ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ﴿٢﴾ الرَّحْمَٰنِ الرَّحِيمِ ﴿٣﴾ مَالِكِ يَوْمِ الدِّينِ ﴿٤﴾ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ﴿٥﴾ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ﴿٦﴾ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ ﴿٧﴾",
      pronunciation: "বিসমিল্লাহির রাহমানির রাহিম। আলহামদু লিল্লাহি রাব্বিল আলামিন। আর রাহমানির রাহিম। মালিকি ইয়াউমিদ দিন। ইয়্যাকা না'বুদু ওয়া ইয়্যাকা নাসতাইন। ইহদিনাস সিরাতাল মুসতাকিম। সিরাতাল্লাজিনা আনআমতা আলাইহিম, গাইরিল মাগদুবি আলাইহিম ওয়ালাদ দাল্লিন।",
      bengali: "পরম করুণাময় ও অসীম দয়ালু আল্লাহর নামে। সকল প্রশংসা আল্লাহর জন্য, যিনি সকল সৃষ্টি জগতের পালনকর্তা। তিনি পরম করুণাময় ও অসীম দয়ালু। তিনি বিচার দিনের মালিক। আমরা একমাত্র তোমারই ইবাদত করি এবং একমাত্র তোমারই নিকট সাহায্য প্রার্থনা করি। আমাদেরকে সরল পথ দেখাও। তাদের পথ, যাদেরকে তুমি নেয়ামত দান করেছ। তাদের পথ নয়, যাদের প্রতি তোমার গজব নাজিল হয়েছে এবং যারা পথভ্রষ্ট হয়েছে।",
      reference: "সূরা আল-ফাতিহা, আয়াত ১-৭",
      benefits: "এই সূরা নামাজের প্রতিটি রাকাতে পড়া হয়। এটি কোরআনের সারসংক্ষেপ এবং সবচেয়ে গুরুত্বপূর্ণ সূরা।",
      category: "নামাজের দোয়া"
    },
    {
      id: "surah-ikhlas",
      title: "সূরা আল-ইখলাস",
      arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ ﴿١﴾ اللَّهُ الصَّمَدُ ﴿٢﴾ لَمْ يَلِدْ وَلَمْ يُولَدْ ﴿٣﴾ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ ﴿٤﴾",
      pronunciation: "কুল হুয়াল্লাহু আহাদ। আল্লাহুস সামাদ। লাম ইয়ালিদ ওয়ালাম ইউলাদ। ওয়ালাম ইয়াকুল্লাহু কুফুয়ান আহাদ।",
      bengali: "বলুন, তিনি আল্লাহ, তিনি এক। আল্লাহ অমুখাপেক্ষী। তিনি কাউকে জন্ম দেননি এবং তাঁকেও জন্ম দেওয়া হয়নি। এবং তাঁর সমতুল্য কেউ নেই।",
      reference: "সূরা আল-ইখলাস, আয়াত ১-৪",
      benefits: "এই সূরা পড়লে এক তৃতীয়াংশ কোরআন পড়ার সওয়াব লাভ হয়। এটি তাওহীদের মূল ভিত্তি।",
      category: "নামাজের দোয়া"
    },
    {
      id: "surah-falaq",
      title: "সূরা আল-ফালাক",
      arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ﴿١﴾ مِن شَرِّ مَا خَلَقَ ﴿٢﴾ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ﴿٣﴾ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ﴿٤﴾ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ ﴿٥﴾",
      pronunciation: "কুল আউযু বিরাব্বিল ফালাক। মিন শাররি মা খালাক। ওয়ামিন শাররি গাসিকিন ইজা ওয়াকাব। ওয়ামিন শাররিন নাফফাসাতি ফিল উকাদ। ওয়ামিন শাররি হাসিদিন ইজা হাসাদ।",
      bengali: "বলুন, আমি আশ্রয় গ্রহণ করছি প্রভাতের পালনকর্তার। যা তিনি সৃষ্টি করেছেন, তার অনিষ্ট থেকে। অন্ধকার রাত্রির অনিষ্ট থেকে, যখন তা সমাগত হয়। গ্রন্থিতে ফুঁৎকার দানকারিণীদের অনিষ্ট থেকে। হিংসুকের অনিষ্ট থেকে, যখন সে হিংসা করে।",
      reference: "সূরা আল-ফালাক, আয়াত ১-৫",
      benefits: "এই সূরা পড়লে জাদু, হিংসা এবং সব ধরনের অনিষ্ট থেকে সুরক্ষা লাভ হয়।",
      category: "সুরক্ষার দোয়া"
    },
    {
      id: "surah-nas",
      title: "সূরা আন-নাস",
      arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ ﴿١﴾ مَلِكِ النَّاسِ ﴿٢﴾ إِلَٰهِ النَّاسِ ﴿٣﴾ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ﴿٤﴾ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ﴿٥﴾ مِنَ الْجِنَّةِ وَالنَّاسِ ﴿٦﴾",
      pronunciation: "কুল আউযু বিরাব্বিন নাস। মালিকিন নাস। ইলাহিন নাস। মিন শাররিল ওয়াসওয়াসিল খান্নাস। আল্লাজি ইউয়াসউইসু ফি সুদুরিন নাস। মিনাল জিন্নাতি ওয়ান নাস।",
      bengali: "বলুন, আমি আশ্রয় গ্রহণ করছি মানুষের পালনকর্তার। মানুষের অধিপতির। মানুষের ইলাহের। কুমন্ত্রণাদাতার অনিষ্ট থেকে, যে অন্তরে কুমন্ত্রণা দেয়। জিন ও মানুষের মধ্য থেকে।",
      reference: "সূরা আন-নাস, আয়াত ১-৬",
      benefits: "এই সূরা পড়লে শয়তানের কুমন্ত্রণা থেকে সুরক্ষা লাভ হয় এবং মন শান্ত থাকে।",
      category: "সুরক্ষার দোয়া"
    },
    {
      id: "durood-sharif",
      title: "দুরূদ শরীফ",
      arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ",
      pronunciation: "আল্লাহুম্মা সাল্লি আলা মুহাম্মাদিও ওয়া আলা আলি মুহাম্মাদিন, কামা সাল্লাইতা আলা ইবরাহিমা ওয়া আলা আলি ইবরাহিমা, ইন্নাকা হামিদুম মাজিদ।",
      bengali: "হে আল্লাহ! আপনি মুহাম্মদ (সা.) এর উপর এবং তাঁর পরিবারবর্গের উপর রহমত বর্ষণ করুন, যেমন আপনি ইবরাহিম (আ.) এর উপর এবং তাঁর পরিবারবর্গের উপর রহমত বর্ষণ করেছিলেন। নিশ্চয় আপনি প্রশংসিত, মহিমান্বিত।",
      reference: "সহীহ বুখারি ও মুসলিম",
      benefits: "দুরূদ পড়লে আল্লাহর রহমত লাভ হয়, গুনাহ মাফ হয়, এবং নবীজি (সা.) এর শাফায়াত লাভের সুযোগ হয়।",
      category: "নামাজের দোয়া"
    }
  ]

  const popularDuas = popularDuasData.map(dua => dua.title)

  const sampleDuas: SampleDua[] = [
    {
      id: 1,
      title: "ঘুমানোর দোয়া",
      category: "দৈনন্দিন দোয়া",
      arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
      pronunciation: "বিসমিকা আল্লাহুম্মা আমূতু ওয়া আহইয়া",
      bengali: "হে আল্লাহ! আপনার নামেই আমি মৃত্যুবরণ করি এবং জীবিত হই।",
      reference: "সহীহ বুখারি",
      benefits: "রাতে শান্তিতে ঘুমানোর জন্য এবং আল্লাহর সুরক্ষার জন্য।",
    },
    {
      id: 2,
      title: "খাওয়ার পূর্বে দোয়া",
      category: "খাওয়ার দোয়া",
      arabic: "بِسْمِ اللَّهِ",
      pronunciation: "বিসমিল্লাহ",
      bengali: "আল্লাহর নামে (শুরু করছি)।",
      reference: "সহীহ মুসলিম",
      benefits: "খাবারে বরকত লাভের জন্য এবং শয়তান থেকে সুরক্ষার জন্য।",
    },
    {
      id: 3,
      title: "সফরের দোয়া",
      category: "সফরের দোয়া",
      arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ",
      pronunciation: "সুবহানাল্লাজি সাখখারা লানা হাজা ওয়ামা কুন্না লাহু মুকরিনীন",
      bengali: "পবিত্র সেই সত্তা যিনি এটিকে আমাদের অধীনস্থ করে দিয়েছেন, অথচ আমরা এটিকে বশীভূত করতে সক্ষম ছিলাম না।",
      reference: "সহীহ মুসলিম",
      benefits: "সফরে নিরাপত্তা ও কল্যাণের জন্য।",
    },
  ]

  const [filteredSampleDuas, setFilteredSampleDuas] = useState(sampleDuas)
  const [filteredPopularDuas, setFilteredPopularDuas] = useState(popularDuasData)

  useEffect(() => {
    setCurrentUrl(window.location.origin + "/duas")
  }, [])

  const handleDuaClick = (duaTitle: string) => {
    const dua = popularDuasData.find(d => d.title === duaTitle)
    if (dua) {
      setSelectedDua(dua)
      setIsModalOpen(true)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    showToastMessage("দোয়া কপি করা হয়েছে!")
  }

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'ar-SA' // Arabic language
      utterance.rate = 0.8 // Slower speed for better pronunciation
      speechSynthesis.speak(utterance)
    } else {
      alert('আপনার ব্রাউজারে টেক্সট-টু-স্পিচ সাপোর্ট নেই।')
    }
  }

  const shareDua = (dua: PopularDua) => {
    if (navigator.share) {
      navigator.share({
        title: dua.title,
        text: `${dua.title}\n\n${dua.arabic}\n\n${dua.bengali}\n\nফজিলত: ${dua.benefits}`,
        url: currentUrl
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      const shareText = `${dua.title}\n\n${dua.arabic}\n\n${dua.bengali}\n\nফজিলত: ${dua.benefits}`
      copyToClipboard(shareText)
      showToastMessage('দোয়া কপি করা হয়েছে! আপনি এখন শেয়ার করতে পারেন।')
    }
  }

  const addToFavorites = (dua: PopularDua) => {
    // Get existing favorites from localStorage
    const existingFavorites = JSON.parse(localStorage.getItem('favoriteDuas') || '[]')
    
    // Check if already in favorites
    const isAlreadyFavorite = existingFavorites.some((fav: any) => fav.id === dua.id)
    
    if (isAlreadyFavorite) {
      // Remove from favorites
      const updatedFavorites = existingFavorites.filter((fav: any) => fav.id !== dua.id)
      localStorage.setItem('favoriteDuas', JSON.stringify(updatedFavorites))
      showToastMessage('পছন্দের তালিকা থেকে সরানো হয়েছে।')
    } else {
      // Add to favorites
      const updatedFavorites = [...existingFavorites, dua]
      localStorage.setItem('favoriteDuas', JSON.stringify(updatedFavorites))
      showToastMessage('পছন্দের তালিকায় যোগ করা হয়েছে!')
    }
  }

  const showToastMessage = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 3000)
  }

  const filterDuas = (term: string, category: string) => {
    const lowerTerm = term.trim().toLowerCase()
    // Sample Duas
    let filteredSample = sampleDuas.filter(dua => {
      const matchText = dua.title + dua.arabic + dua.pronunciation + dua.bengali + dua.reference + dua.benefits
      const matchCategory = category === "all" || dua.category === category || dua.category === category
      return matchText.toLowerCase().includes(lowerTerm) && matchCategory
    })
    // Popular Duas
    let filteredPopular = popularDuasData.filter(dua => {
      const matchText = dua.title + dua.arabic + dua.pronunciation + dua.bengali + dua.reference + dua.benefits
      const matchCategory = category === "all" || dua.category === category || dua.category === category
      return matchText.toLowerCase().includes(lowerTerm) && matchCategory
    })
    setFilteredSampleDuas(filteredSample)
    setFilteredPopularDuas(filteredPopular)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    filterDuas(searchTerm, selectedCategory)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    filterDuas(e.target.value, selectedCategory)
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value)
    filterDuas(searchTerm, e.target.value)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <Link href="/" className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-pink-600" />
              <span className="text-lg sm:text-xl font-bold">ইসলামিক গাইড</span>
            </Link>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <h1 className="text-xl sm:text-2xl font-bold text-pink-600">দোয়া সমূহ</h1>
              <ShareButton
                title="দোয়া সমূহ"
                text="ইসলামিক গাইড অ্যাপে দৈনন্দিন দোয়া, নামাজের দোয়া, খাওয়ার দোয়া সহ সব দোয়া পড়ুন।"
                url={currentUrl}
                variant="outline"
                size="sm"
              >
                <Share2 className="h-4 w-4 mr-2" />
                শেয়ার
              </ShareButton>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Search Section */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <Search className="h-5 w-5" />
              <span>দোয়া খুঁজুন</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col space-y-4" onSubmit={handleSearch}>
              <Input
                placeholder="দোয়ার নাম বা বিষয় লিখুন..."
                value={searchTerm}
                onChange={handleInputChange}
                className="flex-1"
              />
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <select
                  className="px-3 py-2 border rounded-md"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="all">সকল বিভাগ</option>
                  {duaCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <Button className="w-full sm:w-auto" type="submit">
                  <Search className="h-4 w-4 mr-2" />
                  খুঁজুন
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Popular Duas */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl">জনপ্রিয় দোয়া সমূহ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {filteredPopularDuas.length === 0 ? (
                <span>কোনো দোয়া পাওয়া যায়নি।</span>
              ) : (
                filteredPopularDuas.map((dua, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground text-xs sm:text-sm py-2 px-3 sm:px-4 transition-colors"
                    onClick={() => handleDuaClick(dua.title)}
                  >
                    {dua.title}
                  </Badge>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dua Categories */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">দোয়ার বিভাগ সমূহ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {duaCategories.map((category) => (
              <Link key={category.id} href={`/duas/${category.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-base sm:text-lg group-hover:text-blue-600 transition-colors">{category.name}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">{category.count} টি দোয়া</p>
                      </div>
                  </div>
                </CardContent>
              </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Sample Duas */}
        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold">নির্বাচিত দোয়া সমূহ</h2>
          {filteredSampleDuas.length === 0 ? (
            <div>কোনো দোয়া পাওয়া যায়নি।</div>
          ) : (
            filteredSampleDuas.map((dua) => (
              <Card key={dua.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <CardTitle className="text-lg sm:text-xl text-blue-600">{dua.title}</CardTitle>
                    <Badge variant="outline" className="w-fit">{dua.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  {/* Arabic Text */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 sm:p-6 rounded-lg">
                    <p className="text-right text-lg sm:text-2xl font-arabic leading-loose text-green-700 dark:text-green-300 mb-4">
                      {dua.arabic}
                    </p>
                    <div className="border-t pt-4">
                      <p className="text-sm sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <span className="text-xs sm:text-sm text-muted-foreground">উচ্চারণ:</span> {dua.pronunciation}
                      </p>
                    </div>
                  </div>

                  {/* Bengali Translation */}
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                    <h4 className="font-semibold mb-2 text-blue-600 text-sm sm:text-base">অর্থ:</h4>
                    <p className="text-sm sm:text-lg leading-relaxed text-gray-800 dark:text-gray-200">{dua.bengali}</p>
                  </div>

                  {/* Benefits */}
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-yellow-700 dark:text-yellow-300 text-sm sm:text-base">ফজিলত:</h4>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{dua.benefits}</p>
                  </div>

                  {/* Reference */}
                  <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
                    <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="font-medium">সূত্র:</span>
                    <span>{dua.reference}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-4 border-t">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => playAudio(dua.arabic)}
                    >
                      <Volume2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      শুনুন
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => copyToClipboard(dua.arabic)} 
                      className="text-xs"
                    >
                      <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      কপি করুন
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => {
                        const shareText = `${dua.title}\n\n${dua.arabic}\n\n${dua.bengali}\n\nফজিলত: ${dua.benefits}`
                        copyToClipboard(shareText)
                        showToastMessage('দোয়া শেয়ার করা হয়েছে!')
                      }}
                    >
                      <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      শেয়ার
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => {
                        const existingFavorites = JSON.parse(localStorage.getItem('favoriteDuas') || '[]')
                        const isAlreadyFavorite = existingFavorites.some((fav: any) => fav.title === dua.title)
                        if (isAlreadyFavorite) {
                          const updatedFavorites = existingFavorites.filter((fav: any) => fav.title !== dua.title)
                          localStorage.setItem('favoriteDuas', JSON.stringify(updatedFavorites))
                          showToastMessage('পছন্দের তালিকা থেকে সরানো হয়েছে।')
                        } else {
                          const updatedFavorites = [...existingFavorites, dua]
                          localStorage.setItem('favoriteDuas', JSON.stringify(updatedFavorites))
                          showToastMessage('পছন্দের তালিকায় যোগ করা হয়েছে!')
                        }
                      }}
                    >
                      <Heart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      পছন্দের তালিকায়
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Load More */}
        <div className="text-center mt-6 sm:mt-8">
          <Button size="lg">আরো দোয়া দেখুন</Button>
        </div>

        {/* Daily Reminder */}
        <Card className="mt-6 sm:mt-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <CardContent className="p-4 sm:p-6 text-center">
            <h3 className="text-xl sm:text-2xl font-bold mb-4">দৈনিক দোয়া রিমাইন্ডার</h3>
            <p className="mb-4 text-sm sm:text-base">প্রতিদিন গুরুত্বপূর্ণ দোয়া মনে রাখার জন্য নোটিফিকেশন চালু করুন</p>
            <Button variant="secondary">রিমাইন্ডার সেট করুন</Button>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 sm:mt-12">
          <Card className="text-center">
            <CardContent className="p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl font-bold text-pink-600">১০০+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">মোট দোয়া</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600">৬</div>
              <div className="text-xs sm:text-sm text-muted-foreground">প্রধান বিভাগ</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl font-bold text-green-600">১০০%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">সহীহ সূত্র</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600">২৪/৭</div>
              <div className="text-xs sm:text-sm text-muted-foreground">সেবা</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dua Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl text-blue-600 flex items-center justify-between">
              {selectedDua?.title}
              <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {selectedDua && (
            <div className="space-y-4 sm:space-y-6">
              {/* Arabic Text */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 sm:p-6 rounded-lg">
                <p className="text-right text-xl sm:text-3xl font-arabic leading-loose text-green-700 dark:text-green-300 mb-4">
                  {selectedDua.arabic}
                </p>
                <div className="border-t pt-4">
                  <p className="text-sm sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <span className="text-xs sm:text-sm text-muted-foreground">উচ্চারণ:</span> {selectedDua.pronunciation}
                  </p>
                </div>
              </div>

              {/* Bengali Translation */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                <h4 className="font-semibold mb-2 text-blue-600 text-sm sm:text-base">অর্থ:</h4>
                <p className="text-sm sm:text-lg leading-relaxed text-gray-800 dark:text-gray-200">{selectedDua.bengali}</p>
              </div>

              {/* Benefits */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-yellow-700 dark:text-yellow-300 text-sm sm:text-base">ফজিলত:</h4>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{selectedDua.benefits}</p>
              </div>

              {/* Reference */}
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
                <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="font-medium">সূত্র:</span>
                <span>{selectedDua.reference}</span>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2 pt-4 border-t">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => playAudio(selectedDua.arabic)}
                >
                  <Volume2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  শুনুন
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyToClipboard(selectedDua.arabic)} 
                  className="text-xs"
                >
                  <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  কপি করুন
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => shareDua(selectedDua)}
                >
                  <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  শেয়ার
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => addToFavorites(selectedDua)}
                >
                  <Heart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  পছন্দের তালিকায়
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 left-4 right-4 z-50">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg" role="alert">
            <div className="flex items-center justify-between">
              <span>{toastMessage}</span>
              <button 
                onClick={() => setShowToast(false)}
                className="text-green-700 hover:text-green-900"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
