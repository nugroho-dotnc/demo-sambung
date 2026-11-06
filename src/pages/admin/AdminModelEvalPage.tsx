import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, ArrowLeft, ShieldAlert, CheckCircle2 } from "lucide-react"

interface AdminModelEvalPageProps {
  onBack: () => void
}

export function AdminModelEvalPage({ onBack }: AdminModelEvalPageProps) {
  const modelEvaluationRows = [
    {
      province: "Jawa Barat",
      horizon: "2 Pekan",
      mase: 0.74,
      intervalCoverage: "82.4%",
      status: "Lulus Target",
      activeMethod: "Model AI (Ensemble)",
      isFallback: false
    },
    {
      province: "Jawa Barat",
      horizon: "4 Pekan",
      mase: 0.86,
      intervalCoverage: "79.1%",
      status: "Lulus Target",
      activeMethod: "Model AI (Ensemble)",
      isFallback: false
    },
    {
      province: "Jawa Tengah",
      horizon: "2 Pekan",
      mase: 0.81,
      intervalCoverage: "80.5%",
      status: "Lulus Target",
      activeMethod: "Model AI (Ensemble)",
      isFallback: false
    },
    {
      province: "Sulawesi Selatan",
      horizon: "2 Pekan",
      mase: 0.98, // Gagal MASE <= 0.9
      intervalCoverage: "69.0%",
      status: "Gagal Ambang Target",
      activeMethod: "Prakiraan Baseline",
      isFallback: true // DEC-017a: beralih ke baseline transparan
    }
  ]

  return (
    <div className="app-wrap space-y-8 pb-16">
      {/* Header */}
      <div className="pt-2 border-b border-border/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 mb-2 text-xs">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Ringkasan Admin</span>
          </Button>
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            <span>SAMBUNG</span>
            <span>/</span>
            <span className="text-foreground">EVALUASI MODEL AI</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
            Laporan Evaluasi & Gerbang Publikasi Model AI
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Penilaian performa model AI per unit wilayah dan horizon terhadap target akurasi proposal.
          </p>
        </div>
      </div>

      {/* Target Criteria Info */}
      <div className="p-4 rounded-xl bg-card border border-border flex items-start gap-3 text-body-sm text-muted-foreground">
        <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs leading-relaxed">
          <p className="font-bold text-foreground">Kriteria Kelayakan Publikasi Model:</p>
          <p>
            1. <strong>MASE ≤ 0,9</strong> (dibandingkan baseline musiman).<br />
            2. <strong>Cakupan Pita Keyakinan 80%</strong> berada di rentang 75%–85%.<br />
            3. Unit provinsi yang <em>gagal memenuhi target</em> wajib beralih ke <strong>Prakiraan Baseline</strong> dengan label jujur; skor agregat tidak boleh dipakai meloloskan unit yang gagal.
          </p>
        </div>
      </div>

      {/* Evaluation Table */}
      <Card>
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-base">Hasil Backtesting Walk-Forward per Unit Wilayah</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-body-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-xs font-bold text-muted-foreground uppercase">
                <th className="py-3 px-4">Provinsi</th>
                <th className="py-3 px-4">Horizon</th>
                <th className="py-3 px-4 font-mono text-right">Skor MASE</th>
                <th className="py-3 px-4 font-mono text-right">Cakupan Pita 80%</th>
                <th className="py-3 px-4">Status Evaluasi</th>
                <th className="py-3 px-4">Metode yang Dipublikasikan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {modelEvaluationRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-accent/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-foreground">{row.province}</td>
                  <td className="py-3.5 px-4 text-foreground">{row.horizon}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-right text-foreground">
                    <span className={row.mase <= 0.9 ? "text-price-within" : "text-destructive"}>
                      {row.mase}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-right text-foreground">
                    {row.intervalCoverage}
                  </td>
                  <td className="py-3.5 px-4">
                    {row.isFallback ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-destructive">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Gagal Target (Fallback)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-price-within">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Lolos Ambang Target</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={row.isFallback ? "destructive" : "default"}>
                      {row.activeMethod}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
