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
  ArrowRight,
  Sprout
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

  // Only published offers
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
    <div className="max-w-6xl mx-auto space-y-7 pb-14">
      {/* Header & Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/70">
        <div>
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            <span>Sambung</span>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-primary font-bold">Ruang Pembeli</span>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-foreground">Katalog Pasokan</span>
          </nav>

          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Katalog Pasokan Gabah Terverifikasi
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Bandingkan penawaran gabah GKP & GKG langsung dari kelompok tani, periksa mutu panen, dan ajukan pesanan parsial.
          </p>
        </div>

        <Button
          onClick={() => setShowExportModal(true)}
          variant="outline"
          className="self-start sm:self-auto gap-2 text-xs font-semibold border-border/80 shadow-2xs"
        >
          <Download className="w-3.5 h-3.5 text-primary" />
          <span>Ekspor Agregasi CSV</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="bg-card border-border/80 shadow-xs">
        <CardContent className="p-5 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari kecamatan, kabupaten, atau nama petani..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-card text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-2xs"
              />
            </div>

            {/* Grain Buttons */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Komoditas:</span>
              {["Semua", "GKP", "GKG"].map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGrain(g)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
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
          <div className="flex items-center gap-2 overflow-x-auto pt-3 border-t border-border/70">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider shrink-0 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" />
              <span>Wilayah:</span>
            </span>
            {provinces.map((prov) => (
              <button
                key={prov}
                onClick={() => setSelectedProvince(prov)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
                  selectedProvince === prov
                    ? "bg-secondary text-secondary-foreground font-bold border border-primary/40 shadow-2xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
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
          <div className="col-span-2 p-12 text-center text-muted-foreground bg-card rounded-2xl border border-dashed border-border/80 shadow-xs">
            <Sprout className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
            <h3 className="text-base font-bold text-foreground">Tidak ada pasokan yang cocok</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Coba sesuaikan kata kunci pencarian atau ubah filter jenis komoditas dan wilayah.
            </p>
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
                className={`border transition-all flex flex-col justify-between overflow-hidden rounded-2xl ${
                  isOutOfStock
                    ? "opacity-60 bg-muted/20 border-border/80"
                    : "bg-card border-border/80 hover:border-primary/50 shadow-xs hover:shadow-md"
                }`}
              >
                <div>
                  <CardHeader className="bg-muted/30 px-6 py-4 border-b border-border/70 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold bg-card border border-border px-2 py-0.5 rounded text-foreground">
                        #{offer.id}
                      </span>
                      <Badge variant="default" className="font-bold text-xs">
                        {offer.grainType}
                      </Badge>
                      <span className="text-xs font-bold text-foreground">
                        {offer.farmerName}
                      </span>
                    </div>
                    <PriceLampBadge status={lamp.status} size="sm" />
                  </CardHeader>

                  <CardContent className="p-6 space-y-4">
                    {/* Moderation Warning if any */}
                    {offer.moderationStatus === "Sedang diminta perbaikan" && (
                      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">Peninjauan Pengelola: </span>
                          <span>{offer.moderationIssue || "Menunggu pembaruan informasi dari petani."}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-baseline justify-between pt-1">
                      <div>
                        <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">Harga Minta Petani</span>
                        <p className="text-3xl font-bold font-mono text-primary tabular-nums mt-0.5">
                          {formatRupiah(offer.askingPrice)}
                          <span className="text-xs font-sans font-normal text-muted-foreground ml-1">/kg</span>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">Volume Tersedia</span>
                        <p className="text-2xl font-bold font-mono text-foreground tabular-nums mt-0.5">
                          {offer.availableVolume.toLocaleString("id-ID")} <span className="text-xs font-sans font-normal text-muted-foreground">kg</span>
                        </p>
                        <p className="text-[10px] text-muted-foreground font-mono">
                          (Total {offer.totalVolume.toLocaleString("id-ID")} kg)
                        </p>
                      </div>
                    </div>

                    {/* Metadata Specs */}
                    <div className="p-3.5 rounded-xl bg-muted/40 border border-border/70 text-xs space-y-2">
                      <div className="flex items-center gap-1.5 text-foreground font-medium">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>Kec. {offer.district}, {offer.regency}, {offer.province}</span>
                      </div>
                      <div className="flex items-center justify-between text-muted-foreground pt-1 border-t border-border/60">
                        <span>Kadar Air: <strong className="text-foreground font-mono">{typeof offer.moisturePercent === "number" ? `${offer.moisturePercent}%` : offer.moisturePercent}</strong></span>
                        <span>Kadar Hampa: <strong className="text-foreground font-mono">{typeof offer.impurityPercent === "number" ? `${offer.impurityPercent}%` : offer.impurityPercent}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground pt-1 border-t border-border/60">
                        <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>Siap Angkut: <strong className="text-foreground">{offer.readyDate}</strong></span>
                      </div>
                    </div>
                  </CardContent>
                </div>

                <div className="p-6 pt-0">
                  <Button
                    disabled={isOutOfStock}
                    onClick={() => onNavigate("supply-detail", offer.id)}
                    className="w-full font-semibold gap-2 shadow-xs"
                  >
                    <span>{isOutOfStock ? "Stok Habis Terpesan" : "Pesan Parsial & Negosiasi"}</span>
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
