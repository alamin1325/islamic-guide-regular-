"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Share2, CheckCircle, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface ShareButtonProps {
  title: string
  text: string
  url?: string
  className?: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  children?: React.ReactNode
}

export function ShareButton({
  title,
  text,
  url,
  className = "",
  variant = "outline",
  size = "sm",
  children
}: ShareButtonProps) {
  const [showSuccess, setShowSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleShare = async () => {
    setIsLoading(true)
    
    try {
      const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
      const shareText = `${title}\n\n${text}\n\nইসলামিক গাইড অ্যাপ থেকে শেয়ার করা হয়েছে\n${shareUrl}`

      if (navigator.share) {
        try {
          await navigator.share({
            title: title,
            text: shareText,
            url: shareUrl,
          })
          setShowSuccess(true)
          setTimeout(() => setShowSuccess(false), 3000)
        } catch (error) {
          if (error instanceof Error && error.name !== "AbortError") {
            await copyToClipboard(shareText)
          }
        }
      } else {
        await copyToClipboard(shareText)
      }
    } catch (error) {
      console.error("Share failed:", error)
      alert("শেয়ার করতে সমস্যা হয়েছে।")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      const textArea = document.createElement("textarea")
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleShare}
        disabled={isLoading}
        className={className}
      >
        {children || (
          <>
            <Share2 className="h-4 w-4 mr-2" />
            শেয়ার করুন
          </>
        )}
      </Button>

      {/* Success Message */}
      {showSuccess && (
        <Card className="fixed top-4 right-4 z-50 bg-green-50 dark:bg-green-900/20 border-green-200 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800 dark:text-green-200">
                  ✅ কপি করা হয়েছে!
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSuccess(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
} 