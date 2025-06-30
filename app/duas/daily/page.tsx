"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Heart, Volume2, Copy, Share2, BookOpen, X, ArrowLeft } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

interface DailyDua {
  id: string
  title: string
  arabic: string
  pronunciation: string
  bengali: string
  reference: string
  benefits: string
  timing: string
}

export default function DailyDuasPage() {
  const [selectedDua, setSelectedDua] = useState<DailyDua | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [showToast, setShowToast] = useState(false)

  const dailyDuas: DailyDua[] = [
    {
      id: "wake-up",
      title: "ঘুম থেকে উঠার দোয়া",
      arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانِي بَعْدَ مَا أَمَاتَنِي وَإِلَيْهِ النُّشُورُ",
      pronunciation: "আলহামদু লিল্লাহিল্লাজি আহইয়ানি বাদা মা আমাতানি ওয়া ইলাইহিন নুশুর",
      bengali: "সকল প্রশংসা আল্লাহর জন্য, যিনি আমাকে মৃত্যুর পর জীবিত করেছেন এবং তাঁরই কাছে পুনরুত্থান হবে।",
      reference: "সহীহ বুখারি",
      benefits: "সকালে উঠে এই দোয়া পড়লে দিনটি বরকতময় হয় এবং আল্লাহর শুকরিয়া আদায় হয়।",
      timing: "সকালে ঘুম থেকে উঠার পর"
    },
    {
      id: "sleep",
      title: "ঘুমানোর দোয়া",
      arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
      pronunciation: "বিসমিকা আল্লাহুম্মা আমূতু ওয়া আহইয়া",
      bengali: "হে আল্লাহ! আপনার নামেই আমি মৃত্যুবরণ করি এবং জীবিত হই।",
      reference: "সহীহ বুখারি",
      benefits: "রাতে শান্তিতে ঘুমানোর জন্য এবং আল্লাহর সুরক্ষার জন্য।",
      timing: "রাতে ঘুমানোর আগে"
    },
    {
      id: "bathroom",
      title: "টয়লেটে যাওয়ার দোয়া",
      arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",
      pronunciation: "আল্লাহুম্মা ইন্নি আউযু বিকা মিনাল খুবুসি ওয়াল খাবাইস",
      bengali: "হে আল্লাহ! আমি আপনার কাছে আশ্রয় চাইছি পুরুষ ও মহিলা জিন থেকে।",
      reference: "সহীহ বুখারি ও মুসলিম",
      benefits: "টয়লেটে যাওয়ার সময় শয়তান থেকে সুরক্ষার জন্য।",
      timing: "টয়লেটে যাওয়ার আগে"
    },
    {
      id: "bathroom-exit",
      title: "টয়লেট থেকে বের হওয়ার দোয়া",
      arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَذْهَبَ عَنِّي الْأَذَى وَعَافَانِي",
      pronunciation: "আলহামদু লিল্লাহিল্লাজি আযহাবা আন্নিল আযা ওয়া আফানি",
      bengali: "সকল প্রশংসা আল্লাহর জন্য, যিনি আমার কষ্ট দূর করেছেন এবং আমাকে সুস্থ করেছেন।",
      reference: "ইবনে মাজাহ",
      benefits: "টয়লেট থেকে বের হওয়ার পর শুকরিয়া আদায়ের জন্য।",
      timing: "টয়লেট থেকে বের হওয়ার পর"
    },
    {
      id: "clothing",
      title: "কাপড় পরার দোয়া",
      arabic: "الْحَمْدُ لِلَّهِ الَّذِي كَسَانِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
      pronunciation: "আলহামদু লিল্লাহিল্লাজি কাসানি হাজা ওয়া রাজাকানিহি মিন গাইরি হাউলিন মিন্নি ওয়ালা কুওয়াতিন",
      bengali: "সকল প্রশংসা আল্লাহর জন্য, যিনি আমাকে এ কাপড় পরিয়েছেন এবং আমার কোন ক্ষমতা ছাড়াই এটা দান করেছেন।",
      reference: "আবু দাউদ, তিরমিজি",
      benefits: "কাপড় পরার সময় আল্লাহর শুকরিয়া আদায়ের জন্য।",
      timing: "কাপড় পরার সময়"
    },
    {
      id: "mirror",
      title: "আয়নায় দেখার দোয়া",
      arabic: "اللَّهُمَّ كَمَا حَسَّنْتَ خَلْقِي فَحَسِّنْ خُلُقِي",
      pronunciation: "আল্লাহুম্মা কামা হাসসানতা খালকি ফাহাসসিন খুলুকি",
      bengali: "হে আল্লাহ! যেমন আপনি আমার সৃষ্টি সুন্দর করেছেন, তেমনি আমার চরিত্রও সুন্দর করুন।",
      reference: "আহমাদ",
      benefits: "আয়নায় দেখার সময় সুন্দর চরিত্রের জন্য দোয়া।",
      timing: "আয়নায় দেখার সময়"
    },
    {
      id: "house-exit",
      title: "বাড়ি থেকে বের হওয়ার দোয়া",
      arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
      pronunciation: "বিসমিল্লাহি তাওয়াক্কালতু আলাল্লাহি ওয়ালা হাউলা ওয়ালা কুওয়াতা ইল্লা বিল্লাহ",
      bengali: "আল্লাহর নামে, আমি আল্লাহর উপর ভরসা করছি এবং আল্লাহ ছাড়া কোন ক্ষমতা নেই।",
      reference: "আবু দাউদ, তিরমিজি",
      benefits: "বাড়ি থেকে বের হওয়ার সময় নিরাপত্তার জন্য।",
      timing: "বাড়ি থেকে বের হওয়ার সময়"
    },
    {
      id: "house-enter",
      title: "বাড়িতে প্রবেশের দোয়া",
      arabic: "بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا",
      pronunciation: "বিসমিল্লাহি ওয়ালাজনা ওয়া বিসমিল্লাহি খারাজনা ওয়া আলাল্লাহি রাব্বিনা তাওয়াক্কালনা",
      bengali: "আল্লাহর নামে আমরা প্রবেশ করছি এবং আল্লাহর নামে বের হচ্ছি এবং আমাদের পালনকর্তা আল্লাহর উপর ভরসা করছি।",
      reference: "আবু দাউদ",
      benefits: "বাড়িতে প্রবেশের সময় বরকতের জন্য।",
      timing: "বাড়িতে প্রবেশের সময়"
    },
    {
      id: "mosque-enter",
      title: "মসজিদে প্রবেশের দোয়া",
      arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
      pronunciation: "আল্লাহুম্মাফতাহ লি আবওয়াবা রাহমাতিক",
      bengali: "হে আল্লাহ! আমার জন্য আপনার রহমতের দরজা খুলে দিন।",
      reference: "সহীহ মুসলিম",
      benefits: "মসজিদে প্রবেশের সময় আল্লাহর রহমত লাভের জন্য।",
      timing: "মসজিদে প্রবেশের সময়"
    },
    {
      id: "mosque-exit",
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

  const shareDua = (dua: DailyDua) => {
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

  const addToFavorites = (dua: DailyDua) => {
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
            <h1 className="text-xl sm:text-2xl font-bold text-pink-600">দৈনন্দিন দোয়া</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Category Info */}
        <Card className="mb-6 sm:mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <CardContent className="p-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-4">দৈনন্দিন দোয়া সমূহ</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              প্রতিদিনের বিভিন্ন কাজের জন্য গুরুত্বপূর্ণ দোয়া সমূহ। এই দোয়া গুলো পড়লে দিনটি বরকতময় হয় এবং আল্লাহর সুরক্ষা লাভ হয়।
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-blue-100 text-blue-800">২৫ টি দোয়া</Badge>
              <Badge variant="outline" className="bg-green-100 text-green-800">সহীহ সূত্র</Badge>
              <Badge variant="outline" className="bg-purple-100 text-purple-800">দৈনন্দিন ব্যবহার</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Duas List */}
        <div className="space-y-4 sm:space-y-6">
          {dailyDuas.map((dua) => (
            <Card key={dua.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <CardTitle className="text-lg sm:text-xl text-blue-600">{dua.title}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="w-fit bg-blue-50 text-blue-700">
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