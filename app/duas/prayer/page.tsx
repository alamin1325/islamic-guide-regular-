"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Volume2, Copy, Share2, BookOpen, ArrowLeft } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

interface PrayerDua {
  id: string
  title: string
  arabic: string
  pronunciation: string
  bengali: string
  reference: string
  benefits: string
  timing: string
}

export default function PrayerDuasPage() {
  const [toastMessage, setToastMessage] = useState("")
  const [showToast, setShowToast] = useState(false)

  const prayerDuas: PrayerDua[] = [
    {
      id: "takbir",
      title: "তাকবীর (আল্লাহু আকবার)",
      arabic: "اللَّهُ أَكْبَرُ",
      pronunciation: "আল্লাহু আকবার",
      bengali: "আল্লাহ মহান",
      reference: "সহীহ বুখারি ও মুসলিম",
      benefits: "নামাজ শুরু করার সময় এবং প্রতিটি রাকাতের শুরুতে পড়া হয়।",
      timing: "নামাজের শুরুতে এবং প্রতিটি রাকাতে"
    },
    {
      id: "fatiha",
      title: "সূরা ফাতিহা",
      arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿١﴾ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ﴿٢﴾ الرَّحْمَٰنِ الرَّحِيمِ ﴿٣﴾ مَالِكِ يَوْمِ الدِّينِ ﴿٤﴾ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ﴿٥﴾ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ﴿٦﴾ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ ﴿٧﴾",
      pronunciation: "বিসমিল্লাহির রাহমানির রাহীম। আলহামদু লিল্লাহি রাব্বিল আলামীন। আর রাহমানির রাহীম। মালিকি ইয়াওমিদ্দীন। ইয়্যাকা না'বুদু ওয়া ইয়্যাকা নাসতাঈন। ইহদিনাস সিরাতাল মুসতাকীম। সিরাতাল্লাযীনা আনআমতা আলাইহিম গাইরিল মাগদূবি আলাইহিম ওয়ালাদ দাল্লীন।",
      bengali: "পরম করুণাময় ও অসীম দয়ালু আল্লাহর নামে। সকল প্রশংসা আল্লাহর জন্য, যিনি সকল সৃষ্টি জগতের পালনকর্তা। যিনি পরম করুণাময় ও অসীম দয়ালু। যিনি বিচার দিনের মালিক। আমরা একমাত্র আপনারই ইবাদত করি এবং একমাত্র আপনারই নিকট সাহায্য প্রার্থনা করি। আমাদেরকে সরল পথ দেখান। তাদের পথ, যাদেরকে আপনি অনুগ্রহ করেছেন। তাদের পথ নয়, যাদের প্রতি আপনার গজব নেমেছে এবং যারা পথভ্রষ্ট হয়েছে।",
      reference: "সূরা আল-ফাতিহা",
      benefits: "প্রতিটি নামাজের প্রতিটি রাকাতে পড়া হয়। এটি কোরআনের সবচেয়ে গুরুত্বপূর্ণ সূরা।",
      timing: "প্রতিটি নামাজের প্রতিটি রাকাতে"
    },
    {
      id: "ruku",
      title: "রুকু'র দোয়া",
      arabic: "سُبْحَانَ رَبِّيَ الْعَظِيمِ",
      pronunciation: "সুবহানা রাব্বিয়াল আযীম",
      bengali: "মহান আমার পালনকর্তা পবিত্র",
      reference: "সহীহ মুসলিম",
      benefits: "রুকু'তে আল্লাহর মহত্ত্বের প্রশংসা করার জন্য।",
      timing: "রুকু'তে"
    },
    {
      id: "sajdah",
      title: "সিজদার দোয়া",
      arabic: "سُبْحَانَ رَبِّيَ الْأَعْلَى",
      pronunciation: "সুবহানা রাব্বিয়াল আ'লা",
      bengali: "সর্বোচ্চ আমার পালনকর্তা পবিত্র",
      reference: "সহীহ মুসলিম",
      benefits: "সিজদায় আল্লাহর সর্বোচ্চত্বের প্রশংসা করার জন্য।",
      timing: "সিজদায়"
    },
    {
      id: "tashahhud",
      title: "তাশাহহুদ",
      arabic: "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
      pronunciation: "আত-তাহিয়্যাতু লিল্লাহি ওয়াস-সালাওয়াতু ওয়াত-তাইয়্যিবাতু। আস-সালামু আলাইকা আইয়্যুহান-নাবিয়্যু ওয়া রাহমাতুল্লাহি ওয়া বারাকাতুহু। আস-সালামু আলাইনা ওয়া আলা ইবাদিল্লাহিস-সালিহীন। আশহাদু আল্লা ইলাহা ইল্লাল্লাহু ওয়া আশহাদু আন্না মুহাম্মাদান আবদুহু ওয়া রাসূলুহু।",
      bengali: "সকল প্রকার সম্মান, ইবাদত ও পবিত্রতা আল্লাহর জন্য। হে নবী! আপনার প্রতি সালাম, আল্লাহর রহমত ও বরকত। আমাদের প্রতি এবং আল্লাহর সৎ বান্দাদের প্রতি সালাম। আমি সাক্ষ্য দিচ্ছি যে, আল্লাহ ছাড়া কোন ইলাহ নেই এবং আমি সাক্ষ্য দিচ্ছি যে, মুহাম্মদ তাঁর বান্দা ও রাসূল।",
      reference: "সহীহ বুখারি ও মুসলিম",
      benefits: "প্রতিটি নামাজের শেষ রাকাতে বসে পড়া হয়।",
      timing: "প্রতিটি নামাজের শেষ রাকাতে"
    },
    {
      id: "durood",
      title: "দরূদ শরীফ",
      arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ",
      pronunciation: "আল্লাহুম্মা সাল্লি আলা মুহাম্মাদিন ওয়া আলা আলি মুহাম্মাদিন কামা সাল্লাইতা আলা ইবরাহীমা ওয়া আলা আলি ইবরাহীমা ইন্নাকা হামীদুম মাজীদ। আল্লাহুম্মা বারিক আলা মুহাম্মাদিন ওয়া আলা আলি মুহাম্মাদিন কামা বারাকতা আলা ইবরাহীমা ওয়া আলা আলি ইবরাহীমা ইন্নাকা হামীদুম মাজীদ।",
      bengali: "হে আল্লাহ! মুহাম্মদ ও তাঁর পরিবারবর্গের উপর রহমত নাযিল করুন, যেমন আপনি ইবরাহীম ও তাঁর পরিবারবর্গের উপর রহমত নাযিল করেছেন। নিশ্চয় আপনি প্রশংসিত ও মহিমান্বিত। হে আল্লাহ! মুহাম্মদ ও তাঁর পরিবারবর্গের উপর বরকত নাযিল করুন, যেমন আপনি ইবরাহীম ও তাঁর পরিবারবর্গের উপর বরকত নাযিল করেছেন। নিশ্চয় আপনি প্রশংসিত ও মহিমান্বিত।",
      reference: "সহীহ বুখারি ও মুসলিম",
      benefits: "নামাজের শেষে রাসূল (সা.) এর উপর দরূদ পাঠ করা হয়।",
      timing: "নামাজের শেষে তাশাহহুদের পর"
    },
    {
      id: "salam",
      title: "সালাম",
      arabic: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ",
      pronunciation: "আস-সালামু আলাইকুম ওয়া রাহমাতুল্লাহ",
      bengali: "আপনাদের প্রতি সালাম এবং আল্লাহর রহমত",
      reference: "সহীহ বুখারি ও মুসলিম",
      benefits: "নামাজ শেষ করার জন্য ডান ও বাম দিকে সালাম দেওয়া হয়।",
      timing: "নামাজ শেষে"
    },
    {
      id: "qunut",
      title: "কুনুত দোয়া",
      arabic: "اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ وَعَافِنِي فِيمَنْ عَافَيْتَ وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ وَبَارِكْ لِي فِيمَا أَعْطَيْتَ وَقِنِي شَرَّ مَا قَضَيْتَ فَإِنَّكَ تَقْضِي وَلَا يُقْضَى عَلَيْكَ وَإِنَّهُ لَا يَذِلُّ مَنْ وَالَيْتَ وَلَا يَعِزُّ مَنْ عَادَيْتَ تَبَارَكْتَ رَبَّنَا وَتَعَالَيْتَ",
      pronunciation: "আল্লাহুম্মাহদিনি ফীমান হাদাইতা ওয়া আফিনি ফীমান আফাইতা ওয়া তাওয়াল্লানি ফীমান তাওয়াল্লাইতা ওয়া বারিক লি ফীমা আ'তাইতা ওয়া কিনি শাররা মা কাদাইতা ফাঈন্নাকা তাকদি ওয়া লা ইউকদা আলাইকা ওয়া ইন্নাহু লা ইয়াজিল্লু মান ওয়ালাইতা ওয়া লা ইয়া'জ্জু মান আদাইতা তাবারাকতা রাব্বানা ওয়া তা'আলাইতা।",
      bengali: "হে আল্লাহ! আপনি যাদের হিদায়াত দিয়েছেন তাদের মধ্যে আমাকেও হিদায়াত দিন। আপনি যাদের সুস্থতা দিয়েছেন তাদের মধ্যে আমাকেও সুস্থতা দিন। আপনি যাদের সাহায্য করেছেন তাদের মধ্যে আমাকেও সাহায্য করুন। আপনি যা দিয়েছেন তাতে আমার জন্য বরকত দিন। আপনি যা নির্ধারণ করেছেন তার ক্ষতি থেকে আমাকে রক্ষা করুন। নিশ্চয় আপনি ফায়সালা করেন এবং আপনার বিরুদ্ধে ফায়সালা করা হয় না। আপনি যাকে সাহায্য করেন সে কখনও অপমানিত হয় না এবং আপনি যার শত্রু সে কখনও সম্মানিত হয় না। হে আমাদের পালনকর্তা! আপনি বরকতময় ও মহান।",
      reference: "আবু দাউদ, তিরমিজি",
      benefits: "বিতর নামাজে কুনুত পড়া হয়।",
      timing: "বিতর নামাজে"
    },
    {
      id: "istighfar",
      title: "ইস্তিগফার",
      arabic: "رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ",
      pronunciation: "রাব্বিগফির লি ওয়া তুব আলাইয়া ইন্নাকা আনতাত-তাওয়াবুর রাহীম",
      bengali: "হে আমার পালনকর্তা! আমাকে ক্ষমা করুন এবং আমার তাওবা কবুল করুন। নিশ্চয় আপনি তাওবা কবুলকারী ও দয়ালু।",
      reference: "আবু দাউদ",
      benefits: "নামাজের পর ক্ষমা প্রার্থনার জন্য।",
      timing: "নামাজের পর"
    },
    {
      id: "masjid-exit",
      title: "মসজিদ থেকে বের হওয়ার দোয়া",
      arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ وَرَحْمَتِكَ",
      pronunciation: "আল্লাহুম্মা ইন্নি আসআলুকা মিন ফাদলিকা ওয়া রাহমাতিক",
      bengali: "হে আল্লাহ! আমি আপনার অনুগ্রহ ও রহমত চাইছি।",
      reference: "সহীহ মুসলিম",
      benefits: "মসজিদ থেকে বের হওয়ার সময় আল্লাহর অনুগ্রহ লাভের জন্য।",
      timing: "মসজিদ থেকে বের হওয়ার সময়"
    }
  ]

  const showToastMessage = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 3000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    showToastMessage("দোয়া কপি করা হয়েছে!")
  }

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'ar-SA'
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    } else {
      showToastMessage('আপনার ব্রাউজারে টেক্সট-টু-স্পিচ সাপোর্ট নেই।')
    }
  }

  const shareDua = (dua: PrayerDua) => {
    if (navigator.share) {
      navigator.share({
        title: dua.title,
        text: `${dua.title}\n\n${dua.arabic}\n\n${dua.bengali}\n\nফজিলত: ${dua.benefits}`,
        url: window.location.href
      })
    } else {
      const shareText = `${dua.title}\n\n${dua.arabic}\n\n${dua.bengali}\n\nফজিলত: ${dua.benefits}`
      copyToClipboard(shareText)
      showToastMessage('দোয়া কপি করা হয়েছে! আপনি এখন শেয়ার করতে পারেন।')
    }
  }

  const addToFavorites = (dua: PrayerDua) => {
    const existingFavorites = JSON.parse(localStorage.getItem('favoriteDuas') || '[]')
    const isAlreadyFavorite = existingFavorites.some((fav: any) => fav.id === dua.id)
    
    if (isAlreadyFavorite) {
      const updatedFavorites = existingFavorites.filter((fav: any) => fav.id !== dua.id)
      localStorage.setItem('favoriteDuas', JSON.stringify(updatedFavorites))
      showToastMessage('পছন্দের তালিকা থেকে সরানো হয়েছে।')
    } else {
      const updatedFavorites = [...existingFavorites, dua]
      localStorage.setItem('favoriteDuas', JSON.stringify(updatedFavorites))
      showToastMessage('পছন্দের তালিকায় যোগ করা হয়েছে!')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/duas" className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
                <ArrowLeft className="h-5 w-5" />
                <span>ফিরে যান</span>
              </Link>
              <div className="flex items-center space-x-2">
                <Heart className="h-6 w-6 text-pink-600" />
                <span className="text-lg sm:text-xl font-bold">ইসলামিক গাইড</span>
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-pink-600">নামাজের দোয়া</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Category Info */}
        <Card className="mb-6 sm:mb-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
          <CardContent className="p-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-green-600 mb-4">নামাজের দোয়া সমূহ</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              নামাজের বিভিন্ন অংশে পড়া হয় এমন গুরুত্বপূর্ণ দোয়া সমূহ। এই দোয়া গুলো নামাজকে পূর্ণাঙ্গ করে তোলে।
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-green-100 text-green-800">১৫ টি দোয়া</Badge>
              <Badge variant="outline" className="bg-blue-100 text-blue-800">নামাজের অংশ</Badge>
              <Badge variant="outline" className="bg-purple-100 text-purple-800">অত্যাবশ্যক</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Duas List */}
        <div className="space-y-4 sm:space-y-6">
          {prayerDuas.map((dua) => (
            <Card key={dua.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <CardTitle className="text-lg sm:text-xl text-green-600">{dua.title}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="w-fit bg-green-50 text-green-700">
                      {dua.timing}
                    </Badge>
                  </div>
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
                  <h4 className="font-semibold mb-2 text-green-600 text-sm sm:text-base">অর্থ:</h4>
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
                    onClick={() => shareDua(dua)}
                  >
                    <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    শেয়ার
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs"
                    onClick={() => addToFavorites(dua)}
                  >
                    <Heart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    পছন্দের তালিকায়
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Back to Categories */}
        <div className="text-center mt-8">
          <Link href="/duas">
            <Button variant="outline" size="lg">
              <ArrowLeft className="h-4 w-4 mr-2" />
              সব বিভাগ দেখুন
            </Button>
          </Link>
        </div>
      </div>

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