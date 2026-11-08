import { useState } from "react"
import { useSambungStore } from "@/store/sambungStore"
import { Card, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, Settings2, Sliders } from "lucide-react"

interface AdminParametersPageProps {
  onBack?: () => void
}

export function AdminParametersPage({ onBack: _onBack }: AdminParametersPageProps) {
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
    <div className="max-w-6xl mx-auto space-y-7 pb-14">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/70">
        <div>
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            <span>SAMBUNG</span>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-primary font-bold">ADMIN</span>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-foreground">PARAMETER OPERASIONAL</span>
          </nav>

          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Pengaturan Parameter Operasional
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola nilai default batas waktu negosiasi, ambang toleransi lampu harga, dan rasio rendemen konversi acuan.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 text-xs font-semibold text-primary border border-primary/20">
          <Settings2 className="w-4 h-4 shrink-0" />
          <span>Konfigurasi Engine Terpusat</span>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Parameter operasional berhasil diperbarui dan dicatat ke dalam log audit sistem.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Durasi Tenggat Negosiasi */}
        <Card className="p-6 bg-card border-border/80 shadow-xs rounded-2xl space-y-4">
          <div>
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <Sliders className="w-4 h-4 text-primary" />
              <span>1. Durasi Awal Tenggat Negosiasi Kontrak</span>
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Batas waktu maksimal per putaran negosiasi sebelum pesanan dinyatakan kedaluwarsa otomatis (stok cadangan dikembalikan).
            </p>
          </div>

          <div className="max-w-xs space-y-1.5">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider">Durasi Default (Jam)</label>
            <div className="relative">
              <Input
                type="number"
                min="1"
                max="168"
                value={defaultDurationHours}
                onChange={(e) => setDefaultDurationHours(Number(e.target.value))}
                className="pr-12 text-sm font-mono font-bold"
                required
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">Jam</span>
            </div>
            <p className="text-[11px] text-muted-foreground">Nilai standar yang disarankan: 24 jam.</p>
          </div>
        </Card>

        {/* 2. Ambang Toleransi Lampu Harga */}
        <Card className="p-6 bg-card border-border/80 shadow-xs rounded-2xl space-y-4">
          <div>
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <Sliders className="w-4 h-4 text-primary" />
              <span>2. Ambang Toleransi Batas Bawah Lampu Harga (%)</span>
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Persentase di bawah batas bawah acuan wajar sebelum status lampu berubah menjadi Merah (peringatan harga terlalu rendah).
            </p>
          </div>

          <div className="max-w-xs space-y-1.5">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider">Toleransi Batas Bawah (%)</label>
            <div className="relative">
              <Input
                type="number"
                step="0.5"
                min="0"
                max="50"
                value={tolerancePercent}
                onChange={(e) => setTolerancePercent(Number(e.target.value))}
                className="pr-8 text-sm font-mono font-bold"
                required
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">%</span>
            </div>
            <p className="text-[11px] text-muted-foreground">Nilai standar: 3% (Lampu Merah jika penawaran &lt; Batas Bawah - 3%).</p>
          </div>
        </Card>

        {/* 3. Rasio Rendemen Konversi */}
        <Card className="p-6 bg-card border-border/80 shadow-xs rounded-2xl space-y-4">
          <div>
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <Sliders className="w-4 h-4 text-primary" />
              <span>3. Rasio Rendemen Konversi Acuan</span>
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Estimasi persentase beras yang dihasilkan dari proses penggilingan gabah kering.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider">Rendemen GKP ke Beras (%)</label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.1"
                  value={rendemenGKP}
                  onChange={(e) => setRendemenGKP(Number(e.target.value))}
                  className="pr-8 text-sm font-mono font-bold"
                  required
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">%</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider">Rendemen GKG ke Beras (%)</label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.1"
                  value={rendemenGKG}
                  onChange={(e) => setRendemenGKG(Number(e.target.value))}
                  className="pr-8 text-sm font-mono font-bold"
                  required
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">%</span>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Digunakan dalam formula konversi acuan harga beras medium I ke harga wajar gabah di tingkat petani.
          </p>
        </Card>

        {/* Action Button */}
        <div className="flex items-center justify-end pt-2">
          <Button type="submit" size="default" className="text-xs gap-1.5 font-semibold shadow-xs cursor-pointer">
            <Check className="w-4 h-4" />
            <span>Simpan Perubahan Parameter</span>
          </Button>
        </div>
      </form>
    </div>
  )
}
