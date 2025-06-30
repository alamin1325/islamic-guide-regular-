"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Volume2, Copy, Share2, BookOpen, ArrowLeft } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

interface ForgivenessDua {
  id: string
  title: string
  arabic: string
  pronunciation: string
  bengali: string
  reference: string
  benefits: string
  timing: string
}

export default function ForgivenessDuasPage() {
  const [toastMessage, setToastMessage] = useState("")
  const [showToast, setShowToast] = useState(false)

  const forgivenessDuas: ForgivenessDua[] = [
    {
      id: "sayyidul-istighfar",
      title: "সাইয়্যিদুল ইস্তিগফার",
      arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
      pronunciation: "আল্লাহুম্মা আনতা রাব্বি লা ইলাহা ইল্লা আনতা, খালাকতানি ওয়া আনা আবদুকা, ওয়া আনা আলা আহদিকা ওয়া ওয়া'দিকা মাসতাতাতু। আউযু বিকা মিন শাররি মা সানাতু, আবুউ লাকা বিনি'মাতিকা আলাইয়া, ওয়া আবুউ লাকা বিজাম্বি, ফাগফির লি, ফাঈন্নাহু লা ইয়াগফিরুয-যুনুবা ইল্লা আনতা।",
      bengali: "হে আল্লাহ! আপনি আমার পালনকর্তা, আপনি ছাড়া কোন ইলাহ নেই। আপনি আমাকে সৃষ্টি করেছেন এবং আমি আপনার বান্দা। আমি আপনার অঙ্গীকার ও প্রতিশ্রুতির উপর আছি যতটুকু পারি। আমি আপনার কাছে আমার কৃতকর্মের ক্ষতি থেকে আশ্রয় চাইছি। আমি আপনার নিয়ামত স্বীকার করছি এবং আমার গুনাহ স্বীকার করছি। তাই আমাকে ক্ষমা করুন, কারণ আপনি ছাড়া কেউ গুনাহ ক্ষমা করতে পারে না।",
      reference: "সহীহ বুখারি",
      benefits: "এই দোয়া পড়লে আল্লাহ গুনাহ মাফ করেন এবং জান্নাত দান করেন।",
      timing: "সকাল-সন্ধ্যা, গুনাহ থেকে ক্ষমা চাওয়ার জন্য"
    },
    {
      id: "istighfar-simple",
      title: "সহজ ইস্তিগফার",
      arabic: "أَسْتَغْفِرُ اللَّهَ",
      pronunciation: "আসতাগফিরুল্লাহ",
      bengali: "আমি আল্লাহর কাছে ক্ষমা চাইছি",
      reference: "সহীহ বুখারি ও মুসলিম",
      benefits: "এই সহজ দোয়া পড়লে আল্লাহ গুনাহ মাফ করেন।",
      timing: "যেকোনো সময়"
    },
    {
      id: "istighfar-complete",
      title: "সম্পূর্ণ ইস্তিগফার",
      arabic: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ",
      pronunciation: "আসতাগফিরুল্লাহাল-আযীমাল্লাজি লা ইলাহা ইল্লা হুয়াল-হাইয়ুল-কাইয়ুমু ওয়া আতুবু ইলাইহি",
      bengali: "আমি মহান আল্লাহর কাছে ক্ষমা চাইছি, যিনি ছাড়া কোন ইলাহ নেই, তিনি চিরঞ্জীব, সবকিছুর ধারক এবং আমি তাঁর কাছে তাওবা করছি।",
      reference: "আবু দাউদ, তিরমিজি",
      benefits: "এই দোয়া পড়লে আল্লাহ গুনাহ মাফ করেন এবং তাওবা কবুল করেন।",
      timing: "সকাল-সন্ধ্যা, গুনাহ থেকে ক্ষমা চাওয়ার জন্য"
    },
    {
      id: "istighfar-100",
      title: "শতবার ইস্তিগফার",
      arabic: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",
      pronunciation: "আসতাগফিরুল্লাহা ওয়া আতুবু ইলাইহি",
      bengali: "আমি আল্লাহর কাছে ক্ষমা চাইছি এবং তাঁর কাছে তাওবা করছি",
      reference: "সহীহ বুখারি ও মুসলিম",
      benefits: "একশত বার এই দোয়া পড়লে আল্লাহ গুনাহ মাফ করেন।",
      timing: "সকাল-সন্ধ্যা, বিশেষ করে রমজান মাসে"
    },
    {
      id: "istighfar-night",
      title: "রাতের ইস্তিগফার",
      arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَأَعُوذُ بِكَ مِنَ النَّارِ",
      pronunciation: "আল্লাহুম্মা ইন্নি আসআলুকাল-জান্নাতা ওয়া আউযু বিকা মিনান-নার",
      bengali: "হে আল্লাহ! আমি আপনার কাছে জান্নাত চাইছি এবং জাহান্নাম থেকে আশ্রয় চাইছি।",
      reference: "আবু দাউদ",
      benefits: "রাতে এই দোয়া পড়লে আল্লাহ গুনাহ মাফ করেন এবং জান্নাত দান করেন।",
      timing: "রাতে ঘুমানোর আগে"
    },
    {
      id: "istighfar-morning",
      title: "সকালের ইস্তিগফার",
      arabic: "اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ",
      pronunciation: "আল্লাহুম্মা ইন্নি আসবাহতু উশহিদুকা ওয়া উশহিদু হামালাতা আরশিকা ওয়া মালাইকাতাকা ওয়া জামীআ খালকিকা আন্নাকা আনতাল্লাহু লা ইলাহা ইল্লা আনতা ওয়াহদাকা লা শারীকা লাকা ওয়া আন্না মুহাম্মাদান আবদুকা ওয়া রাসূলুকা",
      bengali: "হে আল্লাহ! আমি সকালে পৌঁছেছি। আমি আপনাকে সাক্ষী মানছি এবং আপনার আরশের বাহক, ফেরেশতাগণ ও সকল সৃষ্টিকে সাক্ষী মানছি যে, আপনি আল্লাহ, আপনি ছাড়া কোন ইলাহ নেই, আপনি একক, আপনার কোন শরীক নেই এবং মুহাম্মদ আপনার বান্দা ও রাসূল।",
      reference: "আবু দাউদ",
      benefits: "সকালে এই দোয়া পড়লে আল্লাহ গুনাহ মাফ করেন।",
      timing: "সকালে উঠার পর"
    },
    {
      id: "istighfar-evening",
      title: "সন্ধ্যার ইস্তিগফার",
      arabic: "اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ",
      pronunciation: "আল্লাহুম্মা ইন্নি আমসাইতু উশহিদুকা ওয়া উশহিদু হামালাতা আরশিকা ওয়া মালাইকাতাকা ওয়া জামীআ খালকিকা আন্নাকা আনতাল্লাহু লা ইলাহা ইল্লা আনতা ওয়াহদাকা লা শারীকা লাকা ওয়া আন্না মুহাম্মাদান আবদুকা ওয়া রাসূলুকা",
      bengali: "হে আল্লাহ! আমি সন্ধ্যায় পৌঁছেছি। আমি আপনাকে সাক্ষী মানছি এবং আপনার আরশের বাহক, ফেরেশতাগণ ও সকল সৃষ্টিকে সাক্ষী মানছি যে, আপনি আল্লাহ, আপনি ছাড়া কোন ইলাহ নেই, আপনি একক, আপনার কোন শরীক নেই এবং মুহাম্মদ আপনার বান্দা ও রাসূল।",
      reference: "আবু দাউদ",
      benefits: "সন্ধ্যায় এই দোয়া পড়লে আল্লাহ গুনাহ মাফ করেন।",
      timing: "সন্ধ্যায়"
    },
    {
      id: "istighfar-ramadan",
      title: "রমজানের ইস্তিগফার",
      arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي وَآمِنْ رَوْعَاتِي، اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَمِنْ خَلْفِي وَعَنْ يَمِينِي وَعَنْ شِمَالِي وَمِنْ فَوْقِي، وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي",
      pronunciation: "আল্লাহুম্মা ইন্নি আসআলুকাল-আফওয়া ওয়াল-আফিয়াতা ফিদ-দুনইয়া ওয়াল-আখিরাতি। আল্লাহুম্মা ইন্নি আসআলুকাল-আফওয়া ওয়াল-আফিয়াতা ফি দিনি ওয়া দুনইয়া ওয়া আহলি ওয়া মালি। আল্লাহুম্মাসতুর আওরাতি ওয়া আমিন রাও'আতি। আল্লাহুম্মাহফাজনি মিন বাইনি ইয়াদাইয়া ওয়া মিন খালফি ওয়া আন ইয়ামীনি ওয়া আন শিমালি ওয়া মিন ফাওকি, ওয়া আউযু বিআযামাতিকা আন উগতালা মিন তাহতি।",
      bengali: "হে আল্লাহ! আমি আপনার কাছে দুনিয়া ও আখিরাতে ক্ষমা ও সুস্থতা চাইছি। হে আল্লাহ! আমি আপনার কাছে আমার দীন, দুনিয়া, পরিবার ও সম্পদের ক্ষমা ও সুস্থতা চাইছি। হে আল্লাহ! আমার দোষত্রুটি গোপন করুন এবং আমার ভয় দূর করুন। হে আল্লাহ! আমাকে সামনে, পিছনে, ডানে, বামে ও উপরে থেকে রক্ষা করুন এবং আমি আপনার মহত্ত্বের কাছে আশ্রয় চাইছি যাতে নিচ থেকে আক্রান্ত না হই।",
      reference: "আবু দাউদ, ইবনে মাজাহ",
      benefits: "রমজান মাসে এই দোয়া পড়লে আল্লাহ গুনাহ মাফ করেন।",
      timing: "রমজান মাসে বিশেষ করে"
    },
    {
      id: "istighfar-laylatul-qadr",
      title: "লাইলাতুল কদরের ইস্তিগফার",
      arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
      pronunciation: "আল্লাহুম্মা ইন্নাকা আফুউন তুহিব্বুল-আফওয়া ফাআফু আন্নি",
      bengali: "হে আল্লাহ! নিশ্চয় আপনি ক্ষমাশীল, আপনি ক্ষমা করতে পছন্দ করেন, তাই আমাকে ক্ষমা করুন।",
      reference: "তিরমিজি, ইবনে মাজাহ",
      benefits: "লাইলাতুল কদরে এই দোয়া পড়লে আল্লাহ গুনাহ মাফ করেন।",
      timing: "লাইলাতুল কদরে বিশেষ করে"
    },
    {
      id: "istighfar-final",
      title: "চূড়ান্ত ইস্তিগফার",
      arabic: "رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ",
      pronunciation: "রাব্বিগফির লি ওয়া তুব আলাইয়া ইন্নাকা আনতাত-তাওয়াবুর রাহীম",
      bengali: "হে আমার পালনকর্তা! আমাকে ক্ষমা করুন এবং আমার তাওবা কবুল করুন। নিশ্চয় আপনি তাওবা কবুলকারী ও দয়ালু।",
      reference: "আবু দাউদ",
      benefits: "এই দোয়া পড়লে আল্লাহ গুনাহ মাফ করেন এবং তাওবা কবুল করেন।",
      timing: "যেকোনো সময়, বিশেষ করে নামাজের পর"
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

  const shareDua = (dua: ForgivenessDua) => {
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

  const addToFavorites = (dua: ForgivenessDua) => {
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
            <h1 className="text-xl sm:text-2xl font-bold text-pink-600">ক্ষমার দোয়া</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Category Info */}
        <Card className="mb-6 sm:mb-8 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20">
          <CardContent className="p-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-teal-600 mb-4">ক্ষমার দোয়া সমূহ</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              গুনাহ থেকে ক্ষমা চাওয়ার জন্য গুরুত্বপূর্ণ দোয়া সমূহ। এই দোয়া গুলো পড়লে আল্লাহ গুনাহ মাফ করেন।
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-teal-100 text-teal-800">১০ টি দোয়া</Badge>
              <Badge variant="outline" className="bg-cyan-100 text-cyan-800">ক্ষমার জন্য</Badge>
              <Badge variant="outline" className="bg-blue-100 text-blue-800">গুনাহ মাফ</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Duas List */}
        <div className="space-y-4 sm:space-y-6">
          {forgivenessDuas.map((dua) => (
            <Card key={dua.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <CardTitle className="text-lg sm:text-xl text-teal-600">{dua.title}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="w-fit bg-teal-50 text-teal-700">
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
                  <h4 className="font-semibold mb-2 text-teal-600 text-sm sm:text-base">অর্থ:</h4>
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