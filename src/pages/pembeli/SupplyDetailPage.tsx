import { useState } from "react"
import { useSambungStore } from "@/store/sambungStore"
import { formatRupiah } from "@/lib/utils"
import { calculateFairPrice, evaluatePriceLamp, validatePriceInput, validateVolumeInput } from "@/lib/priceEngine"
import { PriceLampBadge } from "@/components/domain/PriceLampBadge"
import { PriceRangeSlider } from "@/components/domain/PriceRangeSlider"
import { ConfirmationModal } from "@/components/domain/ConfirmationModal"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  MapPin,
  Calendar,
  Lock,
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from "lucide-react"

interface SupplyDetailPageProps {
  offerId: string
  onBack: () => void
  onSuccess: (contractId: string) => void
}

export function SupplyDetailPage({ offerId, onBack, onSuccess }: SupplyDetailPageProps) {
  const { offers, createOrder } = useSambungStore()

  const offer = offers.find((o) => o.id === offerId)

  // Order Form State
  const [orderVolume, setOrderVolume] = useState<number>(1000)
  const [proposedPrice, setProposedPrice] = useState<number>(offer ? offer.askingPrice : 6800)
  const [validationError, setValidationError] = useState("")
  const [showRedPriceConfirm, setShowRedPriceConfirm] = useState(false)

  if (!offer) {
    return (
      <div className="app-wrap py-12 text-center">
        <p className="text-muted-foreground">Tawaran pasokan tidak ditemukan.</p>
        <Button onClick={onBack} className="mt-4">Kembali ke Katalog</Button>
      </div>
    )
  }

  const estimate = calculateFairPrice(
    offer.grainType,
    offer.province,
    13500,
    offer.grainType === "GKP" ? 0.52 : 0.63
  )
  const lampEval = evaluatePriceLamp(proposedPrice, estimate.lowerBound, estimate.upperBound)

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const volVal = validateVolumeInput(orderVolume)
    if (!volVal.isValid) {
      setValidationError(volVal.message || "Volume tidak valid")
      return
    }

    if (orderVolume > offer.availableVolume) {
      setValidationError(
        `Volume pesanan (${orderVolume.toLocaleString("id-ID")} kg) melebihi stok yang tersedia (${offer.availableVolume.toLocaleString("id-ID")} kg)`
      )
      return
    }

    const priceVal = validatePriceInput(proposedPrice)
    if (!priceVal.isValid) {
      setValidationError(priceVal.message || "Harga tidak valid")
      return
    }

    setValidationError("")

    if (lampEval.status === "MERAH") {
      setShowRedPriceConfirm(true)
      return
    }

    proceedOrder()
  }

  const proceedOrder = () => {
    try {
      const contract = createOrder(offer.id, Number(orderVolume), Number(proposedPrice))
      alert(`Pesanan berhasil diajukan! Volume ${orderVolume} kg telah dicadangkan. Silakan lanjut ke halaman kontrak.`)
      onSuccess(contract.id)
    } catch (err: unknown) {
      setValidationError((err as Error).message)
    }
  }

  return (
    <div className="w-full space-y-6 pb-16">
      {/* Back Button */}
      <div className="pt-1 border-b border-border/80 pb-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 text-xs cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Katalog Pasokan</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Offer Specifications */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader className="p-6 border-b border-border">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="font-mono text-xs font-bold bg-muted px-2.5 py-0.5 rounded text-foreground">
                  #{offer.id}
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-secondary text-secondary-foreground">
                  {offer.grainType} ({offer.grainType === "GKP" ? "Panen" : "Giling"})
                </span>
                <PriceLampBadge status={lampEval.status} size="sm" />
              </div>
              <CardTitle className="text-2xl font-bold font-display text-foreground">
                Pasokan Gabah {offer.farmerName}
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {offer.moderationStatus === "Sedang diminta perbaikan" && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Penanda Temuan Moderasi:</p>
                    <p className="mt-0.5">{offer.moderationIssue || "Ada permintaan peninjauan dari pengelola."}</p>
                  </div>
                </div>
              )}

              {/* Volume Status */}
              <div className="p-4 rounded-xl bg-muted/50 border border-border grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground font-semibold">Volume Tersedia Saat Ini</span>
                  <p className="text-2xl font-extrabold font-mono text-primary mt-1">
                    {offer.availableVolume.toLocaleString("id-ID")} kg
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground font-semibold">Harga Minta Petani</span>
                  <p className="text-2xl font-extrabold font-mono text-foreground mt-1">
                    {formatRupiah(offer.askingPrice)} /kg
                  </p>
                </div>
              </div>

              {/* Specs & Location */}
              <div className="space-y-3 text-body-sm">
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span>Kec. {offer.district}, {offer.regency}, {offer.province}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4 text-primary shrink-0" />
                  <span>Tanggal Siap Angkut: <strong className="text-foreground">{offer.readyDate}</strong></span>
                </div>
                <div className="grid grid-cols-2 gap-4 p-3 rounded-lg bg-card border border-border text-xs">
                  <div>
                    <span className="text-muted-foreground">Kadar Air: </span>
                    <strong className="text-foreground">
                      {typeof offer.moisturePercent === "number" ? `${offer.moisturePercent}%` : offer.moisturePercent}
                    </strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Kadar Hampa: </span>
                    <strong className="text-foreground">
                      {typeof offer.impurityPercent === "number" ? `${offer.impurityPercent}%` : offer.impurityPercent}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Privacy Notice on Phone */}
              <div className="p-3.5 rounded-lg bg-card border border-border flex items-center gap-2.5 text-xs text-muted-foreground">
                <Lock className="w-4 h-4 text-primary shrink-0" />
                <span>
                  Nomor HP petani dilindungi privasi. Kontak telepon akan otomatis dibuka setelah harga kesepakatan disetujui bersama.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Order Form (FR-007) */}
        <div className="lg:col-span-5">
          <Card className="border-2 border-primary/30 shadow-lg">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-lg">Form Pengajuan Pesanan Parsial</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleOrderSubmit} className="space-y-5">
                {validationError && (
                  <div className="p-3.5 rounded-lg bg-destructive/15 text-destructive text-xs font-semibold">
                    {validationError}
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-body-sm font-bold text-foreground">
                      Volume yang Ingin Dipesan (kg) <span className="text-destructive">*</span>
                    </label>
                    <span className="text-xs text-muted-foreground font-mono">
                      Maks: {offer.availableVolume.toLocaleString("id-ID")} kg
                    </span>
                  </div>
                  <Input
                    type="number"
                    step="0.01"
                    max={offer.availableVolume}
                    value={orderVolume}
                    onChange={(e) => setOrderVolume(Number(e.target.value))}
                    placeholder="Contoh: 1500"
                    className="font-mono text-xl font-bold"
                    required
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Anda dapat memesan sebagian volume (pembelian parsial).
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-body-sm font-bold text-foreground">
                      Harga Penawaran Anda (Rp / kg) <span className="text-destructive">*</span>
                    </label>
                    <span className="text-xs text-muted-foreground font-mono">
                      Minta: {formatRupiah(offer.askingPrice)}
                    </span>
                  </div>
                  <Input
                    type="number"
                    step="1"
                    value={proposedPrice}
                    onChange={(e) => setProposedPrice(Number(e.target.value))}
                    placeholder="Contoh: 6800"
                    className="font-mono text-xl font-bold"
                    required
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Gunakan harga minta petani atau ajukan harga negosiasi awal.
                  </p>
                </div>

                <PriceRangeSlider
                  value={proposedPrice}
                  min={Math.max(1000, estimate.lowerBound - 2500)}
                  max={estimate.upperBound + 3500}
                  lowerBound={estimate.lowerBound}
                  upperBound={estimate.upperBound}
                  tolerancePercent={estimate.tolerancePercent}
                  askingPrice={offer.askingPrice}
                  onChange={setProposedPrice}
                  label="Harga penawaran Anda"
                />

                {/* Total Value Preview */}
                <div className="p-4 rounded-xl bg-card border border-border space-y-2">
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Estimasi Total Pembelian:</span>
                    <PriceLampBadge status={lampEval.status} size="sm" />
                  </div>
                  <p className="text-2xl font-extrabold font-mono text-primary">
                    {formatRupiah(orderVolume * proposedPrice)}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Tenggat awal kesepakatan: <strong>24 jam</strong> sejak pesanan dikirim.
                  </p>
                </div>

                <Button type="submit" size="default" className="w-full font-semibold gap-2 text-xs">
                  <CheckCircle className="w-4 h-4" />
                  <span>Kirim Pesanan & Cadangkan Volume</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Red Price Modal */}
      <ConfirmationModal
        isOpen={showRedPriceConfirm}
        title="Konfirmasi Pengajuan Harga di Bawah Wajar"
        description={`Harga penawaran Anda (${formatRupiah(proposedPrice)}/kg) berada jauh di bawah rentang wajar acuan (${formatRupiah(estimate.lowerBound)} – ${formatRupiah(estimate.upperBound)}). Apakah Anda yakin ingin mengajukan harga penawaran ini ke petani?`}
        confirmText="Tetap Ajukan Tawaran"
        cancelText="Ubah Harga"
        variant="warning"
        onConfirm={() => {
          setShowRedPriceConfirm(false)
          proceedOrder()
        }}
        onCancel={() => setShowRedPriceConfirm(false)}
      />

    </div>
  )
}
