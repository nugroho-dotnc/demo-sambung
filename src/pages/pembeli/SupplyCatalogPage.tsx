import { useState } from "react"
import { useSambungStore } from "@/store/sambungStore"
import { formatRupiah } from "@/lib/utils"
import { calculateFairPrice, evaluatePriceLamp } from "@/lib/priceEngine"
import { PriceLampBadge } from "@/components/domain/PriceLampBadge"
import { ExportSupplyModal } from "@/pages/pembeli/ExportSupplyModal"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Filter,
  Download,
  MapPin,
  Calendar,
  AlertCircle,
  ArrowRight
} from "lucide-react"

interface SupplyCatalogPageProps {
  onNavigate: (tab: string, targetId?: string) => void
}

export function SupplyCatalogPage({ onNavigate }: SupplyCatalogPageProps) {
  const { offers } = useSambungStore()
  const [selectedGrain, setSelectedGrain] = useState<string>("Semua")
  const [selectedProvince, setSelectedProvince] = useState<string>("Semua")
  const [searchQuery, setSearchQuery] = useState("")
  const [showExportModal, setShowExportModal] = useState(false)

  // Only published offers with availableVolume > 0 (or all published)
  const publishedOffers = offers.filter((o) => o.publicationStatus === "Terbit")

  const filteredOffers = publishedOffers.filter((o) => {
    const matchGrain = selectedGrain === "Semua" || o.grainType === selectedGrain
    const matchProv = selectedProvince === "Semua" || o.province === selectedProvince
    const matchQuery =
      o.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.regency.toLowerCase().includes(searchQuery.toLowerCase())
    return matchGrain && matchProv && matchQuery
  })

  const provinces = ["Semua", "Jawa Barat", "Jawa Tengah", "Jawa Timur", "Bali", "Sulawesi Selatan"]

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span>SAMBUNG</span>
          <span>/</span>
          <span className="text-foreground">KATALOG PASOKAN</span>
        </div>

        <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Katalog Pasokan Gabah Siap Giling
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Temukan pasokan gabah GKP dan GKG langsung dari kelompok tani terpercaya di berbagai wilayah.
            </p>
          </div>

          <Button
            onClick={() => setShowExportModal(true)}
            variant="outline"
            className="self-start sm:self-auto gap-2 text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh CSV Pasokan</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-5 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari kecamatan, kabupaten, atau petani..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full min-h-[44px] pl-9 pr-4 rounded-md border border-input bg-card text-body-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-[3px] focus-visible:outline-ring"
              />
            </div>

            {/* Grain Buttons */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-bold text-muted-foreground uppercase">Jenis:</span>
              {["Semua", "GKP", "GKG"].map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGrain(g)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all min-h-[36px] ${
                    selectedGrain === g
                      ? "bg-primary text-white dark:text-[#182117] shadow-xs"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Province Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-border">
            <span className="text-xs font-bold text-muted-foreground uppercase shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Provinsi:</span>
            </span>
            {provinces.map((prov) => (
              <button
                key={prov}
                onClick={() => setSelectedProvince(prov)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors shrink-0 min-h-[36px] ${
                  selectedProvince === prov
                    ? "bg-secondary text-secondary-foreground font-bold border border-primary/40"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {prov}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Catalog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredOffers.length === 0 ? (
          <div className="col-span-2 p-12 text-center text-muted-foreground bg-card rounded-xl border border-dashed">
            Tidak ada pasokan gabah yang sesuai dengan pencarian Anda.
          </div>
        ) : (
          filteredOffers.map((offer) => {
            const estimate = calculateFairPrice(
              offer.grainType,
              offer.province,
              13500,
              offer.grainType === "GKP" ? 0.52 : 0.63
            )
            const lamp = evaluatePriceLamp(offer.askingPrice, estimate.lowerBound, estimate.upperBound)
            const isOutOfStock = offer.availableVolume <= 0

            return (
              <Card
                key={offer.id}
                className={`border transition-all flex flex-col justify-between ${
                  isOutOfStock ? "opacity-60 bg-muted/20" : "hover:border-primary/50 shadow-sm"
                }`}
              >
                <div>
                  <CardHeader className="bg-muted/30 p-5 border-b border-border flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="font-bold text-xs">
                        {offer.grainType}
                      </Badge>
                      <span className="text-xs font-semibold text-foreground">
                        {offer.farmerName}
                      </span>
                    </div>
                    <PriceLampBadge status={lamp.status} size="sm" />
                  </CardHeader>

                  <CardContent className="p-5 space-y-4">
                    {/* Moderation Warning if any (DEC-013f: buyer sees note without personal info) */}
                    {offer.moderationStatus === "Sedang diminta perbaikan" && (
                      <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">Sedang Diminta Perbaikan: </span>
                          <span>{offer.moderationIssue || "Menunggu pembaruan informasi dari petani."}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-xs text-muted-foreground font-semibold">Harga Minta Petani</span>
                        <p className="text-2xl font-extrabold font-mono text-primary">
                          {formatRupiah(offer.askingPrice)}
                          <span className="text-xs font-normal text-muted-foreground ml-1">/kg</span>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-muted-foreground font-semibold">Volume Tersedia</span>
                        <p className="text-xl font-bold font-mono text-foreground">
                          {offer.availableVolume.toLocaleString("id-ID")} kg
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          (dari total {offer.totalVolume.toLocaleString("id-ID")} kg)
                        </p>
                      </div>
                    </div>

                    {/* Metadata Specs */}
                    <div className="p-3 rounded-lg bg-muted/60 text-xs space-y-1.5">
                      <div className="flex items-center gap-1.5 text-foreground">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>Kec. {offer.district}, {offer.regency}, {offer.province}</span>
                      </div>
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>Kadar Air: <strong className="text-foreground">{typeof offer.moisturePercent === "number" ? `${offer.moisturePercent}%` : offer.moisturePercent}</strong></span>
                        <span>Kotoran: <strong className="text-foreground">{typeof offer.impurityPercent === "number" ? `${offer.impurityPercent}%` : offer.impurityPercent}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground pt-1 border-t border-border/60">
                        <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>Siap Panen: <strong className="text-foreground">{offer.readyDate}</strong></span>
                      </div>
                    </div>
                  </CardContent>
                </div>

                <div className="p-5 pt-0">
                  <Button
                    disabled={isOutOfStock}
                    onClick={() => onNavigate("supply-detail", offer.id)}
                    className="w-full font-bold gap-2"
                  >
                    <span>{isOutOfStock ? "Stok Habis Terpesan" : "Pesan Parsial / Negosiasi"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            )
          })
        )}
      </div>

      {/* Export Supply Modal (PR-07) */}
      <ExportSupplyModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </div>
  )
}
