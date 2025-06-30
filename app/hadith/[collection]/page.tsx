"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShareButton } from "@/components/share-button"
import { Scroll, BookOpen, ArrowLeft, BookMarked, Users, Calendar, Award } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface Book {
  id: number
  name: string
  arabicName: string
  bengaliName: string
}

interface CollectionData {
  collection: {
    name: string
    arabicName: string
  }
  books: Book[]
  total: number
}

export default function HadithCollectionPage() {
  const params = useParams()
  const collection = params.collection as string
  
  const [collectionData, setCollectionData] = useState<CollectionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [shareUrl, setShareUrl] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(`${window.location.origin}/hadith/${collection}`);
    }
  }, [collection]);

  useEffect(() => {
    fetchBooks()
  }, [collection])

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/hadith/${collection}/books`)
      const data = await response.json()
      
      if (data.success) {
        setCollectionData(data.data)
      } else {
        setError("Failed to load books")
      }
    } catch (error) {
      console.error("Error fetching books:", error)
      setError("Failed to load books")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600 dark:text-gray-300">কিতাবগুলি লোড হচ্ছে...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !collectionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 text-lg">{error || "Collection not found"}</p>
            <Button onClick={fetchBooks} className="mt-4">
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
            <Link href="/hadith" className="flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5" />
              <span>হাদীস সংগ্রহ</span>
            </Link>
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-purple-600">{collectionData.collection.name}</h1>
              <ShareButton
                title={`${collectionData.collection.name} - হাদীস কিতাব`}
                text={`ইসলামিক গাইড অ্যাপে ${collectionData.collection.name} এর সব কিতাব পড়ুন।`}
                url={shareUrl}
                variant="outline"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Collection Info */}
        <Card className="mb-8 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {collectionData.collection.name}
                </CardTitle>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-1">
                  {collectionData.collection.arabicName}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <BookMarked className="h-4 w-4" />
                    <span>{collectionData.total}টি কিতাব</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Award className="h-4 w-4" />
                    <span>সহীহ হাদীস</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="default" className="text-lg px-4 py-2">
                  {collectionData.total} কিতাব
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collectionData.books.map((book) => (
            <Card key={book.id} className="group hover:shadow-lg transition-all duration-300 border-l-4 border-green-500">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {book.bengaliName}
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      {book.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {book.arabicName}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-sm">
                    কিতাব {book.id}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Book Info */}
                  <div className="flex items-center space-x-2 text-sm">
                    <BookOpen className="h-4 w-4 text-green-600" />
                    <span className="text-gray-700 dark:text-gray-300">হাদীস কিতাব</span>
                  </div>
                  
                  {/* Action Button */}
                  <Link href={`/hadith/${collection}/${book.id}`}>
                    <Button className="w-full group-hover:bg-green-700 transition-colors">
                      <BookOpen className="h-4 w-4 mr-2" />
                      হাদীস পড়ুন
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {collectionData.books.length === 0 && (
          <div className="text-center py-12">
            <BookMarked className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
              কোন কিতাব পাওয়া যায়নি
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              এই সংগ্রহে এখনও কোন কিতাব যোগ করা হয়নি
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 