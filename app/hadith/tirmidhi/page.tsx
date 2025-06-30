"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ShareButton } from "@/components/share-button"
import { Scroll, Search, BookOpen, Heart, Share2, ChevronLeft, ChevronRight, Home, BookMarked, Loader2 } from "lucide-react"
import Link from "next/link"

interface Hadith {
  id: number
  bookNumber: string
  hadithNumber: string
  bookName: string
  chapterName: string
  arabic: string
  bengali: string
  narrator: string
  grade: string
  explanation: string
}

export default function TirmidhiPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [shareUrl, setShareUrl] = useState("")
  const [hadiths, setHadiths] = useState<Hadith[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [totalHadiths, setTotalHadiths] = useState(0)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(`${window.location.origin}/hadith/tirmidhi`);
    }
  }, []);

  useEffect(() => {
    fetchHadiths()
  }, [currentPage, searchTerm])

  const fetchHadiths = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '1',
        search: searchTerm
      })
      
      const response = await fetch(`/api/hadith/tirmidhi?${params}`)
      const data = await response.json()
      
      setHadiths(data.hadiths)
      setTotalPages(data.totalPages)
      setTotalHadiths(data.total)
    } catch (error) {
      console.error('Error fetching hadiths:', error)
    } finally {
      setLoading(false)
    }
  }

  const currentHadith = hadiths[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/hadith" className="flex items-center space-x-2">
              <ChevronLeft className="h-5 w-5" />
              <span>হাদিস সংকলন</span>
            </Link>
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-purple-600">সুনান তিরমিজি</h1>
              <ShareButton
                title="সুনান তিরমিজি"
                text="ইসলামিক গাইড অ্যাপে সুনান তিরমিজি পড়ুন।"
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
          <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-700 text-white">
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6" />
              <span>সুনান তিরমিজি - ইমাম তিরমিজি (রহ.)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">বইয়ের তথ্য</h3>
                <p className="text-sm text-gray-600">মোট হাদিস: ৩,৯৫৬</p>
                <p className="text-sm text-gray-600">মোট অধ্যায়: ৪৬</p>
                <p className="text-sm text-gray-600">সময়কাল: ৮২৪-৮৯২ খ্রি.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">বর্তমান অবস্থা</h3>
                <p className="text-sm text-gray-600">পৃষ্ঠা: {currentPage} / {totalPages}</p>
                <p className="text-sm text-gray-600">হাদিস নং: {currentHadith?.hadithNumber || '...'}</p>
                <p className="text-sm text-gray-600">অধ্যায়: {currentHadith?.chapterName || '...'}</p>
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

        {/* Loading State */}
        {loading && (
          <Card className="mb-8 shadow-lg">
            <CardContent className="p-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
              <p className="text-gray-600">হাদিস লোড হচ্ছে...</p>
            </CardContent>
          </Card>
        )}

        {/* Hadith Content */}
        {!loading && currentHadith && (
          <Card className="mb-8 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary" className="font-medium">হাদিস নং: {currentHadith.hadithNumber}</Badge>
                  <Badge variant="outline">{currentHadith.chapterName}</Badge>
                  <Badge variant="default">{currentHadith.grade}</Badge>
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
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-lg border-l-4 border-purple-500">
                <p className="text-right text-2xl font-arabic leading-loose text-purple-700 dark:text-purple-300">
                  {currentHadith.arabic}
                </p>
              </div>

              {/* Bengali Translation */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-l-4 border-pink-500">
                <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200">
                  {currentHadith.bengali}
                </p>
              </div>

              {/* Narrator */}
              <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <span className="font-medium">বর্ণনাকারী:</span>
                <span>{currentHadith.narrator}</span>
              </div>

              {/* Explanation */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border-l-4 border-yellow-500">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">ব্যাখ্যা:</h4>
                <p className="text-yellow-700 dark:text-yellow-300">{currentHadith.explanation}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1 || loading}
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
                disabled={currentPage === 1 || loading}
              >
                ১
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 10))}
                disabled={currentPage <= 10 || loading}
              >
                -১০
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 10))}
                disabled={currentPage >= totalPages - 10 || loading}
              >
                +১০
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || loading}
              >
                {totalPages}
              </Button>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages || loading}
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
              <Button variant="outline" onClick={() => setCurrentPage(1)} disabled={loading}>
                প্রথম হাদিস
              </Button>
              <Button variant="outline" onClick={() => setCurrentPage(100)} disabled={loading}>
                ১০০তম হাদিস
              </Button>
              <Button variant="outline" onClick={() => setCurrentPage(1000)} disabled={loading}>
                ১০০০তম হাদিস
              </Button>
              <Button variant="outline" onClick={() => setCurrentPage(totalPages)} disabled={loading}>
                শেষ হাদিস
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 