import { useState } from "react"
import { SEED_FORECASTS } from "@/mock/seedData"
import { formatRupiah } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, HelpCircle, ShieldAlert, Cpu, Sparkles } from "lucide-react"

export function ForecastPage() {
  const [selectedHorizon, setSelectedHorizon] = useState<2 | 4>(2)
  const [selectedProvince, setSelectedProvince] = useState<string>("Jawa Barat")

  const forecasts = SEED_FORECASTS.filter(
    (f) => f.horizonWeeks === selectedHorizon && f.province === selectedProvince
  )

  const activeForecast = forecasts[0] || SEED_FORECASTS[0]

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div>
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <span className="font-semibold text-primary">SAMBUNG</span>
          <span className="text-muted-foreground/50">/</span>
          <span className="font-medium text-foreground">Prakiraan Pasar & Model AI</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Prakiraan Harga & Transparansi Pasar
            </h1>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              Prakiraan harga beras produsen ke depan beserta estimasi turunan gabah GKP/GKG dan bobot kontribusi faktor cuaca/pasar.
            </p>
          </div>

          {/* Horizon Toggle */}
          <div className="flex items-center bg-muted/80 p-1 rounded-xl border border-border self-start sm:self-auto shadow-2xs">
            <Button
              variant={selectedHorizon === 2 ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedHorizon(2)}
              className="gap-2 text-xs font-bold"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Horizon 2 Pekan</span>
            </Button>
            <Button
              variant={selectedHorizon === 4 ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedHorizon(4)}
              className="gap-2 text-xs font-bold"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Horizon 4 Pekan</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Province Picker */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider shrink-0 mr-1">Wilayah:</span>
        {["Jawa Barat", "Jawa Tengah", "Sulawesi Selatan"].map((prov) => (
          <button
            key={prov}
            onClick={() => setSelectedProvince(prov)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-2xs ${
              selectedProvince === prov
                ? "bg-primary text-white dark:text-[#05200E] shadow-xs"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted/60"
            }`}
          >
            {prov}
          </button>
        ))}
      </div>

      {/* Main Forecast Card */}
      {activeForecast ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Numbers & Interval Band */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="border border-border rounded-2xl shadow-xs overflow-hidden">
              <CardHeader className="p-6 pb-4 border-b border-border flex flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-primary font-bold uppercase tracking-wider">
                    Target Wilayah: {activeForecast.province} · Horizon {activeForecast.horizonWeeks} Pekan
                  </span>
                  <CardTitle className="text-xl sm:text-2xl mt-1">Estimasi Harga Beras & Gabah Turunan</CardTitle>
                </div>
                <Badge
                  variant={activeForecast.isFallback ? "destructive" : "default"}
                  className="font-bold text-xs"
                >
                  {activeForecast.method}
                </Badge>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {activeForecast.isFallback && (
                  <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3.5 text-xs text-destructive">
                    <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Prakiraan Baseline Aktif</p>
                      <p className="mt-0.5 leading-relaxed">
                        Model machine learning pada unit wilayah ini belum mencapai batas ambang akurasi MASE ≤ 0,9. Sistem secara transparan beralih ke metode baseline terevaluasi demi menjaga keabsahan prediksi.
                      </p>
                    </div>
                  </div>
                )}

                {/* Primary Rice Prediction */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-card via-card to-emerald-50/30 dark:to-emerald-950/20 border border-border shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                      Prediksi Langsung Model AI:
                    </span>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Pita Keyakinan 80%</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                    <p className="text-4xl font-black font-display text-primary tabular-nums tracking-tight">
                      {formatRupiah(activeForecast.riceProducerPrice)}
                      <span className="text-sm font-semibold text-muted-foreground ml-1.5">/kg Beras Produsen</span>
                    </p>
                    <span className="font-mono text-xs font-bold text-foreground bg-muted px-3 py-1.5 rounded-xl border border-border">
                      {formatRupiah(activeForecast.confidenceInterval80[0])} – {formatRupiah(activeForecast.confidenceInterval80[1])}
                    </span>
                  </div>
                </div>

                {/* Derived Grain Estimates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl border border-border bg-muted/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">Estimasi Turunan GKP</span>
                      <span className="text-[10px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md font-mono font-bold">R 52%</span>
                    </div>
                    <p className="text-2xl font-black font-display text-foreground tabular-nums">
                      {formatRupiah(activeForecast.gkpEstimate)}<span className="text-xs font-medium text-muted-foreground">/kg</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Dihitung dari konversi beras ke GKP standar rendemen panen (bukan observasi lapangan langsung).
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl border border-border bg-muted/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">Estimasi Turunan GKG</span>
                      <span className="text-[10px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md font-mono font-bold">R 63%</span>
                    </div>
                    <p className="text-2xl font-black font-display text-foreground tabular-nums">
                      {formatRupiah(activeForecast.gkgEstimate)}<span className="text-xs font-medium text-muted-foreground">/kg</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Dihitung dari konversi beras ke GKG siap giling (bukan observasi lapangan langsung).
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SHAP Explainability Panel */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="border border-border rounded-2xl shadow-xs overflow-hidden">
              <CardHeader className="p-6 pb-4 border-b border-border">
                <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
                  <Cpu className="w-4 h-4" />
                  <span>Transparansi AI · Analisis SHAP</span>
                </div>
                <CardTitle className="text-xl mt-1">Faktor Pembentuk Nilai Prediksi</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Nilai SHAP menunjukkan seberapa besar kontribusi masing-masing fitur masukan terhadap deviasi prediksi harga dari rata-rata historis (bukan bukti kausalitas mutlak).
                </p>

                <div className="space-y-3">
                  {activeForecast.shapContributions.map((factor, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-border bg-card space-y-2 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-foreground font-display">
                          {factor.feature}
                        </span>
                        <span
                          className={`font-mono text-xs font-bold px-2.5 py-1 rounded-lg border ${
                            factor.impact > 0
                              ? "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800"
                              : factor.impact < 0
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"
                              : "bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          {factor.impact > 0 ? `+${factor.impact}` : factor.impact} Rp/kg
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {factor.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-muted-foreground bg-card border border-border rounded-2xl">
          Data prakiraan untuk wilayah ini belum tersedia.
        </div>
      )}

      {/* Note on Evaluated Targets */}
      <div className="p-5 rounded-2xl bg-card border border-border flex items-start gap-3.5 text-xs text-muted-foreground shadow-2xs">
        <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-foreground">Target Evaluasi Akurasi:</strong> Target akurasi proposal mensyaratkan MASE ≤ 0,9 terhadap baseline pekan lalu, dengan cakupan empiris pita 80% berada di rentang 75% – 85%. Nilai prediksi merupakan acuan analitis dan tidak menjamin harga transaksi riil di masa depan.
        </p>
      </div>
    </div>
  )
}
