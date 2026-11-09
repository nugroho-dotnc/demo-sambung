import { useState } from "react"
import { useSambungStore } from "@/store/sambungStore"
import { GrainType } from "@/types/domain"
import { calculateFairPrice } from "@/lib/priceEngine"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ChevronDown,
  ArrowRight,
  AlertTriangle,
  TrendingUp,
  Map,
  Calendar,
  Calculator,
  Database
} from "lucide-react"

interface FairPriceDetailPageProps {
  onNavigate?: (tab: string) => void
}

export function FairPriceDetailPage({ onNavigate }: FairPriceDetailPageProps) {
  const { currentRole } = useSambungStore()
  const [grainType, setGrainType] = useState<GrainType>("GKP")
  const [province, setProvince] = useState<string>("Jawa Timur")
  const [ricePrice, setRicePrice] = useState<number>(13500)

  const rendemen = grainType === "GKP" ? 0.5338 : 0.63
  const estimate = calculateFairPrice(grainType, province, ricePrice, rendemen)
  const hppGabah = grainType === "GKP" ? 6500 : 7400

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div>
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <span className="font-semibold text-primary">SAMBUNG</span>
          <span className="text-muted-foreground/50">/</span>
          <span className="font-medium text-foreground">Kalkulator & Acuan Harga Wajar</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Estimator & Acuan Harga Wajar Gabah
            </h1>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              Estimasi berbasis formula konversi rendemen beras produsen, bukan jaminan harga transaksi mutlak.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar (Jenis Gabah & Wilayah) */}
      <Card className="p-5 sm:p-6 bg-card border border-border rounded-2xl shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Komoditas Gabah</label>
            <div className="relative">
              <select
                value={grainType}
                onChange={(e) => setGrainType(e.target.value as GrainType)}
                className="w-full h-11 appearance-none rounded-xl border border-border bg-card px-3.5 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary pr-9 cursor-pointer transition-all hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs"
              >
                <option value="GKP">Gabah Kering Panen (GKP)</option>
                <option value="GKG">Gabah Kering Giling (GKG)</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Provinsi Acuan</label>
            <div className="relative">
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full h-11 appearance-none rounded-xl border border-border bg-card px-3.5 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary pr-9 cursor-pointer transition-all hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs"
              >
                <option value="Jawa Timur">Jawa Timur</option>
                <option value="Jawa Tengah">Jawa Tengah</option>
                <option value="Jawa Barat">Jawa Barat</option>
                <option value="Sulawesi Selatan">Sulawesi Selatan</option>
                <option value="Sumatera Utara">Sumatera Utara</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Harga Beras Pasar (Rp / kg)</label>
            <div className="relative">
              <input
                type="number"
                value={ricePrice}
                onChange={(e) => setRicePrice(Number(e.target.value))}
                className="w-full h-11 rounded-xl border border-border bg-card px-3.5 text-xs font-bold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-mono shadow-2xs"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (4 cols): Rentang Wajar Utama */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 sm:p-7 space-y-6 bg-gradient-to-b from-card to-emerald-50/20 dark:to-emerald-950/20 border border-border rounded-2xl shadow-xs">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Rentang Estimasi Wajar [L - U]
              </span>
              <p className="font-display text-3xl sm:text-4xl font-black text-emerald-800 dark:text-emerald-400 mt-1 tabular-nums">
                Rp{estimate.lowerBound.toLocaleString("id-ID")} - Rp{estimate.upperBound.toLocaleString("id-ID")}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Rupiah per kilogram gabah bersih pada acuan wilayah {province}.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/60 border border-border space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-border/60">
                <span className="text-muted-foreground">Batas Bawah Wajar (L):</span>
                <span className="font-mono font-bold text-foreground">Rp{estimate.lowerBound.toLocaleString("id-ID")}/kg</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/60">
                <span className="text-muted-foreground">Nilai Tengah Acuan:</span>
                <span className="font-mono font-black text-primary">Rp{Math.round((estimate.lowerBound + estimate.upperBound) / 2).toLocaleString("id-ID")}/kg</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/60">
                <span className="text-muted-foreground">Batas Atas Wajar (U):</span>
                <span className="font-mono font-bold text-foreground">Rp{estimate.upperBound.toLocaleString("id-ID")}/kg</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Jaminan HPP Pemerintah:</span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">Rp{hppGabah.toLocaleString("id-ID")}/kg</span>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 leading-relaxed flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Estimasi, bukan jaminan harga:</strong> Dihitung dari harga beras pasar produsen dan koefisien rendemen standar. Biaya angkut lokal dan negosiasi riil tetap menjadi hak para pihak.
              </span>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 pt-3 border-t border-border">
              {currentRole === "petani" && onNavigate && (
                <Button
                  size="default"
                  onClick={() => onNavigate("create-offer")}
                  className="w-full gap-2 text-xs font-bold"
                >
                  <span>Gunakan Acuan untuk Pasang Panen</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
              {currentRole === "pembeli" && onNavigate && (
                <Button
                  size="default"
                  onClick={() => onNavigate("supply-catalog")}
                  className="w-full gap-2 text-xs font-bold"
                >
                  <span>Cari Pasokan di Katalog</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
              {onNavigate && (
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Alat Riset Terkait
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigate("price-board")}
                    className="w-full justify-between text-xs font-semibold"
                  >
                    <span className="flex items-center gap-2">
                      <TrendingUp className="w-3.5 h-3.5 text-primary" />
                      <span>Papan Rantai Harga 2 Sisi</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigate("price-map")}
                    className="w-full justify-between text-xs font-semibold"
                  >
                    <span className="flex items-center gap-2">
                      <Map className="w-3.5 h-3.5 text-primary" />
                      <span>Peta Disparitas Regional</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigate("forecast")}
                    className="w-full justify-between text-xs font-semibold"
                  >
                    <span className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      <span>Prakiraan AI (Horizon 2/4 Pekan)</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column (7 cols): Formula, Rendemen, dan Metodologi */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Formula Perhitungan */}
          <Card className="p-6 sm:p-7 space-y-5 rounded-2xl border border-border shadow-xs">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-primary" />
              <h2 className="font-display font-black text-lg text-foreground">Formula Konversi & Parameter Matematika</h2>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Harga gabah dihitung berlandaskan korelasi ekonomi konversi beras produsen ke tingkat gabah panen petani:
            </p>

            <div className="p-4 rounded-xl bg-muted/80 border border-border font-mono text-xs sm:text-sm text-foreground space-y-1.5 shadow-inner">
              <p className="font-bold text-primary">P_gabah_estimasi = P_beras × Rendemen</p>
              <p className="text-muted-foreground text-xs font-sans">
                Rentang Toleransi Wajar: L = P_gabah × (1 - δ) | U = P_gabah × (1 + δ), dengan δ = 3,0%
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1 text-xs">
              <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
                <span className="text-muted-foreground font-semibold text-[11px] uppercase tracking-wider">Harga Beras Input</span>
                <p className="font-mono text-lg font-black text-foreground">Rp{ricePrice.toLocaleString("id-ID")}/kg</p>
                <p className="text-[10px] text-muted-foreground">Tingkat produsen</p>
              </div>

              <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
                <span className="text-muted-foreground font-semibold text-[11px] uppercase tracking-wider">Koefisien Rendemen</span>
                <p className="font-mono text-lg font-black text-foreground">{(rendemen * 100).toFixed(2)}%</p>
                <p className="text-[10px] text-muted-foreground">{grainType === "GKP" ? "Standar SNI GKP (53,38%)" : "Standar GKG (63,0%)"}</p>
              </div>

              <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
                <span className="text-muted-foreground font-semibold text-[11px] uppercase tracking-wider">Toleransi Rentang (δ)</span>
                <p className="font-mono text-lg font-black text-foreground">± 3,0%</p>
                <p className="text-[10px] text-muted-foreground">Parameter operasional</p>
              </div>
            </div>
          </Card>

          {/* Card 2: Sumber Data & Provenance */}
          <Card className="p-6 sm:p-7 space-y-4 rounded-2xl border border-border shadow-xs">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-primary" />
              <h2 className="font-display font-black text-lg text-foreground">Transparansi Sumber & Provenance Data</h2>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Sumber Pengamatan Beras</span>
                <span className="font-bold text-foreground">Bapanas / PIHPS Pasar Produsen</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Frekuensi Pembaruan</span>
                <span className="font-bold text-foreground">Mingguan (Setiap Senin 08:00 WIB)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Status Evaluasi Model</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">Tervalidasi Baseline (MASE ≤ 0,9)</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Kadar Air & Hampa Deklaratif</span>
                <span className="font-bold text-foreground">Diisi mandiri oleh petani saat menerbitkan panen</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
