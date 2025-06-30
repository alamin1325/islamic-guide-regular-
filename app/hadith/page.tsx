"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ShareButton } from "@/components/share-button"
import { Scroll, Search, BookOpen, Heart, Share2, Star, Users, Calendar, Award, BookMarked, ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

interface HadithCollection {
  id: string
  name: string
  arabicName: string
  englishName: string
  count: number
  color: string
  gradient: string
  author: string
  authorArabic: string
  authorEnglish: string
  period: string
  location: string
  description: string
  features: string[]
  rating: number
  readers: string
  language: string
  translation: string
  apiUrl: string
}

export default function HadithPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCollection, setSelectedCollection] = useState("all")
  const [shareUrl, setShareUrl] = useState("")
  const [collections, setCollections] = useState<HadithCollection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(`${window.location.origin}/hadith`);
    }
  }, []);

  useEffect(() => {
    fetchCollections()
  }, [])

  const fetchCollections = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/hadith/collections')
      const data = await response.json()
      
      if (data.success) {
        setCollections(data.data)
      } else {
        setError("Failed to load hadith collections")
      }
    } catch (error) {
      console.error("Error fetching collections:", error)
      setError("Failed to load hadith collections")
    } finally {
      setLoading(false)
    }
  }

  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.author.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600 dark:text-gray-300">হাদীস সংগ্রহ লোড হচ্ছে...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 text-lg">{error}</p>
            <Button onClick={fetchCollections} className="mt-4">
              আবার চেষ্টা করুন
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Scroll className="h-6 w-6 text-purple-600" />
              <span className="text-xl font-bold">ইসলামিক গাইড</span>
            </Link>
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-purple-600">সহীহ হাদিস</h1>
              <ShareButton
                title="সহীহ হাদিস"
                text="ইসলামিক গাইড অ্যাপে সহীহ হাদিস পড়ুন। বুখারি, মুসলিম, তিরমিজি সহ সব হাদিস সংকলন।"
                url={shareUrl}
                variant="outline"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filter */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="হাদীস সংগ্রহ, লেখক বা বিষয় অনুসন্ধান করুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedCollection === "all" ? "default" : "outline"}
              onClick={() => setSelectedCollection("all")}
            >
              সব
            </Button>
            <Button
              variant={selectedCollection === "bukhari" ? "default" : "outline"}
              onClick={() => setSelectedCollection("bukhari")}
            >
              বুখারি
            </Button>
            <Button
              variant={selectedCollection === "muslim" ? "default" : "outline"}
              onClick={() => setSelectedCollection("muslim")}
            >
              মুসলিম
            </Button>
          </div>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCollections.map((collection) => (
            <Card key={collection.id} className="group hover:shadow-lg transition-all duration-300 border-l-4 border-purple-500">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {collection.name}
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      {collection.arabicName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {collection.englishName}
                    </p>
                  </div>
                  <Badge className={`${collection.color} text-white`}>
                    {collection.count.toLocaleString()}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Author Info */}
                  <div className="flex items-center space-x-2 text-sm">
                    <Award className="h-4 w-4 text-purple-600" />
                    <span className="text-gray-700 dark:text-gray-300">{collection.author}</span>
                  </div>
                  
                  {/* Period & Location */}
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-600 dark:text-gray-400">{collection.period}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="h-4 w-4 text-green-600" />
                    <span className="text-gray-600 dark:text-gray-400">{collection.location}</span>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(collection.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {collection.rating} ({collection.readers} পাঠক)
                    </span>
                  </div>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                    {collection.description}
                  </p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-1">
                    {collection.features.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Action Button */}
                  <Link href={`/hadith/${collection.id}`}>
                    <Button className="w-full group-hover:bg-purple-700 transition-colors">
                      <BookOpen className="h-4 w-4 mr-2" />
                      পড়ুন
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredCollections.length === 0 && (
          <div className="text-center py-12">
            <BookMarked className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
              কোন হাদীস সংগ্রহ পাওয়া যায়নি
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              অনুসন্ধানের শব্দ পরিবর্তন করে আবার চেষ্টা করুন
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 