import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatRupiah } from "@/lib/utils"
import {
  Database,
  CheckCircle2,
  RefreshCw,
  AlertOctagon
} from "lucide-react"

interface AdminPriceDataPageProps {
  onBack?: () => void
}

interface PriceObservationRecord {
  id: string
  province: string
  commodity: string
  price: number
  unit: string
  source: string
  period: string
  status: "Valid" | "Ditolak" | "Anomali" | "Duplikat"
  reason?: string
}

const INITIAL_OBSERVATIONS: PriceObservationRecord[] = [
  {
    id: "obs-01",
    province: "Jawa Timur",
    commodity: "Gabah Kering Panen (GKP)",
    price: 6780,
    unit: "Rp/kg",
    source: "Bapanas Produsen",
    period: "Pekan 44 (Nov 2026)",
    status: "Valid"
  },
  {
    id: "obs-02",
    province: "Jawa Tengah",
    commodity: "Gabah Kering Panen (GKP)",
    price: 6620,
    unit: "Rp/kg",
    source: "PIHPS",
    period: "Pekan 44 (Nov 2026)",
    status: "Valid"
  },
  {
    id: "obs-03",
    province: "Jawa Barat",
    commodity: "Gabah Kering Panen (GKP)",
    price: 6910,
    unit: "Rp/kg",
    source: "Bapanas Produsen",
    period: "Pekan 44 (Nov 2026)",
    status: "Valid"
  },
  {
    id: "obs-04",
    province: "Sulawesi Selatan",
    commodity: "Gabah Kering Panen (GKP)",
    price: 6450,
    unit: "Rp/kg",
    source: "Bapanas Produsen",
    period: "Pekan 44 (Nov 2026)",
    status: "Valid"
  },
  {
    id: "obs-05",
    province: "Kalimantan Selatan",
    commodity: "Gabah Kering Panen (GKP)",
    price: -500,
    unit: "Rp/kg",
    source: "Kandidat Ingest",
    period: "Pekan 44 (Nov 2026)",
    status: "Ditolak",
    reason: "Harga bernilai negatif atau nol tidak diizinkan masuk sistem observasi."
  },
  {
    id: "obs-06",
    province: "Sumatera Utara",
    commodity: "Gabah Kering Panen (GKP)",
    price: 18200,
    unit: "Rp/kg",
    source: "Kandidat Ingest",
    period: "Pekan 44 (Nov 2026)",
    status: "Anomali",
    reason: "Deviasi ekstrem >150% terhadap median nasional."
  }
]

export function AdminPriceDataPage({ onBack: _onBack }: AdminPriceDataPageProps) {
  const [records] = useState<PriceObservationRecord[]>(INITIAL_OBSERVATIONS)
  const [filter, setFilter] = useState<"all" | "valid" | "issue">("all")
  const [isValidating, setIsValidating] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishedVersion, setPublishedVersion] = useState("Snapshot v2.4 (Aktif)")

  const validCount = records.filter((r) => r.status === "Valid").length
  const issueCount = records.filter((r) => r.status !== "Valid").length

  const handleValidate = () => {
    setIsValidating(true)
    setTimeout(() => {
      setIsValidating(false)
      alert("Validasi selesai: 4 baris valid siap dipublikasikan, 2 baris ditolak karena aturan batas domain.")
    }, 600)
  }

  const handlePublish = () => {
    setIsPublishing(true)
    setTimeout(() => {
      setIsPublishing(false)
      setPublishedVersion("Snapshot v2.5 (Baru Dipublikasikan)")
      alert("Snapshot data harga berhasil dipublikasikan ke papan publik!")
    }, 700)
  }

  const filtered = records.filter((r) => {
    if (filter === "valid") return r.status === "Valid"
    if (filter === "issue") return r.status !== "Valid"
    return true
  })

  return (
    <div className="max-w-6xl mx-auto space-y-7 pb-14">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/70">
        <div>
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            <span>SAMBUNG</span>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-primary font-bold">ADMIN</span>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-foreground">DATA HARGA OBSERVASI</span>
          </nav>

          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Manajemen Data Harga Observasi
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ingest sumber resmi (Bapanas, PIHPS, BPS), periksa anomali dan duplikasi, lalu terbitkan snapshot tervalidasi.
          </p>
        </div>

        <Badge variant="outline" className="font-mono text-xs self-start sm:self-auto px-3 py-1 border-border/80">
          {publishedVersion}
        </Badge>
      </div>

      {/* Snapshot Info & Control Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 bg-card border-border/80 shadow-xs flex items-center justify-between rounded-2xl">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Rekaman Observasi</span>
            <p className="font-mono text-2xl font-bold text-foreground mt-0.5 tabular-nums">{records.length} Baris</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-5 bg-emerald-500/10 border-emerald-500/20 shadow-xs flex items-center justify-between rounded-2xl">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">Lolos Uji Validasi</span>
            <p className="font-mono text-2xl font-bold text-emerald-800 dark:text-emerald-300 mt-0.5 tabular-nums">{validCount} Baris</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-5 bg-destructive/10 border-destructive/20 shadow-xs flex items-center justify-between rounded-2xl">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-destructive">Anomali & Ditolak</span>
            <p className="font-mono text-2xl font-bold text-destructive mt-0.5 tabular-nums">{issueCount} Baris</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-destructive/20 text-destructive flex items-center justify-center">
            <AlertOctagon className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Table Actions & Filters */}
      <Card className="p-6 bg-card border-border/80 shadow-xs space-y-4 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/70">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                filter === "all" ? "bg-primary text-white dark:text-[#182117] shadow-xs" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              Semua Baris ({records.length})
            </button>
            <button
              onClick={() => setFilter("valid")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                filter === "valid" ? "bg-primary text-white dark:text-[#182117] shadow-xs" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              Valid ({validCount})
            </button>
            <button
              onClick={() => setFilter("issue")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                filter === "issue" ? "bg-primary text-white dark:text-[#182117] shadow-xs" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              Perlu Atensi ({issueCount})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={isValidating}
              onClick={handleValidate}
              className="gap-1.5 text-xs border-border/80"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-primary ${isValidating ? "animate-spin" : ""}`} />
              <span>{isValidating ? "Memvalidasi..." : "Validasi Data"}</span>
            </Button>

            <Button
              size="sm"
              disabled={isPublishing}
              onClick={handlePublish}
              className="gap-1.5 text-xs font-semibold shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isPublishing ? "Menerbitkan..." : "Publikasikan Snapshot"}</span>
            </Button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto border border-border/80 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/80 bg-muted/40 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <th className="p-3">ID</th>
                <th className="p-3">Provinsi</th>
                <th className="p-3">Komoditas</th>
                <th className="p-3 text-right">Harga Input</th>
                <th className="p-3">Sumber & Periode</th>
                <th className="p-3">Status</th>
                <th className="p-3">Keterangan / Alasan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-mono font-bold text-foreground">{r.id}</td>
                  <td className="p-3 font-semibold text-foreground">{r.province}</td>
                  <td className="p-3 text-muted-foreground">{r.commodity}</td>
                  <td className="p-3 text-right font-mono font-bold tabular-nums">
                    {r.price > 0 ? formatRupiah(r.price) : `${r.price} (Non-positif)`}
                  </td>
                  <td className="p-3 text-muted-foreground">
                    <span className="block font-medium text-foreground">{r.source}</span>
                    <span className="text-[10px] font-mono">{r.period}</span>
                  </td>
                  <td className="p-3">
                    <Badge
                      variant={
                        r.status === "Valid"
                          ? "default"
                          : r.status === "Anomali"
                          ? "secondary"
                          : "destructive"
                      }
                      className="text-[10px]"
                    >
                      {r.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-[11px] text-muted-foreground max-w-xs">
                    {r.reason || "Lolos uji integritas domain & konsistensi antar-wilayah."}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
