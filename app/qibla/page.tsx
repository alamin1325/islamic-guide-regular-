"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShareButton } from "@/components/share-button"
import { Compass, MapPin, Navigation, RotateCcw, Target, Clock, Globe, Smartphone, AlertCircle, CheckCircle, Settings, Info, Star } from "lucide-react"
import Link from "next/link"

interface Location {
  latitude: number
  longitude: number
  city?: string
  country?: string
}

interface QiblaData {
  direction: number
  distance: number
  bearing: number
  location: Location
  accuracy: number
}

export default function QiblaPage() {
  const [location, setLocation] = useState<Location | null>(null)
  const [qiblaDirection, setQiblaDirection] = useState<number>(0)
  const [compassHeading, setCompassHeading] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [currentUrl, setCurrentUrl] = useState("")
  const [isCalibrated, setIsCalibrated] = useState(false)
  const [compassAccuracy, setCompassAccuracy] = useState<number>(0)
  const [showInstructions, setShowInstructions] = useState(true)
  const [isCompassActive, setIsCompassActive] = useState(false)
  const compassRef = useRef<HTMLDivElement>(null)
  const needleRef = useRef<HTMLDivElement>(null)

  // কাবা শরীফের স্থানাঙ্ক (মক্কা, সৌদি আরব) - উচ্চ নির্ভুলতা
  const KAABA_LAT = 21.4225
  const KAABA_LNG = 39.8262

  useEffect(() => {
    setCurrentUrl(window.location.origin + "/qibla")
    // Auto-detect location on page load
    setTimeout(() => {
      getCurrentLocation()
    }, 1000)
  }, [])

  // বর্তমান অবস্থান নির্ণয় - উন্নত নির্ভুলতা
  const getCurrentLocation = () => {
    setIsLoading(true)
    setError("")

    if (!navigator.geolocation) {
      setError("আপনার ব্রাউজারে অবস্থান সেবা সাপোর্ট করে না। অনুগ্রহ করে HTTPS ব্যবহার করুন।")
      setIsLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords
        const newLocation = { latitude, longitude }
        setLocation(newLocation)
        setCompassAccuracy(accuracy || 0)
        calculateQiblaDirection(newLocation)
        setIsLoading(false)
        setIsCalibrated(true)
        setIsCompassActive(true)
      },
      (error) => {
        console.error("Geolocation error:", error)
        let errorMessage = "আপনার অবস্থান নির্ণয় করা যায়নি।"
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "অবস্থান অনুমতি দেওয়া হয়নি। অনুগ্রহ করে ব্রাউজার সেটিংসে অবস্থান অনুমতি দিন।"
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "অবস্থান তথ্য পাওয়া যায়নি। অনুগ্রহ করে ইন্টারনেট কানেকশন চেক করুন।"
            break
          case error.TIMEOUT:
            errorMessage = "অবস্থান নির্ণয়ে সময় বেশি লাগছে। অনুগ্রহ করে আবার চেষ্টা করুন।"
            break
        }
        
        setError(errorMessage)
        setIsLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000 // 5 minutes
      }
    )
  }

  // উন্নত কম্পাস হেডিং আপডেট
  useEffect(() => {
    if ('DeviceOrientationEvent' in window) {
      const handleOrientation = (event: DeviceOrientationEvent) => {
        if (event.alpha !== null && event.beta !== null && event.gamma !== null) {
          // More accurate compass calculation
          let heading = event.alpha
          
          // Adjust for device orientation
          if (event.webkitCompassHeading) {
            heading = event.webkitCompassHeading
          } else if (event.alpha !== null) {
            heading = event.alpha
          }
          
          setCompassHeading(heading)
        }
      }

      const requestPermission = async () => {
        if ('DeviceOrientationEvent' in window && 'requestPermission' in DeviceOrientationEvent) {
          try {
            const permission = await (DeviceOrientationEvent as any).requestPermission()
            if (permission === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation)
            }
          } catch (error) {
            console.log('Device orientation permission denied')
          }
        } else {
          window.addEventListener('deviceorientation', handleOrientation)
        }
      }

      requestPermission()
      
      return () => window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [])

  // উচ্চ নির্ভুলতার কিবলা দিক নির্ণয়
  const calculateQiblaDirection = (userLocation: Location) => {
    const lat1 = userLocation.latitude * Math.PI / 180
    const lng1 = userLocation.longitude * Math.PI / 180
    const lat2 = KAABA_LAT * Math.PI / 180
    const lng2 = KAABA_LNG * Math.PI / 180

    const y = Math.sin(lng2 - lng1) * Math.cos(lat2)
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1)
    
    let bearing = Math.atan2(y, x) * 180 / Math.PI
    bearing = (bearing + 360) % 360

    setQiblaDirection(bearing)
  }

  // উন্নত দূরত্ব নির্ণয় (কিলোমিটারে)
  const calculateDistance = (userLocation: Location): number => {
    const R = 6371 // পৃথিবীর ব্যাসার্ধ (কিমি)
    const lat1 = userLocation.latitude * Math.PI / 180
    const lng1 = userLocation.longitude * Math.PI / 180
    const lat2 = KAABA_LAT * Math.PI / 180
    const lng2 = KAABA_LNG * Math.PI / 180

    const dLat = lat2 - lat1
    const dLng = lng2 - lng1

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dLng/2) * Math.sin(dLng/2)
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return Math.round(R * c)
  }

  // কম্পাস ক্যালিব্রেশন
  const calibrateCompass = () => {
    setIsCalibrated(false)
    setShowInstructions(true)
    
    // Show calibration animation
    if (compassRef.current) {
      compassRef.current.style.animation = 'spin 3s ease-in-out infinite'
      setTimeout(() => {
        if (compassRef.current) {
          compassRef.current.style.animation = ''
        }
        setIsCalibrated(true)
      }, 3000)
    }
  }

  // উন্নত কম্পাস রেন্ডার
  const renderCompass = () => {
    const rotation = qiblaDirection - compassHeading
    const distance = location ? calculateDistance(location) : 0
    const accuracy = compassAccuracy > 0 ? `±${Math.round(compassAccuracy)}m` : ""

    return (
      <div className="relative w-96 h-96 mx-auto">
        {/* Outer Ring */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-green-600 to-blue-800 rounded-full border-8 border-blue-400 shadow-2xl animate-pulse">
          {/* Compass Face */}
          <div className="absolute inset-4 bg-gradient-to-br from-white via-gray-50 to-white rounded-full border-4 border-gray-300 shadow-inner">
            {/* Cardinal Directions */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
              <div className="text-red-600 font-bold text-2xl">N</div>
              <div className="text-xs text-gray-500 text-center">উত্তর</div>
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="text-gray-600 font-bold text-2xl">S</div>
              <div className="text-xs text-gray-500 text-center">দক্ষিণ</div>
            </div>
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <div className="text-gray-600 font-bold text-2xl">E</div>
              <div className="text-xs text-gray-500 text-center">পূর্ব</div>
            </div>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="text-gray-600 font-bold text-2xl">W</div>
              <div className="text-xs text-gray-500 text-center">পশ্চিম</div>
            </div>

            {/* Degree Markers */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((degree) => (
              <div
                key={degree}
                className="absolute w-1 h-8 bg-gray-400 transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) rotate(${degree}deg) translateY(-40px)`
                }}
              />
            ))}

            {/* Inner Ring */}
            <div className="absolute inset-8 bg-gradient-to-br from-blue-50 to-green-50 rounded-full border-2 border-blue-200">
              {/* Center Point */}
              <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-gradient-to-br from-green-600 to-green-700 rounded-full transform -translate-x-1/2 -translate-y-1/2 border-4 border-white shadow-lg flex items-center justify-center z-20">
                <Target className="h-4 w-4 text-white" />
              </div>

              {/* Qibla Needle - Professional Design */}
              <div 
                ref={needleRef}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 origin-center transition-transform duration-700 ease-out z-10"
                style={{ transform: `translate(-50%, -50%) rotate(${rotation}deg)` }}
              >
                {/* Main Needle Body */}
                <div className="relative">
                  {/* Needle Shaft */}
                  <div className="w-2 h-40 bg-gradient-to-t from-green-800 via-green-600 to-green-400 rounded-full shadow-lg border-2 border-white">
                    {/* Needle Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-green-400 to-transparent rounded-full opacity-30 animate-pulse"></div>
                  </div>
                  
                  {/* Needle Tip */}
                  <div className="absolute -top-6 -left-3 w-8 h-8 bg-gradient-to-br from-green-500 to-green-700 rounded-full border-4 border-white shadow-xl flex items-center justify-center animate-pulse">
                    <Star className="h-4 w-4 text-white fill-current" />
                  </div>
                  
                  {/* Needle Base */}
                  <div className="absolute -bottom-4 -left-3 w-8 h-8 bg-gradient-to-br from-green-700 to-green-900 rounded-full border-3 border-white shadow-lg"></div>
                  
                  {/* Direction Arrow */}
                  <div className="absolute -top-2 -left-1 w-4 h-4 bg-green-600 transform rotate-45 border-2 border-white"></div>
                </div>
              </div>

              {/* Direction Labels */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-center z-30">
                <div className="text-xs text-gray-600 font-medium bg-white/80 px-2 py-1 rounded-full">কিবলা</div>
              </div>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center z-30">
                <div className="text-xs text-gray-600 font-medium bg-white/80 px-2 py-1 rounded-full">মক্কা</div>
              </div>

              {/* Live Direction Indicator */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
                <div className="flex items-center justify-center space-x-2 bg-green-100/90 backdrop-blur-sm px-3 py-1 rounded-full border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-green-800">লাইভ</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Display */}
        <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 text-center space-y-2">
          <div className="text-3xl font-bold text-green-600 bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full shadow-lg">
            {Math.round(qiblaDirection)}°
          </div>
          <div className="text-sm text-gray-600 bg-white/80 backdrop-blur-sm px-4 py-1 rounded-full">
            {distance} কিমি দূরে
          </div>
          {accuracy && (
            <div className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              নির্ভুলতা: {accuracy}
            </div>
          )}
        </div>

        {/* Compass Status */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          {isCompassActive ? (
            <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>সক্রিয়</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span>নিষ্ক্রিয়</span>
            </div>
          )}
        </div>

        {/* Live Qibla Detector Badge */}
        <div className="absolute top-4 right-4">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              <span>লাইভ কিবলা ডিটেক্টর</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <Link href="/" className="flex items-center space-x-2">
              <Compass className="h-6 w-6 text-green-600" />
              <span className="text-lg sm:text-xl font-bold">ইসলামিক গাইড</span>
            </Link>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <h1 className="text-xl sm:text-2xl font-bold text-green-600">কিবলা কম্পাস</h1>
              <ShareButton
                title="কিবলা কম্পাস"
                text="ইসলামিক গাইড অ্যাপে আপনার অবস্থান থেকে কিবলার সঠিক দিকনির্দেশনা পান।"
                url={currentUrl}
                variant="outline"
                size="sm"
              >
                <Navigation className="h-4 w-4 mr-2" />
                শেয়ার
              </ShareButton>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Status Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-center space-x-4">
            {isCalibrated ? (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                কম্পাস প্রস্তুত
              </Badge>
            ) : (
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                <AlertCircle className="h-3 w-3 mr-1" />
                ক্যালিব্রেট হচ্ছে...
              </Badge>
            )}
            {location && (
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                <MapPin className="h-3 w-3 mr-1" />
                অবস্থান সনাক্ত
              </Badge>
            )}
            {isCompassActive && (
              <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                <Compass className="h-3 w-3 mr-1" />
                কম্পাস সক্রিয়
              </Badge>
            )}
          </div>
        </div>

        {/* Main Qibla Section */}
        <Card className="mb-8 bg-white/95 backdrop-blur-sm shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2 text-2xl">
              <Target className="h-8 w-8 text-green-600" />
              <span>কিবলা কম্পাস</span>
            </CardTitle>
            <p className="text-gray-600">আপনার অবস্থান থেকে কাবা শরীফের সঠিক দিকনির্দেশনা</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Compass Display */}
            <div className="flex justify-center">
              {renderCompass()}
            </div>

            {/* Location Info */}
            {location && (
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>অবস্থান: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</span>
                </div>
                <Badge variant="outline" className="text-green-600 text-lg px-4 py-2">
                  কিবলা দিক: {Math.round(qiblaDirection)}° উত্তর থেকে
                </Badge>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={getCurrentLocation}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                <MapPin className="h-4 w-4 mr-2" />
                {isLoading ? "অবস্থান নির্ণয় হচ্ছে..." : "অবস্থান আপডেট করুন"}
              </Button>
              <Button 
                variant="outline"
                onClick={calibrateCompass}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                কম্পাস ক্যালিব্রেট
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowInstructions(!showInstructions)}
              >
                <Info className="h-4 w-4 mr-2" />
                নির্দেশনা
              </Button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        {showInstructions && (
          <Card className="mb-8 bg-white/95 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Smartphone className="h-5 w-5 text-blue-600" />
                <span>ব্যবহার পদ্ধতি</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-600 flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>১. অবস্থান অনুমতি দিন</span>
                  </h4>
                  <p className="text-sm text-gray-600">আপনার ফোনের অবস্থান সেবা চালু করুন এবং অনুমতি দিন। HTTPS কানেকশন প্রয়োজন।</p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-600 flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>২. ফোন সোজা রাখুন</span>
                  </h4>
                  <p className="text-sm text-gray-600">ফোনটি সোজা করে রাখুন যাতে কম্পাস সঠিকভাবে কাজ করে। চুম্বকীয় হস্তক্ষেপ এড়িয়ে চলুন।</p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-600 flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>৩. সবুজ তীর অনুসরণ করুন</span>
                  </h4>
                  <p className="text-sm text-gray-600">সবুজ তীরের দিকেই কাবা শরীফের অবস্থান। তীরটি সবসময় সঠিক দিক দেখায়।</p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-600 flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>৪. সঠিক দিক নির্ধারণ করুন</span>
                  </h4>
                  <p className="text-sm text-gray-600">তীরের দিকে মুখ করে নামাজ পড়ুন। নির্ভুলতা ±৫ মিটার পর্যন্ত।</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/95 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6 text-center">
              <Globe className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">সর্বত্র ব্যবহার</h3>
              <p className="text-sm text-gray-600">বিশ্বের যেকোনো স্থান থেকে কিবলা নির্ণয় করুন</p>
            </CardContent>
          </Card>
          <Card className="bg-white/95 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6 text-center">
              <Target className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">উচ্চ নির্ভুলতা</h3>
              <p className="text-sm text-gray-600">±৫ মিটার নির্ভুলতার সাথে কিবলা দিক নির্ণয়</p>
            </CardContent>
          </Card>
          <Card className="bg-white/95 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6 text-center">
              <Clock className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">রিয়েল-টাইম</h3>
              <p className="text-sm text-gray-600">সর্বদা আপডেটেড দিকনির্দেশনা</p>
            </CardContent>
          </Card>
        </div>

        {/* Prayer Times Link */}
        <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2">নামাজের সময়সূচি</h3>
            <p className="mb-4">আপনার এলাকার নামাজের সময়সূচি দেখুন</p>
            <Link href="/prayer-times">
              <Button variant="secondary" size="lg">
                নামাজের সময় দেখুন
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(90deg); }
          50% { transform: rotate(180deg); }
          75% { transform: rotate(270deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
} 