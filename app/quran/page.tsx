"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ShareButton } from "@/components/share-button"
import {
  BookOpen,
  Search,
  Volume2,
  Pause,
  VolumeX,
  Loader2,
  Play,
  Share2,
  X,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Headphones,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { fetchQuranSurahs } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

export default function QuranPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [surahs, setSurahs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioLoading, setAudioLoading] = useState<string | null>(null)
  const [audioError, setAudioError] = useState<string | null>(null)
  const [audioSuccess, setAudioSuccess] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [userInteracted, setUserInteracted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [origin, setOrigin] = useState("")

  useEffect(() => {
    // Set origin only on client side
    setOrigin(window.location.origin)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetchQuranSurahs()

        if (response.success) {
          setSurahs(response.data || [])
          setSearchResults(response.data || [])
        } else {
          setError(response.error)
        }
      } catch (err) {
        setError("কোরআনের সূরা লোড করতে সমস্যা হয়েছে")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Track user interaction for autoplay policy
  useEffect(() => {
    const handleUserInteraction = () => {
      setUserInteracted(true)
      console.log("✅ User interaction detected - audio enabled")
    }

    document.addEventListener("click", handleUserInteraction)
    document.addEventListener("touchstart", handleUserInteraction)

    return () => {
      document.removeEventListener("click", handleUserInteraction)
      document.removeEventListener("touchstart", handleUserInteraction)
    }
  }, [])

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim()
      const filtered = surahs.filter((surah) => {
        return (
          surah.name?.toLowerCase().includes(searchLower) ||
          surah.meaning?.toLowerCase().includes(searchLower) ||
          surah.englishName?.toLowerCase().includes(searchLower) ||
          surah.arabicName?.includes(searchTerm) ||
          surah.id.toString().includes(searchTerm)
        )
      })
      setSearchResults(filtered)
    } else {
      setSearchResults(surahs)
    }
  }, [searchTerm, surahs])

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults(surahs)
      setShowSearchResults(false)
      return
    }
    setShowSearchResults(true)
  }

  const clearSearch = () => {
    setSearchTerm("")
    setSearchResults(surahs)
    setShowSearchResults(false)
  }

  // Fixed audio handling - completely stop background audio
  const handlePlayAudioDirect = async (surah, audioType = "surah", event) => {
    // Stop event propagation to prevent card click
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }

    try {
      const audioId = `${audioType}-${surah.id}`
      console.log(`🎵 Direct audio request for: ${surah.name} (${audioId})`)

      // Clear previous states
      setAudioError(null)
      setAudioSuccess(null)

      // Check if user has interacted (required for autoplay)
      if (!userInteracted) {
        setAudioError("অডিও চালানোর জন্য প্রথমে পেজে কোথাও ক্লিক করুন")
        return
      }

      // If same audio is playing, COMPLETELY STOP it
      if (currentlyPlaying === audioId && isPlaying) {
        console.log(`⏹️ Stopping audio: ${surah.name}`)
        stopAllAudio()
        return
      }

      // Stop any currently playing audio COMPLETELY
      stopAllAudio()

      setAudioLoading(audioId)
      setCurrentlyPlaying(audioId)

      // Try to create and play audio with better error handling
      const success = await createAndPlayAudio(surah, audioId)

      if (!success) {
        // If audio fails, offer external link
        setAudioError(`সূরা ${surah.name} এর অডিও লোড করতে সমস্যা হয়েছে`)
        setCurrentlyPlaying(null)
        setAudioLoading(null)

        // Auto-open external link as fallback
        setTimeout(() => {
          handleOpenExternalAudio(surah)
        }, 1000)
      }
    } catch (error) {
      console.error("🚨 Direct audio failed:", error)
      handleAudioError(surah.name, error.message)
    }
  }

  const handleShareSurahDirect = async (surah, verseNumber = null, event) => {
    // Stop event propagation to prevent card click
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }

    try {
      console.log(`📤 Direct share for: ${surah.name}`)

      const content = verseNumber
        ? `সূরা ${surah.name} (${surah.meaning}), আয়াত ${verseNumber}

আরবি: ${surah.arabicName}
অর্থ: ${surah.meaning}
${surah.revelation === "মক্কি" ? "মক্কায় অবতীর্ণ" : "মদিনায় অবতীর্ণ"}

ইসলামিক গাইড অ্যাপ থেকে শেয়ার করা হয়েছে
${origin}/quran/surah/${surah.id}`
        : `সূরা ${surah.name} (${surah.meaning})

আরবি: ${surah.arabicName}
অর্থ: ${surah.meaning}
আয়াত সংখ্যা: ${surah.verses}
${surah.revelation === "মক্কি" ? "মক্কায় অবতীর্ণ" : "মদিনায় অবতীর্ণ"}

ইসলামিক গাইড অ্যাপ থেকে শেয়ার করা হয়েছে
${origin}/quran/surah/${surah.id}`

      // Try native share first
      if (navigator.share && navigator.canShare) {
        try {
          await navigator.share({
            title: `সূরা ${surah.name} - ইসলামিক গাইড`,
            text: content,
            url: `${origin}/quran/surah/${surah.id}`,
          })
          console.log("✅ Native share successful")
          setAudioSuccess(`সূরা ${surah.name} শেয়ার করা হয়েছে`)
          setTimeout(() => setAudioSuccess(null), 3000)
          return
        } catch (shareError) {
          if (shareError.name === "AbortError") {
            console.log("Share cancelled by user")
            return
          }
          console.log("Native share failed, falling back to clipboard")
        }
      }

      // Fallback to clipboard
      await copyToClipboard(content)
      setAudioSuccess(`সূরা ${surah.name} কপি করা হয়েছে - এখন যেকোনো জায়গায় পেস্ট করুন`)
      setTimeout(() => setAudioSuccess(null), 4000)
    } catch (error) {
      console.error("Share failed:", error)
      setAudioError("শেয়ার করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।")
      setTimeout(() => setAudioError(null), 3000)
    }
  }

  const handleShareSampleVerse = async (event) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }

    try {
      const content = `আজকের আয়াত - সূরা আল-ফাতিহা, আয়াত ১

আরবি: بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ

বাংলা: পরম করুণাময় ও অসীম দয়ালু আল্লাহর নামে (শুরু করছি)।

ইসলামিক গাইড অ্যাপ থেকে শেয়ার করা হয়েছে
${origin}/quran/surah/1`

      if (navigator.share && navigator.canShare) {
        try {
          await navigator.share({
            title: "আজকের আয়াত - ইসলামিক গাইড",
            text: content,
            url: `${origin}/quran/surah/1`,
          })
          setAudioSuccess("আজকের আয়াত শেয়ার করা হয়েছে")
          setTimeout(() => setAudioSuccess(null), 3000)
          return
        } catch (shareError) {
          if (shareError.name === "AbortError") return
        }
      }

      await copyToClipboard(content)
      setAudioSuccess("আজকের আয়াত কপি করা হয়েছে - এখন যেকোনো জায়গায় পেস্ট করুন")
      setTimeout(() => setAudioSuccess(null), 4000)
    } catch (error) {
      console.error("Sample verse share failed:", error)
      setAudioError("শেয়ার করতে সমস্যা হয়েছে।")
      setTimeout(() => setAudioError(null), 3000)
    }
  }

  const handleOpenExternalAudioDirect = (surah, event) => {
    // Stop event propagation to prevent card click
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }

    const externalUrl = `https://quran.com/${surah.id}`
    window.open(externalUrl, "_blank")
    console.log(`🌐 Opening external audio for ${surah.name}: ${externalUrl}`)

    setAudioSuccess(`সূরা ${surah.name} Quran.com এ খোলা হয়েছে`)
    setTimeout(() => setAudioSuccess(null), 3000)
  }

  const createAndPlayAudio = async (surah, audioId) => {
    // Try primary and fallback audio sources
    const getAudioUrls = () => [
      `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surah.id}.mp3`,
      `https://server8.mp3quran.net/afs/${surah.id.toString().padStart(3, "0")}.mp3`
    ]
    return new Promise((resolve) => {
      const urls = getAudioUrls()
      let tried = 0
      let audio = null
      let timeoutId = null
      const tryNext = () => {
        if (audio) {
          audio.pause()
          audio.src = ""
          audio.load()
        }
        if (tried >= urls.length) {
          resolve(false)
          return
        }
        const url = urls[tried]
        tried++
        audio = new Audio()
        audio.preload = "none"
        audio.volume = 0.7
        audio.muted = false
        audio.src = url
        audio.load()
        // Clean up previous listeners
        audio.removeEventListener("loadeddata", onLoadedData)
        audio.removeEventListener("canplaythrough", onLoadedData)
        audio.removeEventListener("error", onError)
        audio.removeEventListener("pause", onPause)
        audio.removeEventListener("ended", onEnded)
        // Add listeners
        audio.addEventListener("loadeddata", onLoadedData)
        audio.addEventListener("canplaythrough", onLoadedData)
        audio.addEventListener("error", onError)
        audio.addEventListener("pause", onPause)
        audio.addEventListener("ended", onEnded)
        // Timeout
        timeoutId = setTimeout(() => {
          cleanup()
          tryNext()
        }, 10000)
      }
      const cleanup = () => {
        if (audio) {
          audio.removeEventListener("loadeddata", onLoadedData)
          audio.removeEventListener("canplaythrough", onLoadedData)
          audio.removeEventListener("error", onError)
          audio.removeEventListener("pause", onPause)
          audio.removeEventListener("ended", onEnded)
        }
        if (timeoutId) clearTimeout(timeoutId)
      }
      const onLoadedData = () => {
        cleanup()
        audio.play()
          .then(() => {
            setIsPlaying(true)
            setAudioLoading(null)
            setAudioSuccess(`সূরা ${surah.name} চালু হয়েছে`)
            audioRef.current = audio
            setTimeout(() => setAudioSuccess(null), 3000)
            resolve(true)
          })
          .catch(() => {
            tryNext()
          })
      }
      const onError = () => {
        cleanup()
        tryNext()
      }
      const onPause = () => {
        setIsPlaying(false)
      }
      const onEnded = () => {
        stopAllAudio()
      }
      tryNext()
    })
  }

  const handleOpenExternalAudio = (surah) => {
    const externalUrl = `https://quran.com/${surah.id}`
    window.open(externalUrl, "_blank")
    console.log(`🌐 Opening external audio for ${surah.name}: ${externalUrl}`)

    setAudioSuccess(`সূরা ${surah.name} Quran.com এ খোলা হয়েছে`)
    setTimeout(() => setAudioSuccess(null), 3000)
  }

  const handleAudioError = (surahName, errorMessage = "") => {
    stopAllAudio()
    setAudioError(`সূরা ${surahName} চালানো যায়নি। ${errorMessage}`)

    // Clear error after 5 seconds
    setTimeout(() => setAudioError(null), 5000)
  }

  const copyToClipboard = async (text) => {
    try {
      // Modern clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
        console.log("✅ Clipboard API successful")
        return true
      }

      // Fallback for older browsers or non-secure contexts
      const textArea = document.createElement("textarea")
      textArea.value = text
      textArea.style.position = "fixed"
      textArea.style.left = "-999999px"
      textArea.style.top = "-999999px"
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      const successful = document.execCommand("copy")
      document.body.removeChild(textArea)

      if (successful) {
        console.log("✅ Fallback copy successful")
        return true
      } else {
        throw new Error("Copy command failed")
      }
    } catch (error) {
      console.error("Copy failed:", error)

      // Final fallback - show text in alert for manual copy
      const shortText = text.length > 200 ? text.substring(0, 200) + "..." : text
      alert(`কপি করতে সমস্যা হয়েছে। নিচের টেক্সট ম্যানুয়ালি কপি করুন:\n\n${shortText}`)
      return false
    }
  }

  // COMPLETELY stop all audio - no background playing
  const stopAllAudio = () => {
    console.log("🛑 Stopping ALL audio completely")

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current.src = ""
      audioRef.current.load() // Force reload to clear buffer
      audioRef.current = null
    }

    // Clear all states
    setCurrentlyPlaying(null)
    setIsPlaying(false)
    setAudioLoading(null)
    setAudioError(null)

    // Force garbage collection of any remaining audio
    if (window.gc) {
      window.gc()
    }
  }

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      stopAllAudio()
    }
  }, [])

  const displaySurahs = showSearchResults ? searchResults : surahs

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
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
                <BookOpen className="h-8 w-8 text-green-600" />
                <span>পবিত্র কোরআন</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                ১১৪টি সূরা • বাংলা অনুবাদ • অডিও তেলাওয়াত
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{surahs.length}</div>
                <div className="text-sm text-gray-500">সূরা</div>
              </div>
              <ShareButton
                title="পবিত্র কোরআন"
                text="ইসলামিক গাইড অ্যাপে পবিত্র কোরআন পড়ুন এবং শুনুন। সব সূরা বাংলা অনুবাদসহ।"
                url={`${origin}/quran`}
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
        {/* User Interaction Notice */}
        {!userInteracted && (
          <Card className="mb-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Headphones className="h-5 w-5 text-blue-600" />
                <div>
                  <span className="font-medium text-blue-800 dark:text-blue-200">অডিও চালানোর জন্য প্রস্তুত</span>
                  <p className="text-sm text-blue-600 dark:text-blue-300">অডিও শুনতে যেকোনো সূরার Play বাটনে ক্লিক করুন</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>সূরা খুঁজুন</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Input
                  placeholder="সূরার বাংলা নাম, অর্থ, ইংরেজি নাম বা নম্বর লিখুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSearch()
                    }
                  }}
                  className="pr-10"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Button onClick={handleSearch} disabled={!searchTerm.trim()}>
                <Search className="h-4 w-4 mr-2" />
                খুঁজুন
              </Button>
            </div>

            {/* Search Results Info */}
            {showSearchResults && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  "{searchTerm}" এর জন্য {searchResults.length} টি ফলাফল পাওয়া গেছে
                  {searchResults.length === 0 && <span className="block mt-1 text-xs">অন্য কীওয়ার্ড দিয়ে চেষ্টা করুন</span>}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Audio Success Message */}
        {audioSuccess && (
          <Card className="mb-6 bg-green-50 dark:bg-green-900/20 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800 dark:text-green-200">{audioSuccess}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setAudioSuccess(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Audio Error Message with External Link */}
        {audioError && (
          <Card className="mb-6 bg-red-50 dark:bg-red-900/20 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <div>
                    <span className="font-medium text-red-800 dark:text-red-200">{audioError}</span>
                    <p className="text-sm text-red-600 dark:text-red-300">
                      বিকল্প: Quran.com এ শুনুন বা ইন্টারনেট সংযোগ চেক করুন
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open("https://quran.com", "_blank")}
                    className="text-red-600 border-red-300"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Quran.com
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setAudioError(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sample Verse */}
        <Card className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>আজকের আয়াত</CardTitle>
                <CardDescription>সূরা আল-ফাতিহা, আয়াত ১</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => handlePlayAudioDirect({ id: 1, name: "আল-ফাতিহা" }, "verse", e)}
                  className={currentlyPlaying === "verse-1" && isPlaying ? "bg-blue-50 text-blue-600" : ""}
                  disabled={audioLoading === "verse-1"}
                >
                  {currentlyPlaying === "verse-1" && isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : audioLoading === "verse-1" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => handleOpenExternalAudioDirect({ id: 1, name: "আল-ফাতিহা" }, e)}
                  title="Quran.com এ শুনুন"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleShareSampleVerse}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-right">
              <p className="text-3xl font-arabic leading-loose text-green-700 dark:text-green-300">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                পরম করুণাময় ও অসীম দয়ালু আল্লাহর নামে (শুরু করছি)।
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Audio Control Info */}
        {currentlyPlaying && (
          <Card className="mb-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={isPlaying ? "animate-pulse" : ""}>
                    <Volume2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <span className="font-medium">সূরা তেলাওয়াত চলছে</span>
                    <p className="text-sm text-muted-foreground">{isPlaying ? "চালু আছে" : "বিরতি"} • Islamic Network</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={stopAllAudio}>
                  <VolumeX className="h-4 w-4 mr-2" />
                  বন্ধ করুন
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Surah List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p>কোরআনের সূরা লোড হচ্ছে...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displaySurahs.map((surah) => (
              <Card key={surah.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                        {surah.id}
                      </div>
                      <div>
                        <CardTitle className="text-lg text-green-700 dark:text-green-300">{surah.name}</CardTitle>
                        <p className="text-xl font-arabic text-green-600">{surah.arabicName}</p>
                      </div>
                    </div>
                    {/* Audio Controls */}
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handlePlayAudioDirect(surah, "surah", e)}
                        disabled={audioLoading === `surah-${surah.id}`}
                        className={`${
                          currentlyPlaying === `surah-${surah.id}` && isPlaying
                            ? "text-blue-600 bg-blue-50"
                            : "text-gray-600 hover:text-green-600"
                        }`}
                        title="তেলাওয়াত শুনুন"
                      >
                        {audioLoading === `surah-${surah.id}` ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : currentlyPlaying === `surah-${surah.id}` && isPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Volume2 className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleOpenExternalAudioDirect(surah, e)}
                        className="text-gray-600 hover:text-purple-600"
                        title="Quran.com এ শুনুন"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleShareSurahDirect(surah, null, e)}
                        className="text-gray-600 hover:text-blue-600"
                        title="শেয়ার করুন"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Badge variant={surah.revelation === "মক্কি" ? "default" : "secondary"}>{surah.revelation}</Badge>
                      <span className="text-sm text-muted-foreground">{surah.verses} আয়াত</span>
                    </div>

                    {/* Bengali Meaning */}
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-lg border border-yellow-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">বাংলা অর্থ:</span>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handlePlayAudioDirect(surah, "verse", e)}
                            disabled={audioLoading === `verse-${surah.id}`}
                            className="h-6 w-6 p-0 text-yellow-600 hover:text-yellow-800"
                            title="সূরা তেলাওয়াত শুনুন"
                          >
                            {currentlyPlaying === `verse-${surah.id}` && isPlaying ? (
                              <Pause className="h-3 w-3" />
                            ) : audioLoading === `verse-${surah.id}` ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Play className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleOpenExternalAudioDirect(surah, e)}
                            className="h-6 w-6 p-0 text-yellow-600 hover:text-yellow-800"
                            title="Quran.com এ শুনুন"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleShareSurahDirect(surah, 1, e)}
                            className="h-6 w-6 p-0 text-yellow-600 hover:text-yellow-800"
                            title="সূরা শেয়ার করুন"
                          >
                            <Share2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-base font-medium text-yellow-800 dark:text-yellow-200 leading-relaxed">
                        {surah.meaning}
                      </p>
                      <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                        {surah.verses} টি আয়াত • {surah.revelation === "মক্কি" ? "মক্কায় অবতীর্ণ" : "মদিনায় অবতীর্ণ"}
                      </p>
                    </div>

                    <div onClick={(e) => e.stopPropagation()}>
                      <Link href={`/quran/surah/${surah.id}`}>
                        <Button className="w-full mt-4 bg-transparent" variant="outline">
                          <BookOpen className="h-4 w-4 mr-2" />
                          পড়ুন
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Enhanced Instructions */}
        <Card className="mt-8 bg-green-50 dark:bg-green-900/20 border-green-200">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3 text-green-800 dark:text-green-200 flex items-center">
              <Volume2 className="h-5 w-5 mr-2" />
              অডিও ফিচার:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700 dark:text-green-300">
              <ul className="space-y-2">
                <li>
                  • <strong>🎵 Play বাটন:</strong> সূরার সম্পূর্ণ তেলাওয়াত
                </li>
                <li>
                  • <strong>🌐 External বাটন:</strong> Quran.com এ শুনুন
                </li>
                <li>
                  • <strong>📤 Share বাটন:</strong> সূরা শেয়ার করুন
                </li>
              </ul>
              <ul className="space-y-2">
                <li>
                  • <strong>✅ নির্ভরযোগ্য:</strong> Auto-fallback to external
                </li>
                <li>
                  • <strong>🚀 দ্রুত:</strong> Instant external backup
                </li>
                <li>
                  • <strong>📱 সব ডিভাইসে:</strong> Universal compatibility
                </li>
              </ul>
            </div>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>🔧 Smart System:</strong> অডিও লোড না হলে স্বয়ংক্রিয়ভাবে Quran.com এ redirect হবে।
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-green-600">১১৪</div>
              <div className="text-sm text-muted-foreground">সূরা</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-blue-600">{displaySurahs.length}</div>
              <div className="text-sm text-muted-foreground">{showSearchResults ? "খুঁজে পাওয়া" : "মোট সূরা"}</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-purple-600">৮৬</div>
              <div className="text-sm text-muted-foreground">মক্কি সূরা</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-orange-600">২৮</div>
              <div className="text-sm text-muted-foreground">মাদানি সূরা</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
