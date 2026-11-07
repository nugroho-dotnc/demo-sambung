import { useSambungStore } from "@/store/sambungStore"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Plus,
  TrendingUp,
  Sprout,
  ScrollText,
  AlertTriangle,
  Info,
  ArrowRight,
  ArrowUpRight,
  ChevronRight
} from "lucide-react"

interface PetaniDashboardProps {
  onNavigate: (tab: string, targetId?: string) => void
}

export function PetaniDashboard({ onNavigate }: PetaniDashboardProps) {
  const { currentUser, contracts } = useSambungStore()

  // Filter farmer contracts
  const myContracts = contracts.filter((c) => c.farmerId === currentUser.id)
  const pendingContracts = myContracts.filter((c) => c.status === "Menunggu Kesepakatan")

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Breadcrumb & Header Section */}
      <div>
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
          <span className="font-medium">Sambung</span>
          <span className="text-muted-foreground/60">/</span>
          <span className="font-medium text-foreground">Beranda Petani</span>
        </nav>

        <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Keputusan panen, lebih terarah.
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Ringkasan harga, arah pasar, dan langkah berikutnya untuk petani.
            </p>
          </div>

          <Button
            onClick={() => onNavigate("create-offer")}
            className="self-start sm:self-auto gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Jual hasil panen</span>
          </Button>
        </div>
      </div>

      {/* Hero Card: Harga Wajar GKP & HPP */}
      <Card className="p-6 md:p-8 bg-card border border-border/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Harga Wajar GKP */}
          <div className="lg:col-span-7 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">Harga wajar GKP</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary border border-primary/20">
                {currentUser.province || "Jawa Timur"}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl sm:text-4xl font-extrabold text-price-within tracking-tight">
                Rp6.650 - 6.940
              </span>
              <span className="text-sm font-medium text-muted-foreground">/kg</span>
            </div>

            <p className="text-xs text-muted-foreground">
              Gabah Kering Panen · rentang acuan, bukan jaminan harga jual
            </p>
          </div>

          {/* Vertical Divider for large screens */}
          <div className="hidden lg:block lg:col-span-1 h-20 border-r border-border/80 justify-self-center" />

          {/* Right: Harga Pembelian Pemerintah (HPP) */}
          <div className="lg:col-span-4 space-y-1.5 border-t lg:border-t-0 pt-4 lg:pt-0 border-border/80">
            <p className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
              Harga Pembelian Pemerintah
            </p>
            <p className="text-xl font-bold text-foreground">
              Rp6.500 <span className="text-xs font-normal text-muted-foreground">/kg</span>
            </p>
            <p className="text-xs font-medium text-foreground/80">
              Rendemen acuan: 53,38%
            </p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Mutu dan kadar air memengaruhi hasil konversi gabah menjadi beras.
            </p>
          </div>
        </div>
      </Card>

      {/* Middle Section: Prediksi Tren & Langkah Berikutnya */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Prediksi 3-4 Pekan with Visual Ribbon */}
        <Card className="lg:col-span-8 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-bold text-base text-foreground">Prediksi 3 - 4 pekan</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Skema arah dari acuan · bukan proyeksi harga numerik
                </p>
              </div>

              <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-semibold border border-emerald-200/60 dark:border-emerald-800/60">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Arah naik</span>
              </div>
            </div>

            {/* SVG Visual Graph matching mockup */}
            <div className="mt-6 relative">
              <div className="text-[11px] text-muted-foreground mb-2">
                Harga relatif terhadap acuan
              </div>

              <div className="w-full h-44 sm:h-52 relative border-l border-b border-border/80 flex flex-col justify-between p-2">
                {/* Reference horizontal guide lines */}
                <div className="absolute inset-x-0 top-1/4 border-b border-dashed border-border/40" />
                <div className="absolute inset-x-0 top-2/4 border-b border-border/40" />
                <div className="absolute inset-x-0 top-3/4 border-b border-dashed border-border/40" />

                {/* Y-axis labels */}
                <div className="absolute -left-18 top-2 text-[10px] text-muted-foreground text-right w-16">
                  Lebih tinggi
                </div>
                <div className="absolute -left-18 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground text-right w-16">
                  Acuan
                </div>
                <div className="absolute -left-18 bottom-2 text-[10px] text-muted-foreground text-right w-16">
                  Lebih rendah
                </div>

                {/* SVG Curves */}
                <svg className="w-full h-full overflow-visible" viewBox="0 0 400 160" preserveAspectRatio="none">
                  {/* Confidence Interval Ribbon */}
                  <path
                    d="M 10 120 Q 150 95 390 40 L 390 100 Q 150 115 10 140 Z"
                    className="fill-muted/70 dark:fill-muted/30"
                  />
                  {/* Trend Median Line */}
                  <path
                    d="M 10 130 Q 150 105 390 70"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="text-[#1E3A24] dark:text-[#A9D6B0]"
                  />
                </svg>
              </div>

              {/* X-axis labels */}
              <div className="mt-2 flex justify-between text-[11px] text-muted-foreground px-2">
                <span>Saat ini</span>
                <span>+1</span>
                <span>+2</span>
                <span>+3</span>
                <span>+4 pekan</span>
              </div>

              {/* Graph Legend */}
              <div className="mt-4 flex items-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-0.5 bg-[#1E3A24] dark:bg-[#A9D6B0]" />
                  <span>Median</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3 bg-muted rounded-xs border border-border" />
                  <span>Interval prediksi 90%</span>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-4 pt-3 border-t border-border/60 text-[11px] text-muted-foreground">
            Pita menunjukkan ketidakpastian; rentang makin lebar untuk pekan berikutnya.
          </p>
        </Card>

        {/* Right: Langkah Berikutnya */}
        <Card className="lg:col-span-4 p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-foreground">Langkah berikutnya</h3>

            <div className="mt-4 space-y-3">
              <button
                onClick={() => onNavigate("create-offer")}
                className="w-full p-3 rounded-lg border border-border/70 hover:border-primary/40 hover:bg-muted/40 transition-all text-left flex items-start gap-3 group cursor-pointer"
              >
                <div className="p-2 rounded-md bg-[#EAF1E7] text-[#2D4828] dark:bg-primary/20 dark:text-primary-foreground group-hover:scale-105 transition-transform">
                  <Sprout className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                      Tawarkan hasil panen
                    </p>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Masukkan mutu, volume, dan harga.
                  </p>
                </div>
              </button>

              <button
                onClick={() => onNavigate("price-board")}
                className="w-full p-3 rounded-lg border border-border/70 hover:border-primary/40 hover:bg-muted/40 transition-all text-left flex items-start gap-3 group cursor-pointer"
              >
                <div className="p-2 rounded-md bg-secondary text-secondary-foreground group-hover:scale-105 transition-transform">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                      Bandingkan harga
                    </p>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Lihat rantai harga dari petani ke eceran.
                  </p>
                </div>
              </button>

              <button
                onClick={() => onNavigate("contracts")}
                className="w-full p-3 rounded-lg border border-border/70 hover:border-primary/40 hover:bg-muted/40 transition-all text-left flex items-start gap-3 group cursor-pointer"
              >
                <div className="p-2 rounded-md bg-secondary text-secondary-foreground group-hover:scale-105 transition-transform">
                  <ScrollText className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                      Periksa kontrak
                    </p>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Tinjau harga sebelum menyetujui.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {pendingContracts.length > 0 && (
            <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-amber-800 dark:text-amber-300">
                  {pendingContracts.length} pesanan baru menunggu
                </p>
                <p className="text-[11px] text-amber-700/80 dark:text-amber-400">
                  Respon sebelum tenggat berakhir
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate("contracts")}
                className="text-xs h-7 border-amber-300 text-amber-800 hover:bg-amber-100"
              >
                Lihat
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Alert Banner: Harga Berpotensi Naik */}
      <div className="p-4 rounded-xl bg-[#FDECE8] dark:bg-[#3D1E16] border border-[#F5C2B5] dark:border-[#5C2E22] flex items-start gap-3 text-xs">
        <AlertTriangle className="w-4 h-4 text-[#C86B3C] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold text-[#9B3529] dark:text-[#FFC0AB]">
            Perhatian · harga berpotensi naik
          </span>
          <p className="text-[#7A281E] dark:text-[#FFD7CB] mt-0.5">
            Pertimbangkan prediksi bersama kebutuhan penjualan Anda. Harga kesepakatan tetap bergantung pada mutu, lokasi, dan waktu transaksi.
          </p>
        </div>
      </div>

      {/* Bottom 2 Guidance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-2">
          <h3 className="font-bold text-base text-foreground">
            Bagaimana membaca rentang ini?
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Batas bawah Rp6.650/kg membantu memeriksa penawaran terlalu rendah. Batas atas Rp6.940/kg menjadi acuan negosiasi, bukan harga pasti.
          </p>
        </Card>

        <Card className="p-6 space-y-2 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-foreground">
              Harga yang transparan
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed mt-1">
              Periksa harga di tingkat petani, penggilingan, pedagang besar, dan eceran sebelum membuat keputusan.
            </p>
          </div>
          <button
            onClick={() => onNavigate("price-board")}
            className="self-start pt-2 flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline cursor-pointer"
          >
            <span>Buka papan harga 2 sisi</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </Card>
      </div>

      {/* Footer Disclaimer */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
        <Info className="w-3.5 h-3.5 shrink-0" />
        <span>
          Data dari gambar acuan untuk simulasi desain. Bukan harga langsung atau pembaruan pasar.
        </span>
      </div>
    </div>
  )
}
