import { useSambungStore } from "@/store/sambungStore"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Plus,
  TrendingUp,
  Sprout,
  ScrollText,
  AlertTriangle,
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
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Breadcrumb & Header Section */}
      <div>
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <span className="font-semibold text-primary">SAMBUNG</span>
          <span className="text-muted-foreground/50">/</span>
          <span className="font-medium text-foreground">Ruang Kerja Petani</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Keputusan Panen, Lebih Terarah.
            </h1>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              Selamat datang kembali, <strong>{currentUser.name}</strong> ({currentUser.district || "Subang"}). Pantau acuan harga wajar gabah dan kelola pesanan masuk.
            </p>
          </div>

          <Button
            size="lg"
            onClick={() => onNavigate("create-offer")}
            className="self-start sm:self-auto gap-2.5 font-bold text-sm shadow-sm cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Jual Hasil Panen</span>
          </Button>
        </div>
      </div>

      {/* Hero Card: Harga Wajar GKP & HPP */}
      <Card className="p-7 sm:p-8 bg-gradient-to-br from-card via-card to-emerald-50/30 dark:to-emerald-950/20 border border-border shadow-xs rounded-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Harga Wajar GKP */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Estimasi Acuan Wajar GKP</span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-display text-4xl sm:text-5xl font-black text-emerald-800 dark:text-emerald-400 tracking-tight tabular-nums">
                Rp6.650 - Rp6.940
              </span>
              <span className="text-sm font-semibold text-muted-foreground">/kg</span>
            </div>

            <p className="text-xs text-muted-foreground font-medium">
              Gabah Kering Panen (GKP) · rentang acuan resmi berdasarkan data Bapanas dan PIHPS, bukan jaminan harga tunggal.
            </p>
          </div>

          {/* Vertical Divider for large screens */}
          <div className="hidden lg:block lg:col-span-1 h-20 border-r border-border justify-self-center" />

          {/* Right: Harga Pembelian Pemerintah (HPP) */}
          <div className="lg:col-span-4 space-y-2 border-t lg:border-t-0 pt-4 lg:pt-0 border-border">
            <p className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
              Harga Pembelian Pemerintah (HPP)
            </p>
            <p className="text-2xl font-black text-foreground font-display tabular-nums">
              Rp6.500 <span className="text-xs font-medium text-muted-foreground">/kg</span>
            </p>
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              Rendemen Standar Nasional: 53,38%
            </p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Mutu fisik, kadar air panen, dan rendemen giling memengaruhi penetapan harga akhir di pabrik.
            </p>
          </div>
        </div>
      </Card>

      {/* Middle Section: Prediksi Tren & Langkah Berikutnya */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Prediksi 3-4 Pekan with Visual Ribbon */}
        <Card className="lg:col-span-8 p-6 sm:p-7 flex flex-col justify-between rounded-2xl border border-border shadow-xs">
          <div>
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-border">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Arah Pasar Mendatang</span>
                <h3 className="font-display font-black text-xl text-foreground mt-0.5">Prakiraan Tren Harga 3 - 4 Pekan</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Proyeksi arah dari model transmisi harga · rentang ketidakpastian 90%
                </p>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 shadow-2xs">
                <ArrowUpRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Kecenderungan Naik</span>
              </div>
            </div>

            {/* SVG Visual Graph */}
            <div className="mt-6 relative">
              <div className="text-xs font-semibold text-muted-foreground mb-2 flex items-center justify-between">
                <span>Harga relatif terhadap acuan normal</span>
                <span className="text-[11px] font-mono text-muted-foreground">Data Sinkronisasi Bapanas</span>
              </div>

              <div className="w-full h-48 sm:h-56 relative border-l border-b border-border flex flex-col justify-between p-2">
                <div className="absolute inset-x-0 top-1/4 border-b border-dashed border-border/40" />
                <div className="absolute inset-x-0 top-2/4 border-b border-border/40" />
                <div className="absolute inset-x-0 top-3/4 border-b border-dashed border-border/40" />

                <div className="absolute -left-20 top-2 text-[10px] text-muted-foreground text-right w-16 font-medium">
                  Lebih Tinggi
                </div>
                <div className="absolute -left-20 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground text-right w-16 font-medium">
                  Acuan (0%)
                </div>
                <div className="absolute -left-20 bottom-2 text-[10px] text-muted-foreground text-right w-16 font-medium">
                  Lebih Rendah
                </div>

                <svg className="w-full h-full overflow-visible" viewBox="0 0 400 160" preserveAspectRatio="none">
                  {/* Confidence Interval Ribbon */}
                  <path
                    d="M 10 120 Q 150 95 390 40 L 390 100 Q 150 115 10 140 Z"
                    className="fill-emerald-100/50 dark:fill-emerald-950/40"
                  />
                  {/* Trend Median Line */}
                  <path
                    d="M 10 130 Q 150 105 390 70"
                    fill="none"
                    stroke="#15803D"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* X-axis labels */}
              <div className="mt-2.5 flex justify-between text-xs font-semibold text-muted-foreground px-2">
                <span>Pekan Ini</span>
                <span>+1 Pekan</span>
                <span>+2 Pekan</span>
                <span>+3 Pekan</span>
                <span>+4 Pekan</span>
              </div>

              {/* Graph Legend */}
              <div className="mt-5 flex items-center gap-6 text-xs text-muted-foreground pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-1 bg-[#15803D] rounded-full" />
                  <span className="font-semibold text-foreground">Median Prediksi AI</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-3 bg-emerald-100 dark:bg-emerald-950/50 rounded border border-emerald-300 dark:border-emerald-800" />
                  <span>Pita Interval Kepercayaan 90%</span>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-4 pt-3 border-t border-border text-xs text-muted-foreground">
            Pita keyakinan menunjukkan tingkat ketidakpastian pasar; semakin jauh horizon waktu, rentang variasi semakin luas.
          </p>
        </Card>

        {/* Right: Langkah Berikutnya */}
        <Card className="lg:col-span-4 p-6 sm:p-7 flex flex-col justify-between rounded-2xl border border-border shadow-xs">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Aksi Cepat</span>
            <h3 className="font-display font-black text-xl text-foreground mt-0.5">Langkah Berikutnya</h3>

            <div className="mt-5 space-y-3">
              <button
                onClick={() => onNavigate("create-offer")}
                className="w-full p-3.5 rounded-xl border border-border hover:border-emerald-500 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/30 transition-all text-left flex items-start gap-3.5 group cursor-pointer shadow-2xs"
              >
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 group-hover:scale-105 transition-transform shrink-0">
                  <Sprout className="w-4.5 h-4.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                      Tawarkan Hasil Panen
                    </p>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                    Masukkan mutu, tonase, dan patokan harga per kg.
                  </p>
                </div>
              </button>

              <button
                onClick={() => onNavigate("price-board")}
                className="w-full p-3.5 rounded-xl border border-border hover:border-emerald-500 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/30 transition-all text-left flex items-start gap-3.5 group cursor-pointer shadow-2xs"
              >
                <div className="p-2.5 rounded-xl bg-muted text-foreground group-hover:scale-105 transition-transform shrink-0">
                  <TrendingUp className="w-4.5 h-4.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                      Bandingkan Harga Pasar
                    </p>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                    Lihat rantai harga dari petani ke penggilingan & eceran.
                  </p>
                </div>
              </button>

              <button
                onClick={() => onNavigate("contracts")}
                className="w-full p-3.5 rounded-xl border border-border hover:border-emerald-500 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/30 transition-all text-left flex items-start gap-3.5 group cursor-pointer shadow-2xs"
              >
                <div className="p-2.5 rounded-xl bg-muted text-foreground group-hover:scale-105 transition-transform shrink-0">
                  <ScrollText className="w-4.5 h-4.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                      Periksa Kontrak & Pesanan
                    </p>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                    Tinjau tawaran harga pembeli sebelum menyetujui.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {pendingContracts.length > 0 && (
            <div className="mt-5 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  {pendingContracts.length} Pesanan Masuk Menunggu
                </p>
                <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80">
                  Respon sebelum batas tenggat berakhir
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate("contracts")}
                className="text-xs h-8 border-amber-300 text-amber-900 hover:bg-amber-100 font-bold"
              >
                Tinjau
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Alert Banner: Potensi Kenaikan */}
      <div className="p-4.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex items-start gap-3.5 text-xs shadow-2xs">
        <AlertTriangle className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold text-amber-950 dark:text-amber-200 text-sm">
            Perhatian · Potensi Kenaikan Harga Gabah
          </span>
          <p className="text-amber-900/80 dark:text-amber-300/80 mt-1">
            Pertimbangkan tren kenaikan harga ini bersama kebutuhan waktu panen dan kapasitas pengeringan Anda. Kesepakatan harga riil tetap ditentukan oleh kadar air dan kesepakatan langsung dengan penggilingan.
          </p>
        </div>
      </div>

      {/* Bottom 2 Guidance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 sm:p-7 space-y-2.5 rounded-2xl border border-border shadow-xs">
          <h3 className="font-display font-black text-lg text-foreground">
            Bagaimana Membaca Rentang Acuan Ini?
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Batas bawah Rp6.650/kg membantu petani mengidentifikasi tawaran tengkulak yang terlalu rendah di bawah kelayakan biaya tanam. Batas atas Rp6.940/kg adalah acuan posisi tawar terbaik berdasarkan harga beras giling di pasar konsumen.
          </p>
        </Card>

        <Card className="p-6 sm:p-7 space-y-2.5 flex flex-col justify-between rounded-2xl border border-border shadow-xs">
          <div>
            <h3 className="font-display font-black text-lg text-foreground">
              Transparansi Nilai Tanpa Potongan
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed mt-1">
              Periksa harga di tingkat petani, penggilingan lokal, dan pedagang pasar rakyat sebelum melepas hasil panen Anda.
            </p>
          </div>
          <button
            onClick={() => onNavigate("price-board")}
            className="self-start pt-3 flex items-center gap-1.5 text-xs font-bold text-primary hover:underline cursor-pointer"
          >
            <span>Buka Papan Harga 2 Sisi</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </Card>
      </div>
    </div>
  )
}
