import { useState } from "react"
import { SEED_FORECASTS } from "@/mock/seedData"
import { formatRupiah } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, HelpCircle, Info, ShieldAlert } from "lucide-react"

export function ForecastPage() {
  const [selectedHorizon, setSelectedHorizon] = useState<2 | 4>(2)
  const [selectedProvince, setSelectedProvince] = useState<string>("Jawa Barat")

  const forecasts = SEED_FORECASTS.filter(
    (f) => f.horizonWeeks === selectedHorizon && f.province === selectedProvince
  )

  const activeForecast = forecasts[0] || SEED_FORECASTS[0]

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span>SAMBUNG</span>
          <span>/</span>
          <span className="text-foreground">PRAKIRAAN PASAR</span>
        </div>

        <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Prakiraan Harga & Penjelasan Faktor Pasar
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Prakiraan harga beras produsen ke depan beserta estimasi turunan gabah GKP/GKG dan kontribusi faktor pembentuk harga.
            </p>
          </div>

          {/* Horizon Toggle */}
          <div className="flex items-center bg-muted p-1 rounded-lg border border-border/80 self-start sm:self-auto">
            <Button
              variant={selectedHorizon === 2 ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedHorizon(2)}
              className="gap-2 text-xs font-semibold"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Horizon 2 Pekan</span>
            </Button>
            <Button
              variant={selectedHorizon === 4 ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedHorizon(4)}
              className="gap-2 text-xs font-semibold"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Horizon 4 Pekan</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Province Picker */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-muted-foreground uppercase shrink-0">Wilayah:</span>
        {["Jawa Barat", "Jawa Tengah", "Sulawesi Selatan"].map((prov) => (
          <button
            key={prov}
            onClick={() => setSelectedProvince(prov)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 min-h-[36px] ${
              selectedProvince === prov
                ? "bg-primary text-white dark:text-[#182117] shadow-xs"
                : "bg-muted text-muted-foreground hover:text-foreground"
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
            <Card className="border border-border">
              <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground font-semibold">
                    Target Wilayah: {activeForecast.province} · Horizon {activeForecast.horizonWeeks} Pekan
                  </span>
                  <CardTitle className="text-xl mt-0.5">Estimasi Harga Beras & Gabah Turunan</CardTitle>
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
                  <div className="p-3.5 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3 text-xs text-destructive">
                    <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Prakiraan Baseline Aktif (DEC-017a)</p>
                      <p className="mt-0.5">
                        Model machine learning pada unit wilayah ini belum mencapai batas ambang akurasi MASE ≤ 0,9. Sistem secara transparan beralih ke metode baseline terevaluasi demi menjaga keabsahan prediksi.
                      </p>
                    </div>
                  </div>
                )}

                {/* Primary Rice Prediction */}
                <div className="p-5 rounded-xl bg-card border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-muted-foreground uppercase">
                      Prediksi Langsung Model AI:
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">Pita Keyakinan 80%</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                    <p className="text-3xl font-extrabold font-mono text-primary">
                      {formatRupiah(activeForecast.riceProducerPrice)}
                      <span className="text-sm font-normal text-muted-foreground ml-1">/kg Beras Produsen</span>
                    </p>
                    <span className="font-mono text-xs font-bold text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
                      Pita 80%: {formatRupiah(activeForecast.confidenceInterval80[0])} – {formatRupiah(activeForecast.confidenceInterval80[1])}
                    </span>
                  </div>
                </div>

                {/* Derived Grain Estimates (DEC-008b) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-border bg-muted/40 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">Estimasi Turunan GKP</span>
                      <span className="text-[10px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded font-mono font-bold">R 52%</span>
                    </div>
                    <p className="text-xl font-bold font-mono text-foreground">
                      {formatRupiah(activeForecast.gkpEstimate)} /kg
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Dihitung dari konversi beras ke GKP (bukan observasi langsung)
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-border bg-muted/40 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">Estimasi Turunan GKG</span>
                      <span className="text-[10px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded font-mono font-bold">R 63%</span>
                    </div>
                    <p className="text-xl font-bold font-mono text-foreground">
                      {formatRupiah(activeForecast.gkgEstimate)} /kg
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Dihitung dari konversi beras ke GKG (bukan observasi langsung)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SHAP Explainability Panel (DEC-008c) */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="border border-border">
              <CardHeader className="pb-3 border-b border-border">
                <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase">
                  <Info className="w-4 h-4" />
                  <span>Transparansi AI · Analisis Kontribusi Fitur</span>
                </div>
                <CardTitle className="text-lg mt-0.5">Faktor Pendorong Perubahan Harga</CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Nilai SHAP menunjukkan seberapa besar kontribusi masing-masing fitur masukan terhadap deviasi prediksi harga dari rata-rata historis (bukan bukti sebab-akibat mutlak).
                </p>

                <div className="space-y-3">
                  {activeForecast.shapContributions.map((factor, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-lg border border-border bg-card space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-body-sm font-bold text-foreground">
                          {factor.feature}
                        </span>
                        <span
                          className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                            factor.impact > 0
                              ? "bg-price-caution-surface text-price-caution"
                              : factor.impact < 0
                              ? "bg-price-within-surface text-price-within"
                              : "bg-muted text-muted-foreground"
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
        <div className="p-8 text-center text-muted-foreground bg-card border border-border rounded-xl">
          Data prakiraan untuk wilayah ini belum tersedia.
        </div>
      )}

      {/* Note on Evaluated Targets */}
      <div className="p-4 rounded-xl bg-card border border-border flex items-start gap-3 text-body-sm text-muted-foreground">
        <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <p className="text-xs leading-relaxed">
          <strong>Target Evaluasi Akurasi:</strong> Target akurasi proposal mensyaratkan MASE ≤ 0,9 terhadap baseline pekan lalu, dengan cakupan empiris pita 80% berada di rentang 75%–85%. Nilai prediksi tidak menjamin harga transaksi riil di masa depan.
        </p>
      </div>
    </div>
  )
}
