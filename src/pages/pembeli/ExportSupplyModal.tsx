import { useSambungStore } from "@/store/sambungStore"
import { Button } from "@/components/ui/button"
import { Download, X, ShieldCheck, FileSpreadsheet } from "lucide-react"

interface ExportSupplyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ExportSupplyModal({ isOpen, onClose }: ExportSupplyModalProps) {
  const { offers } = useSambungStore()

  if (!isOpen) return null

  // Aggregation logic according to DEC-015b
  // Groups by: grainType + province
  const groups: Record<
    string,
    {
      grainType: string
      province: string
      count: number
      totalAvailableVolume: number
      minPrice: number
      maxPrice: number
    }
  > = {}

  offers
    .filter((o) => o.publicationStatus === "Terbit")
    .forEach((o) => {
      const key = `${o.grainType}_${o.province}`
      if (!groups[key]) {
        groups[key] = {
          grainType: o.grainType,
          province: o.province,
          count: 0,
          totalAvailableVolume: 0,
          minPrice: o.askingPrice,
          maxPrice: o.askingPrice
        }
      }
      groups[key].count += 1
      groups[key].totalAvailableVolume += o.availableVolume
      groups[key].minPrice = Math.min(groups[key].minPrice, o.askingPrice)
      groups[key].maxPrice = Math.max(groups[key].maxPrice, o.askingPrice)
    })

  const aggregatedList = Object.values(groups)

  const handleDownload = () => {
    const timestamp = new Date().toISOString()
    const headers =
      "Jenis Gabah,Provinsi,Jumlah Tawaran Unik,Total Volume Tersedia (kg),Harga Minta Min (Rp/kg),Harga Minta Maks (Rp/kg),Waktu Snapshot\n"
    const rows = aggregatedList
      .map(
        (g) =>
          `"${g.grainType}","${g.province}",${g.count},${g.totalAvailableVolume},${g.minPrice},${g.maxPrice},"${timestamp}"`
      )
      .join("\n")

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `SAMBUNG_Pasokan_Agregasi_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-card text-card-foreground border border-border/80 rounded-2xl shadow-xl overflow-hidden p-6 sm:p-7">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors cursor-pointer"
          aria-label="Tutup dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-3.5 mb-4">
          <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-display text-foreground">
              Ekspor Data Agregasi Pasokan
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Unduh rekapitulasi pasokan gabah per wilayah sesuai prinsip perlindungan privasi dan anonimitas petani.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-muted/40 border border-border/70 space-y-1.5 text-xs text-muted-foreground leading-relaxed">
          <div className="flex items-center gap-2 font-bold text-foreground">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Kepatuhan Privasi Data Platform</span>
          </div>
          <p>
            Berkas CSV ini hanya memuat ringkasan agregasi per jenis gabah dan provinsi: jumlah tawaran unik, total volume tersedia, dan rentang harga minta. Berkas <strong>TIDAK memuat</strong> identitas perorangan, nomor kontak, atau rincian transaksi individu.
          </p>
        </div>

        {/* Preview of Aggregated Data */}
        <div className="mt-4 border border-border/80 rounded-xl overflow-x-auto shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-muted/60 text-muted-foreground uppercase text-[10px] font-bold tracking-wider border-b border-border/80">
                <th className="p-3 font-semibold">Komoditas</th>
                <th className="p-3 font-semibold">Provinsi</th>
                <th className="p-3 text-right font-semibold">Tawaran</th>
                <th className="p-3 text-right font-semibold">Volume (kg)</th>
                <th className="p-3 text-right font-semibold">Rentang Harga</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-mono">
              {aggregatedList.map((g, i) => (
                <tr key={i} className="hover:bg-muted/20 transition-colors">
                  <td className="p-3 font-sans font-bold text-foreground">{g.grainType}</td>
                  <td className="p-3 font-sans text-foreground">{g.province}</td>
                  <td className="p-3 text-right tabular-nums text-foreground">{g.count}</td>
                  <td className="p-3 text-right tabular-nums text-foreground">{g.totalAvailableVolume.toLocaleString("id-ID")}</td>
                  <td className="p-3 text-right tabular-nums text-primary font-bold">
                    Rp{g.minPrice.toLocaleString("id-ID")} - Rp{g.maxPrice.toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border/70">
          <Button variant="outline" size="sm" onClick={onClose} className="border-border/80 text-xs">
            Batal
          </Button>
          <Button size="sm" onClick={handleDownload} className="font-bold gap-2 text-xs shadow-xs">
            <Download className="w-4 h-4" />
            <span>Unduh Berkas CSV</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
