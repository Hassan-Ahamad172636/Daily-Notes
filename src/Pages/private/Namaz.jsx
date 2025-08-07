"use client"

import { useState, useEffect } from 'react'
import { Sun, Moon, Check, Calendar } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// Define prayers with icon metadata instead of JSX elements
const PRAYERS = [
  { id: 1, name: 'Fajr', iconType: 'Sun', iconClass: 'w-6 h-6 text-amber-400' },
  { id: 2, name: 'Zuhr', iconType: 'Sun', iconClass: 'w-6 h-6 text-yellow-400' },
  { id: 3, name: 'Asr', iconType: 'Sun', iconClass: 'w-6 h-6 text-orange-400' },
  { id: 4, name: 'Maghrib', iconType: 'Sun', iconClass: 'w-6 h-6 text-red-400' },
  { id: 5, name: 'Isha', iconType: 'Moon', iconClass: 'w-6 h-6 text-indigo-400' }
]

// Map iconType to actual React component
const iconComponents = {
  Sun,
  Moon
}

export default function Namaz() {
  const [prayers, setPrayers] = useState(() => {
    const storedPrayers = JSON.parse(localStorage.getItem('prayers'))
    return storedPrayers || PRAYERS.map(prayer => ({
      ...prayer,
      completed: false,
      date: new Date().toISOString().split('T')[0]
    }))
  })
  const [prayerHistory, setPrayerHistory] = useState(() =>
    JSON.parse(localStorage.getItem('prayerHistory')) || []
  )

  // Check for new day and reset prayers if needed
  useEffect(() => {
    const checkDayChange = () => {
      const today = new Date().toISOString().split('T')[0]
      const storedDate = prayers[0]?.date || today

      if (today !== storedDate) {
        // Add previous day's data to history
        const completedCount = prayers.filter(p => p.completed).length
        setPrayerHistory(prev => [{
          date: storedDate,
          completedCount
        }, ...prev])

        // Reset prayers for new day
        setPrayers(PRAYERS.map(prayer => ({
          ...prayer,
          completed: false,
          date: today
        })))
      }
    }

    // Run immediately and then every minute
    checkDayChange()
    const interval = setInterval(checkDayChange, 60000)
    return () => clearInterval(interval)
  }, [prayers])

  // Save to localStorage whenever prayers or history change
  useEffect(() => {
    localStorage.setItem('prayers', JSON.stringify(prayers))
    localStorage.setItem('prayerHistory', JSON.stringify(prayerHistory))
  }, [prayers, prayerHistory])

  // Toggle prayer completion
  const togglePrayer = (id) => {
    setPrayers(prev => prev.map(prayer => 
      prayer.id === id ? { ...prayer, completed: !prayer.completed } : prayer
    ))
  }

  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Render icon dynamically
  const renderIcon = (iconType, iconClass) => {
    const IconComponent = iconComponents[iconType]
    return IconComponent ? <IconComponent className={iconClass} /> : null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-1 to-slate-900 p-4 md:p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-teal-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/3 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row gap-8">
        {/* Prayer Cards Section */}
        <div className="flex-1">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-teal-500/20 rounded-xl">
                <Sun className="w-6 h-6 text-teal-400" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-teal-200 bg-clip-text text-transparent">
                Daily Namaz
              </h1>
            </div>
            <p className="text-slate-400">
              Track your five daily prayers
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {prayers.map(prayer => (
              <Card
                key={prayer.id}
                className={`relative bg-slate-800/50 backdrop-blur-md border rounded-xl transition-all duration-300 hover:shadow-lg ${
                  prayer.completed 
                    ? 'border-teal-500/50 bg-teal-500/10 shadow-teal-500/20' 
                    : 'border-slate-700/50 hover:border-teal-500/30'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-700/50 rounded-lg">
                      {renderIcon(prayer.iconType, prayer.iconClass)}
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold mb-1 ${
                        prayer.completed ? 'text-teal-400' : 'text-white'
                      }`}>
                        {prayer.name}
                      </h3>
                      <p className="text-slate-400 text-sm">
                        {prayer.completed ? 'Completed' : 'Not yet prayed'}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => togglePrayer(prayer.id)}
                      className={`${
                        prayer.completed
                          ? 'bg-teal-500/30 text-teal-400'
                          : 'bg-slate-700/50 text-slate-400 hover:bg-teal-500/20 hover:text-teal-400'
                      }`}
                    >
                      <Check className="w-5 h-5" />
                    </Button>
                  </div>
                  {prayer.completed && (
                    <div className="absolute inset-0 rounded-xl border-2 border-teal-400/40 animate-pulse pointer-events-none"></div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Prayer History Section */}
        <div className="lg:w-80 xl:w-96">
          <div className="sticky top-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-teal-500/20 rounded-lg">
                <Calendar className="w-5 h-5 text-teal-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Prayer History</h2>
            </div>
            <Card className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 max-h-[calc(100vh-200px)] overflow-y-auto">
              <CardContent className="p-4">
                {prayerHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Calendar className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="text-slate-400 text-sm">No prayer history yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {prayerHistory.map((entry, index) => (
                      <Card
                        key={index}
                        className="p-3 bg-slate-700/30 border-slate-600/50"
                      >
                        <CardContent className="p-0 flex items-center justify-between">
                          <div>
                            <p className="text-sm text-white">{formatDate(entry.date)}</p>
                            <p className="text-xs text-teal-400">
                              Prayed {entry.completedCount} of 5 namaz
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${
                                  i < entry.completedCount ? 'bg-teal-400' : 'bg-slate-600'
                                }`}
                              />
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}