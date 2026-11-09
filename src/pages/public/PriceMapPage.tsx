import { useState } from "react"
import { SEED_PROVINCIAL_COMPARISONS } from "@/mock/seedData"
import { ProvincialPriceComparison } from "@/types/domain"
import { formatRupiah } from "@/lib/utils"
import { LeafletPriceMap } from "@/components/domain/LeafletPriceMap"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Map as MapIcon,
  Table as TableIcon,
  ChevronDown,
  AlertTriangle,
  Cpu,
  ArrowRight
} from "lucide-react"

interface PriceMapPageProps {
  onNavigate?: (tab: string) => void
}

export function PriceMapPage({ onNavigate }: PriceMapPageProps) {
  const data: ProvincialPriceComparison[] = SEED_PROVINCIAL_COMPARISONS
  const [viewMode, setViewMode] = useState<"map" | "table">("map")
  const [selectedCommodity, setSelectedCommodity] = useState("Beras medium")
  const [selectedCoverage, setSelectedCoverage] = useState("Seluruh Indonesia")
  const [selectedTime, setSelectedTime] = useState("Snapshot pada acuan")
  const [selectedProvince, setSelectedProvince] = useState<string>("Jawa Timur")

  const validData = data.filter((d: ProvincialPriceComparison) => d.isAvailable && d.price > 0)
  const minPriceItem = validData.reduce((prev: ProvincialPriceComparison, curr: ProvincialPriceComparison) => (curr.price < prev.price ? curr : prev), validData[0] || { province: "Sulawesi Selatan", price: 6400, medianPrice: 6700, percentageDiff: -4.48, isAvailable: true })
  const maxPriceItem = validData.reduce((prev: ProvincialPriceComparison, curr: ProvincialPriceComparison) => (curr.price > prev.price ? curr : prev), validData[0] || { province: "Bali", price: 7200, medianPrice: 6700, percentageDiff: 7.46, isAvailable: true })

  const activeProvinceItem = data.find((d) => d.province === selectedProvince) || data[0]

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Breadcrumb & Header */}
      <div>
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <span className="font-semibold text-primary">SAMBUNG</span>
          <span className="text-muted-foreground/50">/</span>
          <span className="font-medium text-foreground">Peta Disparitas Harga Regional</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Disparitas Harga Antarprovinsi
            </h1>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              Pantau selisih harga beras dan gabah pada peta geospasial Indonesia dan pahami faktor penentu harga daerah.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === "map" ? "table" : "map")}
            className="self-start sm:self-auto gap-2 text-xs font-semibold shadow-xs cursor-pointer"
          >
            {viewMode === "map" ? (
              <>
                <TableIcon className="w-3.5 h-3.5 text-primary" />
                <span>Lihat sebagai Tabel</span>
              </>
            ) : (
              <>
                <MapIcon className="w-3.5 h-3.5 text-primary" />
                <span>Tampilkan Peta Spasial</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Filter Bar (3 Columns) */}
      <Card className="p-4 sm:p-5 bg-card border border-border rounded-2xl shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Komoditas Acuan</label>
            <div className="relative">
              <select
                value={selectedCommodity}
                onChange={(e) => setSelectedCommodity(e.target.value)}
                className="w-full h-11 appearance-none rounded-xl border border-border bg-card px-3.5 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary pr-9 cursor-pointer transition-all hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs"
              >
                <option value="Beras medium">Beras Medium</option>
                <option value="Beras premium">Beras Premium</option>
                <option value="Gabah Kering Panen (GKP)">Gabah Kering Panen (GKP)</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cakupan Wilayah</label>
            <div className="relative">
              <select
                value={selectedCoverage}
                onChange={(e) => setSelectedCoverage(e.target.value)}
                className="w-full h-11 appearance-none rounded-xl border border-border bg-card px-3.5 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary pr-9 cursor-pointer transition-all hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs"
              >
                <option value="Seluruh Indonesia">Seluruh Indonesia (38 Provinsi)</option>
                <option value="Pulau Jawa">Pulau Jawa (Sentra Utama)</option>
                <option value="Luar Jawa">Luar Jawa</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Snapshot Waktu</label>
            <div className="relative">
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full h-11 appearance-none rounded-xl border border-border bg-card px-3.5 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary pr-9 cursor-pointer transition-all hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs"
              >
                <option value="Snapshot pada acuan">Snapshot Terkini (Pekan Ini)</option>
                <option value="Rata-rata 30 hari">Rata-rata 30 Hari Terakhir</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>
      </Card>

      {/* Main Map Card */}
      <Card className="p-6 sm:p-7 space-y-6 rounded-2xl border border-border shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border">
          <div>
            <h2 className="font-display font-black text-xl text-foreground">Peta Geospasial Komparasi Wilayah</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Skema spasial Indonesia berdasarkan data pengamatan resmi BPS dan Bank Indonesia.
            </p>
          </div>
          <span className="text-xs font-bold text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20 self-start sm:self-auto">
            {selectedCoverage}
          </span>
        </div>

        {viewMode === "map" ? (
          <div>
            {/* Map Canvas */}
            <div className="w-full h-[400px] sm:h-[460px] rounded-2xl overflow-hidden border border-border relative shadow-inner">
              <LeafletPriceMap
                data={data}
                selectedProvince={selectedProvince}
                onSelectProvince={(prov) => setSelectedProvince(prov)}
              />
            </div>

            {/* Disparity Legend */}
            <div className="mt-5 flex flex-wrap items-center gap-6 text-xs text-muted-foreground pt-3 border-t border-border">
              <span className="font-bold text-foreground">Kategori Selisih Harga:</span>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-md bg-[#15803D]" />
                <span className="font-medium text-foreground">A · Murah (&lt; -2%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-md bg-[#657D28]" />
                <span>B · Sedikit di Bawah Acuan</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-md bg-[#EAB308]" />
                <span>C · Dekat Median (±2%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-md bg-[#DC2626]" />
                <span className="font-medium text-foreground">D · Tinggi (&gt; +2%)</span>
              </div>
            </div>
          </div>
        ) : (
          /* Table View */
          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/70">
                <tr className="border-b border-border text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="p-3.5">Provinsi</th>
                  <th className="p-3.5 text-right">Harga Gabah / kg</th>
                  <th className="p-3.5 text-right">Selisih vs Median</th>
                  <th className="p-3.5">Kategori Disparitas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/80">
                {data.map((item: ProvincialPriceComparison) => (
                  <tr
                    key={item.province}
                    onClick={() => setSelectedProvince(item.province)}
                    className={`hover:bg-muted/40 cursor-pointer transition-colors ${selectedProvince === item.province ? "bg-emerald-50 dark:bg-emerald-950/40" : ""}`}
                  >
                    <td className="p-3.5 font-bold text-foreground flex items-center gap-2">
                      {selectedProvince === item.province && <span className="w-2 h-2 rounded-full bg-primary" />}
                      <span>{item.province}</span>
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold text-foreground">
                      {item.isAvailable && item.price ? formatRupiah(item.price) : "Belum cukup data"}
                    </td>
                    <td className="p-3.5 text-right font-mono">
                      {item.isAvailable && item.price ? (
                        <span className={item.percentageDiff < 0 ? "text-emerald-700 dark:text-emerald-400 font-bold" : "text-amber-700 dark:text-amber-400 font-bold"}>
                          {item.percentageDiff > 0 ? `+${item.percentageDiff.toFixed(1)}%` : `${item.percentageDiff.toFixed(1)}%`}
                        </span>
                      ) : "-"}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-muted text-muted-foreground">
                        {Math.abs(item.percentageDiff) < 2 ? "A (Wajar)" : Math.abs(item.percentageDiff) < 5 ? "B (Moderat)" : Math.abs(item.percentageDiff) < 10 ? "C (Tinggi)" : "D (Ekstrem)"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3 Summary Metrics */}
        <div className="pt-5 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Harga Terendah (Sentra Panen)
            </p>
            <p className="text-base font-bold text-foreground">
              {minPriceItem?.province || "Bali"}
            </p>
            <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-display tabular-nums">
              {formatRupiah(minPriceItem?.price || 11900)}<span className="text-xs font-semibold text-muted-foreground">/kg</span>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Harga Tertinggi (Wilayah Konsumen)
            </p>
            <p className="text-base font-bold text-foreground">
              {maxPriceItem?.province || "Kalimantan Selatan"}
            </p>
            <p className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 pt-1">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Biaya logistik lintas pulau</span>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Rentang Disparitas Nasional
            </p>
            <p className="font-display text-3xl font-black text-foreground tracking-tight tabular-nums">
              45%
            </p>
            <p className="text-[11px] text-muted-foreground">
              Perbedaan biaya pasokan beras antarpulau
            </p>
          </div>
        </div>
      </Card>

      {/* PB-03b : Detail Konteks Provinsi & Penjelasan SHAP Model */}
      <Card className="p-6 sm:p-7 space-y-6 border border-emerald-300 dark:border-emerald-800/80 bg-gradient-to-b from-card to-emerald-50/20 dark:to-emerald-950/20 rounded-2xl shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Detail Wilayah Terpilih</span>
              <Badge variant="default" className="text-xs font-bold">{selectedProvince}</Badge>
            </div>
            <h3 className="font-display text-2xl font-black text-foreground mt-1">
              Konteks Harga & Analisis Disparitas {selectedProvince}
            </h3>
          </div>
        </div>

        {/* 8:4 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-4">
            <div>
              <h4 className="font-bold text-sm text-foreground flex items-center gap-2 font-display">
                <Cpu className="w-4 h-4 text-primary" />
                <span>Faktor Kontribusi Deviasi Model SHAP (v0.2)</span>
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Estimasi pengaruh variabel makro, logistik antarpulau, dan curah hujan terhadap selisih harga dari median nasional.
              </p>
            </div>

            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/70">
                  <tr className="border-b border-border text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    <th className="p-3">Variabel Pengaruh</th>
                    <th className="p-3">Nilai Pengamatan</th>
                    <th className="p-3 text-right">Arah & Bobot Kontribusi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/80">
                  <tr>
                    <td className="p-3 font-semibold text-foreground">Jarak & Biaya Logistik Distribusi</td>
                    <td className="p-3 text-muted-foreground font-mono">Indeks 1.18</td>
                    <td className="p-3 text-right font-mono font-bold text-amber-700 dark:text-amber-400">
                      + Rp85/kg (Menaikkan harga)
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-foreground">Curah Hujan & Anomali Iklim BMKG</td>
                    <td className="p-3 text-muted-foreground font-mono">145 mm / dasarian</td>
                    <td className="p-3 text-right font-mono font-bold text-amber-700 dark:text-amber-400">
                      + Rp45/kg (Menekan pasokan)
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-foreground">Volume Surplus Panen Regional</td>
                    <td className="p-3 text-muted-foreground font-mono">Tinggi (Masa Panen Raya)</td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      - Rp95/kg (Menurunkan harga)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-muted-foreground italic">
              * Faktor kontribusi SHAP menjelaskan bobot model statistik, bukan klaim penyebab hukum mutlak.
            </p>
          </div>

          <div className="lg:col-span-4 space-y-3.5 p-5 rounded-2xl bg-muted/60 border border-border">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Ringkasan Wilayah</span>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-border/80">
                <span className="text-muted-foreground">Harga Teramati:</span>
                <span className="font-mono font-bold text-foreground text-sm">
                  {activeProvinceItem.isAvailable && activeProvinceItem.price ? formatRupiah(activeProvinceItem.price) : "Belum cukup"}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/80">
                <span className="text-muted-foreground">Median Pembanding:</span>
                <span className="font-mono font-bold text-foreground text-sm">
                  {formatRupiah(activeProvinceItem.medianPrice)}/kg
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">Selisih Relatif:</span>
                <span className={`font-mono font-black text-sm ${activeProvinceItem.percentageDiff < 0 ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"}`}>
                  {activeProvinceItem.percentageDiff > 0 ? `+${activeProvinceItem.percentageDiff.toFixed(1)}%` : `${activeProvinceItem.percentageDiff.toFixed(1)}%`}
                </span>
              </div>
            </div>

            {onNavigate && (
              <div className="space-y-2 pt-2">
                <Button
                  size="default"
                  onClick={() => onNavigate("price-board")}
                  className="w-full text-xs font-bold justify-between group cursor-pointer"
                >
                  <span>Lihat Papan Rantai Harga</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => onNavigate("forecast")}
                  className="w-full text-xs font-semibold justify-between group cursor-pointer"
                >
                  <span>Buka Prakiraan Wilayah</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
