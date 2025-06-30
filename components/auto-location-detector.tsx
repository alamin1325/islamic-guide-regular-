"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Loader2, Navigation, CheckCircle, AlertCircle } from "lucide-react"

interface LocationData {
  city: string
  district: string
  division: string
  postalCode: string
  coordinates: {
    latitude: number
    longitude: number
  }
}

interface AutoLocationDetectorProps {
  onLocationDetected: (location: LocationData) => void
  currentLocation?: string
}

export function AutoLocationDetector({ onLocationDetected, currentLocation }: AutoLocationDetectorProps) {
  const [detecting, setDetecting] = useState(false)
  const [locationStatus, setLocationStatus] = useState<"idle" | "detecting" | "success" | "error">("idle")
  const [detectedLocation, setDetectedLocation] = useState<LocationData | null>(null)

  // Auto-detect location on component mount
  useEffect(() => {
    detectLocation()
  }, [])

  // Listen for manual location detection trigger
  useEffect(() => {
    const handleDetectLocation = () => {
      detectLocation()
    }

    window.addEventListener('detectLocation', handleDetectLocation)
    return () => {
      window.removeEventListener('detectLocation', handleDetectLocation)
    }
  }, [])

  const detectLocation = async () => {
    setDetecting(true)
    setLocationStatus("detecting")

    try {
      // Get user's current position
      const position = await getCurrentPosition()
      const { latitude, longitude } = position.coords

      // Get location details from coordinates
      const locationData = await getLocationFromCoordinates(latitude, longitude)

      setDetectedLocation(locationData)
      setLocationStatus("success")
      onLocationDetected(locationData)
    } catch (error) {
      console.error("Location detection failed:", error)
      setLocationStatus("error")

      // Fallback to Dimla, Nilphamari
      const fallbackLocation: LocationData = {
        city: "দিমলা",
        district: "নীলফামারী",
        division: "রংপুর",
        postalCode: "5350",
        coordinates: {
          latitude: 25.6516,
          longitude: 88.6741,
        },
      }

      setDetectedLocation(fallbackLocation)
      onLocationDetected(fallbackLocation)
    } finally {
      setDetecting(false)
    }
  }

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported"))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes cache
        },
      )
    })
  }

  const getLocationFromCoordinates = async (lat: number, lon: number): Promise<LocationData> => {
    // Bangladesh location mapping based on coordinates
    const bangladeshLocations = [
      {
        name: "দিমলা",
        district: "নীলফামারী",
        division: "রংপুর",
        postalCode: "5350",
        lat: 25.6516,
        lng: 88.6741,
        radius: 0.1,
      },
      {
        name: "নীলফামারী",
        district: "নীলফামারী",
        division: "রংপুর",
        postalCode: "5300",
        lat: 25.9317,
        lng: 88.856,
        radius: 0.2,
      },
      {
        name: "রংপুর",
        district: "রংপুর",
        division: "রংপুর",
        postalCode: "5400",
        lat: 25.7439,
        lng: 89.2752,
        radius: 0.3,
      },
      {
        name: "ঢাকা",
        district: "ঢাকা",
        division: "ঢাকা",
        postalCode: "1000",
        lat: 23.8103,
        lng: 90.4125,
        radius: 0.5,
      },
      {
        name: "চট্টগ্রাম",
        district: "চট্টগ্রাম",
        division: "চট্টগ্রাম",
        postalCode: "4000",
        lat: 22.3569,
        lng: 91.7832,
        radius: 0.5,
      },
    ]

    // Find closest location
    let closestLocation = bangladeshLocations[0] // Default to Dimla
    let minDistance = Number.MAX_VALUE

    for (const location of bangladeshLocations) {
      const distance = Math.sqrt(Math.pow(lat - location.lat, 2) + Math.pow(lon - location.lng, 2))
      if (distance < minDistance) {
        minDistance = distance
        closestLocation = location
      }
    }

    return {
      city: closestLocation.name,
      district: closestLocation.district,
      division: closestLocation.division,
      postalCode: closestLocation.postalCode,
      coordinates: { latitude: lat, longitude: lon },
    }
  }

  const getStatusIcon = () => {
    switch (locationStatus) {
      case "detecting":
        return <Loader2 className="h-4 w-4 animate-spin" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-orange-600" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  const getStatusText = () => {
    switch (locationStatus) {
      case "detecting":
        return "অবস্থান খুঁজে বের করা হচ্ছে..."
      case "success":
        return "অবস্থান সফলভাবে শনাক্ত করা হয়েছে"
      case "error":
        return "অবস্থান শনাক্ত করতে সমস্যা (ডিফল্ট: দিমলা)"
      default:
        return "অবস্থান শনাক্ত করুন"
    }
  }

  const getStatusColor = () => {
    switch (locationStatus) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800"
      case "error":
        return "bg-orange-50 border-orange-200 text-orange-800"
      case "detecting":
        return "bg-blue-50 border-blue-200 text-blue-800"
      default:
        return "bg-gray-50 border-gray-200 text-gray-800"
    }
  }

  return (
    <Card className={`${getStatusColor()} transition-colors`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div>
              <p className="font-medium">{getStatusText()}</p>
              {detectedLocation && (
                <p className="text-sm opacity-75">
                  {detectedLocation.city}, {detectedLocation.district}, {detectedLocation.division} (
                  {detectedLocation.postalCode})
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {locationStatus === "success" && <Badge variant="secondary">Auto</Badge>}
            <Button variant="outline" size="sm" onClick={detectLocation} disabled={detecting}>
              <Navigation className="h-4 w-4 mr-2" />
              {detecting ? "খুঁজছি..." : "পুনরায় খুঁজুন"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
