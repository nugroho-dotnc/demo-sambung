import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Download,
  ChevronDown,
  Info,
  Sprout,
  Building2,
  Truck,
  Store,
  Percent
} from "lucide-react"

export function PriceBoardPage() {
  const [selectedCommodity, setSelectedCommodity] = useState<string>("Beras medium I")
  const [selectedRegion, setSelectedRegion] = useState<string>("Jawa Timur")
  const [selectedPeriod, setSelectedPeriod] = useState<string>("12 pekan pada acuan")

  // Chain price data matching mockup
  const chainData = [
    { level: "Petani (setara beras)", price: 12730, icon: Sprout, note: "Rendemen gabah ~55%" },
    { level: "Penggilingan (produsen)", price: 14380, icon: Building2, note: "Marjin pengolahan +Rp1.650" },
    { level: "Pedagang besar / grosir", price: 14590, icon: Truck, note: "Logistik distribusi +Rp210" },
    { level: "Eceran pasar konsumen", price: 15350, icon: Store, note: "Harga rata-rata PIHPS +Rp760" },
  ]

  const farmerPrice = 12730
  const retailPrice = 15350
  const marginPrice = retailPrice - farmerPrice
  const marginPercent = ((marginPrice / farmerPrice) * 100).toFixed(1)
  const farmerShare = Math.round((farmerPrice / retailPrice) * 100)

  // Export CSV Handler
  const handleDownloadCSV = () => {
    const headers = "Tingkat Rantai Pasok,Komoditas,Wilayah,Harga Acuan (Rp/kg),Keterangan\n"
    const rows = chainData
      .map((d) => `"${d.level}","${selectedCommodity}","${selectedRegion}",${d.price},"${d.note}"`)
      .join("\n")

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `SAMBUNG_Papan_Harga_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Breadcrumb & Header */}
      <div>
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <span className="font-semibold text-primary">SAMBUNG</span>
          <span className="text-muted-foreground/50">/</span>
          <span className="font-medium text-foreground">Papan Rantai Harga 2 Sisi</span>
        </nav>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Papan Harga 2 Sisi
            </h1>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              Ikuti pembentukan nilai dari produsen ke konsumen. Bandingkan komoditas yang sama secara transparan.
            </p>
          </div>

          <Button
            onClick={handleDownloadCSV}
            variant="outline"
            className="self-start sm:self-auto gap-2 text-xs font-semibold cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-primary" />
            <span>Unduh Ringkasan CSV</span>
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
                <option value="Beras medium I">Beras Medium I</option>
                <option value="Beras premium">Beras Premium</option>
                <option value="Gabah Kering Panen (GKP)">Gabah Kering Panen (GKP)</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Wilayah Pembanding</label>
            <div className="relative">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full h-11 appearance-none rounded-xl border border-border bg-card px-3.5 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary pr-9 cursor-pointer transition-all hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs"
              >
                <option value="Jawa Timur">Jawa Timur</option>
                <option value="Jawa Tengah">Jawa Tengah</option>
                <option value="Jawa Barat">Jawa Barat</option>
                <option value="Nasional">Rata-rata Nasional</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Rentang Waktu</label>
            <div className="relative">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full h-11 appearance-none rounded-xl border border-border bg-card px-3.5 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary pr-9 cursor-pointer transition-all hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs"
              >
                <option value="12 pekan pada acuan">12 Pekan Terakhir</option>
                <option value="8 pekan pada acuan">8 Pekan Terakhir</option>
                <option value="4 pekan pada acuan">4 Pekan Terakhir</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>
      </Card>

      {/* Main 2 Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Dari Petani ke Pembeli */}
        <Card className="lg:col-span-7 p-6 sm:p-7 space-y-5 rounded-2xl border border-border shadow-xs">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Struktur Biaya & Marjin</span>
            <h3 className="font-display font-black text-xl text-foreground mt-0.5">Dari Petani ke Pembeli</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Harga per kg ekuivalen beras medium I · mencerminkan konversi dari gabah panen.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/70">
                <tr className="border-b border-border text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="py-3 px-4">Tingkat Rantai Pasok</th>
                  <th className="py-3 px-4">Keterangan</th>
                  <th className="py-3 px-4 text-right">Harga Acuan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/80">
                {chainData.map((item) => {
                  const Icon = item.icon
                  return (
                    <tr key={item.level} className="hover:bg-muted/40 transition-colors">
                      <td className="py-3.5 px-4 flex items-center gap-3 font-bold text-foreground">
                        <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span>{item.level}</span>
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground text-[11px]">{item.note}</td>
                      <td className="py-3.5 px-4 text-right font-black font-display text-sm text-foreground tabular-nums">
                        Rp{item.price.toLocaleString("id-ID")}/kg
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Right Column: Transparansi Selisih */}
        <Card className="lg:col-span-5 p-6 sm:p-7 space-y-5 rounded-2xl border border-border shadow-xs bg-gradient-to-b from-card to-emerald-50/20 dark:to-emerald-950/20">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Indikator Distribusi</span>
            <h3 className="font-display font-black text-xl text-foreground mt-0.5">Transparansi Selisih Nilai</h3>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Percent className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-950 dark:text-emerald-200">Bagian Petani (Farmer's Share)</p>
              <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300 font-display tabular-nums">
                {farmerShare}%
              </p>
            </div>
          </div>

          <div className="space-y-1.5 p-4 rounded-xl bg-muted/50 border border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Selisih Petani → Konsumen Akhir</p>
            <p className="font-display text-3xl font-black text-foreground tracking-tight tabular-nums">
              Rp{marginPrice.toLocaleString("id-ID")} <span className="text-sm font-semibold text-muted-foreground">/kg</span>
            </p>
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
              +{marginPercent}% total marjin rantai distribusi
            </p>
          </div>

          <div className="pt-2 border-t border-border space-y-2 text-xs text-muted-foreground leading-relaxed">
            <p>
              Selisih Rp{retailPrice.toLocaleString("id-ID")} - Rp{farmerPrice.toLocaleString("id-ID")} mencakup biaya operasional pengeringan pabrik, logistik darat/laut antarpulau, kemasan, dan susut mutu alami.
            </p>
            <p className="font-mono text-[11px] pt-1 text-foreground/80 font-medium">
              Formula: Farmer's Share = (Rp{farmerPrice.toLocaleString("id-ID")} ÷ Rp{retailPrice.toLocaleString("id-ID")}) × 100%
            </p>
          </div>
        </Card>
      </div>

      {/* Multi-Line Trend Chart (Pergerakan Harga · 12 Pekan) */}
      <Card className="p-6 sm:p-7 space-y-5 rounded-2xl border border-border shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border">
          <div>
            <h3 className="font-display font-black text-xl text-foreground">Pergerakan Harga Rantai Pasok · 12 Pekan</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Tren transmisi harga dari produsen penggilingan hingga pasar eceran konsumen (PIHPS).
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-lg bg-muted text-muted-foreground font-semibold self-start sm:self-auto">
            Satuan: Rp/kg Beras
          </span>
        </div>

        {/* SVG Chart with 3 lines */}
        <div className="relative pt-6 pb-2">
          {/* Y-axis reference levels */}
          <div className="w-full h-52 sm:h-64 relative border-l border-b border-border flex flex-col justify-between p-2">
            <div className="absolute inset-x-0 top-0 border-b border-dashed border-border/40" />
            <div className="absolute inset-x-0 top-1/3 border-b border-dashed border-border/40" />
            <div className="absolute inset-x-0 top-2/3 border-b border-dashed border-border/40" />

            <div className="absolute -left-16 top-0 text-[11px] font-mono text-muted-foreground text-right w-14">
              Rp20.000
            </div>
            <div className="absolute -left-16 top-1/3 text-[11px] font-mono text-muted-foreground text-right w-14">
              Rp15.000
            </div>
            <div className="absolute -left-16 top-2/3 text-[11px] font-mono text-muted-foreground text-right w-14">
              Rp10.000
            </div>
            <div className="absolute -left-16 bottom-0 text-[11px] font-mono text-muted-foreground text-right w-14">
              Rp5.000
            </div>

            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 160" preserveAspectRatio="none">
              {/* Eceran line (Dotted red/dark) */}
              <path
                d="M 10 95 Q 120 90 250 80 T 490 65"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeDasharray="4 4"
                className="text-foreground/70"
              />
              {/* Pedagang besar line (Dashed amber) */}
              <path
                d="M 10 110 Q 120 105 250 95 T 490 80"
                fill="none"
                stroke="#D97706"
                strokeWidth="2.5"
                strokeDasharray="6 4"
              />
              {/* Produsen line (Solid emerald) */}
              <path
                d="M 10 130 Q 120 120 250 110 T 490 95"
                fill="none"
                stroke="#15803D"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* X-axis labels */}
          <div className="mt-3 flex justify-between text-xs font-semibold text-muted-foreground px-2">
            <span>Pekan 1</span>
            <span>Pekan 3</span>
            <span>Pekan 6</span>
            <span>Pekan 9</span>
            <span>Pekan 12</span>
          </div>

          {/* Chart Legend */}
          <div className="mt-5 flex flex-wrap items-center gap-6 text-xs font-semibold text-muted-foreground pt-3 border-t border-border">
            <div className="flex items-center gap-2">
              <span className="w-5 h-1 bg-[#15803D] rounded-full" />
              <span className="text-foreground">Produsen Penggilingan (Garis Utuh Hijau)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-1 border-b-2 border-dashed border-[#D97706]" />
              <span>Pedagang Besar / Grosir (Garis Putus Amber)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-1 border-b-2 border-dotted border-foreground/70" />
              <span>Eceran Pasar Konsumen (Garis Titik Netral)</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Info Banner: Bandingkan Setara */}
      <div className="p-4.5 rounded-2xl bg-muted/60 border border-border flex items-start gap-3.5 text-xs shadow-2xs">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="leading-relaxed text-muted-foreground">
          <span className="font-bold text-foreground">Bandingkan Setara: </span>
          Harga beras tidak dapat langsung disamakan dengan harga gabah mentah tanpa memperhitungkan faktor rendemen konversi giling (~55%), kadar air panen, dan biaya penyusutan.
        </div>
      </div>
    </div>
  )
}
