"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShareButton } from "@/components/share-button"
import { TextToSpeech } from "@/components/text-to-speech"
import {
  BookOpen,
  ArrowLeft,
  Play,
  Copy,
  Share2,
  Pause,
  Volume2,
  VolumeX,
  Loader2,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { type SurahDetailResponse } from "@/lib/api"

interface SurahClientPageProps {
  initialData: SurahDetailResponse["data"]
}

export default function SurahClientPage({ initialData }: SurahClientPageProps) {
  const [surahData] = useState<SurahDetailResponse["data"] | null>(initialData)
  const [showTranslation, setShowTranslation] = useState(true)
  const [shareUrl, setShareUrl] = useState("")

  // Audio states
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioLoading, setAudioLoading] = useState<string | null>(null)
  const [audioError, setAudioError] = useState<string | null>(null)
  const [audioSuccess, setAudioSuccess] = useState<string | null>(null)
  const [userInteracted, setUserInteracted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && initialData?.number) {
      setShareUrl(`${window.location.origin}/quran/surah/${initialData.number}`);
    }
  }, [initialData?.number]);

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

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      stopAllAudio()
    }
  }, [])

  const stopAllAudio = () => {
    console.log("🛑 Stopping ALL audio completely")

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current.src = ""
      audioRef.current.load()
      audioRef.current = null
    }

    setCurrentlyPlaying(null)
    setIsPlaying(false)
    setAudioLoading(null)
    setAudioError(null)

    if (typeof window !== "undefined" && (window as any).gc) {
      ;(window as any).gc()
    }
  }

  // Audio handling functions
  const handlePlayAudio = async (audioType = "surah", verseNumber: number | null = null, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }

    if (!surahData) return

    try {
      const audioId = verseNumber ? `verse-${verseNumber}` : `surah-${surahData.number}`
      console.log(`🎵 Audio request for: ${surahData.englishName} (${audioId})`)

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
        console.log(`⏹️ Stopping audio: ${surahData.englishName}`)
        stopAllAudio()
        return
      }

      // Stop any currently playing audio COMPLETELY
      stopAllAudio()

      setAudioLoading(audioId)
      setCurrentlyPlaying(audioId)

      // Try to create and play audio
      const success = await createAndPlayAudio(surahData, audioId, verseNumber)

      if (!success) {
        setAudioError(`সূরা ${surahData.englishName} এর অডিও লোড করতে সমস্যা হয়েছে`)
        setCurrentlyPlaying(null)
        setAudioLoading(null)

        // Auto-open external link as fallback
        setTimeout(() => {
          handleOpenExternalAudio()
        }, 1000)
      }
    } catch (error) {
      console.error("🚨 Audio failed:", error)
      handleAudioError(surahData?.englishName || "Unknown", error instanceof Error ? error.message : "Unknown error")
    }
  }

  const createAndPlayAudio = async (surah: any, audioId: string, verseNumber: number | null = null) => {
    // Try primary and fallback audio sources
    const getAudioUrls = () => {
      if (verseNumber) {
        // Verse audio: only one reliable source
        return [
          `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${surah.verses[verseNumber - 1]?.number || surah.number}.mp3`
        ]
      } else {
        // Surah audio: try both sources
        return [
          `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surah.number}.mp3`,
          `https://server8.mp3quran.net/afs/${surah.number.toString().padStart(3, "0")}.mp3`
        ]
      }
    }

    return new Promise((resolve) => {
      const urls = getAudioUrls()
      let tried = 0
      let audio: HTMLAudioElement | null = null
      let timeoutId: any = null

      const tryNext = () => {
        if (audio) {
          audio.pause()
          audio.src = ""
          audio.load()
        }
        if (tried >= urls.length) {
          // All sources failed
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
        audio!.play()
          .then(() => {
            setIsPlaying(true)
            setAudioLoading(null)
            setAudioSuccess(`${verseNumber ? `আয়াত ${verseNumber}` : `সূরা ${surah.englishName}`} চালু হয়েছে`)
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

  const handleOpenExternalAudio = (event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }

    if (!surahData) return

    const externalUrl = `https://quran.com/${surahData.number}`
    window.open(externalUrl, "_blank")
    console.log(`🌐 Opening external audio: ${externalUrl}`)

    setAudioSuccess(`সূরা ${surahData.englishName} Quran.com এ খোলা হয়েছে`)
    setTimeout(() => setAudioSuccess(null), 3000)
  }

  const handleShareVerse = async (verse: any, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }

    if (!surahData) return

    try {
      const content = `সূরা ${surahData.englishName}, আয়াত ${verse.numberInSurah}

আরবি: ${verse.arabic}

বাংলা: ${verse.bengali}

ইসলামিক গাইড অ্যাপ থেকে শেয়ার করা হয়েছে
${shareUrl}`

      if (navigator.share) {
        try {
          await navigator.share({
            title: `সূরা ${surahData.englishName}, আয়াত ${verse.numberInSurah}`,
            text: content,
            url: shareUrl,
          })
          setAudioSuccess(`আয়াত ${verse.numberInSurah} শেয়ার করা হয়েছে`)
          setTimeout(() => setAudioSuccess(null), 3000)
        } catch (error) {
          if (error instanceof Error && error.name !== "AbortError") {
            await copyToClipboard(content)
          }
        }
      } else {
        await copyToClipboard(content)
      }
    } catch (error) {
      console.error("Share failed:", error)
      alert("শেয়ার করতে সমস্যা হয়েছে।")
    }
  }

  const handleCopyVerse = async (verse: any, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }

    const content = `${verse.arabic}\n\n${verse.bengali}\n\n- সূরা ${surahData?.englishName}, আয়াত ${verse.numberInSurah}`
    await copyToClipboard(content)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setAudioSuccess("✅ কপি করা হয়েছে!")
      setTimeout(() => setAudioSuccess(null), 3000)
    } catch (error) {
      const textArea = document.createElement("textarea")
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setAudioSuccess("✅ কপি করা হয়েছে!")
      setTimeout(() => setAudioSuccess(null), 3000)
    }
  }

  const handleAudioError = (surahName: string, errorMessage = "") => {
    stopAllAudio()
    setAudioError(`সূরা ${surahName} চালানো যায়নি। ${errorMessage}`)
    setTimeout(() => setAudioError(null), 5000)
  }

  if (!surahData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">সূরা লোড করা যায়নি।</p>
          <Link href="/quran">
            <Button>কোরআনে ফিরে যান</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/quran" className="flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5" />
              <BookOpen className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold">কোরআন</span>
            </Link>
            <div className="text-center">
              <h1 className="text-xl font-bold text-green-600">{surahData.englishName}</h1>
              <p className="text-sm text-muted-foreground">{surahData.numberOfAyahs} আয়াত</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setShowTranslation(!showTranslation)}>
                {showTranslation ? "অনুবাদ লুকান" : "অনুবাদ দেখান"}
              </Button>
              {surahData && (
                <ShareButton
                  title={`সূরা ${surahData.englishName}`}
                  text={`সূরা ${surahData.englishName} (${surahData.englishNameTranslation})\n${surahData.numberOfAyahs} আয়াত • ${surahData.revelationType === "Meccan" ? "মক্কি" : "মাদানি"}`}
                  url={shareUrl}
                  variant="outline"
                  size="sm"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  শেয়ার
                </ShareButton>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
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

        {/* Audio Error Message */}
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
                    onClick={handleOpenExternalAudio}
                    className="text-red-600 border-red-300 bg-transparent"
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

        {/* Surah Info */}
        <Card className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
          <CardHeader className="text-center">
            <div className="text-4xl font-arabic text-green-700 dark:text-green-300 mb-4">{surahData.name}</div>
            <CardTitle className="text-2xl">{surahData.englishName}</CardTitle>
            <div className="flex items-center justify-center space-x-4 mt-4">
              <Badge variant={surahData.revelationType === "Meccan" ? "default" : "secondary"}>
                {surahData.revelationType === "Meccan" ? "মক্কি" : "মাদানি"}
              </Badge>
              <Badge variant="outline">{surahData.numberOfAyahs} আয়াত</Badge>
            </div>
            <p className="text-muted-foreground mt-2">অর্থ: {surahData.englishNameTranslation}</p>

            {/* Bengali Translation Audio */}
            <div className="flex items-center justify-center mt-3">
              <TextToSpeech
                text={`সূরা ${surahData.englishName}। অর্থ: ${surahData.englishNameTranslation}। ${surahData.numberOfAyahs} টি আয়াত। ${surahData.revelationType === "Meccan" ? "মক্কায় অবতীর্ণ" : "মদিনায় অবতীর্ণ"}`}
                variant="outline"
                size="sm"
              >
                <Volume2 className="h-4 w-4 mr-2" />
                বাংলা অর্থ শুনুন
              </TextToSpeech>
            </div>

            {/* Surah Audio Controls */}
            <div className="flex items-center justify-center space-x-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => handlePlayAudio("surah", null, e)}
                disabled={audioLoading === `surah-${surahData.number}`}
                className={
                  currentlyPlaying === `surah-${surahData.number}` && isPlaying ? "bg-blue-50 text-blue-600" : ""
                }
              >
                {audioLoading === `surah-${surahData.number}` ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : currentlyPlaying === `surah-${surahData.number}` && isPlaying ? (
                  <Pause className="h-4 w-4 mr-2" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                {currentlyPlaying === `surah-${surahData.number}` && isPlaying ? "বিরতি" : "সূরা শুনুন"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleOpenExternalAudio}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Quran.com
              </Button>
              <Button variant="outline" size="sm" onClick={stopAllAudio}>
                <VolumeX className="h-4 w-4 mr-2" />
                বন্ধ করুন
              </Button>
              <ShareButton
                title={`সূরা ${surahData.englishName}`}
                text={`সূরা ${surahData.englishName} (${surahData.englishNameTranslation})\n${surahData.numberOfAyahs} আয়াত • ${surahData.revelationType === "Meccan" ? "মক্কি" : "মাদানি"}`}
                url={shareUrl}
                variant="outline"
                size="sm"
              >
                <Share2 className="h-4 w-4 mr-2" />
                শেয়ার
              </ShareButton>
            </div>
          </CardHeader>
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
                    <span className="font-medium">তেলাওয়াত চলছে</span>
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

        {/* Bismillah */}
        {surahData.number !== 1 && surahData.number !== 9 && (
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-arabic text-green-700 dark:text-green-300 mb-2">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
              {showTranslation && <p className="text-lg text-muted-foreground">পরম করুণাময় ও অসীম দয়ালু আল্লাহর নামে</p>}
            </CardContent>
          </Card>
        )}

        {/* Verses */}
        <div className="space-y-6">
          {surahData.verses.map((verse) => (
            <Card key={verse.numberInSurah} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline">আয়াত {verse.numberInSurah}</Badge>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handlePlayAudio("verse", verse.numberInSurah, e)}
                      disabled={audioLoading === `verse-${verse.numberInSurah}`}
                      className={
                        currentlyPlaying === `verse-${verse.numberInSurah}` && isPlaying
                          ? "bg-blue-50 text-blue-600"
                          : ""
                      }
                    >
                      {audioLoading === `verse-${verse.numberInSurah}` ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : currentlyPlaying === `verse-${verse.numberInSurah}` && isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={(e) => handleCopyVerse(verse, e)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <ShareButton
                      title={`সূরা ${surahData.englishName}, আয়াত ${verse.numberInSurah}`}
                      text={`সূরা ${surahData.englishName}, আয়াত ${verse.numberInSurah}\n\nআরবি: ${verse.arabic}\n\nবাংলা: ${verse.bengali}`}
                      url={shareUrl}
                      variant="ghost"
                      size="sm"
                    >
                      <Share2 className="h-4 w-4" />
                    </ShareButton>
                  </div>
                </div>

                {/* Arabic Text */}
                <div className="bg-muted/30 p-6 rounded-lg mb-4">
                  <p className="text-right text-2xl font-arabic leading-loose text-green-700 dark:text-green-300">
                    {verse.arabic}
                  </p>
                </div>

                {/* Bengali Translation */}
                {showTranslation && verse.bengali && (
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-blue-600">বাংলা অনুবাদ:</h4>
                      <TextToSpeech
                        text={`সূরা ${surahData.englishName}, আয়াত ${verse.numberInSurah}। ${verse.bengali}`}
                        variant="ghost"
                        size="sm"
                      >
                        <Volume2 className="h-4 w-4" />
                      </TextToSpeech>
                    </div>
                    <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200">{verse.bengali}</p>
                  </div>
                )}

                {/* Verse Info */}
                <div className="flex items-center space-x-4 mt-4 text-sm text-muted-foreground">
                  <span>পারা: {verse.juz}</span>
                  <span>পৃষ্ঠা: {verse.page}</span>
                  {verse.sajda && <Badge variant="secondary">সিজদা</Badge>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12">
          <div>
            {surahData.number > 1 && (
              <Link href={`/quran/surah/${surahData.number - 1}`}>
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  পূর্ববর্তী সূরা
                </Button>
              </Link>
            )}
          </div>
          <div>
            {surahData.number < 114 && (
              <Link href={`/quran/surah/${surahData.number + 1}`}>
                <Button variant="outline">
                  পরবর্তী সূরা
                  <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 