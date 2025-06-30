"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, BookOpen, Heart } from "lucide-react"

export function PrayerInfoCard() {
  const prayerDetails = [
    {
      name: "ফজর",
      icon: "🌅",
      time: "সূর্যোদয়ের আগে",
      rakats: {
        farz: 2,
        sunnah: 2,
        total: 4,
      },
      benefits: "দিনের শুরুতে আল্লাহর কাছে দোয়া ও কৃতজ্ঞতা",
      color: "bg-orange-50 border-orange-200 text-orange-800",
    },
    {
      name: "যোহর",
      icon: "☀️",
      time: "দুপুরে সূর্য মাথার উপর",
      rakats: {
        farz: 4,
        sunnah: 4,
        total: 8,
      },
      benefits: "দিনের কাজের মাঝে আল্লাহকে স্মরণ",
      color: "bg-yellow-50 border-yellow-200 text-yellow-800",
    },
    {
      name: "আসর",
      icon: "🌤️",
      time: "বিকেলে সূর্য হেলে পড়লে",
      rakats: {
        farz: 4,
        sunnah: 4,
        total: 8,
      },
      benefits: "দিনের শেষ ভাগে তওবা ও ইস্তিগফার",
      color: "bg-blue-50 border-blue-200 text-blue-800",
    },
    {
      name: "মাগরিব",
      icon: "🌅",
      time: "সূর্যাস্তের পর",
      rakats: {
        farz: 3,
        sunnah: 2,
        total: 5,
      },
      benefits: "দিনের কৃতজ্ঞতা ও রাতের জন্য প্রস্তুতি",
      color: "bg-purple-50 border-purple-200 text-purple-800",
    },
    {
      name: "এশা",
      icon: "🌙",
      time: "রাতের অন্ধকার নামলে",
      rakats: {
        farz: 4,
        sunnah: 2,
        witr: 3,
        total: 9,
      },
      benefits: "রাতের শান্তিতে আল্লাহর ইবাদত ও দোয়া",
      color: "bg-indigo-50 border-indigo-200 text-indigo-800",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">৫ ওয়াক্ত নামাজের বিস্তারিত</h2>
        <p className="text-muted-foreground">প্রতিদিন ৫ ওয়াক্ত নামাজ আদায় করা প্রতিটি মুসলমানের উপর ফরজ</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prayerDetails.map((prayer, index) => (
          <Card key={index} className={`${prayer.color} transition-all hover:shadow-lg`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{prayer.icon}</span>
                  <CardTitle className="text-xl">{prayer.name}</CardTitle>
                </div>
                <Badge variant="outline" className="bg-white/50">
                  {prayer.rakats.total} রাকাত
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Time */}
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">{prayer.time}</span>
              </div>

              {/* Rakats Breakdown */}
              <div className="bg-white/50 p-3 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  রাকাত বিভাজন:
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>ফরজ:</span>
                    <span className="font-medium">{prayer.rakats.farz} রাকাত</span>
                  </div>
                  <div className="flex justify-between">
                    <span>সুন্নত:</span>
                    <span className="font-medium">{prayer.rakats.sunnah} রাকাত</span>
                  </div>
                  {prayer.rakats.witr && (
                    <div className="flex justify-between">
                      <span>বিতর:</span>
                      <span className="font-medium">{prayer.rakats.witr} রাকাত</span>
                    </div>
                  )}
                  <div className="border-t pt-1 flex justify-between font-semibold">
                    <span>মোট:</span>
                    <span>{prayer.rakats.total} রাকাত</span>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="flex items-start space-x-2">
                <Heart className="h-4 w-4 mt-1 flex-shrink-0" />
                <p className="text-sm">{prayer.benefits}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-green-800 mb-4">দৈনিক নামাজের সারসংক্ষেপ</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">৫</div>
                <div className="text-sm text-green-700">ওয়াক্ত নামাজ</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">১৭</div>
                <div className="text-sm text-blue-700">ফরজ রাকাত</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">১৪</div>
                <div className="text-sm text-purple-700">সুন্নত রাকাত</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">৩৪</div>
                <div className="text-sm text-orange-700">মোট রাকাত</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">* বিতর নামাজ সহ মোট দৈনিক রাকাত সংখ্যা</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
