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
  Info,
  AlertTriangle,
  Cpu
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
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span>SAMBUNG</span>
          <span>/</span>
          <span className="text-foreground">PETA PUBLIK</span>
        </div>

        <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Selisih harga antarprovinsi
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Lihat disparitas harga beras pada peta Indonesia, bukan lokasi penjual individual.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === "map" ? "table" : "map")}
            className="self-start sm:self-auto gap-2 text-xs"
          >
            {viewMode === "map" ? (
              <>
                <TableIcon className="w-3.5 h-3.5" />
                <span>Lihat sebagai tabel</span>
              </>
            ) : (
              <>
                <MapIcon className="w-3.5 h-3.5" />
                <span>Tampilkan peta</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Filter Bar (3 Columns) matching mockup */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Komoditas</label>
          <div className="relative">
            <select
              value={selectedCommodity}
              onChange={(e) => setSelectedCommodity(e.target.value)}
              className="w-full h-10 appearance-none rounded-lg border border-border bg-card px-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary pr-9 cursor-pointer"
            >
              <option value="Beras medium">Beras medium</option>
              <option value="Beras premium">Beras premium</option>
              <option value="Gabah Kering Panen (GKP)">Gabah Kering Panen (GKP)</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Cakupan</label>
          <div className="relative">
            <select
              value={selectedCoverage}
              onChange={(e) => setSelectedCoverage(e.target.value)}
              className="w-full h-10 appearance-none rounded-lg border border-border bg-card px-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary pr-9 cursor-pointer"
            >
              <option value="Seluruh Indonesia">Seluruh Indonesia</option>
              <option value="Pulau Jawa">Pulau Jawa</option>
              <option value="Luar Jawa">Luar Jawa</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Waktu</label>
          <div className="relative">
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full h-10 appearance-none rounded-lg border border-border bg-card px-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary pr-9 cursor-pointer"
            >
              <option value="Snapshot pada acuan">Snapshot pada acuan</option>
              <option value="Rata-rata 30 hari">Rata-rata 30 hari</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Map Card matching mockup */}
      <Card className="p-6 space-y-6">
        <div>
          <h2 className="font-bold text-base text-foreground">Peta perbandingan wilayah</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Skema geografis Indonesia · pengelompokan mengikuti visual acuan, bukan batas administratif rinci.
          </p>
        </div>

        {viewMode === "map" ? (
          <div>
            {/* Map Canvas */}
            <div className="w-full h-[380px] sm:h-[420px] rounded-xl overflow-hidden border border-border/80 relative">
              <LeafletPriceMap
                data={data}
                selectedProvince={selectedProvince}
                onSelectProvince={(prov) => setSelectedProvince(prov)}
              />
            </div>

            {/* Mockup Disparity Categories Legend */}
            <div className="mt-4 flex flex-wrap items-center gap-6 text-xs text-muted-foreground pt-3 border-t border-border/60">
              <span className="font-semibold text-foreground">Selisih harga:</span>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-xs bg-[#246447]" />
                <span>A · &lt;20%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-xs bg-[#8A9A3A]" />
                <span>B · 20 - 30%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-xs bg-[#EAB308]" />
                <span>C · 30 - 40%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-xs bg-[#C86B3C]" />
                <span>D · &gt;40%</span>
              </div>
            </div>
          </div>
        ) : (
          /* Table View */
          <div className="overflow-x-auto border border-border/80 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="p-3">Provinsi</th>
                  <th className="p-3 text-right">Harga Gabah / kg</th>
                  <th className="p-3 text-right">Selisih vs Median</th>
                  <th className="p-3">Kategori</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {data.map((item: ProvincialPriceComparison) => (
                  <tr
                    key={item.province}
                    onClick={() => setSelectedProvince(item.province)}
                    className={`hover:bg-muted/40 cursor-pointer transition-colors ${selectedProvince === item.province ? "bg-primary/10" : ""}`}
                  >
                    <td className="p-3 font-semibold text-foreground">{item.province}</td>
                    <td className="p-3 text-right font-mono font-medium">
                      {item.isAvailable && item.price ? formatRupiah(item.price) : "Belum cukup data"}
                    </td>
                    <td className="p-3 text-right font-mono">
                      {item.isAvailable && item.price ? (
                        <span className={item.percentageDiff < 0 ? "text-[#246447] dark:text-[#A9D6B0] font-semibold" : "text-[#C86B3C] font-semibold"}>
                          {item.percentageDiff > 0 ? `+${item.percentageDiff.toFixed(1)}%` : `${item.percentageDiff.toFixed(1)}%`}
                        </span>
                      ) : "-"}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-muted text-muted-foreground">
                        {Math.abs(item.percentageDiff) < 20 ? "A (<20%)" : Math.abs(item.percentageDiff) < 30 ? "B (20-30%)" : Math.abs(item.percentageDiff) < 40 ? "C (30-40%)" : "D (>40%)"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3 Summary Metrics at bottom matching mockup */}
        <div className="pt-4 border-t border-border/80 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Metric 1: Harga Terendah */}
          <div className="space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Harga Terendah
            </p>
            <p className="text-base font-bold text-foreground">
              {minPriceItem?.province || "Bali"}
            </p>
            <p className="text-xl font-bold text-[#246447] dark:text-[#A9D6B0]">
              {formatRupiah(minPriceItem?.price || 11900)}<span className="text-xs font-normal text-muted-foreground">/kg</span>
            </p>
          </div>

          {/* Metric 2: Harga Tertinggi */}
          <div className="space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Harga Tertinggi
            </p>
            <p className="text-base font-bold text-foreground">
              {maxPriceItem?.province || "Kalimantan Tengah"}
            </p>
            <p className="text-xs font-bold text-[#C86B3C] flex items-center gap-1 pt-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Perlu perhatian</span>
            </p>
          </div>

          {/* Metric 3: Selisih Pada Acuan */}
          <div className="space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Selisih Pada Acuan
            </p>
            <p className="font-display text-3xl font-extrabold text-[#C86B3C] tracking-tight">
              49%
            </p>
            <p className="text-[11px] text-muted-foreground">
              Bandingkan komoditas dan waktu yang sama.
            </p>
          </div>
        </div>
      </Card>

      {/* PB-03b :  Detail Konteks Provinsi & Penjelasan SHAP Model */}
      <Card className="p-6 space-y-5 border-2 border-primary/20 bg-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Detail Wilayah (PB-03b)</span>
              <Badge variant="default" className="text-xs">{selectedProvince}</Badge>
            </div>
            <h3 className="font-display text-xl font-bold text-foreground mt-0.5">
              Konteks Harga & Analisis Disparitas {selectedProvince}
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Status Observasi:</span>
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">Tervalidasi Data Bapanas</span>
          </div>
        </div>

        {/* 8:4 Grid: SHAP Table (8) | Metric Summary (4) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-4">
            <div>
              <h4 className="font-bold text-xs text-foreground flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-primary" />
                <span>Faktor Kontribusi Deviasi Model SHAP (v0.2)</span>
              </h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Estimasi pengaruh variabel makro dan iklim terhadap selisih harga dari median nasional.
              </p>
            </div>

            <div className="overflow-x-auto border border-border/80 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <th className="p-2.5">Variabel Pengaruh</th>
                    <th className="p-2.5">Nilai Pengamatan</th>
                    <th className="p-2.5 text-right">Arah & Bobot Kontribusi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  <tr>
                    <td className="p-2.5 font-medium text-foreground">Jarak & Biaya Logistik Distribusi</td>
                    <td className="p-2.5 text-muted-foreground font-mono">Indeks 1.18</td>
                    <td className="p-2.5 text-right font-mono font-bold text-[#C86B3C]">
                      + Rp85/kg (Menaikkan harga)
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium text-foreground">Curah Hujan & Anomali Iklim BMKG</td>
                    <td className="p-2.5 text-muted-foreground font-mono">145 mm / dasarian</td>
                    <td className="p-2.5 text-right font-mono font-bold text-[#C86B3C]">
                      + Rp45/kg (Menekan pasokan)
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium text-foreground">Volume Surplus Panen Regional</td>
                    <td className="p-2.5 text-muted-foreground font-mono">Tinggi (Masa Panen Raya)</td>
                    <td className="p-2.5 text-right font-mono font-bold text-[#246447] dark:text-[#A9D6B0]">
                      - Rp95/kg (Menurunkan harga)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[10px] text-muted-foreground italic">
              * Faktor kontribusi SHAP menjelaskan bobot model statistik, bukan klaim penyebab hukum mutlak.
            </p>
          </div>

          <div className="lg:col-span-4 space-y-3 p-4 rounded-xl bg-muted/50 border border-border/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Ringkasan Wilayah</span>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-border/60">
                <span className="text-muted-foreground">Harga Teramati:</span>
                <span className="font-mono font-bold text-foreground">
                  {activeProvinceItem.isAvailable && activeProvinceItem.price ? formatRupiah(activeProvinceItem.price) : "Belum cukup"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/60">
                <span className="text-muted-foreground">Median Pembanding:</span>
                <span className="font-mono font-bold text-foreground">
                  {formatRupiah(activeProvinceItem.medianPrice)}/kg
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Selisih Relatif:</span>
                <span className={`font-mono font-bold ${activeProvinceItem.percentageDiff < 0 ? "text-[#246447] dark:text-[#A9D6B0]" : "text-[#C86B3C]"}`}>
                  {activeProvinceItem.percentageDiff > 0 ? `+${activeProvinceItem.percentageDiff.toFixed(1)}%` : `${activeProvinceItem.percentageDiff.toFixed(1)}%`}
                </span>
              </div>
            </div>

            {onNavigate && (
              <div className="space-y-1.5 pt-2">
                <Button
                  size="sm"
                  onClick={() => onNavigate("price-board")}
                  className="w-full text-xs"
                >
                  Lihat Papan Rantai Harga
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate("forecast")}
                  className="w-full text-xs"
                >
                  Buka Prakiraan Wilayah
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Info Banner: Mengapa Harga Bisa Berbeda */}
      <div className="p-4 rounded-xl bg-muted/60 border border-border/80 flex items-start gap-3 text-xs">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <div className="leading-relaxed text-muted-foreground">
          <span className="font-bold text-foreground">Mengapa harga bisa berbeda? </span>
          Jarak distribusi, ketersediaan pasokan, mutu, serta biaya pengolahan dapat memengaruhi selisih harga. Peta bukan rekomendasi harga transaksi.
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
