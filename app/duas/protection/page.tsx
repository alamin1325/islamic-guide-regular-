"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Volume2, Copy, Share2, BookOpen, ArrowLeft } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

interface ProtectionDua {
  id: string
  title: string
  arabic: string
  pronunciation: string
  bengali: string
  reference: string
  benefits: string
  timing: string
}

export default function ProtectionDuasPage() {
  const [toastMessage, setToastMessage] = useState("")
  const [showToast, setShowToast] = useState(false)

  const protectionDuas: ProtectionDua[] = [
    {
      id: "ayatul-kursi",
      title: "আয়াতুল কুরসী",
      arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
      pronunciation: "আল্লাহু লা ইলাহা ইল্লা হুয়াল-হাইয়ুল-কাইয়ুম। লা তা'খুযুহু সিনাতুং ওয়ালা নাউম। লাহু মা ফিস-সামাওয়াতি ওয়া মা ফিল-আরদি। মান যাল্লাজি ইয়াশফাউ ইন্দাহু ইল্লা বি-ইজনিহি। ইয়া'লামু মা বাইনা আইদীহিম ওয়া মা খালফাহুম। ওয়া লা ইউহীতুনা বিশাইয়িম-মিন ইলমিহি ইল্লা বিমা শাআ। ওয়াসিয়া কুরসিয়্যুহুস-সামাওয়াতি ওয়াল-আরদা। ওয়া লা ইয়াউদুহু হিফযুহুমা। ওয়া হুয়াল-আলিয়্যুল-আযীম।",
      bengali: "আল্লাহ - তিনি ছাড়া কোন ইলাহ নেই, তিনি চিরঞ্জীব, সবকিছুর ধারক। তাঁকে তন্দ্রাও স্পর্শ করে না, নিদ্রাও নয়। আকাশমণ্ডলী ও পৃথিবীতে যা কিছু আছে সবই তাঁর। কে এমন আছে যে তাঁর অনুমতি ছাড়া তাঁর কাছে সুপারিশ করবে? তিনি জানেন তাদের সামনে ও পিছনে যা কিছু আছে। তারা তাঁর জ্ঞানের কোন কিছুকেই পরিবেষ্টন করতে পারে না, যা তিনি চান তা ছাড়া। তাঁর কুরসী আকাশমণ্ডলী ও পৃথিবী পরিবেষ্টন করে আছে। আর সেগুলোকে ধারণ করা তাঁকে ক্লান্ত করে না। তিনি সর্বোচ্চ, সর্বশ্রেষ্ঠ।",
      reference: "সূরা আল-বাকারা, আয়াত ২৫৫",
      benefits: "এই আয়াত পড়লে আল্লাহর সুরক্ষা লাভ হয় এবং শয়তান থেকে রক্ষা পাওয়া যায়।",
      timing: "সকাল-সন্ধ্যা, ঘুমানোর আগে"
    },
    {
      id: "muawwidhatayn",
      title: "মুআওয়িজাতাইন (সূরা ফালাক ও নাস)",
      arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ﴿١﴾ مِن شَرِّ مَا خَلَقَ ﴿٢﴾ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ﴿٣﴾ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ﴿৪﴾ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ ﴿৫﴾",
      pronunciation: "কুল আউযু বিরাব্বিল-ফালাক। মিন শাররি মা খালাক। ওয়া মিন শাররি গাসিকিন ইযা ওয়াকাব। ওয়া মিন শাররিন-নাফফাসাতি ফিল-উকাদ। ওয়া মিন শাররি হাসিদিন ইযা হাসাদ।",
      bengali: "বলুন, আমি আশ্রয় নিচ্ছি প্রভাতের পালনকর্তার। তাঁর সৃষ্টির অনিষ্ট থেকে। অন্ধকারের অনিষ্ট থেকে যখন তা সমাচ্ছন্ন হয়। গ্রন্থিতে ফুঁৎকার দেয়াদের অনিষ্ট থেকে। হিংসুকের অনিষ্ট থেকে যখন সে হিংসা করে।",
      reference: "সূরা আল-ফালাক",
      benefits: "এই সূরা পড়লে সকল প্রকার অনিষ্ট থেকে সুরক্ষা লাভ হয়।",
      timing: "সকাল-সন্ধ্যা, বিপদ থেকে সুরক্ষার জন্য"
    },
    {
      id: "surah-nas",
      title: "সূরা আন-নাস",
      arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ ﴿١﴾ مَلِكِ النَّاسِ ﴿٢﴾ إِلَٰهِ النَّاسِ ﴿٣﴾ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ﴿৪﴾ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ﴿৫﴾ مِنَ الْجِنَّةِ وَالنَّاسِ ﴿৬﴾",
      pronunciation: "কুল আউযু বিরাব্বিন-নাস। মালিকিন-নাস। ইলাহিন-নাস। মিন শাররিল-ওয়াসওয়াসিল-খান্নাস। আল্লাজি ইউওয়াসউইসু ফি সুদুরিন-নাস। মিনাল-জিন্নাতি ওয়ান-নাস।",
      bengali: "বলুন, আমি আশ্রয় নিচ্ছি মানুষের পালনকর্তার। মানুষের অধিপতির। মানুষের ইলাহের। কুমন্ত্রণাদাতার অনিষ্ট থেকে যে অন্তরে কুমন্ত্রণা দেয়। জিন ও মানুষের মধ্য থেকে।",
      reference: "সূরা আন-নাস",
      benefits: "এই সূরা পড়লে শয়তানের কুমন্ত্রণা থেকে সুরক্ষা লাভ হয়।",
      timing: "সকাল-সন্ধ্যা, শয়তানের কুমন্ত্রণা থেকে সুরক্ষার জন্য"
    },
    {
      id: "istighfar",
      title: "ইস্তিগফার",
      arabic: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ",
      pronunciation: "আসতাগফিরুল্লাহাল-আযীমাল্লাজি লা ইলাহা ইল্লা হুয়াল-হাইয়ুল-কাইয়ুমু ওয়া আতুবু ইলাইহি",
      bengali: "আমি মহান আল্লাহর কাছে ক্ষমা চাইছি, যিনি ছাড়া কোন ইলাহ নেই, তিনি চিরঞ্জীব, সবকিছুর ধারক এবং আমি তাঁর কাছে তাওবা করছি।",
      reference: "আবু দাউদ, তিরমিজি",
      benefits: "এই দোয়া পড়লে গুনাহ মাফ হয় এবং আল্লাহর সুরক্ষা লাভ হয়।",
      timing: "সকাল-সন্ধ্যা, গুনাহ থেকে ক্ষমা চাওয়ার জন্য"
    },
    {
      id: "protection-morning",
      title: "সকালের সুরক্ষার দোয়া",
      arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ",
      pronunciation: "আসবাহনা ওয়া আসবাহাল-মুলকু লিল্লাহি, ওয়াল-হামদু লিল্লাহি, লা ইলাহা ইল্লাল্লাহু ওয়াহদাহু লা শারীকা লাহু, লাহুল-মুলকু ওয়া লাহুল-হামদু ওয়া হুয়া আলা কুল্লি শাইয়িন কাদীর। রাব্বি আসআলুকা খাইরা মা ফি হাজাল-ইয়াওমি ওয়া খাইরা মা বাদাহু, ওয়া আউযু বিকা মিন শাররি মা ফি হাজাল-ইয়াওমি ওয়া শাররি মা বাদাহু। রাব্বি আউযু বিকা মিনাল-কাসালি ওয়া সুইল-কিবার। রাব্বি আউযু বিকা মিন আযাবিন ফিন-নারি ওয়া আযাবিন ফিল-কাবর।",
      bengali: "আমরা সকালে পৌঁছেছি এবং রাজত্ব আল্লাহর জন্য। সকল প্রশংসা আল্লাহর জন্য। আল্লাহ ছাড়া কোন ইলাহ নেই, তিনি একক, তাঁর কোন শরীক নেই। রাজত্ব তাঁর এবং প্রশংসা তাঁর এবং তিনি সবকিছুর উপর ক্ষমতাবান। হে আমার পালনকর্তা! আমি আপনার কাছে এ দিনের কল্যাণ এবং এর পরের কল্যাণ চাইছি। আমি আপনার কাছে এ দিনের ক্ষতি এবং এর পরের ক্ষতি থেকে আশ্রয় চাইছি। হে আমার পালনকর্তা! আমি আপনার কাছে অলসতা ও বৃদ্ধ বয়সের কষ্ট থেকে আশ্রয় চাইছি। হে আমার পালনকর্তা! আমি আপনার কাছে জাহান্নামের শাস্তি ও কবরের শাস্তি থেকে আশ্রয় চাইছি।",
      reference: "সহীহ মুসলিম",
      benefits: "সকালে এই দোয়া পড়লে সারা দিনের সুরক্ষা লাভ হয়।",
      timing: "সকালে উঠার পর"
    },
    {
      id: "protection-evening",
      title: "সন্ধ্যার সুরক্ষার দোয়া",
      arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ",
      pronunciation: "আমসাইনা ওয়া আমসাল-মুলকু লিল্লাহি, ওয়াল-হামদু লিল্লাহি, লা ইলাহা ইল্লাল্লাহু ওয়াহদাহু লা শারীকা লাহু, লাহুল-মুলকু ওয়া লাহুল-হামদু ওয়া হুয়া আলা কুল্লি শাইয়িন কাদীর। রাব্বি আসআলুকা খাইরা মা ফি হাজিহিল-লাইলাতি ওয়া খাইরা মা বাদাহা, ওয়া আউযু বিকা মিন শাররি মা ফি হাজিহিল-লাইলাতি ওয়া শাররি মা বাদাহা। রাব্বি আউযু বিকা মিনাল-কাসালি ওয়া সুইল-কিবার। রাব্বি আউযু বিকা মিন আযাবিন ফিন-নারি ওয়া আযাবিন ফিল-কাবর।",
      bengali: "আমরা সন্ধ্যায় পৌঁছেছি এবং রাজত্ব আল্লাহর জন্য। সকল প্রশংসা আল্লাহর জন্য। আল্লাহ ছাড়া কোন ইলাহ নেই, তিনি একক, তাঁর কোন শরীক নেই। রাজত্ব তাঁর এবং প্রশংসা তাঁর এবং তিনি সবকিছুর উপর ক্ষমতাবান। হে আমার পালনকর্তা! আমি আপনার কাছে এ রাতের কল্যাণ এবং এর পরের কল্যাণ চাইছি। আমি আপনার কাছে এ রাতের ক্ষতি এবং এর পরের ক্ষতি থেকে আশ্রয় চাইছি। হে আমার পালনকর্তা! আমি আপনার কাছে অলসতা ও বৃদ্ধ বয়সের কষ্ট থেকে আশ্রয় চাইছি। হে আমার পালনকর্তা! আমি আপনার কাছে জাহান্নামের শাস্তি ও কবরের শাস্তি থেকে আশ্রয় চাইছি।",
      reference: "সহীহ মুসলিম",
      benefits: "সন্ধ্যায় এই দোয়া পড়লে সারা রাতের সুরক্ষা লাভ হয়।",
      timing: "সন্ধ্যায়"
    },
    {
      id: "house-protection",
      title: "বাড়ির সুরক্ষার দোয়া",
      arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ الَّتِي لَا يُجَاوِزُهُنَّ بَرٌّ وَلَا فَاجِرٌ",
      pronunciation: "আউযু বিকালিমাতিল্লাহিত-তাম্মাতিল্লাতি লা ইয়ুজাউইজুহুন্না বাররুন ওয়ালা ফাজিরুন",
      bengali: "আমি আল্লাহর পরিপূর্ণ বাক্যগুলোর কাছে আশ্রয় চাইছি, যেগুলো কোন সৎ বা অসৎ ব্যক্তি অতিক্রম করতে পারে না।",
      reference: "সহীহ মুসলিম",
      benefits: "বাড়িতে প্রবেশের সময় এই দোয়া পড়লে বাড়ি সুরক্ষিত থাকে।",
      timing: "বাড়িতে প্রবেশের সময়"
    },
    {
      id: "sleep-protection",
      title: "ঘুমের সুরক্ষার দোয়া",
      arabic: "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ",
      pronunciation: "বিসমিকা রাব্বি ওয়াদাআতু জানবী, ওয়া বিকা আরফাউহু, ফাঈন আমসাকতা নাফসি ফারহামহা, ওয়া ইন আরসালতাহা ফাহফাজহা বিমা তাহফাজু বিহি ইবাদাকাস-সালিহীন।",
      bengali: "হে আমার পালনকর্তা! আপনার নামে আমি আমার পাশ ফেলছি এবং আপনার নামেই আমি তা উঠাব। যদি আপনি আমার প্রাণ ধারণ করেন তবে তাকে রহম করুন এবং যদি আপনি তা ছেড়ে দেন তবে আপনার সৎ বান্দাদের যেভাবে রক্ষা করেন সেভাবে তাকে রক্ষা করুন।",
      reference: "সহীহ বুখারি ও মুসলিম",
      benefits: "ঘুমানোর আগে এই দোয়া পড়লে রাতের সুরক্ষা লাভ হয়।",
      timing: "ঘুমানোর আগে"
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

  const shareDua = (dua: ProtectionDua) => {
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

  const addToFavorites = (dua: ProtectionDua) => {
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
            <h1 className="text-xl sm:text-2xl font-bold text-pink-600">সুরক্ষার দোয়া</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Category Info */}
        <Card className="mb-6 sm:mb-8 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20">
          <CardContent className="p-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-red-600 mb-4">সুরক্ষার দোয়া সমূহ</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              বিভিন্ন বিপদ ও অনিষ্ট থেকে সুরক্ষার জন্য গুরুত্বপূর্ণ দোয়া সমূহ। এই দোয়া গুলো পড়লে আল্লাহর সুরক্ষা লাভ হয়।
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-red-100 text-red-800">১৮ টি দোয়া</Badge>
              <Badge variant="outline" className="bg-pink-100 text-pink-800">সুরক্ষার জন্য</Badge>
              <Badge variant="outline" className="bg-purple-100 text-purple-800">বিপদ থেকে রক্ষা</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Duas List */}
        <div className="space-y-4 sm:space-y-6">
          {protectionDuas.map((dua) => (
            <Card key={dua.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <CardTitle className="text-lg sm:text-xl text-red-600">{dua.title}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="w-fit bg-red-50 text-red-700">
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
                  <h4 className="font-semibold mb-2 text-red-600 text-sm sm:text-base">অর্থ:</h4>
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