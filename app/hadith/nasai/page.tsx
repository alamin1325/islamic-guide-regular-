"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ShareButton } from "@/components/share-button"
import { Scroll, Search, BookOpen, Heart, Share2, ChevronLeft, ChevronRight, Home, BookMarked } from "lucide-react"
import Link from "next/link"

export default function NasaiPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [shareUrl, setShareUrl] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(`${window.location.origin}/hadith/nasai`);
    }
  }, []);

  // Sample hadiths from Nasai
  const hadiths = [
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
    }
  ]

  const totalPages = 80 // Total number of pages in Nasai
  const hadithsPerPage = 1

  const filteredHadiths = hadiths.filter(hadith =>
    hadith.arabic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hadith.bengali.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hadith.narrator.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const currentHadith = filteredHadiths[currentPage - 1] || hadiths[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/hadith" className="flex items-center space-x-2">
              <ChevronLeft className="h-5 w-5" />
              <span>হাদিস সংকলন</span>
            </Link>
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-pink-600">সহীহ নাসাঈ</h1>
              <ShareButton
                title="সহীহ নাসাঈ"
                text="ইসলামিক গাইড অ্যাপে সহীহ নাসাঈ পড়ুন।"
                url={shareUrl}
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

      <div className="container mx-auto px-4 py-8">
        {/* Book Info */}
        <Card className="mb-8 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-pink-500 to-pink-700 text-white">
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6" />
              <span>সহীহ নাসাঈ - ইমাম নাসাঈ (রহ.)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">বইয়ের তথ্য</h3>
                <p className="text-sm text-gray-600">মোট হাদিস: ৫,৭৬১</p>
                <p className="text-sm text-gray-600">মোট অধ্যায়: ৫১</p>
                <p className="text-sm text-gray-600">সময়কাল: ৮২৯-৯১৫ খ্রি.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">বর্তমান অবস্থা</h3>
                <p className="text-sm text-gray-600">পৃষ্ঠা: {currentPage} / {totalPages}</p>
                <p className="text-sm text-gray-600">হাদিস নং: {currentHadith?.hadithNumber}</p>
                <p className="text-sm text-gray-600">অধ্যায়: {currentHadith?.chapterName}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">সার্চ</h3>
                <Input
                  placeholder="হাদিস খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hadith Content */}
        <Card className="mb-8 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Badge variant="secondary" className="font-medium">হাদিস নং: {currentHadith?.hadithNumber}</Badge>
                <Badge variant="outline">{currentHadith?.chapterName}</Badge>
                <Badge variant="default">{currentHadith?.grade}</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4 mr-2" />
                  সংরক্ষণ
                </Button>
                <Button variant="ghost" size="sm">
                  <BookMarked className="h-4 w-4 mr-2" />
                  বুকমার্ক
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {/* Arabic Text */}
            <div className="bg-gradient-to-r from-pink-50 to-fuchsia-50 dark:from-pink-900/20 dark:to-fuchsia-900/20 p-6 rounded-lg border-l-4 border-pink-500">
              <p className="text-right text-2xl font-arabic leading-loose text-pink-700 dark:text-pink-300">
                {currentHadith?.arabic}
              </p>
            </div>

            {/* Bengali Translation */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-l-4 border-rose-500">
              <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200">
                {currentHadith?.bengali}
              </p>
            </div>

            {/* Narrator */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <span className="font-medium">বর্ণনাকারী:</span>
              <span>{currentHadith?.narrator}</span>
            </div>

            {/* Explanation */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border-l-4 border-yellow-500">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">ব্যাখ্যা:</h4>
              <p className="text-yellow-700 dark:text-yellow-300">{currentHadith?.explanation}</p>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            আগের হাদিস
          </Button>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              পৃষ্ঠা {currentPage} / {totalPages}
            </span>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                ১
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 10))}
                disabled={currentPage <= 10}
              >
                -১০
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 10))}
                disabled={currentPage >= totalPages - 10}
              >
                +১০
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                {totalPages}
              </Button>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            পরের হাদিস
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Quick Navigation */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>দ্রুত নেভিগেশন</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" onClick={() => setCurrentPage(1)}>
                প্রথম হাদিস
              </Button>
              <Button variant="outline" onClick={() => setCurrentPage(100)}>
                ১০০তম হাদিস
              </Button>
              <Button variant="outline" onClick={() => setCurrentPage(1000)}>
                ১০০০তম হাদিস
              </Button>
              <Button variant="outline" onClick={() => setCurrentPage(totalPages)}>
                শেষ হাদিস
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 