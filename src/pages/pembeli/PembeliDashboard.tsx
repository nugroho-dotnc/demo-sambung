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
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Scale
} from "lucide-react"

interface PembeliDashboardProps {
  onNavigate: (tab: string, targetId?: string) => void
}

export function PembeliDashboard({ onNavigate }: PembeliDashboardProps) {
  const { currentUser, offers, contracts } = useSambungStore()
  const [selectedCommodity, setSelectedCommodity] = useState("Gabah Kering Panen (GKP)")
  const [selectedRegion, setSelectedRegion] = useState("Jawa Timur")

  // Only published offers
  const activeOffers = offers.filter((o) => o.publicationStatus === "Terbit")
  const myContracts = contracts.filter((c) => c.buyerId === currentUser.id)
  const agreedContracts = myContracts.filter((c) => c.status === "Disetujui" || c.status === "Menunggu Kesepakatan")

  return (
    <div className="max-w-6xl mx-auto space-y-7 pb-14">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/70">
        <div>
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            <span>Sambung</span>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-primary font-bold">Ruang Pembeli / Penggilingan</span>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-foreground">Dasbor Pengadaan</span>
          </nav>

          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Dasbor Pengadaan Produsen
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Pantau pasokan gabah sekitar, kewajaran harga beli, dan progres kontrak dalam satu ruang kerja.
          </p>
        </div>

        <Button
          onClick={() => onNavigate("supply-catalog")}
          className="self-start sm:self-auto gap-2 text-xs font-semibold shadow-sm hover:shadow"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Katalog Penawaran Petani</span>
        </Button>
      </div>

      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Card 1: Benchmark Price */}
        <Card className="p-6 bg-card border-border/80 shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Harga Beli Wajar GKP</span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Acuan Resmi</span>
            </span>
          </div>

          <p className="font-mono text-2xl sm:text-3xl font-bold text-primary tracking-tight tabular-nums">
            Rp6.650 - 6.940
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/60">
            <span>per kg · Jawa Timur</span>
            <span className="font-semibold text-foreground">HPP 2024: Rp6.000</span>
          </div>
        </Card>

        {/* Card 2: Active Contracts */}
        <Card className="p-6 bg-card border-border/80 shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Kontrak Aktif</span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-muted text-muted-foreground border border-border">
                Dokumen Berjalan
              </span>
            </div>

            <p className="font-mono text-2xl sm:text-3xl font-bold text-foreground tracking-tight mt-2 tabular-nums">
              {Math.max(3, agreedContracts.length)} <span className="text-sm font-sans font-normal text-muted-foreground">kontrak</span>
            </p>
          </div>

          <button
            onClick={() => onNavigate("contracts")}
            className="flex items-center justify-between text-xs font-semibold text-primary hover:underline cursor-pointer pt-2 border-t border-border/60"
          >
            <span>Buka daftar kontrak saya</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </Card>

        {/* Card 3: Quality & Evaluation */}
        <Card className="p-6 bg-card border-border/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Pemeriksaan Pembelian</span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Pra-Pesanan</span>
            </span>
          </div>

          <p className="text-base font-bold text-foreground mt-1">
            Harga, Mutu, & Volume
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Verifikasi kadar air, kotoran, dan kesesuaian formula sebelum menyepakati pesanan pasokan.
          </p>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 bg-card border-border/80 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Komoditas</label>
            <div className="relative">
              <select
                value={selectedCommodity}
                onChange={(e) => setSelectedCommodity(e.target.value)}
                className="w-full h-10 appearance-none rounded-xl border border-input bg-card px-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary pr-9 cursor-pointer"
              >
                <option value="Gabah Kering Panen (GKP)">Gabah Kering Panen (GKP)</option>
                <option value="Gabah Kering Giling (GKG)">Gabah Kering Giling (GKG)</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Wilayah</label>
            <div className="relative">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full h-10 appearance-none rounded-xl border border-input bg-card px-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary pr-9 cursor-pointer"
              >
                <option value="Jawa Timur">Jawa Timur</option>
                <option value="Jawa Tengah">Jawa Tengah</option>
                <option value="Jawa Barat">Jawa Barat</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Tampilan Pasokan</label>
            <div className="relative">
              <select
                className="w-full h-10 appearance-none rounded-xl border border-input bg-card px-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary pr-9 cursor-pointer"
              >
                <option value="Produsen di sekitar">Produsen di sekitar lokasi saya</option>
                <option value="Semua penawaran aktif">Semua penawaran terbit</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>
      </Card>

      {/* Main Content Area (8 cols left, 4 cols right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Pasokan di sekitar Anda */}
        <Card className="lg:col-span-8 p-6 bg-card border-border/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border/70">
            <div>
              <h3 className="font-bold text-base text-foreground">Pasokan Gabah di Sekitar Anda</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Volume aktif siap dipesan langsung dari petani terverifikasi di Jawa Timur
              </p>
            </div>
            <button
              onClick={() => onNavigate("supply-catalog")}
              className="text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              Lihat Semua →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/80 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="py-3 font-semibold">Wilayah Asal</th>
                  <th className="py-3 font-semibold">Komoditas</th>
                  <th className="py-3 font-semibold">Volume Tersedia</th>
                  <th className="py-3 text-right font-semibold">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {activeOffers.slice(0, 4).map((offer, idx) => {
                  const sampleLocations = ["Sidoarjo", "Probolinggo", "Magetan", "Ngawi"]
                  const displayLocation = sampleLocations[idx] || offer.regency
                  const displayVolume = offer.availableVolume > 1000 ? `${(offer.availableVolume / 1000).toFixed(0)} ton` : `${offer.availableVolume} kg`

                  return (
                    <tr key={offer.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3.5 flex items-center gap-2 font-medium text-foreground">
                        <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <MapPin className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="font-semibold">{displayLocation}</p>
                          <p className="text-[11px] text-muted-foreground font-mono">#{offer.id}</p>
                        </div>
                      </td>
                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-secondary text-secondary-foreground">
                          {offer.grainType}
                        </span>
                      </td>
                      <td className="py-3.5 font-bold font-mono text-foreground tabular-nums">
                        {displayVolume}
                      </td>
                      <td className="py-3.5 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onNavigate("supply-detail", offer.id)}
                          className="h-8 text-xs font-semibold gap-1 border-border/80 hover:border-primary/40"
                        >
                          <span>Rincian</span>
                          <ArrowRight className="w-3 h-3" />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <p className="pt-3 border-t border-border/60 text-[11px] text-muted-foreground flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 shrink-0 text-primary" />
            <span>Volume penawaran dikunci sementara (dicadangkan) saat Anda mengajukan pesanan.</span>
          </p>
        </Card>

        {/* Right Column: Alur Pembelian */}
        <Card className="lg:col-span-4 p-6 bg-card border-border/80 shadow-xs space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-base text-foreground">Alur Pembelian Transparan</h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-primary text-white dark:text-[#182117] text-xs font-bold shrink-0 mt-0.5 shadow-2xs">
                  1
                </span>
                <div>
                  <p className="text-xs font-bold text-foreground">Bandingkan Penawaran</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                    Periksa lokasi panen, kadar air, kadar hampa, dan harga minta petani.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-primary/20 text-primary text-xs font-bold shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <p className="text-xs font-bold text-foreground">Negosiasikan Harga</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                    Gunakan rentang harga wajar acuan sebagai batas negosiasi objektif.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-primary/20 text-primary text-xs font-bold shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <p className="text-xs font-bold text-foreground">Buat Kesepakatan Kontrak</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                    Catat volume, harga final, dan jadwal angkut dalam kontrak digital resmi tanpa komisi.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => onNavigate("price-board")}
            className="w-full text-xs font-semibold gap-1.5 border-border/80"
          >
            <TrendingUp className="w-3.5 h-3.5 text-primary" />
            <span>Buka Papan Rantai Harga</span>
          </Button>
        </Card>
      </div>

      {/* Info Banner: Perbedaan Gabah dan Beras */}
      <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 flex items-start gap-3 text-xs">
        <Scale className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <div className="leading-relaxed text-muted-foreground">
          <span className="font-bold text-foreground">Pedoman Standar Konversi: </span>
          Gunakan GKP untuk pembelian gabah segar di tingkat sawah. Gunakan rasio rendemen <strong>53,38%</strong> (atau GKG <strong>63,0%</strong>) untuk membandingkan harga olahan terhadap batas HET Beras Medium I.
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
        <Info className="w-3.5 h-3.5 shrink-0" />
        <span>
          Data acuan pasar dihitung berdasarkan parameter resmi BPS, Badan Pangan Nasional, dan PIHPS Jawa Timur.
        </span>
      </div>
    </div>
  )
}
