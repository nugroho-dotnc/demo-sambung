import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldAlert, CheckCircle2, Cpu } from "lucide-react"

interface AdminModelEvalPageProps {
  onBack?: () => void
}

export function AdminModelEvalPage({ onBack: _onBack }: AdminModelEvalPageProps) {
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
    <div className="max-w-6xl mx-auto space-y-7 pb-14">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/70">
        <div>
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            <span>SAMBUNG</span>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-primary font-bold">ADMIN</span>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-foreground">EVALUASI MODEL AI</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight">
            Laporan Evaluasi & Gerbang Publikasi Model AI
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
            Penilaian performa model peramalan per unit wilayah dan horizon terhadap target ambang batas kelayakan publikasi.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 text-xs font-semibold text-primary border border-primary/20">
          <Cpu className="w-4 h-4 shrink-0" />
          <span>Walk-Forward Backtesting</span>
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="rounded-2xl border border-border/80 overflow-hidden shadow-xs bg-card">
        <CardHeader className="py-4 px-6 border-b border-border/70">
          <CardTitle className="text-base font-bold text-foreground">
            Hasil Backtesting Walk-Forward per Unit Wilayah
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs tabular-nums">
            <thead>
              <tr className="border-b border-border/80 bg-muted/40 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-5 font-semibold">Provinsi</th>
                <th className="py-3 px-5 font-semibold">Horizon</th>
                <th className="py-3 px-5 font-mono text-right font-semibold">Skor MASE</th>
                <th className="py-3 px-5 font-mono text-right font-semibold">Cakupan Pita 80%</th>
                <th className="py-3 px-5 font-semibold">Status Evaluasi</th>
                <th className="py-3 px-5 font-semibold">Metode yang Dipublikasikan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {modelEvaluationRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-foreground">{row.province}</td>
                  <td className="py-3.5 px-5 text-foreground">{row.horizon}</td>
                  <td className="py-3.5 px-5 font-mono font-bold text-right text-foreground">
                    <span className={row.mase <= 0.9 ? "text-primary" : "text-destructive"}>
                      {row.mase}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 font-mono text-right text-foreground">
                    {row.intervalCoverage}
                  </td>
                  <td className="py-3.5 px-5">
                    {row.isFallback ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-destructive">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Gagal Target (Fallback Baseline)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Lolos Ambang Target</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-5">
                    <Badge variant={row.isFallback ? "destructive" : "default"} className="text-[10px]">
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
