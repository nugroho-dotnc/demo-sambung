import { useState } from "react"
import { useSambungStore } from "@/store/sambungStore"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Info,
  CheckCircle2,
  MapPin,
  ArrowRight
} from "lucide-react"

interface PembeliDashboardProps {
  onNavigate: (tab: string, targetId?: string) => void
}

export function PembeliDashboard({ onNavigate }: PembeliDashboardProps) {
  const { currentUser, offers, contracts } = useSambungStore()
  const [activeTab, setActiveTab] = useState<"pasokan" | "rentang" | "kontrak">("pasokan")
  const [selectedCommodity, setSelectedCommodity] = useState("Gabah Kering Panen (GKP)")
  const [selectedRegion, setSelectedRegion] = useState("Jawa Timur")

  // Only published offers
  const activeOffers = offers.filter((o) => o.publicationStatus === "Terbit")
  const myContracts = contracts.filter((c) => c.buyerId === currentUser.id)
  const agreedContracts = myContracts.filter((c) => c.status === "Disetujui" || c.status === "Menunggu Kesepakatan")

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span>SAMBUNG</span>
          <span>/</span>
          <span className="text-foreground">DASBOR PRODUSEN</span>
        </div>

        <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Dasbor produsen
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Pantau pasokan sekitar, kewajaran harga, dan kontrak dalam satu ruang kerja.
            </p>
          </div>

          <Button
            onClick={() => onNavigate("supply-catalog")}
            className="self-start sm:self-auto gap-2 shadow-xs"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Kelola penawaran</span>
          </Button>
        </div>
      </div>

      {/* Workspace Tabs matching mockup */}
      <div className="border-b border-border/80 flex items-center gap-6 text-sm font-medium">
        <button
          onClick={() => setActiveTab("pasokan")}
          className={`pb-3 transition-colors relative cursor-pointer ${
            activeTab === "pasokan"
              ? "text-primary font-bold border-b-2 border-primary -mb-px"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Pasokan sekitar
        </button>
        <button
          onClick={() => setActiveTab("rentang")}
          className={`pb-3 transition-colors relative cursor-pointer ${
            activeTab === "rentang"
              ? "text-primary font-bold border-b-2 border-primary -mb-px"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Rentang harga beli wajar
        </button>
        <button
          onClick={() => setActiveTab("kontrak")}
          className={`pb-3 transition-colors relative cursor-pointer ${
            activeTab === "kontrak"
              ? "text-primary font-bold border-b-2 border-primary -mb-px"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Ringkasan kontrak
        </button>
      </div>

      {/* Top 3 Summary Cards matching mockup */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Card 1 */}
        <Card className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Harga beli wajar GKP</h3>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#EAF1E7] text-[#2D4828] dark:bg-primary/20 dark:text-primary-foreground border border-primary/20 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Rentang acuan</span>
            </span>
          </div>

          <p className="font-display text-2xl sm:text-3xl font-extrabold text-[#246447] dark:text-[#A9D6B0] tracking-tight">
            Rp6.650 - 6.940
          </p>
          <p className="text-xs text-muted-foreground">
            per kg · Jawa Timur
          </p>
        </Card>

        {/* Card 2 */}
        <Card className="p-6 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Kontrak aktif</h3>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-muted text-muted-foreground">
                Dokumen berjalan
              </span>
            </div>

            <p className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-3">
              {Math.max(3, agreedContracts.length)} <span className="text-base font-normal text-muted-foreground">kontrak</span>
            </p>
          </div>

          <button
            onClick={() => onNavigate("contracts")}
            className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline cursor-pointer"
          >
            <span>Lihat daftar kontrak</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </Card>

        {/* Card 3 */}
        <Card className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Pemeriksaan pembelian</h3>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-muted text-muted-foreground">
              Periksa per tawaran
            </span>
          </div>

          <p className="text-base font-bold text-foreground mt-2">
            Harga, mutu, volume
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Pastikan spesifikasi sebelum menyepakati pembelian.
          </p>
        </Card>
      </div>

      {/* Filter Bar matching mockup */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Komoditas</label>
          <div className="relative">
            <select
              value={selectedCommodity}
              onChange={(e) => setSelectedCommodity(e.target.value)}
              className="w-full h-10 appearance-none rounded-lg border border-border bg-card px-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary pr-9 cursor-pointer"
            >
              <option value="Gabah Kering Panen (GKP)">Gabah Kering Panen (GKP)</option>
              <option value="Gabah Kering Giling (GKG)">Gabah Kering Giling (GKG)</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Wilayah</label>
          <div className="relative">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full h-10 appearance-none rounded-lg border border-border bg-card px-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary pr-9 cursor-pointer"
            >
              <option value="Jawa Timur">Jawa Timur</option>
              <option value="Jawa Tengah">Jawa Tengah</option>
              <option value="Jawa Barat">Jawa Barat</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Tampilan</label>
          <div className="relative">
            <select
              className="w-full h-10 appearance-none rounded-lg border border-border bg-card px-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary pr-9 cursor-pointer"
            >
              <option value="Produsen di sekitar">Produsen di sekitar</option>
              <option value="Semua penawaran aktif">Semua penawaran aktif</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Content Area (2 cols: ~8 cols left, ~4 cols right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Pasokan di sekitar Anda */}
        <Card className="lg:col-span-8 p-6 space-y-4">
          <div>
            <h3 className="font-bold text-base text-foreground">Pasokan di sekitar Anda</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Volume pada gambar acuan · ketersediaan perlu dikonfirmasi
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/80 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="py-2.5 font-semibold">Wilayah Produsen</th>
                  <th className="py-2.5 font-semibold">Komoditas</th>
                  <th className="py-2.5 font-semibold">Volume</th>
                  <th className="py-2.5 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {activeOffers.slice(0, 4).map((offer, idx) => {
                  const sampleLocations = ["Sidoarjo", "Probolinggo", "Magetan", "Ngawi"]
                  const displayLocation = sampleLocations[idx] || offer.regency
                  const displayVolume = offer.availableVolume > 1000 ? `${(offer.availableVolume / 1000).toFixed(0)} ton` : `${offer.availableVolume} kg`

                  return (
                    <tr key={offer.id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-3.5 flex items-center gap-2 font-medium text-foreground">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        <span>{displayLocation}</span>
                      </td>
                      <td className="py-3.5 text-muted-foreground">{offer.grainType}</td>
                      <td className="py-3.5 font-semibold text-foreground">{displayVolume}</td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => onNavigate("supply-detail", offer.id)}
                          className="inline-flex items-center gap-1 font-semibold text-primary hover:underline cursor-pointer"
                        >
                          <span>Lihat</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <p className="pt-3 border-t border-border/60 text-[11px] text-muted-foreground flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>Volume penawaran belum berarti stok terverifikasi atau siap kirim.</span>
          </p>
        </Card>

        {/* Right Column: Alur pembelian yang jelas */}
        <Card className="lg:col-span-4 p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-base text-foreground">Alur pembelian yang jelas</h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-md bg-muted text-xs font-bold text-foreground shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <p className="text-xs font-bold text-foreground">Bandingkan penawaran</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Periksa asal, volume, dan mutu.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-md bg-muted text-xs font-bold text-foreground shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <p className="text-xs font-bold text-foreground">Negosiasikan harga</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Gunakan rentang wajar sebagai pembanding.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-md bg-muted text-xs font-bold text-foreground shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <p className="text-xs font-bold text-foreground">Buat kesepakatan</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Catat biaya dan jadwal dalam kontrak.</p>
                </div>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => onNavigate("price-board")}
            className="w-full text-xs font-semibold"
          >
            Buka papan harga
          </Button>
        </Card>
      </div>

      {/* Info Banner: Perbedaan Gabah dan Beras */}
      <div className="p-4 rounded-xl bg-muted/60 border border-border/80 flex items-start gap-3 text-xs">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <div className="leading-relaxed text-muted-foreground">
          <span className="font-bold text-foreground">Harga gabah dan beras berbeda: </span>
          Gunakan GKP untuk pembelian gabah. Gunakan beras medium I untuk membandingkan harga penggilingan, pedagang besar, dan eceran.
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
        <Info className="w-3.5 h-3.5 shrink-0" />
        <span>
          Data dari gambar acuan untuk simulasi desain. Bukan harga langsung atau pembaruan pasar.
        </span>
      </div>
    </div>
  )
}
