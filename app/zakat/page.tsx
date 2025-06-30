"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShareButton } from "@/components/share-button"
import { Calculator, DollarSign, Coins, Banknote, Home, Car, Clock, AlertCircle, CheckCircle, Info, RefreshCw, TrendingUp, Scale, PiggyBank } from "lucide-react"
import Link from "next/link"

interface AssetCategory {
  id: string
  name: string
  description: string
  icon: any
  value: number
  placeholder: string
  unit: string
}

interface ZakatCalculation {
  totalAssets: number
  totalLiabilities: number
  netWorth: number
  nisabAmount: number
  zakatAmount: number
  zakatPercentage: number
  isZakatApplicable: boolean
  goldPrice: number
  silverPrice: number
}

export default function ZakatPage() {
  const [currentUrl, setCurrentUrl] = useState("")
  const [assets, setAssets] = useState<AssetCategory[]>([
    {
      id: "cash",
      name: "নগদ অর্থ",
      description: "ব্যাংক অ্যাকাউন্ট, হাতের নগদ অর্থ",
      icon: Banknote,
      value: 0,
      placeholder: "নগদ অর্থের পরিমাণ",
      unit: "টাকা"
    },
    {
      id: "gold",
      name: "স্বর্ণ",
      description: "স্বর্ণের অলংকার, বার, কয়েন",
      icon: Coins,
      value: 0,
      placeholder: "স্বর্ণের ওজন (গ্রাম)",
      unit: "গ্রাম"
    },
    {
      id: "silver",
      name: "রৌপ্য",
      description: "রৌপ্যের অলংকার, বার, কয়েন",
      icon: Coins,
      value: 0,
      placeholder: "রৌপ্যের ওজন (গ্রাম)",
      unit: "গ্রাম"
    },
    {
      id: "investments",
      name: "বিনিয়োগ",
      description: "শেয়ার, বন্ড, মিউচুয়াল ফান্ড",
      icon: TrendingUp,
      value: 0,
      placeholder: "বিনিয়োগের মূল্য",
      unit: "টাকা"
    },
    {
      id: "business",
      name: "ব্যবসায়িক সম্পদ",
      description: "মালামাল, স্টক, ব্যবসায়িক সম্পদ",
      icon: DollarSign,
      value: 0,
      placeholder: "ব্যবসায়িক সম্পদের মূল্য",
      unit: "টাকা"
    },
    {
      id: "property",
      name: "জমি-জমা",
      description: "বিক্রয়ের উদ্দেশ্যে রাখা সম্পত্তি",
      icon: Home,
      value: 0,
      placeholder: "সম্পত্তির মূল্য",
      unit: "টাকা"
    },
    {
      id: "vehicles",
      name: "যানবাহন",
      description: "বিক্রয়ের উদ্দেশ্যে রাখা গাড়ি",
      icon: Car,
      value: 0,
      placeholder: "যানবাহনের মূল্য",
      unit: "টাকা"
    },
    {
      id: "other",
      name: "অন্যান্য সম্পদ",
      description: "অন্যান্য বাণিজ্যিক সম্পদ",
      icon: PiggyBank,
      value: 0,
      placeholder: "অন্যান্য সম্পদের মূল্য",
      unit: "টাকা"
    }
  ])

  const [liabilities, setLiabilities] = useState({
    loans: 0,
    creditCards: 0,
    mortgages: 0,
    otherDebts: 0
  })

  const [calculation, setCalculation] = useState<ZakatCalculation>({
    totalAssets: 0,
    totalLiabilities: 0,
    netWorth: 0,
    nisabAmount: 0,
    zakatAmount: 0,
    zakatPercentage: 2.5,
    isZakatApplicable: false,
    goldPrice: 0,
    silverPrice: 0
  })

  const [isLoading, setIsLoading] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    setCurrentUrl(window.location.origin + "/zakat")
    fetchGoldSilverPrices()
  }, [])

  // স্বর্ণ-রৌপ্যের বাজার মূল্য আপডেট
  const fetchGoldSilverPrices = async () => {
    try {
      setIsLoading(true)
      // বর্তমান বাজার মূল্য (প্রতি গ্রাম)
      const currentGoldPrice = 8500 // টাকা (প্রতি গ্রাম)
      const currentSilverPrice = 95 // টাকা (প্রতি গ্রাম)
      
      setCalculation(prev => ({
        ...prev,
        goldPrice: currentGoldPrice,
        silverPrice: currentSilverPrice
      }))
    } catch (error) {
      console.error("Error fetching prices:", error)
      // Fallback prices
      setCalculation(prev => ({
        ...prev,
        goldPrice: 8500,
        silverPrice: 95
      }))
    } finally {
      setIsLoading(false)
    }
  }

  // সম্পদের মূল্য আপডেট
  const updateAssetValue = (id: string, value: number) => {
    setAssets(prev => prev.map(asset => 
      asset.id === id ? { ...asset, value: Math.max(0, value) } : asset
    ))
  }

  // দায় আপডেট
  const updateLiability = (type: keyof typeof liabilities, value: number) => {
    setLiabilities(prev => ({
      ...prev,
      [type]: Math.max(0, value)
    }))
  }

  // যাকাত হিসাব
  const calculateZakat = () => {
    // মোট সম্পদ হিসাব
    const totalAssets = assets.reduce((sum, asset) => {
      if (asset.id === "gold") {
        return sum + (asset.value * calculation.goldPrice)
      } else if (asset.id === "silver") {
        return sum + (asset.value * calculation.silverPrice)
      } else {
        return sum + asset.value
      }
    }, 0)

    // মোট দায় হিসাব
    const totalLiabilities = Object.values(liabilities).reduce((sum, value) => sum + value, 0)

    // নিট সম্পদ
    const netWorth = totalAssets - totalLiabilities

    // নিসাব পরিমাণ (স্বর্ণের ৮৭.৪৮ গ্রাম বা রৌপ্যের ৬১২.৩৬ গ্রাম)
    const goldNisab = 87.48 * calculation.goldPrice
    const silverNisab = 612.36 * calculation.silverPrice
    const nisabAmount = Math.min(goldNisab, silverNisab)

    // যাকাত প্রযোজ্য কিনা
    const isZakatApplicable = netWorth >= nisabAmount

    // যাকাতের পরিমাণ (২.৫%)
    const zakatAmount = isZakatApplicable ? (netWorth * 2.5) / 100 : 0

    setCalculation({
      totalAssets,
      totalLiabilities,
      netWorth,
      nisabAmount,
      zakatAmount,
      zakatPercentage: 2.5,
      isZakatApplicable,
      goldPrice: calculation.goldPrice,
      silverPrice: calculation.silverPrice
    })
  }

  // হিসাব রিসেট
  const resetCalculation = () => {
    setAssets(prev => prev.map(asset => ({ ...asset, value: 0 })))
    setLiabilities({
      loans: 0,
      creditCards: 0,
      mortgages: 0,
      otherDebts: 0
    })
    setCalculation({
      totalAssets: 0,
      totalLiabilities: 0,
      netWorth: 0,
      nisabAmount: 0,
      zakatAmount: 0,
      zakatPercentage: 2.5,
      isZakatApplicable: false,
      goldPrice: calculation.goldPrice,
      silverPrice: calculation.silverPrice
    })
  }

  // হিসাব আপডেট
  useEffect(() => {
    calculateZakat()
  }, [assets, liabilities])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-50">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <Link href="/" className="flex items-center space-x-2">
              <Calculator className="h-6 w-6 text-green-600" />
              <span className="text-lg sm:text-xl font-bold">ইসলামিক গাইড</span>
            </Link>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <h1 className="text-xl sm:text-2xl font-bold text-green-600">যাকাত ক্যালকুলেটর</h1>
              <ShareButton
                title="যাকাত ক্যালকুলেটর"
                text="ইসলামিক গাইড অ্যাপে আপনার যাকাতের পরিমাণ সহজেই হিসাব করুন।"
                url={currentUrl}
                variant="outline"
                size="sm"
              >
                <Calculator className="h-4 w-4 mr-2" />
                শেয়ার
              </ShareButton>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Market Prices */}
        <Card className="mb-8 bg-white/95 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              <span>বর্তমান বাজার মূল্য</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-3">
                  <Coins className="h-8 w-8 text-yellow-600" />
                  <div>
                    <div className="font-semibold text-yellow-800">স্বর্ণ</div>
                    <div className="text-sm text-yellow-600">প্রতি গ্রাম</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-yellow-800">
                    ৳{calculation.goldPrice.toLocaleString()}
                  </div>
                  <div className="text-xs text-yellow-600">নিসাব: ৮৭.৪৮ গ্রাম</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <Coins className="h-8 w-8 text-gray-600" />
                  <div>
                    <div className="font-semibold text-gray-800">রৌপ্য</div>
                    <div className="text-sm text-gray-600">প্রতি গ্রাম</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-800">
                    ৳{calculation.silverPrice.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600">নিসাব: ৬১২.৩৬ গ্রাম</div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchGoldSilverPrices}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                মূল্য আপডেট করুন
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Assets Section */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-6 w-6 text-green-600" />
                <span>সম্পদসমূহ</span>
              </CardTitle>
              <p className="text-sm text-gray-600">আপনার সকল সম্পদের মূল্য লিখুন</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {assets.map((asset) => (
                <div key={asset.id} className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <asset.icon className="h-4 w-4 text-green-600" />
                    <span className="font-medium">{asset.name}</span>
                  </Label>
                  <div className="space-y-1">
                    <Input
                      type="number"
                      placeholder={asset.placeholder}
                      value={asset.value || ""}
                      onChange={(e) => updateAssetValue(asset.id, parseFloat(e.target.value) || 0)}
                      className="text-right"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{asset.description}</span>
                      <span>{asset.unit}</span>
                    </div>
                    {asset.id === "gold" && asset.value > 0 && (
                      <div className="text-sm text-green-600 font-medium">
                        মূল্য: ৳{(asset.value * calculation.goldPrice).toLocaleString()}
                      </div>
                    )}
                    {asset.id === "silver" && asset.value > 0 && (
                      <div className="text-sm text-green-600 font-medium">
                        মূল্য: ৳{(asset.value * calculation.silverPrice).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Liabilities Section */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-6 w-6 text-red-600" />
                <span>দায়সমূহ</span>
              </CardTitle>
              <p className="text-sm text-gray-600">আপনার সকল ঋণ ও দায় লিখুন</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>ব্যাংক ঋণ</Label>
                <Input
                  type="number"
                  placeholder="ব্যাংক ঋণের পরিমাণ"
                  value={liabilities.loans || ""}
                  onChange={(e) => updateLiability("loans", parseFloat(e.target.value) || 0)}
                  className="text-right"
                />
              </div>
              <div className="space-y-2">
                <Label>ক্রেডিট কার্ড</Label>
                <Input
                  type="number"
                  placeholder="ক্রেডিট কার্ডের বকেয়া"
                  value={liabilities.creditCards || ""}
                  onChange={(e) => updateLiability("creditCards", parseFloat(e.target.value) || 0)}
                  className="text-right"
                />
              </div>
              <div className="space-y-2">
                <Label>বন্ধক ঋণ</Label>
                <Input
                  type="number"
                  placeholder="বন্ধক ঋণের পরিমাণ"
                  value={liabilities.mortgages || ""}
                  onChange={(e) => updateLiability("mortgages", parseFloat(e.target.value) || 0)}
                  className="text-right"
                />
              </div>
              <div className="space-y-2">
                <Label>অন্যান্য ঋণ</Label>
                <Input
                  type="number"
                  placeholder="অন্যান্য ঋণের পরিমাণ"
                  value={liabilities.otherDebts || ""}
                  onChange={(e) => updateLiability("otherDebts", parseFloat(e.target.value) || 0)}
                  className="text-right"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calculation Results */}
        <Card className="mt-8 bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Scale className="h-6 w-6" />
              <span>যাকাত হিসাব</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white/10 rounded-lg">
                <div className="text-2xl font-bold">৳{calculation.totalAssets.toLocaleString()}</div>
                <div className="text-sm opacity-90">মোট সম্পদ</div>
              </div>
              <div className="text-center p-4 bg-white/10 rounded-lg">
                <div className="text-2xl font-bold">৳{calculation.totalLiabilities.toLocaleString()}</div>
                <div className="text-sm opacity-90">মোট দায়</div>
              </div>
              <div className="text-center p-4 bg-white/10 rounded-lg">
                <div className="text-2xl font-bold">৳{calculation.netWorth.toLocaleString()}</div>
                <div className="text-sm opacity-90">নিট সম্পদ</div>
              </div>
              <div className="text-center p-4 bg-white/10 rounded-lg">
                <div className="text-2xl font-bold">৳{calculation.nisabAmount.toLocaleString()}</div>
                <div className="text-sm opacity-90">নিসাব পরিমাণ</div>
              </div>
            </div>

            <div className="text-center">
              {calculation.isZakatApplicable ? (
                <div className="space-y-4">
                  <div className="text-4xl font-bold text-green-300">
                    ৳{calculation.zakatAmount.toLocaleString()}
                  </div>
                  <div className="text-lg opacity-90">আপনার যাকাতের পরিমাণ</div>
                  <Badge className="bg-green-500 text-white text-lg px-4 py-2">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    যাকাত প্রযোজ্য
                  </Badge>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-4xl font-bold text-yellow-300">৳০</div>
                  <div className="text-lg opacity-90">যাকাত প্রযোজ্য নয়</div>
                  <Badge className="bg-yellow-500 text-white text-lg px-4 py-2">
                    <Info className="h-4 w-4 mr-2" />
                    নিসাবের নিচে
                  </Badge>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary" 
                onClick={resetCalculation}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                রিসেট করুন
              </Button>
              <Button 
                variant="secondary"
                onClick={() => setShowDetails(!showDetails)}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Info className="h-4 w-4 mr-2" />
                বিস্তারিত দেখুন
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information */}
        {showDetails && (
          <Card className="mt-8 bg-white/95 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Info className="h-6 w-6 text-blue-600" />
                <span>যাকাত সম্পর্কে বিস্তারিত তথ্য</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-green-600">যাকাতের শর্তাবলী</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• নিসাব পরিমাণ সম্পদের মালিক হওয়া</li>
                    <li>• সম্পদ এক বছর ধরে থাকা</li>
                    <li>• সম্পদ বাণিজ্যিক উদ্দেশ্যে হওয়া</li>
                    <li>• ঋণমুক্ত হওয়া</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-green-600">নিসাব পরিমাণ</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• স্বর্ণ: ৮৭.৪৮ গ্রাম</li>
                    <li>• রৌপ্য: ৬১২.৩৬ গ্রাম</li>
                    <li>• নগদ অর্থ: স্বর্ণের সমমূল্য</li>
                    <li>• অন্যান্য সম্পদ: স্বর্ণের সমমূল্য</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-green-600">যাকাতের হার</h4>
                <p className="text-sm text-gray-700">
                  যাকাতের হার ২.৫% (৪০ ভাগের ১ ভাগ)। অর্থাৎ প্রতি ১০০ টাকায় ২.৫ টাকা যাকাত দিতে হবে।
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-green-600">যাকাতের খাতসমূহ</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                  <div>
                    <div className="font-medium">১. ফকির-মিসকিন</div>
                    <div>দরিদ্র ও অভাবী মানুষ</div>
                  </div>
                  <div>
                    <div className="font-medium">২. যাকাত আদায়কারী</div>
                    <div>যাকাত সংগ্রহকারী কর্মচারী</div>
                  </div>
                  <div>
                    <div className="font-medium">৩. নতুন মুসলিম</div>
                    <div>ইসলাম গ্রহণকারী ব্যক্তি</div>
                  </div>
                  <div>
                    <div className="font-medium">৪. দাস মুক্তির জন্য</div>
                    <div>দাসত্ব থেকে মুক্তির উদ্দেশ্যে</div>
                  </div>
                  <div>
                    <div className="font-medium">৫. ঋণগ্রস্ত ব্যক্তি</div>
                    <div>ঋণ পরিশোধে অক্ষম ব্যক্তি</div>
                  </div>
                  <div>
                    <div className="font-medium">৬. আল্লাহর পথে</div>
                    <div>ইসলামের প্রচার ও প্রসারে</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
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
          <Card className="bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold mb-2">কিবলা কম্পাস</h3>
              <p className="mb-4">কাবা শরীফের সঠিক দিকনির্দেশনা পান</p>
              <Link href="/qibla">
                <Button variant="secondary" size="lg">
                  কিবলা দেখুন
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 