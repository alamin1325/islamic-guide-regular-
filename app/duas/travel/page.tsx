"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Volume2, Copy, Share2, BookOpen, ArrowLeft } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

interface TravelDua {
  id: string
  title: string
  arabic: string
  pronunciation: string
  bengali: string
  reference: string
  benefits: string
  timing: string
}

export default function TravelDuasPage() {
  const [toastMessage, setToastMessage] = useState("")
  const [showToast, setShowToast] = useState(false)

  const travelDuas: TravelDua[] = [
    {
      id: "travel-start",
      title: "সফর শুরু করার দোয়া",
      arabic: "اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى وَمِنَ الْعَمَلِ مَا تَرْضَى، اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا وَاطْوِ عَنَّا بُعْدَهُ، اللَّهُمَّ أَنْتَ الصَّاحِبُ فِي السَّفَرِ وَالْخَلِيفَةُ فِي الْأَهْلِ",
      pronunciation: "আল্লাহুম্মা ইন্না নাসআলুকা ফি সাফারিনা হাজাল বিররা ওয়াত-তাকওয়া ওয়া মিনাল আমালি মা তারদা। আল্লাহুম্মা হাওয়িন আলাইনা সাফারানা হাজা ওয়াত্বু আন্না বু'দাহু। আল্লাহুম্মা আনতাস-সাহিবু ফিস-সাফারি ওয়াল-খালীফাতু ফিল-আহলি",
      bengali: "হে আল্লাহ! আমরা আমাদের এ সফরে আপনার কাছে সৎকর্ম ও তাকওয়া এবং আপনার সন্তুষ্টির কাজ চাইছি। হে আল্লাহ! আমাদের এ সফর সহজ করে দিন এবং এর দূরত্ব সংকুচিত করে দিন। হে আল্লাহ! আপনি সফরে সাথী এবং পরিবারে প্রতিনিধি।",
      reference: "সহীহ মুসলিম",
      benefits: "সফর শুরু করার সময় নিরাপত্তা ও বরকতের জন্য।",
      timing: "সফর শুরু করার সময়"
    },
    {
      id: "vehicle-enter",
      title: "যানবাহনে উঠার দোয়া",
      arabic: "بِسْمِ اللَّهِ",
      pronunciation: "বিসমিল্লাহ",
      bengali: "আল্লাহর নামে",
      reference: "সহীহ বুখারি ও মুসলিম",
      benefits: "যানবাহনে উঠার সময় আল্লাহর নাম নেওয়ার জন্য।",
      timing: "যানবাহনে উঠার সময়"
    },
    {
      id: "vehicle-exit",
      title: "যানবাহন থেকে নামার দোয়া",
      arabic: "الْحَمْدُ لِلَّهِ",
      pronunciation: "আলহামদু লিল্লাহ",
      bengali: "সকল প্রশংসা আল্লাহর জন্য",
      reference: "সহীহ বুখারি ও মুসলিম",
      benefits: "যানবাহন থেকে নামার পর শুকরিয়া আদায়ের জন্য।",
      timing: "যানবাহন থেকে নামার পর"
    },
    {
      id: "mountain-pass",
      title: "পাহাড়ে উঠার দোয়া",
      arabic: "اللَّهُ أَكْبَرُ",
      pronunciation: "আল্লাহু আকবার",
      bengali: "আল্লাহ মহান",
      reference: "সহীহ বুখারি ও মুসলিম",
      benefits: "পাহাড়ে উঠার সময় আল্লাহর মহত্ত্বের প্রশংসা করার জন্য।",
      timing: "পাহাড়ে উঠার সময়"
    },
    {
      id: "valley-enter",
      title: "উপত্যকায় প্রবেশের দোয়া",
      arabic: "سُبْحَانَ اللَّهِ",
      pronunciation: "সুবহানাল্লাহ",
      bengali: "আল্লাহ পবিত্র",
      reference: "সহীহ বুখারি ও মুসলিম",
      benefits: "উপত্যকায় প্রবেশের সময় আল্লাহর পবিত্রতার প্রশংসা করার জন্য।",
      timing: "উপত্যকায় প্রবেশের সময়"
    },
    {
      id: "night-travel",
      title: "রাতে সফরের দোয়া",
      arabic: "يَا أَرْضُ رَبِّي وَرَبُّكِ اللَّهُ، أَعُوذُ بِاللَّهِ مِنْ شَرِّكِ وَشَرِّ مَا فِيكِ وَشَرِّ مَا خُلِقَ فِيكِ وَشَرِّ مَا يَدُبُّ عَلَيْكِ، أَعُوذُ بِاللَّهِ مِنْ أَسَدٍ وَأُسُودٍ وَالْحَيَّاتِ وَالْعَقَارِبِ وَمِنْ سَاكِنِ الْبَلَدِ وَمِنْ وَالِدٍ وَمَا وَلَدَ",
      pronunciation: "ইয়া আরদু রাব্বি ওয়া রাব্বুকিল্লাহু, আউযু বিল্লাহি মিন শাররিকি ওয়া শাররি মা ফীকি ওয়া শাররি মা খুলিকা ফীকি ওয়া শাররি মা ইয়াদুব্বু আলাইকি। আউযু বিল্লাহি মিন আসাদিন ওয়া উসুদিন ওয়াল-হাইয়াতি ওয়াল-আকারিবি ওয়া মিন সাকিনিল-বালাদি ওয়া মিন ওয়ালিদিন ওয়া মা ওয়ালাদ",
      bengali: "হে ভূমি! আমার পালনকর্তা ও আপনার পালনকর্তা আল্লাহ। আমি আপনার ক্ষতি, আপনার মধ্যে যা আছে তার ক্ষতি, আপনার মধ্যে যা সৃষ্টি হয়েছে তার ক্ষতি এবং আপনার উপর যা চলাচল করে তার ক্ষতি থেকে আল্লাহর কাছে আশ্রয় চাইছি। আমি সিংহ, সাপ, বিচ্ছু, শহরের বাসিন্দা এবং পিতা-মাতা ও সন্তান থেকে আল্লাহর কাছে আশ্রয় চাইছি।",
      reference: "আবু দাউদ",
      benefits: "রাতে সফরের সময় বিপদ থেকে সুরক্ষার জন্য।",
      timing: "রাতে সফরের সময়"
    },
    {
      id: "return-travel",
      title: "সফর থেকে ফিরে আসার দোয়া",
      arabic: "آيِبُونَ تَائِبُونَ عَابِدُونَ لِرَبِّنَا حَامِدُونَ",
      pronunciation: "আয়িবুনা তা'ইবুনা আবিদুনা লি-রাব্বিনা হামিদুনা",
      bengali: "আমরা ফিরে আসছি, তাওবা করছি, ইবাদত করছি এবং আমাদের পালনকর্তার প্রশংসা করছি।",
      reference: "সহীহ মুসলিম",
      benefits: "সফর থেকে ফিরে আসার সময় শুকরিয়া আদায়ের জন্য।",
      timing: "সফর থেকে ফিরে আসার সময়"
    },
    {
      id: "home-return",
      title: "বাড়িতে ফিরে আসার দোয়া",
      arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَهَا وَخَيْرَ مَا جُبِلَتْ عَلَيْهِ، وَأَعُوذُ بِكَ مِنْ شَرِّهَا وَشَرِّ مَا جُبِلَتْ عَلَيْهِ",
      pronunciation: "আল্লাহুম্মা ইন্নি আসআলুকা খাইরাহা ওয়া খাইরা মা জুবিলাত আলাইহা, ওয়া আউযু বিকা মিন শাররিহা ওয়া শাররি মা জুবিলাত আলাইহা",
      bengali: "হে আল্লাহ! আমি আপনার কাছে এ শহরের কল্যাণ এবং এ শহরে যা সৃষ্টি করা হয়েছে তার কল্যাণ চাইছি। আমি আপনার কাছে এ শহরের ক্ষতি এবং এ শহরে যা সৃষ্টি করা হয়েছে তার ক্ষতি থেকে আশ্রয় চাইছি।",
      reference: "সহীহ মুসলিম",
      benefits: "বাড়িতে ফিরে আসার সময় কল্যাণের জন্য দোয়া।",
      timing: "বাড়িতে ফিরে আসার সময়"
    },
    {
      id: "sea-travel",
      title: "সমুদ্রে সফরের দোয়া",
      arabic: "اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى وَمِنَ الْعَمَلِ مَا تَرْضَى، اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا وَاطْوِ عَنَّا بُعْدَهُ، اللَّهُمَّ أَنْتَ الصَّاحِبُ فِي السَّفَرِ وَالْخَلِيفَةُ فِي الْأَهْلِ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ وَعْثَاءِ السَّفَرِ وَكَآبَةِ الْمَنْظَرِ وَسُوءِ الْمُنْقَلَبِ فِي الْمَالِ وَالْأَهْلِ",
      pronunciation: "আল্লাহুম্মা ইন্না নাসআলুকা ফি সাফারিনা হাজাল বিররা ওয়াত-তাকওয়া ওয়া মিনাল আমালি মা তারদা। আল্লাহুম্মা হাওয়িন আলাইনা সাফারানা হাজা ওয়াত্বু আন্না বু'দাহু। আল্লাহুম্মা আনতাস-সাহিবু ফিস-সাফারি ওয়াল-খালীফাতু ফিল-আহলি। আল্লাহুম্মা ইন্নি আউযু বিকা মিন ওয়া'সায়িস-সাফারি ওয়া কা'আবাতিল-মানযারি ওয়া সু'ইল-মুনকালাবি ফিল-মালি ওয়াল-আহলি",
      bengali: "হে আল্লাহ! আমরা আমাদের এ সফরে আপনার কাছে সৎকর্ম ও তাকওয়া এবং আপনার সন্তুষ্টির কাজ চাইছি। হে আল্লাহ! আমাদের এ সফর সহজ করে দিন এবং এর দূরত্ব সংকুচিত করে দিন। হে আল্লাহ! আপনি সফরে সাথী এবং পরিবারে প্রতিনিধি। হে আল্লাহ! আমি আপনার কাছে সফরের কষ্ট, দুঃখজনক দৃশ্য এবং সম্পদ ও পরিবারে খারাপ প্রত্যাবর্তন থেকে আশ্রয় চাইছি।",
      reference: "সহীহ মুসলিম",
      benefits: "সমুদ্রে সফরের সময় নিরাপত্তা ও কল্যাণের জন্য।",
      timing: "সমুদ্রে সফরের সময়"
    },
    {
      id: "air-travel",
      title: "বিমানে সফরের দোয়া",
      arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
      pronunciation: "বিসমিল্লাহি তাওয়াক্কালতু আলাল্লাহি ওয়ালা হাউলা ওয়ালা কুওয়াতা ইল্লা বিল্লাহ",
      bengali: "আল্লাহর নামে, আমি আল্লাহর উপর ভরসা করছি এবং আল্লাহ ছাড়া কোন ক্ষমতা নেই।",
      reference: "আবু দাউদ, তিরমিজি",
      benefits: "বিমানে সফরের সময় নিরাপত্তার জন্য।",
      timing: "বিমানে সফরের সময়"
    },
    {
      id: "travel-protection",
      title: "সফরের সুরক্ষার দোয়া",
      arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ الَّتِي لَا يُجَاوِزُهُنَّ بَرٌّ وَلَا فَاجِرٌ",
      pronunciation: "আউযু বিকালিমাতিল্লাহিত-তাম্মাতিল্লাতি লা ইয়ুজাউইজুহুন্না বাররুন ওয়ালা ফাজিরুন",
      bengali: "আমি আল্লাহর পরিপূর্ণ বাক্যগুলোর কাছে আশ্রয় চাইছি, যেগুলো কোন সৎ বা অসৎ ব্যক্তি অতিক্রম করতে পারে না।",
      reference: "সহীহ মুসলিম",
      benefits: "সফরের সময় সর্বপ্রকার বিপদ থেকে সুরক্ষার জন্য।",
      timing: "সফরের সময়"
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

  const shareDua = (dua: TravelDua) => {
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

  const addToFavorites = (dua: TravelDua) => {
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
            <h1 className="text-xl sm:text-2xl font-bold text-pink-600">সফরের দোয়া</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Category Info */}
        <Card className="mb-6 sm:mb-8 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
          <CardContent className="p-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-purple-600 mb-4">সফরের দোয়া সমূহ</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              সফরের বিভিন্ন সময়ে পড়া হয় এমন গুরুত্বপূর্ণ দোয়া সমূহ। এই দোয়া গুলো সফরে নিরাপত্তা ও বরকত আনে।
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-purple-100 text-purple-800">১২ টি দোয়া</Badge>
              <Badge variant="outline" className="bg-indigo-100 text-indigo-800">সফরের সময়</Badge>
              <Badge variant="outline" className="bg-blue-100 text-blue-800">নিরাপত্তার জন্য</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Duas List */}
        <div className="space-y-4 sm:space-y-6">
          {travelDuas.map((dua) => (
            <Card key={dua.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <CardTitle className="text-lg sm:text-xl text-purple-600">{dua.title}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="w-fit bg-purple-50 text-purple-700">
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
                  <h4 className="font-semibold mb-2 text-purple-600 text-sm sm:text-base">অর্থ:</h4>
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