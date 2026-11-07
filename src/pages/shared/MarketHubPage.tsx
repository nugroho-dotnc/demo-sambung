import { useState, useEffect } from "react"
import { FairPriceDetailPage } from "@/pages/public/FairPriceDetailPage"
import { PriceBoardPage } from "@/pages/public/PriceBoardPage"
import { PriceMapPage } from "@/pages/public/PriceMapPage"
import { ForecastPage } from "@/pages/public/ForecastPage"
import { Card } from "@/components/ui/card"
import { Scale, TrendingUp, Map, Calendar } from "lucide-react"

export type MarketTabType = "fair-price" | "price-board" | "price-map" | "forecast"

interface MarketHubPageProps {
  initialTab?: MarketTabType
  onNavigate?: (tab: string, targetId?: string) => void
}

export function MarketHubPage({ initialTab = "fair-price", onNavigate }: MarketHubPageProps) {
  const [activeTab, setActiveTab] = useState<MarketTabType>(initialTab)

  // Sync if initialTab prop changes from external navigation
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab)
    }
  }, [initialTab])

  const handleTabClick = (tab: MarketTabType) => {
    setActiveTab(tab)
    // Optionally inform parent router to keep activeTab state synchronized
    if (onNavigate) {
      onNavigate(tab)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Top Sticky TabBar for Market Intelligence */}
      <Card className="p-2 bg-card/95 backdrop-blur-md border border-border/80 sticky top-16 z-30 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => handleTabClick("fair-price")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-colors cursor-pointer ${
              activeTab === "fair-price"
                ? "bg-primary text-white dark:text-[#182117] shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Acuan Wajar (PT-07)</span>
          </button>

          <button
            onClick={() => handleTabClick("price-board")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-colors cursor-pointer ${
              activeTab === "price-board"
                ? "bg-primary text-white dark:text-[#182117] shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Papan Rantai Harga</span>
          </button>

          <button
            onClick={() => handleTabClick("price-map")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-colors cursor-pointer ${
              activeTab === "price-map"
                ? "bg-primary text-white dark:text-[#182117] shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Peta Disparitas</span>
          </button>

          <button
            onClick={() => handleTabClick("forecast")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-colors cursor-pointer ${
              activeTab === "forecast"
                ? "bg-primary text-white dark:text-[#182117] shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Prakiraan Pasar AI</span>
          </button>
        </div>
      </Card>

      {/* Active Tab View */}
      <div className="pt-1">
        {activeTab === "fair-price" && (
          <FairPriceDetailPage onNavigate={(target) => {
            if (target === "price-board" || target === "price-map" || target === "forecast") {
              handleTabClick(target as MarketTabType)
            } else if (onNavigate) {
              onNavigate(target)
            }
          }} />
        )}
        {activeTab === "price-board" && <PriceBoardPage />}
        {activeTab === "price-map" && (
          <PriceMapPage onNavigate={(target) => {
            if (target === "fair-price" || target === "price-board" || target === "forecast") {
              handleTabClick(target as MarketTabType)
            } else if (onNavigate) {
              onNavigate(target)
            }
          }} />
        )}
        {activeTab === "forecast" && <ForecastPage />}
      </div>
    </div>
  )
}
