import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldAlert, CheckCircle2 } from "lucide-react"

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
    <div className="w-full space-y-6">
      {/* Breadcrumbs & Header */}
      <div className="pt-1 border-b border-border/80 pb-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
          <span className="font-medium">Sambung</span>
          <span className="text-muted-foreground/60">/</span>
          <span className="font-medium text-foreground">Evaluasi Model AI</span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight">
          Laporan Evaluasi & Gerbang Publikasi Model AI
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
          Penilaian performa model AI per unit wilayah dan horizon terhadap target akurasi proposal.
        </p>
      </div>

      {/* Main Table Card */}
      <Card className="rounded-xl border border-border/80 overflow-hidden shadow-2xs">
        <CardHeader className="py-4 px-5 sm:px-6 border-b border-border/80">
          <CardTitle className="text-base font-bold text-foreground">
            Hasil Backtesting Walk-Forward per Unit Wilayah
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs tabular-nums">
            <thead>
              <tr className="border-b border-border/80 bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Provinsi</th>
                <th className="py-3 px-4 font-semibold">Horizon</th>
                <th className="py-3 px-4 font-mono text-right font-semibold">Skor MASE</th>
                <th className="py-3 px-4 font-mono text-right font-semibold">Cakupan Pita 80%</th>
                <th className="py-3 px-4 font-semibold">Status Evaluasi</th>
                <th className="py-3 px-4 font-semibold">Metode yang Dipublikasikan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {modelEvaluationRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-foreground">{row.province}</td>
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
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-destructive">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Gagal Target (Fallback)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-price-within">
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
