"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Volume2, Copy, Share2, BookOpen, ArrowLeft } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

interface FoodDua {
  id: string
  title: string
  arabic: string
  pronunciation: string
  bengali: string
  reference: string
  benefits: string
  timing: string
}

export default function FoodDuasPage() {
  const [toastMessage, setToastMessage] = useState("")
  const [showToast, setShowToast] = useState(false)

  const foodDuas: FoodDua[] = [
    {
      id: "before-eating",
      title: "খাওয়ার আগের দোয়া",
      arabic: "بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ",
      pronunciation: "বিসমিল্লাহি ওয়া আলা বারাকাতিল্লাহ",
      bengali: "আল্লাহর নামে এবং আল্লাহর বরকতে",
      reference: "আবু দাউদ, তিরমিজি",
      benefits: "খাওয়ার আগে এই দোয়া পড়লে খাবারে বরকত হয় এবং শয়তান খাবারে অংশগ্রহণ করতে পারে না।",
      timing: "খাওয়ার আগে"
    },
    {
      id: "after-eating",
      title: "খাওয়ার পরের দোয়া",
      arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
      pronunciation: "আলহামদু লিল্লাহিল্লাজি আতআমানি হাজা ওয়া রাজাকানিহি মিন গাইরি হাউলিন মিন্নি ওয়ালা কুওয়াতিন",
      bengali: "সকল প্রশংসা আল্লাহর জন্য, যিনি আমাকে এ খাবার খাওয়িয়েছেন এবং আমার কোন ক্ষমতা ছাড়াই এটা দান করেছেন।",
      reference: "আবু দাউদ, তিরমিজি",
      benefits: "খাওয়ার পর শুকরিয়া আদায়ের জন্য এবং আল্লাহর অনুগ্রহ স্বীকার করার জন্য।",
      timing: "খাওয়ার পর"
    },
    {
      id: "drinking-water",
      title: "পানি পান করার দোয়া",
      arabic: "الْحَمْدُ لِلَّهِ الَّذِي سَقَانِي هَذَا عَذْبًا فُرَاتًا بِرَحْمَتِهِ وَلَمْ يَجْعَلْهُ مِلْحًا أُجَاجًا",
      pronunciation: "আলহামদু লিল্লাহিল্লাজি সাকানি হাজা আযবান ফুরাতান বিরাহমাতিহি ওয়ালাম ইয়াজআলহু মিলহান উজাজান",
      bengali: "সকল প্রশংসা আল্লাহর জন্য, যিনি তাঁর রহমতে আমাকে এ মিষ্টি ও সুস্বাদু পানি পান করিয়েছেন এবং এটাকে লবণাক্ত ও তিক্ত করেননি।",
      reference: "আবু দাউদ",
      benefits: "পানি পান করার পর আল্লাহর শুকরিয়া আদায়ের জন্য।",
      timing: "পানি পান করার পর"
    },
    {
      id: "milk-drinking",
      title: "দুধ পান করার দোয়া",
      arabic: "اللَّهُمَّ بَارِكْ لَنَا فِيهِ وَزِدْنَا مِنْهُ",
      pronunciation: "আল্লাহুম্মা বারিক লানা ফীহি ওয়া জিদনা মিনহু",
      bengali: "হে আল্লাহ! এতে আমাদের জন্য বরকত দিন এবং এ থেকে আরও দিন।",
      reference: "আবু দাউদ",
      benefits: "দুধ পান করার সময় বরকতের জন্য দোয়া।",
      timing: "দুধ পান করার সময়"
    },
    {
      id: "guest-food",
      title: "মেহমানের খাবারের দোয়া",
      arabic: "أَفْطَرَ عِنْدَكُمُ الصَّائِمُونَ وَأَكَلَ طَعَامَكُمُ الْأَبْرَارُ وَصَلَّتْ عَلَيْكُمُ الْمَلَائِكَةُ",
      pronunciation: "আফতারা ইন্দাকুমুস সাইমুনা ওয়া আকালা তা'আমাকুমুল আবরারু ওয়া সাল্লাত আলাইকুমুল মালাইকাতু",
      bengali: "আপনাদের এখানে রোজাদারগণ ইফতার করলেন এবং সৎ লোকেরা আপনার খাবার খেলেন এবং ফেরেশতারা আপনার জন্য দোয়া করলেন।",
      reference: "আবু দাউদ, ইবনে মাজাহ",
      benefits: "মেহমানের খাবারের সময় বরকতের জন্য।",
      timing: "মেহমানের খাবারের সময়"
    },
    {
      id: "fruit-eating",
      title: "ফল খাওয়ার দোয়া",
      arabic: "اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ",
      pronunciation: "আল্লাহুম্মা বারিক লানা ফীমা রাজাকতানা ওয়া কিনা আযাবান নার",
      bengali: "হে আল্লাহ! আপনি যা দান করেছেন তাতে আমাদের জন্য বরকত দিন এবং আমাদেরকে জাহান্নামের শাস্তি থেকে রক্ষা করুন।",
      reference: "ইবনে মাজাহ",
      benefits: "ফল খাওয়ার সময় বরকতের জন্য এবং জাহান্নাম থেকে সুরক্ষার জন্য।",
      timing: "ফল খাওয়ার সময়"
    },
    {
      id: "bread-eating",
      title: "রুটি খাওয়ার দোয়া",
      arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا الْخُبْزَ وَجَعَلَهُ لِي نِعْمَةً وَرِزْقًا",
      pronunciation: "আলহামদু লিল্লাহিল্লাজি আতআমানি হাজাল খুবজা ওয়া জাআলাহু লি নি'মাতান ওয়া রিজকান",
      bengali: "সকল প্রশংসা আল্লাহর জন্য, যিনি আমাকে এ রুটি খাওয়িয়েছেন এবং এটাকে আমার জন্য নিয়ামত ও রিজিক করেছেন।",
      reference: "আবু দাউদ",
      benefits: "রুটি খাওয়ার সময় আল্লাহর শুকরিয়া আদায়ের জন্য।",
      timing: "রুটি খাওয়ার সময়"
    },
    {
      id: "sweet-eating",
      title: "মিষ্টি খাওয়ার দোয়া",
      arabic: "اللَّهُمَّ بَارِكْ لَنَا فِيهِ وَاجْعَلْهُ لَنَا شِفَاءً",
      pronunciation: "আল্লাহুম্মা বারিক লানা ফীহি ওয়াজআলহু লানা শিফাআন",
      bengali: "হে আল্লাহ! এতে আমাদের জন্য বরকত দিন এবং এটাকে আমাদের জন্য শিফা করুন।",
      reference: "আবু দাউদ",
      benefits: "মিষ্টি খাওয়ার সময় বরকত ও শিফার জন্য দোয়া।",
      timing: "মিষ্টি খাওয়ার সময়"
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

  const shareDua = (dua: FoodDua) => {
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

  const addToFavorites = (dua: FoodDua) => {
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
            <h1 className="text-xl sm:text-2xl font-bold text-pink-600">খাওয়ার দোয়া</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Category Info */}
        <Card className="mb-6 sm:mb-8 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
          <CardContent className="p-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-orange-600 mb-4">খাওয়ার দোয়া সমূহ</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              খাওয়ার আগে ও পরে পড়া হয় এমন গুরুত্বপূর্ণ দোয়া সমূহ। এই দোয়া গুলো খাবারে বরকত আনে।
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-orange-100 text-orange-800">৮ টি দোয়া</Badge>
              <Badge variant="outline" className="bg-red-100 text-red-800">খাওয়ার সময়</Badge>
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">বরকতের জন্য</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Duas List */}
        <div className="space-y-4 sm:space-y-6">
          {foodDuas.map((dua) => (
            <Card key={dua.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <CardTitle className="text-lg sm:text-xl text-orange-600">{dua.title}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="w-fit bg-orange-50 text-orange-700">
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
                  <h4 className="font-semibold mb-2 text-orange-600 text-sm sm:text-base">অর্থ:</h4>
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