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
  Calendar
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
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span>SAMBUNG</span>
          <span>/</span>
          <span className="text-foreground">DETAIL ACUAN HARGA WAJAR (PT-07)</span>
        </div>

        <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Estimator dan Acuan Harga Wajar Gabah
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Estimasi berbasis formula konversi rendemen beras produsen, bukan jaminan harga transaksi riil.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-muted text-muted-foreground text-xs font-semibold">
              Formula Operasional v0.2
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar (Jenis Gabah & Wilayah) */}
      <Card className="p-4 bg-card border border-border/80">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Komoditas Gabah</label>
            <div className="relative">
              <select
                value={grainType}
                onChange={(e) => setGrainType(e.target.value as GrainType)}
                className="w-full h-10 appearance-none rounded-lg border border-border bg-card px-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary pr-9 cursor-pointer"
              >
                <option value="GKP">Gabah Kering Panen (GKP)</option>
                <option value="GKG">Gabah Kering Giling (GKG)</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Provinsi Acuan</label>
            <div className="relative">
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full h-10 appearance-none rounded-lg border border-border bg-card px-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary pr-9 cursor-pointer"
              >
                <option value="Jawa Timur">Jawa Timur</option>
                <option value="Jawa Tengah">Jawa Tengah</option>
                <option value="Jawa Barat">Jawa Barat</option>
                <option value="Sulawesi Selatan">Sulawesi Selatan</option>
                <option value="Sumatera Utara">Sumatera Utara</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Harga Beras Pasar (Rp / kg)</label>
            <div className="relative">
              <input
                type="number"
                value={ricePrice}
                onChange={(e) => setRicePrice(Number(e.target.value))}
                className="w-full h-10 rounded-lg border border-border bg-card px-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-mono"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Main 2-Column Layout (Ringkasan 4 kolom, Rincian 8 kolom) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (4 cols): Rentang Wajar Utama */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 space-y-5 bg-card border border-border/80">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Rentang Estimasi Wajar Operasional [L - U]
              </span>
              <p className="font-display text-3xl font-extrabold text-primary mt-1">
                Rp{estimate.lowerBound.toLocaleString("id-ID")} - Rp{estimate.upperBound.toLocaleString("id-ID")}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Satuan: Rupiah per kilogram gabah bersih.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-muted/60 border border-border/60 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Batas Bawah (L):</span>
                <span className="font-mono font-bold text-foreground">Rp{estimate.lowerBound.toLocaleString("id-ID")}/kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Median Acuan:</span>
                <span className="font-mono font-bold text-primary">Rp{Math.round((estimate.lowerBound + estimate.upperBound) / 2).toLocaleString("id-ID")}/kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Batas Atas (U):</span>
                <span className="font-mono font-bold text-foreground">Rp{estimate.upperBound.toLocaleString("id-ID")}/kg</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-border/60">
                <span className="text-muted-foreground">HPP Pemerintah:</span>
                <span className="font-mono font-bold text-foreground">Rp{hppGabah.toLocaleString("id-ID")}/kg</span>
              </div>
            </div>

            {/* Disclaimer pill */}
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Estimasi, bukan jaminan harga:</strong> Harga ini dihitung dari data historis pasar beras produsen dan rendemen standar. Biaya angkut lokal dan negosiasi riil tetap menjadi hak para pihak.
              </span>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 pt-2 border-t border-border/60">
              {currentRole === "petani" && onNavigate && (
                <Button
                  size="sm"
                  onClick={() => onNavigate("create-offer")}
                  className="w-full gap-2 text-xs"
                >
                  <span>Gunakan Acuan untuk Jual Panen</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              )}
              {currentRole === "pembeli" && onNavigate && (
                <Button
                  size="sm"
                  onClick={() => onNavigate("supply-catalog")}
                  className="w-full gap-2 text-xs"
                >
                  <span>Cari Pasokan di Katalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              )}
              {onNavigate && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Alat Riset Pasar Terkait
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigate("price-board")}
                    className="w-full justify-between text-xs font-medium"
                  >
                    <span className="flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-primary" />
                      <span>Papan Rantai Harga 2-Sisi</span>
                    </span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigate("price-map")}
                    className="w-full justify-between text-xs font-medium"
                  >
                    <span className="flex items-center gap-1.5">
                      <Map className="w-3.5 h-3.5 text-primary" />
                      <span>Peta Disparitas Wilayah</span>
                    </span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigate("forecast")}
                    className="w-full justify-between text-xs font-medium"
                  >
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      <span>Prakiraan AI (Horizon 2/4 Pekan)</span>
                    </span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column (8 cols): Formula, Rendemen, dan Metodologi */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Formula Perhitungan */}
          <Card className="p-6 space-y-4">
            <h2 className="font-bold text-base text-foreground">Formula Konversi dan Parameter Matematika</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Harga gabah dihitung berlandaskan korelasi ekonomi konversi beras produsen ke tingkat gabah petani:
            </p>

            <div className="p-4 rounded-xl bg-muted/80 border border-border/80 font-mono text-xs sm:text-sm text-foreground space-y-2">
              <p className="font-bold text-primary">P_gabah_estimasi = P_beras × Rendemen</p>
              <p className="text-muted-foreground text-xs">
                Rentang Toleransi Wajar: L = P_gabah × (1 - δ) | U = P_gabah × (1 + δ), dengan δ = 3,0%
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
              <div className="p-3 rounded-lg border border-border/80 space-y-1">
                <span className="text-muted-foreground font-semibold">Harga Beras Input</span>
                <p className="font-mono text-base font-bold text-foreground">Rp{ricePrice.toLocaleString("id-ID")}/kg</p>
                <p className="text-[10px] text-muted-foreground">Tingkat penggilingan/produsen</p>
              </div>

              <div className="p-3 rounded-lg border border-border/80 space-y-1">
                <span className="text-muted-foreground font-semibold">Koefisien Rendemen</span>
                <p className="font-mono text-base font-bold text-foreground">{(rendemen * 100).toFixed(2)}%</p>
                <p className="text-[10px] text-muted-foreground">{grainType === "GKP" ? "Standar SNI GKP (53,38%)" : "Standar GKG (63,0%)"}</p>
              </div>

              <div className="p-3 rounded-lg border border-border/80 space-y-1">
                <span className="text-muted-foreground font-semibold">Toleransi Rentang (δ)</span>
                <p className="font-mono text-base font-bold text-foreground">± 3,0%</p>
                <p className="text-[10px] text-muted-foreground">Parameter operasional AD-02</p>
              </div>
            </div>
          </Card>

          {/* Card 2: Sumber Data & Provenance */}
          <Card className="p-6 space-y-4">
            <h2 className="font-bold text-base text-foreground">Transparansi Sumber & Provenance Data</h2>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-border/60">
                <span className="text-muted-foreground">Sumber Pengamatan Beras</span>
                <span className="font-semibold text-foreground">Bapanas / PIHPS Pasar Produsen</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/60">
                <span className="text-muted-foreground">Frekuensi Pembaruan</span>
                <span className="font-semibold text-foreground">Mingguan (Setiap Senin 08:00 WIB)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/60">
                <span className="text-muted-foreground">Status Evaluasi Model</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">Tervalidasi Baseline (MASE ≤ 0,9)</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">Kadar Air & Hampa Deklaratif</span>
                <span className="font-semibold text-foreground">Diisi mandiri oleh petani saat menerbitkan panen</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
