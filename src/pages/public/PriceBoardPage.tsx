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
  Store
} from "lucide-react"

export function PriceBoardPage() {
  const [selectedCommodity, setSelectedCommodity] = useState<string>("Beras medium I")
  const [selectedRegion, setSelectedRegion] = useState<string>("Jawa Timur")
  const [selectedPeriod, setSelectedPeriod] = useState<string>("12 pekan pada acuan")

  // Chain price data matching mockup
  const chainData = [
    { level: "Petani (beras)", price: 12730, icon: Sprout },
    { level: "Penggilingan", price: 14380, icon: Building2 },
    { level: "Pedagang besar", price: 14590, icon: Truck },
    { level: "Eceran", price: 15350, icon: Store },
  ]

  const farmerPrice = 12730
  const retailPrice = 15350
  const marginPrice = retailPrice - farmerPrice
  const marginPercent = ((marginPrice / farmerPrice) * 100).toFixed(1)
  const farmerShare = Math.round((farmerPrice / retailPrice) * 100)

  // Export CSV Handler
  const handleDownloadCSV = () => {
    const headers = "Tingkat Rantai Pasok,Komoditas,Wilayah,Harga Acuan (Rp/kg)\n"
    const rows = chainData
      .map((d) => `"${d.level}","${selectedCommodity}","${selectedRegion}",${d.price}`)
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
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span>SAMBUNG</span>
          <span>/</span>
          <span className="text-foreground">PAPAN HARGA 2 SISI</span>
        </div>

        <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Papan harga 2 sisi
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Ikuti nilai dari produsen ke konsumen. Bandingkan komoditas yang sama.
            </p>
          </div>

          <Button
            onClick={handleDownloadCSV}
            variant="outline"
            className="self-start sm:self-auto gap-2 text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh ringkasan</span>
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
              <option value="Beras medium I">Beras medium I</option>
              <option value="Beras premium">Beras premium</option>
              <option value="Gabah Kering Panen (GKP)">Gabah Kering Panen (GKP)</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Wilayah pembanding</label>
          <div className="relative">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full h-10 appearance-none rounded-lg border border-border bg-card px-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary pr-9 cursor-pointer"
            >
              <option value="Jawa Timur">Jawa Timur</option>
              <option value="Jawa Tengah">Jawa Tengah</option>
              <option value="Jawa Barat">Jawa Barat</option>
              <option value="Nasional">Rata-rata Nasional</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Periode</label>
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full h-10 appearance-none rounded-lg border border-border bg-card px-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary pr-9 cursor-pointer"
            >
              <option value="12 pekan pada acuan">12 pekan pada acuan</option>
              <option value="8 pekan pada acuan">8 pekan pada acuan</option>
              <option value="4 pekan pada acuan">4 pekan pada acuan</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main 2 Column Grid (~7 cols left, ~5 cols right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Dari Petani ke Pembeli */}
        <Card className="lg:col-span-7 p-6 space-y-4">
          <div>
            <h3 className="font-bold text-base text-foreground">Dari petani ke pembeli</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Harga per kg beras medium I · bukan harga GKP
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/80 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="py-2.5 font-semibold">Tingkat Rantai Pasok</th>
                  <th className="py-2.5 text-right font-semibold">Harga Acuan / kg</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {chainData.map((item) => {
                  const Icon = item.icon
                  return (
                    <tr key={item.level} className="hover:bg-muted/40 transition-colors">
                      <td className="py-3.5 flex items-center gap-2.5 font-medium text-foreground">
                        <div className="p-1.5 rounded-md bg-secondary text-secondary-foreground">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span>{item.level}</span>
                      </td>
                      <td className="py-3.5 text-right font-bold text-sm text-foreground">
                        Rp{item.price.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Right Column: Transparansi Selisih */}
        <Card className="lg:col-span-5 p-6 space-y-4">
          <h3 className="font-bold text-base text-foreground">Transparansi selisih</h3>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EAF1E7] text-[#2D4828] dark:bg-primary/20 dark:text-primary-foreground text-xs font-semibold border border-primary/20">
            <span>Bagian harga petani ≈ {farmerShare}%</span>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Selisih petani → eceran</p>
            <p className="font-display text-3xl font-extrabold text-foreground tracking-tight">
              Rp{marginPrice.toLocaleString("id-ID")} <span className="text-sm font-normal text-muted-foreground">/kg</span>
            </p>
            <p className="text-xs font-semibold text-[#246447] dark:text-[#A9D6B0]">
              +{marginPercent}% dari harga petani
            </p>
          </div>

          <div className="pt-3 border-t border-border/80 space-y-2 text-[11px] text-muted-foreground leading-relaxed">
            <p>
              Rp{retailPrice.toLocaleString("id-ID")}  -  Rp{farmerPrice.toLocaleString("id-ID")}. Ini bukan laba bersih; biaya pengolahan, logistik, susut, dan margin belum dipisahkan.
            </p>
            <p className="font-mono pt-1 text-foreground/80">
              Bagian petani = Rp{farmerPrice.toLocaleString("id-ID")} ÷ Rp{retailPrice.toLocaleString("id-ID")}.
            </p>
          </div>
        </Card>
      </div>

      {/* Multi-Line Trend Chart (Pergerakan Harga · 12 Pekan) */}
      <Card className="p-6 space-y-4">
        <div>
          <h3 className="font-bold text-base text-foreground">Pergerakan harga · 12 pekan</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Skema tren dari gambar acuan; titik mingguan bukan data harga terverifikasi.
          </p>
        </div>

        {/* SVG Chart with 3 lines matching mockup */}
        <div className="relative pt-4 pb-2">
          {/* Y-axis reference levels */}
          <div className="w-full h-48 sm:h-56 relative border-l border-b border-border/80 flex flex-col justify-between p-2">
            <div className="absolute inset-x-0 top-0 border-b border-dashed border-border/30" />
            <div className="absolute inset-x-0 top-1/3 border-b border-dashed border-border/30" />
            <div className="absolute inset-x-0 top-2/3 border-b border-dashed border-border/30" />

            <div className="absolute -left-16 top-0 text-[10px] text-muted-foreground text-right w-14">
              Rp20.000
            </div>
            <div className="absolute -left-16 top-1/3 text-[10px] text-muted-foreground text-right w-14">
              Rp15.000
            </div>
            <div className="absolute -left-16 top-2/3 text-[10px] text-muted-foreground text-right w-14">
              Rp10.000
            </div>
            <div className="absolute -left-16 bottom-0 text-[10px] text-muted-foreground text-right w-14">
              Rp5.000
            </div>

            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 160" preserveAspectRatio="none">
              {/* Eceran line (Dotted dark) */}
              <path
                d="M 10 95 Q 120 90 250 80 T 490 65"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="3 3"
                className="text-foreground/70"
              />
              {/* Pedagang besar line (Dashed dark) */}
              <path
                d="M 10 110 Q 120 105 250 95 T 490 80"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="6 4"
                className="text-[#1E293B] dark:text-zinc-400"
              />
              {/* Produsen line (Solid green) */}
              <path
                d="M 10 130 Q 120 120 250 110 T 490 95"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-[#246447] dark:text-[#A9D6B0]"
              />
            </svg>
          </div>

          {/* X-axis labels */}
          <div className="mt-3 flex justify-between text-[11px] text-muted-foreground px-2">
            <span>Pekan 1</span>
            <span>Pekan 3</span>
            <span>Pekan 6</span>
            <span>Pekan 9</span>
            <span>Pekan 12</span>
          </div>

          {/* Chart Legend matching mockup */}
          <div className="mt-4 flex flex-wrap items-center gap-6 text-xs text-muted-foreground pt-2 border-t border-border/60">
            <div className="flex items-center gap-2">
              <span className="w-5 h-0.5 bg-[#246447] dark:bg-[#A9D6B0]" />
              <span className="text-foreground font-medium">Produsen · garis utuh</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-0.5 border-b-2 border-dashed border-[#1E293B] dark:border-zinc-400" />
              <span>Pedagang besar · putus</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-0.5 border-b-2 border-dotted border-foreground/70" />
              <span>Eceran · titik</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Info Banner: Bandingkan Setara */}
      <div className="p-4 rounded-xl bg-muted/60 border border-border/80 flex items-start gap-3 text-xs">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <div className="leading-relaxed text-muted-foreground">
          <span className="font-bold text-foreground">Bandingkan setara: </span>
          Harga beras tidak dapat langsung dibandingkan dengan harga gabah. Mutu, rendemen, dan biaya pengolahan memengaruhi nilai akhirnya.
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
