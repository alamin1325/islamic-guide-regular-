"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  BookOpen, 
  Search, 
  Share2, 
  Filter,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Volume2,
  Eye,
  Calendar,
  User,
  Star,
  Heart,
  BookMarked,
  Loader2
} from "lucide-react"
import { ShareButton } from "@/components/share-button"
import Link from "next/link"

interface Hadith {
  id: string
  hadithNumber: string
  arabic: string
  bengali: string
  english: string
  narrator: string
  grade: string
  category: string
  explanation: string
}

interface BookInfo {
  id: string
  title: string
  author: string
  totalHadith: number
  totalChapters: number
  period: string
  description: string
}

export default function BukhariPage() {
  const [hadiths, setHadiths] = useState<Hadith[]>([])
  const [bookInfo, setBookInfo] = useState<BookInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [shareUrl, setShareUrl] = useState("")

  useEffect(() => {
    // Set share URL only on client side
    setShareUrl(`${window.location.origin}/hadith/bukhari`);
  }, [])

  useEffect(() => {
    const fetchHadiths = async () => {
      try {
        const response = await fetch(`/api/hadith/bukhari/1?page=${currentPage}&limit=20&search=${searchTerm}`)
        if (response.ok) {
          const data = await response.json()
          setHadiths(data.hadiths || [])
          setBookInfo(data.bookInfo)
          setTotalPages(data.pagination?.totalPages || 1)
        }
      } catch (error) {
        console.error('Error fetching hadiths:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHadiths()
  }, [currentPage, searchTerm])

  const handleSearch = () => {
    setCurrentPage(1)
  }

  const clearSearch = () => {
    setSearchTerm("")
    setCurrentPage(1)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
                <BookOpen className="h-8 w-8 text-green-600" />
                <span>সহীহ বুখারি</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {bookInfo?.description || "ইসলামের সবচেয়ে নির্ভরযোগ্য হাদিস সংকলন"}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{bookInfo?.totalHadith || hadiths.length}</div>
                <div className="text-sm text-gray-500">হাদিস</div>
              </div>
              <ShareButton
                title="সহীহ বুখারি"
                text="ইসলামিক গাইড অ্যাপে সহীহ বুখারি পড়ুন। সব হাদিস বাংলা অনুবাদসহ।"
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
          <CardHeader className="bg-gradient-to-r from-green-500 to-green-700 text-white">
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6" />
              <span>সহীহ বুখারি - ইমাম বুখারি (রহ.)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">বইয়ের তথ্য</h3>
                <p className="text-sm text-gray-600">মোট হাদিস: {bookInfo?.totalHadith || hadiths.length}</p>
                <p className="text-sm text-gray-600">মোট অধ্যায়: {bookInfo?.totalChapters || 0}</p>
                <p className="text-sm text-gray-600">সময়কাল: {bookInfo?.period || '...'}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">বর্তমান অবস্থা</h3>
                <p className="text-sm text-gray-600">পৃষ্ঠা: {currentPage} / {totalPages}</p>
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
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
              <p className="text-gray-600">হাদিস লোড হচ্ছে...</p>
            </CardContent>
          </Card>
        )}

        {/* Hadith Content */}
        {!loading && hadiths.length > 0 && (
          <Card className="mb-8 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary" className="font-medium">হাদিস নং: {hadiths[0].hadithNumber}</Badge>
                  <Badge variant="outline">{hadiths[0].category}</Badge>
                  <Badge variant="default">{hadiths[0].grade}</Badge>
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
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg border-l-4 border-green-500">
                <p className="text-right text-2xl font-arabic leading-loose text-green-700 dark:text-green-300">
                  {hadiths[0].arabic}
                </p>
              </div>

              {/* Bengali Translation */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-l-4 border-blue-500">
                <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200">
                  {hadiths[0].bengali}
                </p>
              </div>

              {/* Narrator */}
              <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <span className="font-medium">বর্ণনাকারী:</span>
                <span>{hadiths[0].narrator}</span>
              </div>

              {/* Explanation */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border-l-4 border-yellow-500">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">ব্যাখ্যা:</h4>
                <p className="text-yellow-700 dark:text-yellow-300">{hadiths[0].explanation}</p>
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