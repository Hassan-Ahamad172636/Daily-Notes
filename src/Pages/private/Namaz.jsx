"use client";

import { useState, useEffect } from "react";
import { Sun, Moon, Check, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { addNamaz, getNamazHistory, getTodayNamaz } from "@/util/endPoints/namaz";

// Prayer definitions
const PRAYERS = [
  { id: 1, name: "fajr", iconType: "Sun", iconClass: "w-6 h-6 text-amber-400" },
  { id: 2, name: "zuhr", iconType: "Sun", iconClass: "w-6 h-6 text-yellow-400" },
  { id: 3, name: "asar", iconType: "Sun", iconClass: "w-6 h-6 text-orange-400" },
  { id: 4, name: "maghrib", iconType: "Sun", iconClass: "w-6 h-6 text-red-400" },
  { id: 5, name: "isha", iconType: "Moon", iconClass: "w-6 h-6 text-indigo-400" },
];

const iconComponents = { Sun, Moon };

export default function Namaz() {
  const [namaz, setNamaz] = useState({
    fajr: false,
    zuhr: false,
    asar: false,
    maghrib: false,
    isha: false,
  });

  const [prayerHistory, setPrayerHistory] = useState([]);

  // Fetch today's namaz
  async function fetchTodayNamaz() {
    try {
      const res = await getTodayNamaz();
      if (res?.data) {
        setNamaz({
          fajr: res.data.fajr || false,
          zuhr: res.data.zuhr || false,
          asar: res.data.asar || false,
          maghrib: res.data.maghrib || false,
          isha: res.data.isha || false,
        });
      }
    } catch (err) {
      console.error("Error fetching today's namaz:", err);
    }
  }

  // Fetch full history
  async function fetchNamazHistory() {
    try {
      const res = await getNamazHistory();
      if (res?.data) {
        setPrayerHistory(res.data);
      }
    } catch (err) {
      console.error("Error fetching namaz history:", err);
    }
  }

  useEffect(() => {
    fetchTodayNamaz();
    fetchNamazHistory();
  }, []);

  // Toggle a prayer
  const togglePrayer = async (prayer) => {
    const newValue = !namaz[prayer.name];
    setNamaz((prev) => ({ ...prev, [prayer.name]: newValue }));

    try {
      await addNamaz({ prayerName: prayer.name, value: newValue });
      fetchTodayNamaz();
      fetchNamazHistory();
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const renderIcon = (type, cls) => {
    const Icon = iconComponents[type];
    return Icon ? <Icon className={cls} /> : null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-1 to-slate-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row gap-8">
        {/* Prayer Cards */}
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
            <p className="text-slate-400">Track your five daily prayers</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRAYERS.map((prayer) => (
              <Card
                key={prayer.id}
                onClick={() => togglePrayer(prayer)}
                className={`cursor-pointer relative bg-slate-800/50 backdrop-blur-md border rounded-xl transition-all duration-300 hover:shadow-lg ${
                  namaz[prayer.name]
                    ? "border-teal-500/50 bg-teal-500/10 shadow-teal-500/20"
                    : "border-slate-700/50 hover:border-teal-500/30"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-700/50 rounded-lg">
                      {renderIcon(prayer.iconType, prayer.iconClass)}
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`text-lg font-semibold mb-1 ${
                          namaz[prayer.name] ? "text-teal-400" : "text-white"
                        }`}
                      >
                        {prayer.name}
                      </h3>
                      <p className="text-slate-400 text-sm">
                        {namaz[prayer.name] ? "Completed" : "Not yet prayed"}
                      </p>
                    </div>
                    {/* <Button
                      variant="ghost"
                      size="icon"
                      className={`${
                        namaz[prayer.name]
                          ? "bg-teal-500/30 text-teal-400"
                          : "bg-slate-700/50 text-slate-400"
                      }`}
                    >
                      <Check className="w-5 h-5" />
                    </Button> */}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* History */}
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
                    {prayerHistory.map((entry, idx) => {
                      const completedCount =
                        ["fajr", "zuhr", "asar", "maghrib", "isha"].filter(
                          (p) => entry[p]
                        ).length;
                      return (
                        <Card key={idx} className="p-3 bg-slate-700/30 border-slate-600/50">
                          <CardContent className="p-0 flex items-center justify-between">
                            <div>
                              <p className="text-sm text-white">{formatDate(entry.date)}</p>
                              <p className="text-xs text-teal-400">
                                Prayed {completedCount} of 5 namaz
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-2 h-2 rounded-full ${
                                    i < completedCount
                                      ? "bg-teal-400"
                                      : "bg-slate-600"
                                  }`}
                                />
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
