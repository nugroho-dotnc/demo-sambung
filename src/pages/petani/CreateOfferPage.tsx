import { useState } from "react"
import { useSambungStore } from "@/store/sambungStore"
import { GrainType } from "@/types/domain"
import { calculateFairPrice, evaluatePriceLamp, validatePriceInput, validateVolumeInput } from "@/lib/priceEngine"
import { PriceRangeSlider } from "@/components/domain/PriceRangeSlider"
import { PriceLampBadge } from "@/components/domain/PriceLampBadge"
import { PriceAcknowledgement } from "@/components/domain/PriceAcknowledgement"
import { ConfirmationModal } from "@/components/domain/ConfirmationModal"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatRupiah } from "@/lib/utils"
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  RotateCcw,
  Check,
  Building2,
  Calendar,
  Scale
} from "lucide-react"

interface CreateOfferPageProps {
  onSuccess: () => void
}

export function CreateOfferPage({ onSuccess }: CreateOfferPageProps) {
  const { currentUser, createOffer } = useSambungStore()

  // Form Fields
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [grainType, setGrainType] = useState<GrainType>("GKP")
  const [volume, setVolume] = useState<number>(2000)
  const [moisture, setMoisture] = useState<number>(24)
  const [district, setDistrict] = useState(currentUser.district || "Kec. Ngoro, Kab. Mojokerto")
  const [price, setPrice] = useState<number>(6300)

  // Validation & Modal State
  const [validationError, setValidationError] = useState("")
  const [priceAcknowledged, setPriceAcknowledged] = useState(false)
  const [showRedPriceConfirm, setShowRedPriceConfirm] = useState(false)
  const [createdOfferId, setCreatedOfferId] = useState<string>("")

  // Live Fair Price Evaluation
  const rendemen = grainType === "GKP" ? 0.5338 : 0.63
  const estimate = calculateFairPrice(grainType, currentUser.province || "Jawa Timur", 13500, rendemen)
  const lampEval = evaluatePriceLamp(price, estimate.lowerBound, estimate.upperBound)

  const diffFromLower = price - estimate.lowerBound
  const diffPercent = Math.abs(Math.round(((price - estimate.lowerBound) / estimate.lowerBound) * 1000) / 10)
  const grossEstimatedValue = volume * price

  const handleNextStep = () => {
    // Validate inputs
    const priceVal = validatePriceInput(price)
    if (!priceVal.isValid) {
      setValidationError(priceVal.message || "Harga tidak valid")
      return
    }

    const volVal = validateVolumeInput(volume)
    if (!volVal.isValid) {
      setValidationError(volVal.message || "Volume tidak valid")
      return
    }

    setValidationError("")

    if (step === 1) {
      if (lampEval.status === "MERAH") {
        setShowRedPriceConfirm(true)
        return
      }
      setStep(2)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const proceedPublish = () => {
    if (lampEval.status === "MERAH" && !priceAcknowledged) {
      setValidationError("Harap setujui pernyataan pemahaman harga di bawah batas wajar terlebih dahulu.")
      return
    }

    const offer = createOffer({
      grainType,
      province: currentUser.province || "Jawa Timur",
      regency: currentUser.regency || "Kab. Mojokerto",
      district: district || "Kec. Ngoro",
      totalVolume: Number(volume),
      askingPrice: Number(price),
      moisturePercent: Number(moisture),
      impurityPercent: 3.0,
      readyDate: "2026-11-20"
    })

    setCreatedOfferId(offer.id)
    setStep(3)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Breadcrumb & Header */}
      <div>
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <span className="font-semibold text-primary">SAMBUNG</span>
          <span className="text-muted-foreground/50">/</span>
          <span className="font-medium text-foreground">
            {step === 1 ? "Pasang Tawaran Panen" : step === 2 ? "Tinjau Rincian Tawaran" : "Tawaran Terbit"}
          </span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              {step === 1 ? "Jual Hasil Panen" : step === 2 ? "Tinjau Tawaran Panen" : "Tawaran Berhasil Diterbitkan"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              {step === 1
                ? "Lengkapi detail hasil panen dan periksa posisi lampu harga terhadap acuan pasar daerah."
                : step === 2
                ? "Periksa kembali kuantitas, lokasi, dan harga acuan sebelum mempublikasikannya ke katalog pembeli."
                : "Tawaran Anda kini aktif di katalog pasokan gabah SAMBUNG dan dapat dipesan oleh penggilingan."}
            </p>
          </div>

          <span className="self-start sm:self-auto px-3.5 py-1.5 rounded-full text-xs font-bold bg-muted border border-border text-foreground shadow-2xs">
            {step === 3 ? "Terbit · Aktif" : "Langkah " + step + " dari 3"}
          </span>
        </div>
      </div>

      {/* Stepper */}
      <Card className="p-3 bg-card border border-border rounded-2xl shadow-xs">
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div
            className={`flex items-center gap-2.5 p-3 rounded-xl transition-all ${
              step === 1
                ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-300 font-bold border border-emerald-300/60 dark:border-emerald-800"
                : "text-muted-foreground bg-muted/40"
            }`}
          >
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-black shadow-2xs">1</span>
            <span className="font-display">Detail Panen</span>
          </div>

          <div
            className={`flex items-center gap-2.5 p-3 rounded-xl transition-all ${
              step === 2
                ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-300 font-bold border border-emerald-300/60 dark:border-emerald-800"
                : "text-muted-foreground bg-muted/40"
            }`}
          >
            <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-black shadow-2xs ${step >= 2 ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground"}`}>2</span>
            <span className="font-display">Tinjau Tawaran</span>
          </div>

          <div
            className={`flex items-center gap-2.5 p-3 rounded-xl transition-all ${
              step === 3
                ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-300 font-bold border border-emerald-300/60 dark:border-emerald-800"
                : "text-muted-foreground bg-muted/40"
            }`}
          >
            <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-black shadow-2xs ${step === 3 ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground"}`}>3</span>
            <span className="font-display">Terbit</span>
          </div>
        </div>
      </Card>

      {/* Step 1: Input Form */}
      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form (~7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="p-6 sm:p-7 space-y-6 rounded-2xl border border-border shadow-xs">
              <div>
                <h2 className="font-display font-black text-xl text-foreground">Detail Hasil Panen</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Lengkapi data panen gabah dengan jujur sesuai kondisi riil.</p>
              </div>

              {validationError && (
                <div className="p-3.5 rounded-xl bg-destructive/10 text-destructive text-xs font-bold border border-destructive/20 flex items-center gap-2.5 shadow-2xs">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              <div className="space-y-5">
                {/* Komoditas */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Jenis Komoditas Gabah</label>
                  <div className="relative">
                    <select
                      value={grainType}
                      onChange={(e) => setGrainType(e.target.value as GrainType)}
                      className="w-full h-11 appearance-none rounded-xl border border-border bg-card px-3.5 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary pr-9 cursor-pointer transition-all hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs"
                    >
                      <option value="GKP">Gabah Kering Panen (GKP)</option>
                      <option value="GKG">Gabah Kering Giling (GKG)</option>
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* Volume & Kadar Air in 2 cols */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Volume Panen Bersih</label>
                    <div className="relative">
                      <Input
                        type="number"
                        step={10}
                        value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        className="pr-12 text-sm font-mono font-bold"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">kg</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Gunakan estimasi bobot gabah bersih.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Kadar Air Panen</label>
                    <div className="relative">
                      <Input
                        type="number"
                        step={0.5}
                        value={moisture}
                        onChange={(e) => setMoisture(Number(e.target.value))}
                        className="pr-10 text-sm font-mono font-bold"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">%</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Hasil uji moisture meter gabah.</p>
                  </div>
                </div>

                {/* Lokasi */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Lokasi Pengambilan Gabah</label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="Kec. Ngoro, Kab. Mojokerto"
                      className="text-sm font-medium"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">Lokasi ini akan ditampilkan kepada calon pembeli penggilingan.</p>
                </div>

                <div className="pt-3 border-t border-border">
                  <PriceRangeSlider
                    value={price}
                    min={5000}
                    max={8500}
                    lowerBound={estimate.lowerBound}
                    upperBound={estimate.upperBound}
                    tolerancePercent={0.05}
                    onChange={(val) => setPrice(val)}
                    label="Harga Dasar yang Anda Minta"
                  />
                </div>

                {/* Warning Banner if Red */}
                {lampEval.status === "MERAH" && (
                  <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-900 flex items-start gap-3 text-xs shadow-2xs">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                    <div className="leading-relaxed">
                      <p className="font-bold text-red-950 dark:text-red-200 text-sm">
                        Lampu Merah: Di Bawah Batas Wajar
                      </p>
                      <p className="text-red-900/80 dark:text-red-300/80 mt-1">
                        Harga Rp{price.toLocaleString("id-ID")}/kg berada {diffPercent}% di bawah batas acuan wajar (Rp{estimate.lowerBound.toLocaleString("id-ID")}/kg). Menjual di bawah batas wajar berisiko menurunkan pendapatan petani.
                      </p>
                    </div>
                  </div>
                )}

                {/* Quick Preset Action */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 text-xs">
                  <span className="text-muted-foreground">
                    Gunakan batas bawah wajar sebagai titik awal negosiasi:
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setPrice(estimate.lowerBound)}
                    className="text-xs h-8 font-bold text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 cursor-pointer shadow-2xs"
                  >
                    Gunakan Rp{estimate.lowerBound.toLocaleString("id-ID")}/kg
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Reference & Summary (~5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Card 1: Pembanding Harga */}
            <Card className="p-6 sm:p-7 space-y-5 rounded-2xl border border-border shadow-xs bg-gradient-to-b from-card to-emerald-50/20 dark:to-emerald-950/20">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-black text-lg text-foreground">Pembanding Harga {grainType}</h3>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1 shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Acuan Jawa Timur</span>
                </span>
              </div>

              <div className="space-y-1">
                <p className="font-display text-3xl font-black text-emerald-800 dark:text-emerald-400 tabular-nums">
                  Rp{estimate.lowerBound.toLocaleString("id-ID")} – Rp{estimate.upperBound.toLocaleString("id-ID")}
                </p>
                <p className="text-xs text-muted-foreground">
                  per kg: rentang harga wajar resmi pada acuan
                </p>
              </div>

              <div className="pt-3 border-t border-border space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>HPP Resmi Pemerintah</span>
                  <span className="font-bold text-foreground">Rp{grainType === "GKP" ? "6.500" : "7.400"}/kg</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Harga yang Anda Ajukan</span>
                  <span className="font-mono font-bold text-foreground text-sm">Rp{price.toLocaleString("id-ID")}/kg</span>
                </div>

                {diffFromLower < 0 ? (
                  <div className="pt-1.5 flex items-center gap-1.5 text-red-700 dark:text-red-400 font-bold">
                    <TrendingDown className="w-4 h-4 shrink-0" />
                    <span>↓ Rp{Math.abs(diffFromLower).toLocaleString("id-ID")}/kg di bawah batas bawah rentang wajar.</span>
                  </div>
                ) : diffFromLower > (estimate.upperBound - estimate.lowerBound) ? (
                  <div className="pt-1.5 flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold">
                    <TrendingUp className="w-4 h-4 shrink-0" />
                    <span>↑ Di atas plafon atas acuan wajar.</span>
                  </div>
                ) : (
                  <div className="pt-1.5 flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Dalam rentang acuan wajar pemerintah.</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Card 2: Ringkasan Tawaran */}
            <Card className="p-6 sm:p-7 space-y-5 rounded-2xl border border-border shadow-xs">
              <h3 className="font-display font-black text-lg text-foreground">Ringkasan Nilai Tawaran</h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-border/70">
                  <span className="text-muted-foreground">Total Volume</span>
                  <span className="font-mono font-black text-foreground text-sm">{volume.toLocaleString("id-ID")} kg</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-border/70">
                  <span className="text-muted-foreground">Harga Dasar</span>
                  <span className="font-mono font-black text-foreground text-sm">Rp{price.toLocaleString("id-ID")}/kg</span>
                </div>
              </div>

              <div className="pt-3 border-t border-border space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Perkiraan Nilai Kotor Total</p>
                <p className="font-display text-3xl font-black text-foreground tracking-tight tabular-nums">
                  {formatRupiah(grossEstimatedValue)}
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed pt-1">
                  {volume.toLocaleString("id-ID")} kg × Rp{price.toLocaleString("id-ID")}. Belum termasuk biaya angkut atau pemotongan mutu yang disepakati kedua pihak.
                </p>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Step 2: PT-02 Review Tawaran */}
      {step === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <Card className="p-6 sm:p-7 space-y-6 rounded-2xl border border-border shadow-xs">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Verifikasi Akhir</span>
                <h2 className="font-display font-black text-2xl text-foreground mt-0.5">Tinjau Rincian Tawaran Anda (PT-02)</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Pastikan seluruh informasi volume, lokasi, dan harga sudah sesuai sebelum diterbitkan ke pasar publik.
                </p>
              </div>

              {validationError && (
                <div className="p-3.5 rounded-xl bg-destructive/10 text-destructive text-xs font-bold border border-destructive/20 flex items-center gap-2.5 shadow-2xs">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Specification Table */}
              <div className="space-y-3 text-xs rounded-xl border border-border p-4 bg-muted/30">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground font-semibold">Jenis Komoditas Gabah</span>
                  <span className="font-bold text-foreground">{grainType === "GKP" ? "Gabah Kering Panen (GKP)" : "Gabah Kering Giling (GKG)"}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground font-semibold">Volume Panen Bersih</span>
                  <span className="font-mono font-bold text-foreground text-sm">{volume.toLocaleString("id-ID")} kg</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground font-semibold">Kadar Air Panen</span>
                  <span className="font-mono font-bold text-foreground text-sm">{moisture}%</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground font-semibold">Lokasi Pengambilan</span>
                  <span className="font-bold text-foreground">{district}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground font-semibold">Harga Minta Petani</span>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-black text-base text-primary">Rp{price.toLocaleString("id-ID")}/kg</span>
                    <PriceLampBadge status={lampEval.status} size="sm" />
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 pt-3">
                  <span className="text-muted-foreground font-bold">Estimasi Total Nilai Kotor</span>
                  <span className="font-display font-black text-2xl text-foreground tabular-nums">{formatRupiah(grossEstimatedValue)}</span>
                </div>
              </div>

              {/* Price Acknowledgement if RED */}
              {lampEval.status === "MERAH" && (
                <PriceAcknowledgement
                  checked={priceAcknowledged}
                  onChange={setPriceAcknowledged}
                  price={price}
                  lowerBound={estimate.lowerBound}
                  diffPercent={diffPercent}
                />
              )}
            </Card>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <Card className="p-6 sm:p-7 space-y-5 rounded-2xl border border-border shadow-xs">
              <h3 className="font-display font-black text-lg text-foreground">Ketentuan Publikasi</h3>
              <div className="space-y-3.5 text-xs text-muted-foreground leading-relaxed">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span>Tawaran akan langsung terlihat oleh penggilingan padi terverifikasi di wilayah Jawa Timur.</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span>Calon pembeli dapat mengajukan pesanan sebagian volume (parsial) atau pesanan utuh.</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 shrink-0">
                    <Scale className="w-4 h-4" />
                  </div>
                  <span>Nomor kontak telepon Anda baru akan diberikan kepada pembeli setelah kontrak disetujui bersama secara sah.</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation State */}
      {step === 3 && (
        <Card className="p-8 sm:p-10 max-w-2xl mx-auto text-center space-y-6 bg-gradient-to-b from-card via-card to-emerald-50/30 dark:to-emerald-950/20 border border-border rounded-3xl shadow-lg">
          <div className="w-18 h-18 rounded-3xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-3xl font-black text-foreground">
              Tawaran Panen Berhasil Diterbitkan!
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Tawaran panen Anda #{createdOfferId} telah tercatat dan dapat ditinjau oleh calon pembeli di katalog pasokan gabah.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-muted/60 border border-border text-xs space-y-2.5 text-left max-w-md mx-auto shadow-2xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Komoditas:</span>
              <span className="font-bold text-foreground">{grainType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Volume Bersih:</span>
              <span className="font-mono font-bold text-foreground">{volume.toLocaleString("id-ID")} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Harga Minta:</span>
              <span className="font-mono font-black text-primary text-sm">Rp{price.toLocaleString("id-ID")}/kg</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-border">
              <span className="text-muted-foreground">Status Publikasi:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">Terbit (Tersedia di Katalog)</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-3">
            <Button onClick={onSuccess} size="lg" className="text-xs font-bold gap-2">
              <span>Buka Daftar Tawaran Saya</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                setStep(1)
                setPriceAcknowledged(false)
              }}
              className="text-xs font-semibold gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Pasang Tawaran Baru</span>
            </Button>
          </div>
        </Card>
      )}

      {/* Bottom Action Bar (visible on step 1 & 2) */}
      {step < 3 && (
        <Card className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border rounded-2xl shadow-sm">
          <div>
            <p className="text-sm font-bold text-foreground">
              {step === 1 ? "Tawaran Belum Dikirim" : "Konfirmasi Penerbitan Pasokan"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {step === 1 ? "Anda dapat memeriksa ulang rincian sebelum terbit ke pasar." : "Tawaran Anda siap dipublikasikan ke katalog pasokan terbuka."}
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {step === 2 && (
              <Button
                type="button"
                variant="outline"
                size="default"
                onClick={() => setStep(1)}
                className="text-xs font-semibold"
              >
                Ubah Detail
              </Button>
            )}

            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={() => alert("Draf tawaran tersimpan di memori perangkat.")}
              className="text-xs font-semibold"
            >
              Simpan Draf
            </Button>

            {step === 1 ? (
              <Button
                type="button"
                size="default"
                onClick={handleNextStep}
                className="gap-2 text-xs font-bold shadow-xs cursor-pointer"
              >
                <span>Tinjau Tawaran</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="button"
                variant="default"
                size="default"
                onClick={proceedPublish}
                disabled={lampEval.status === "MERAH" && !priceAcknowledged}
                className="gap-2 text-xs font-bold shadow-xs cursor-pointer"
              >
                <span>Terbitkan Tawaran Sekarang</span>
                <Check className="w-4 h-4" />
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Confirmation Modal if Red Price */}
      <ConfirmationModal
        isOpen={showRedPriceConfirm}
        onCancel={() => setShowRedPriceConfirm(false)}
        onConfirm={() => {
          setShowRedPriceConfirm(false)
          setStep(2)
        }}
        title="Konfirmasi Harga di Bawah Batas Wajar"
        description={`Harga Rp${price.toLocaleString("id-ID")}/kg berada di bawah batas acuan wajar (Rp${estimate.lowerBound.toLocaleString("id-ID")}/kg). Menjual di bawah batas wajar berisiko menurunkan pendapatan Anda. Apakah Anda yakin ingin melanjutkan penawaran ini?`}
        confirmText="Ya, Tetap Lanjutkan"
        cancelText="Ubah Harga"
        variant="warning"
      />
    </div>
  )
}
