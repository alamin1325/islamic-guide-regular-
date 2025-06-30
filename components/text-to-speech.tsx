"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, VolumeX, AlertCircle } from "lucide-react"

interface TextToSpeechProps {
  text: string
  title?: string
  className?: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  children?: React.ReactNode
}

export function TextToSpeech({
  text,
  title = "বাংলা অর্থ",
  className = "",
  variant = "outline",
  size = "sm",
  children
}: TextToSpeechProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [voicesLoaded, setVoicesLoaded] = useState(false)
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Load voices when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsSupported('speechSynthesis' in window)
      
      if (window.speechSynthesis) {
        // Load voices
        const loadVoices = () => {
          const voices = window.speechSynthesis.getVoices()
          console.log("🎤 Available voices:", voices.map(v => `${v.name} (${v.lang})`))
          setVoicesLoaded(true)
        }

        // Some browsers load voices asynchronously
        if (window.speechSynthesis.getVoices().length > 0) {
          loadVoices()
        } else {
          window.speechSynthesis.onvoiceschanged = loadVoices
        }
      }
    }
  }, [])

  const handlePlay = () => {
    if (!text) return

    // Check if speech synthesis is supported
    if (!window.speechSynthesis) {
      setError("আপনার ব্রাউজার স্পিচ সিনথেসিস সাপোর্ট করে না")
      return
    }

    // Stop any existing speech
    if (speechRef.current) {
      window.speechSynthesis.cancel()
    }

    try {
      // Create new speech utterance
      const utterance = new SpeechSynthesisUtterance(text)
      
      // Get available voices
      const voices = window.speechSynthesis.getVoices()
      
      // Try to find Bengali voice with multiple fallback options
      let selectedVoice = null
      
      // First try: Exact Bengali language match
      selectedVoice = voices.find(voice => 
        voice.lang === 'bn-BD' || 
        voice.lang === 'bn-IN' || 
        voice.lang === 'ben-BD' || 
        voice.lang === 'ben-IN'
      )
      
      // Second try: Bengali language code
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
          voice.lang.startsWith('bn') || 
          voice.lang.startsWith('ben')
        )
      }
      
      // Third try: Voice name contains Bengali/Bangla
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
          voice.name.toLowerCase().includes('bengali') ||
          voice.name.toLowerCase().includes('bangla') ||
          voice.name.toLowerCase().includes('bn')
        )
      }
      
      // Fourth try: Any Indian subcontinent voice
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
          voice.lang.includes('hi') || // Hindi
          voice.lang.includes('ur') || // Urdu
          voice.lang.includes('pa') || // Punjabi
          voice.name.toLowerCase().includes('india') ||
          voice.name.toLowerCase().includes('indian')
        )
      }
      
      // Final fallback: Any available voice
      if (!selectedVoice && voices.length > 0) {
        selectedVoice = voices[0]
        console.log("⚠️ Using fallback voice:", selectedVoice.name)
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice
        console.log("✅ Using voice:", selectedVoice.name, "Language:", selectedVoice.lang)
      } else {
        console.log("⚠️ No suitable voice found, using default")
      }

      // Set language and properties
      utterance.lang = "bn-BD" // Bengali language
      utterance.rate = 0.7 // Slower for better understanding
      utterance.pitch = 1.0
      utterance.volume = 1.0

      // Set up event handlers
      utterance.onstart = () => {
        console.log("🎤 Speech started")
        setIsPlaying(true)
        setIsPaused(false)
        setError(null)
      }

      utterance.onend = () => {
        console.log("✅ Speech ended")
        setIsPlaying(false)
        setIsPaused(false)
        speechRef.current = null
        setError(null)
      }

      utterance.onpause = () => {
        console.log("⏸️ Speech paused")
        setIsPaused(true)
      }

      utterance.onresume = () => {
        console.log("▶️ Speech resumed")
        setIsPaused(false)
      }

      utterance.onerror = (event) => {
        console.error("❌ Speech synthesis error:", event)
        setIsPlaying(false)
        setIsPaused(false)
        speechRef.current = null
        
        // Handle specific errors
        if (event.error === 'not-allowed') {
          setError("অডিও চালানোর অনুমতি নেই। ব্রাউজার সেটিংস চেক করুন।")
        } else if (event.error === 'network') {
          setError("নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।")
        } else if (event.error === 'synthesis-failed') {
          setError("স্পিচ সিনথেসিস ব্যর্থ। অন্য ব্রাউজার ব্যবহার করুন।")
        } else {
          setError("অডিও চালু করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।")
        }
      }

      // Store reference and start speaking
      speechRef.current = utterance
      window.speechSynthesis.speak(utterance)
      
    } catch (error) {
      console.error("❌ Speech synthesis setup error:", error)
      setError("স্পিচ সিনথেসিস সেটআপ করতে সমস্যা হয়েছে")
    }
  }

  const handlePause = () => {
    if (!window.speechSynthesis) return
    
    if (isPlaying && !isPaused) {
      window.speechSynthesis.pause()
      setIsPaused(true)
    } else if (isPaused) {
      window.speechSynthesis.resume()
      setIsPaused(false)
    }
  }

  const handleStop = () => {
    if (!window.speechSynthesis) return
    
    window.speechSynthesis.cancel()
    setIsPlaying(false)
    setIsPaused(false)
    speechRef.current = null
    setError(null)
  }

  const handleClick = () => {
    if (isPlaying) {
      if (isPaused) {
        handlePause() // Resume
      } else {
        handlePause() // Pause
      }
    } else {
      handlePlay()
    }
  }

  // If not supported, show error
  if (!isSupported) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Button
          variant={variant}
          size={size}
          disabled
          className="opacity-50"
        >
          <AlertCircle className="h-4 w-4 mr-2" />
          সাপোর্ট নেই
        </Button>
      </div>
    )
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        disabled={!text}
        className={isPlaying ? "bg-blue-50 text-blue-600" : ""}
      >
        {children || (
          <>
            {isPlaying ? (
              isPaused ? (
                <Play className="h-4 w-4 mr-2" />
              ) : (
                <Pause className="h-4 w-4 mr-2" />
              )
            ) : (
              <Volume2 className="h-4 w-4 mr-2" />
            )}
            {isPlaying ? (isPaused ? "চালু করুন" : "বিরতি") : "বাংলা অর্থ শুনুন"}
          </>
        )}
      </Button>
      
      {isPlaying && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleStop}
          className="h-8 w-8 p-0"
        >
          <VolumeX className="h-4 w-4" />
        </Button>
      )}

      {/* Error message */}
      {error && (
        <div className="text-red-500 text-xs max-w-48">
          {error}
        </div>
      )}
    </div>
  )
} 