import { useState } from "react"
import { useSambungStore } from "@/store/sambungStore"
import { Card, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, ArrowLeft, Info } from "lucide-react"

interface AdminParametersPageProps {
  onBack: () => void
}

export function AdminParametersPage({ onBack }: AdminParametersPageProps) {
  const { parameters, updateParameters } = useSambungStore()

  const [defaultDurationHours, setDefaultDurationHours] = useState(parameters.orderExpiryHours)
  const [tolerancePercent, setTolerancePercent] = useState(parameters.fairPriceToleranceDelta * 100)
  const [rendemenGKP, setRendemenGKP] = useState(parameters.rendemenGKP * 100)
  const [rendemenGKG, setRendemenGKG] = useState(parameters.rendemenGKG * 100)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    updateParameters({
      orderExpiryHours: Number(defaultDurationHours),
      fairPriceToleranceDelta: Number(tolerancePercent) / 100,
      rendemenGKP: Number(rendemenGKP) / 100,
      rendemenGKG: Number(rendemenGKG) / 100,
    })

    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Breadcrumb & Navigation */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span>SAMBUNG</span>
          <span>/</span>
          <button onClick={onBack} className="hover:text-foreground hover:underline">
            ADMIN
          </button>
          <span>/</span>
          <span className="text-foreground">PARAMETER HARGA</span>
        </div>

        <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Pengaturan Parameter Operasional
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Kelola nilai default batas waktu negosiasi, ambang toleransi lampu harga, dan rasio rendemen acuan.
            </p>
          </div>

          <Button variant="ghost" size="sm" onClick={onBack} className="self-start sm:self-auto gap-2 text-xs">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke dasbor</span>
          </Button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-[#EAF1E7] text-[#2D4828] dark:bg-primary/20 dark:text-primary-foreground border border-primary/20 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Parameter operasional berhasil diperbarui dan dicatat dalam audit log.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Durasi Tenggat Negosiasi */}
        <Card className="p-6 space-y-4">
          <div>
            <CardTitle className="text-sm font-bold text-foreground">
              1. Durasi Awal Tenggat Negosiasi Kontrak
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Batas waktu maksimal per putaran negosiasi sebelum kontrak dinyatakan kedaluwarsa otomatis.
            </p>
          </div>

          <div className="max-w-xs space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Durasi Default (Jam)</label>
            <div className="relative">
              <Input
                type="number"
                min="1"
                max="168"
                value={defaultDurationHours}
                onChange={(e) => setDefaultDurationHours(Number(e.target.value))}
                className="pr-12 text-sm"
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">Jam</span>
            </div>
            <p className="text-[11px] text-muted-foreground">Nilai standar yang disarankan: 24 jam.</p>
          </div>
        </Card>

        {/* 2. Ambang Toleransi Lampu Harga */}
        <Card className="p-6 space-y-4">
          <div>
            <CardTitle className="text-sm font-bold text-foreground">
              2. Ambang Toleransi Batas Bawah Lampu Harga (%)
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Persentase di bawah batas bawah acuan wajar sebelum status lampu berubah menjadi Merah (peringatan keras).
            </p>
          </div>

          <div className="max-w-xs space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Toleransi Batas Bawah (%)</label>
            <div className="relative">
              <Input
                type="number"
                step="0.5"
                min="0"
                max="50"
                value={tolerancePercent}
                onChange={(e) => setTolerancePercent(Number(e.target.value))}
                className="pr-8 text-sm"
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">%</span>
            </div>
            <p className="text-[11px] text-muted-foreground">Nilai standar: 3% (Lampu Merah jika harga &lt; Batas Bawah - 3%).</p>
          </div>
        </Card>

        {/* 3. Rasio Rendemen Konversi */}
        <Card className="p-6 space-y-4">
          <div>
            <CardTitle className="text-sm font-bold text-foreground">
              3. Rasio Rendemen Konversi Acuan
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Estimasi persentase beras yang dihasilkan dari penggilingan gabah kering.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Rendemen GKP ke Beras (%)</label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.1"
                  value={rendemenGKP}
                  onChange={(e) => setRendemenGKP(Number(e.target.value))}
                  className="pr-8 text-sm"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">%</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Rendemen GKG ke Beras (%)</label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.1"
                  value={rendemenGKG}
                  onChange={(e) => setRendemenGKG(Number(e.target.value))}
                  className="pr-8 text-sm"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">%</span>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Digunakan dalam estimator konversi harga beras produsen ke harga wajar gabah.
          </p>
        </Card>

        {/* Action Buttons: sleek & compact! */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="outline" size="default" onClick={onBack} className="text-xs">
            Kembali
          </Button>
          <Button type="submit" size="default" className="text-xs gap-1.5 shadow-xs">
            <Check className="w-3.5 h-3.5" />
            <span>Simpan Perubahan Parameter</span>
          </Button>
        </div>
      </form>

      <div className="p-4 rounded-xl bg-muted/60 border border-border/80 flex items-start gap-3 text-xs text-muted-foreground">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <span>
          Semua perubahan parameter dicatat secara permanen dengan stempel waktu dan identitas admin pada log audit sistem.
        </span>
      </div>
    </div>
  )
}
