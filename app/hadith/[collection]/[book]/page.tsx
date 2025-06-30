"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  BookOpen, 
  Clock, 
  User, 
  Filter,
  Share2,
  Bookmark,
  Volume2,
  Eye,
  ArrowLeft,
  Home,
  Settings,
  Book,
  Calendar,
  Users,
  Star,
  CheckCircle,
  AlertCircle,
  Info,
  Play,
  Pause,
  SkipBack,
  SkipForward
} from "lucide-react"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface Hadith {
  id: number
  hadithNumber: number
  arabic: string
  bengali: string
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

export default function HadithBookPage() {
  const params = useParams()
  const router = useRouter()
  const collection = params.collection as string
  const book = params.book as string
  
  const [hadiths, setHadiths] = useState<Hadith[]>([])
  const [bookInfo, setBookInfo] = useState<BookInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [hadithsPerPage] = useState(5)
  const [selectedHadith, setSelectedHadith] = useState<Hadith | null>(null)
  const [isReadingMode, setIsReadingMode] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const [bookmarkedHadiths, setBookmarkedHadiths] = useState<number[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentAudioHadith, setCurrentAudioHadith] = useState<number | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  const [lineHeight, setLineHeight] = useState(1.6)
  const [showArabic, setShowArabic] = useState(true)
  const [showBengali, setShowBengali] = useState(true)
  const [showExplanation, setShowExplanation] = useState(true)

  useEffect(() => {
    fetchHadiths()
    loadBookmarks()
  }, [collection, book])

  useEffect(() => {
    // Calculate reading progress
    if (hadiths.length > 0) {
      const progress = ((currentPage - 1) * hadithsPerPage + 1) / hadiths.length * 100
      setReadingProgress(Math.min(progress, 100))
    }
  }, [currentPage, hadiths.length, hadithsPerPage])

  const fetchHadiths = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/hadith/${collection}/${book}`)
      if (!response.ok) {
        throw new Error('Failed to fetch hadiths')
      }
      const data = await response.json()
      setHadiths(data.hadiths || [])
      setBookInfo(data.bookInfo)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const loadBookmarks = () => {
    const saved = localStorage.getItem(`hadith-bookmarks-${collection}-${book}`)
    if (saved) {
      setBookmarkedHadiths(JSON.parse(saved))
    }
  }

  const toggleBookmark = (hadithId: number) => {
    const newBookmarks = bookmarkedHadiths.includes(hadithId)
      ? bookmarkedHadiths.filter(id => id !== hadithId)
      : [...bookmarkedHadiths, hadithId]
    
    setBookmarkedHadiths(newBookmarks)
    localStorage.setItem(`hadith-bookmarks-${collection}-${book}`, JSON.stringify(newBookmarks))
  }

  const playAudio = (hadithId: number) => {
    if (currentAudioHadith === hadithId) {
      setIsPlaying(!isPlaying)
    } else {
      setCurrentAudioHadith(hadithId)
      setIsPlaying(true)
    }
  }

  const shareHadith = async (hadith: Hadith) => {
    const text = `${hadith.arabic}\n\n${hadith.bengali}\n\nবর্ণনাকারী: ${hadith.narrator}\nগ্রেড: ${hadith.grade}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${bookInfo?.title} - হাদীস নং ${hadith.hadithNumber}`,
          text: text,
          url: window.location.href
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(text)
        alert('হাদীস কপি করা হয়েছে!')
      } catch (err) {
        console.error('Failed to copy')
      }
    }
  }

  const filteredHadiths = hadiths.filter(hadith => {
    const matchesSearch = hadith.arabic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hadith.bengali.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hadith.narrator.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hadith.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hadith.hadithNumber.toString().includes(searchTerm)
    
    const matchesCategory = filterCategory === "all" || hadith.category === filterCategory
    
    return matchesSearch && matchesCategory
  })

  const totalPages = Math.ceil(filteredHadiths.length / hadithsPerPage)
  const startIndex = (currentPage - 1) * hadithsPerPage
  const endIndex = startIndex + hadithsPerPage
  const currentHadiths = filteredHadiths.slice(startIndex, endIndex)

  const categories = Array.from(new Set(hadiths.map(h => h.category)))

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToHadith = (hadithNumber: number) => {
    const hadithIndex = hadiths.findIndex(h => h.hadithNumber === hadithNumber)
    if (hadithIndex !== -1) {
      const page = Math.floor(hadithIndex / hadithsPerPage) + 1
      setCurrentPage(page)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-6xl mx-auto">
          <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-800 dark:text-red-200">ত্রুটি</h3>
                  <p className="text-red-600 dark:text-red-300">{error}</p>
                </div>
              </div>
              <Button 
                onClick={() => router.push('/hadith')} 
                className="mt-4"
                variant="outline"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                ফিরে যান
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push('/hadith')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                ফিরে যান
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {bookInfo?.title}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {bookInfo?.author} • {bookInfo?.totalHadith} হাদীস • {bookInfo?.totalChapters} অধ্যায়
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowSettings(!showSettings)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>সেটিংস</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsReadingMode(!isReadingMode)}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                {isReadingMode ? 'সম্পাদনা মোড' : 'পঠন মোড'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Book Info Card */}
        <Card className="mb-6 border-l-4 border-green-500">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3">
                <Book className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">মোট হাদীস</p>
                  <p className="font-semibold">{bookInfo?.totalHadith}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">মোট অধ্যায়</p>
                  <p className="font-semibold">{bookInfo?.totalChapters}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">সময়কাল</p>
                  <p className="font-semibold">{bookInfo?.period}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Star className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">গ্রেড</p>
                  <p className="font-semibold">সহীহ</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reading Progress */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">পঠন অগ্রগতি</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {Math.round(readingProgress)}%
              </span>
            </div>
            <Progress value={readingProgress} className="h-2" />
            <div className="flex items-center justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
              <span>পৃষ্ঠা: {currentPage} / {totalPages}</span>
              <span>হাদীস: {startIndex + 1} - {Math.min(endIndex, filteredHadiths.length)} / {filteredHadiths.length}</span>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="হাদীস, বর্ণনাকারী, বা বিষয় অনুসন্ধান করুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="বিষয় নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">সব বিষয়</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  প্রথম
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  শেষ
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Panel */}
        {showSettings && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">পঠন সেটিংস</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>ফন্ট সাইজ</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                    >
                      A-
                    </Button>
                    <span className="w-12 text-center">{fontSize}px</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                    >
                      A+
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label>লাইন হাইট</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setLineHeight(Math.max(1.2, lineHeight - 0.2))}
                    >
                      -
                    </Button>
                    <span className="w-12 text-center">{lineHeight}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setLineHeight(Math.min(2.4, lineHeight + 0.2))}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={showArabic} 
                    onCheckedChange={setShowArabic}
                  />
                  <Label>আরবি টেক্সট দেখান</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={showBengali} 
                    onCheckedChange={setShowBengali}
                  />
                  <Label>বাংলা অনুবাদ দেখান</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={showExplanation} 
                    onCheckedChange={setShowExplanation}
                  />
                  <Label>ব্যাখ্যা দেখান</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Hadiths */}
        <div className="space-y-6">
          {currentHadiths.map((hadith) => (
            <Card 
              key={hadith.id} 
              className={`transition-all duration-200 hover:shadow-lg ${
                selectedHadith?.id === hadith.id ? 'ring-2 ring-green-500' : ''
              }`}
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: lineHeight
              }}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="font-mono">
                      #{hadith.hadithNumber}
                    </Badge>
                    <Badge variant="secondary">{hadith.category}</Badge>
                    <Badge variant="default" className="bg-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {hadith.grade}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleBookmark(hadith.id)}
                          >
                            <Bookmark 
                              className={`h-4 w-4 ${
                                bookmarkedHadiths.includes(hadith.id) 
                                  ? 'fill-current text-yellow-500' 
                                  : 'text-gray-400'
                              }`}
                            />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{bookmarkedHadiths.includes(hadith.id) ? 'বুকমার্ক সরান' : 'বুকমার্ক করুন'}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => playAudio(hadith.id)}
                          >
                            {currentAudioHadith === hadith.id && isPlaying ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>অডিও শুনুন</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => shareHadith(hadith)}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>শেয়ার করুন</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {showArabic && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="text-right leading-relaxed text-lg">
                      {hadith.arabic}
                    </div>
                  </div>
                )}
                
                {showBengali && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">বাংলা অনুবাদ:</h4>
                    <p className="leading-relaxed">{hadith.bengali}</p>
                  </div>
                )}
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">বর্ণনাকারী:</span>
                    <span className="font-medium">{hadith.narrator}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">হাদীস নং:</span>
                    <span className="font-medium">{hadith.hadithNumber}</span>
                  </div>
                </div>
                
                {showExplanation && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center">
                      <Info className="h-4 w-4 mr-2" />
                      ব্যাখ্যা:
                    </h4>
                    <p className="text-blue-800 dark:text-blue-300">{hadith.explanation}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Card className="mt-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    প্রথম
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    আগের
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                  >
                    পরের
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    শেষ
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Navigation */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">দ্রুত নেভিগেশন</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {[1, 10, 50, 100, 500, 1000].map(num => {
                const hadith = hadiths.find(h => h.hadithNumber === num)
                if (!hadith) return null
                
                return (
                  <Button
                    key={num}
                    variant="outline"
                    size="sm"
                    onClick={() => goToHadith(num)}
                    className="text-xs"
                  >
                    #{num}
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 