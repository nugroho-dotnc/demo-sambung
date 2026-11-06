import { useState } from "react"
import { useSambungStore } from "@/store/sambungStore"
import { GrainType } from "@/types/domain"
import { calculateFairPrice, evaluatePriceLamp, validatePriceInput, validateVolumeInput } from "@/lib/priceEngine"
import { PriceRangeSlider } from "@/components/domain/PriceRangeSlider"
import { ConfirmationModal } from "@/components/domain/ConfirmationModal"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatRupiah } from "@/lib/utils"
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  ChevronDown,
  ArrowRight,
  TrendingDown,
  TrendingUp
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
  const [showRedPriceConfirm, setShowRedPriceConfirm] = useState(false)

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
    } else if (step === 2) {
      setStep(3)
    }
  }

  const proceedPublish = () => {
    createOffer({
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

    alert("Tawaran panen berhasil diterbitkan ke katalog pasokan!")
    onSuccess()
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span>SAMBUNG</span>
          <span>/</span>
          <span className="text-foreground">JUAL HASIL PANEN</span>
        </div>

        <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Jual hasil panen
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Lengkapi detail panen. Periksa kewajaran harga sebelum mengirim tawaran.
            </p>
          </div>

          <span className="self-start sm:self-auto px-2.5 py-1 rounded-md bg-muted text-muted-foreground text-xs font-semibold">
            Draf · belum diterbitkan
          </span>
        </div>
      </div>

      {/* Stepper matching mockup */}
      <Card className="p-3 bg-card border border-border/80">
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className={`flex items-center gap-2 p-2 rounded-lg font-medium ${step === 1 ? "bg-[#EAF1E7] text-[#2D4828] dark:bg-primary/20 dark:text-primary-foreground font-semibold" : "text-muted-foreground"}`}>
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-xs font-bold">1</span>
            <span>Detail panen</span>
          </div>

          <div className={`flex items-center gap-2 p-2 rounded-lg font-medium ${step === 2 ? "bg-[#EAF1E7] text-[#2D4828] dark:bg-primary/20 dark:text-primary-foreground font-semibold" : "text-muted-foreground"}`}>
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-muted text-xs font-bold">2</span>
            <span>Tinjau tawaran</span>
          </div>

          <div className={`flex items-center gap-2 p-2 rounded-lg font-medium ${step === 3 ? "bg-[#EAF1E7] text-[#2D4828] dark:bg-primary/20 dark:text-primary-foreground font-semibold" : "text-muted-foreground"}`}>
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-muted text-xs font-bold">3</span>
            <span>Kirim</span>
          </div>
        </div>
      </Card>

      {/* Main 2-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form (~7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="font-bold text-base text-foreground">Detail hasil panen</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Semua kolom wajib diisi.</p>
            </div>

            {validationError && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Komoditas */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Jenis komoditas</label>
                <div className="relative">
                  <select
                    value={grainType}
                    onChange={(e) => setGrainType(e.target.value as GrainType)}
                    className="w-full h-10 appearance-none rounded-lg border border-border bg-card px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary pr-9 cursor-pointer"
                  >
                    <option value="GKP">Gabah Kering Panen (GKP)</option>
                    <option value="GKG">Gabah Kering Giling (GKG)</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Volume & Kadar Air in 2 cols */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Volume panen</label>
                  <div className="relative">
                    <Input
                      type="number"
                      step={10}
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="pr-10 text-sm"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">kg</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">Gunakan berat gabah bersih.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Kadar air</label>
                  <div className="relative">
                    <Input
                      type="number"
                      step={0.5}
                      value={moisture}
                      onChange={(e) => setMoisture(Number(e.target.value))}
                      className="pr-10 text-sm"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">%</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">Hasil pengukuran kadar air.</p>
                </div>
              </div>

              {/* Lokasi */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Lokasi pengambilan</label>
                <div className="relative">
                  <Input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="Kec. Ngoro, Kab. Mojokerto"
                    className="text-sm"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">Lokasi ini ditampilkan kepada calon pembeli.</p>
              </div>

              <div className="pt-2 border-t border-border/80">
                {/* Colored Slider System (Merah, Kuning, Hijau, Kuning) */}
                <PriceRangeSlider
                  value={price}
                  min={5000}
                  max={8500}
                  lowerBound={estimate.lowerBound}
                  upperBound={estimate.upperBound}
                  tolerancePercent={0.05}
                  onChange={(val) => setPrice(val)}
                  label="Harga dasar yang Anda minta"
                />
              </div>

              {/* Warning Banner if Red / Yellow */}
              {lampEval.status === "MERAH" && (
                <div className="p-3.5 rounded-xl bg-[#FDECE8] dark:bg-[#3D1E16] border border-[#F5C2B5] dark:border-[#5C2E22] flex items-start gap-2.5 text-xs">
                  <AlertTriangle className="w-4 h-4 text-[#C86B3C] shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <p className="font-bold text-[#9B3529] dark:text-[#FFC0AB]">
                      Lampu merah · di bawah batas wajar
                    </p>
                    <p className="text-[#7A281E] dark:text-[#FFD7CB] mt-0.5">
                      Harga Rp{price.toLocaleString("id-ID")}/kg berada {diffPercent}% di bawah batas bawah Rp{estimate.lowerBound.toLocaleString("id-ID")}/kg. Tinjau kembali harga sebelum melanjutkan.
                    </p>
                  </div>
                </div>
              )}

              {/* Quick Preset Action */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted-foreground">
                  Gunakan batas bawah sebagai titik awal negosiasi.
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPrice(estimate.lowerBound)}
                  className="text-xs h-8 border-border hover:bg-muted"
                >
                  Gunakan Rp{estimate.lowerBound.toLocaleString("id-ID")}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Reference & Summary (~5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card 1: Pembanding Harga */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground">Pembanding harga GKP</h3>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#EAF1E7] text-[#2D4828] dark:bg-primary/20 dark:text-primary-foreground border border-primary/20 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Acuan Jawa Timur</span>
              </span>
            </div>

            <div className="space-y-1">
              <p className="font-display text-2xl font-extrabold text-[#246447] dark:text-[#A9D6B0]">
                Rp{estimate.lowerBound.toLocaleString("id-ID")}–{estimate.upperBound.toLocaleString("id-ID")}
              </p>
              <p className="text-xs text-muted-foreground">
                per kg · rentang harga wajar pada acuan
              </p>
            </div>

            <div className="pt-3 border-t border-border/80 space-y-2 text-xs">
              <div className="flex justify-between items-center text-muted-foreground">
                <span>HPP</span>
                <span className="font-medium text-foreground">Rp6.500/kg</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Harga Anda</span>
                <span className="font-semibold text-foreground">Rp{price.toLocaleString("id-ID")}/kg</span>
              </div>

              {diffFromLower < 0 ? (
                <div className="pt-1 flex items-center gap-1 text-[#9B3529] dark:text-[#FFC0AB] font-medium">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>↓ Rp{Math.abs(diffFromLower).toLocaleString("id-ID")}/kg dari batas bawah rentang wajar.</span>
                </div>
              ) : diffFromLower > (estimate.upperBound - estimate.lowerBound) ? (
                <div className="pt-1 flex items-center gap-1 text-amber-700 dark:text-amber-400 font-medium">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>↑ Di atas batas atas acuan wajar.</span>
                </div>
              ) : (
                <div className="pt-1 flex items-center gap-1 text-[#246447] dark:text-[#A9D6B0] font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Dalam rentang acuan wajar pemerintah.</span>
                </div>
              )}
            </div>
          </Card>

          {/* Card 2: Ringkasan Tawaran */}
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-sm text-foreground">Ringkasan tawaran</h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Volume</span>
                <span className="font-bold text-foreground">{volume.toLocaleString("id-ID")} kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Harga dasar</span>
                <span className="font-bold text-foreground">Rp{price.toLocaleString("id-ID")}/kg</span>
              </div>
            </div>

            <div className="pt-3 border-t border-border/80 space-y-1">
              <p className="text-xs text-muted-foreground">Perkiraan nilai kotor</p>
              <p className="font-display text-2xl font-bold text-foreground">
                {formatRupiah(grossEstimatedValue)}
              </p>
              <p className="text-[11px] text-muted-foreground leading-relaxed pt-1">
                {volume.toLocaleString("id-ID")} kg × Rp{price.toLocaleString("id-ID")}. Belum termasuk biaya angkut, potongan mutu, atau biaya lain yang belum disepakati.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Action Bar matching mockup */}
      <Card className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border/80">
        <div>
          <p className="text-xs font-semibold text-foreground">Tawaran belum dikirim</p>
          <p className="text-[11px] text-muted-foreground">
            {step === 1 ? "Anda dapat memeriksa ulang rincian pada langkah berikutnya." : "Tawaran Anda siap diterbitkan."}
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={() => setStep(1)}
              className="text-xs"
            >
              Kembali
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={() => alert("Draf tawaran tersimpan di memori perangkat.")}
            className="text-xs"
          >
            Simpan draf
          </Button>

          {step < 3 ? (
            <Button
              type="button"
              size="default"
              onClick={handleNextStep}
              className="gap-2 text-xs"
            >
              <span>{step === 1 ? "Tinjau tawaran" : "Lanjutkan"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="default"
              size="default"
              onClick={proceedPublish}
              className="gap-2 text-xs shadow-xs"
            >
              <span>Terbitkan tawaran</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </Card>

      {/* Bottom Disclaimer */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
        <Info className="w-3.5 h-3.5 shrink-0" />
        <span>
          Data dari gambar acuan untuk simulasi desain. Bukan harga langsung atau pembaruan pasar.
        </span>
      </div>

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
