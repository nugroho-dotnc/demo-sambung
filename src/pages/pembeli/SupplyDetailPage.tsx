import { useState } from "react"
import { useSambungStore } from "@/store/sambungStore"
import { formatRupiah } from "@/lib/utils"
import { calculateFairPrice, evaluatePriceLamp, validatePriceInput, validateVolumeInput } from "@/lib/priceEngine"
import { PriceLampBadge } from "@/components/domain/PriceLampBadge"
import { PriceRangeSlider } from "@/components/domain/PriceRangeSlider"
import { PriceAcknowledgement } from "@/components/domain/PriceAcknowledgement"
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
  AlertCircle,
  Package
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
  const [priceAcknowledged, setPriceAcknowledged] = useState(false)
  const [showRedPriceConfirm, setShowRedPriceConfirm] = useState(false)

  if (!offer) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <p className="text-muted-foreground text-sm">Tawaran pasokan tidak ditemukan dalam basis data.</p>
        <Button onClick={onBack} size="sm">Kembali ke Katalog</Button>
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
      alert(`Pesanan berhasil diajukan! Volume ${orderVolume.toLocaleString("id-ID")} kg telah dicadangkan. Silakan lanjut ke halaman kontrak.`)
      onSuccess(contract.id)
    } catch (err: unknown) {
      setValidationError((err as Error).message)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-7 pb-14">
      {/* Back button & Breadcrumb */}
      <div>
        <div className="flex items-center justify-between pb-2">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Sambung</span>
            <span className="text-muted-foreground/50">/</span>
            <button onClick={onBack} className="hover:text-foreground hover:underline cursor-pointer">Katalog Pasokan</button>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-primary font-mono font-bold">#{offer.id}</span>
          </nav>

          <button
            onClick={onBack}
            className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke katalog</span>
          </button>
        </div>

        <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/70">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Pengajuan Pesanan Pasokan
              </h1>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-muted border border-border text-foreground">
                #{offer.id}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Tentukan kuantitas pesanan parsial dan ajukan harga penawaran objektif berdasarkan kalkulasi wajar.
            </p>
          </div>

          <PriceLampBadge status={lampEval.status} size="default" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Offer Specifications */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="bg-card border-border/80 shadow-xs overflow-hidden rounded-2xl">
            <CardHeader className="bg-muted/30 p-6 border-b border-border/70">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="font-mono text-xs font-bold bg-card border border-border px-2.5 py-0.5 rounded text-foreground">
                  #{offer.id}
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-secondary text-secondary-foreground border border-border/60">
                  {offer.grainType} · {offer.grainType === "GKP" ? "Panen Basah" : "Giling Siap Olah"}
                </span>
              </div>
              <CardTitle className="text-2xl font-bold font-display text-foreground">
                Pasokan Gabah Kelompok Tani {offer.farmerName}
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {offer.moderationStatus === "Sedang diminta perbaikan" && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Penanda Temuan Moderasi:</p>
                    <p className="mt-0.5">{offer.moderationIssue || "Ada permintaan peninjauan dari pengelola."}</p>
                  </div>
                </div>
              )}

              {/* Volume Status */}
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/70 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">Volume Tersedia Saat Ini</span>
                  <p className="text-3xl font-bold font-mono text-primary mt-1 tabular-nums">
                    {offer.availableVolume.toLocaleString("id-ID")} <span className="text-xs font-sans font-normal text-muted-foreground">kg</span>
                  </p>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">Harga Minta Petani</span>
                  <p className="text-3xl font-bold font-mono text-foreground mt-1 tabular-nums">
                    {formatRupiah(offer.askingPrice)} <span className="text-xs font-sans font-normal text-muted-foreground">/kg</span>
                  </p>
                </div>
              </div>

              {/* Specs & Location */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span>Kec. {offer.district}, {offer.regency}, {offer.province}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4 text-primary shrink-0" />
                  <span>Tanggal Siap Angkut: <strong className="text-foreground">{offer.readyDate}</strong></span>
                </div>

                <div className="grid grid-cols-2 gap-4 p-3.5 rounded-xl bg-card border border-border/70 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Kadar Air Rata-rata</span>
                    <strong className="text-foreground font-mono text-sm mt-0.5 block">
                      {typeof offer.moisturePercent === "number" ? `${offer.moisturePercent}%` : offer.moisturePercent}
                    </strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Kadar Hampa / Kotoran</span>
                    <strong className="text-foreground font-mono text-sm mt-0.5 block">
                      {typeof offer.impurityPercent === "number" ? `${offer.impurityPercent}%` : offer.impurityPercent}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Privacy Notice on Phone */}
              <div className="p-3.5 rounded-xl bg-muted/40 border border-border/70 flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
                <Lock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>
                  Nomor kontak petani dilindungi privasi platform. Nomor telepon dan alamat presisi penjemputan akan otomatis terbuka bagi kedua pihak setelah kesepakatan harga disetujui bersama.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Order Form (FR-007) */}
        <div className="lg:col-span-5">
          <Card className="bg-card border-2 border-primary/30 shadow-md rounded-2xl overflow-hidden">
            <CardHeader className="bg-muted/30 px-6 py-4 border-b border-border/70">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" />
                <span>Form Pengajuan Pesanan Parsial</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={handleOrderSubmit} className="space-y-5">
                {validationError && (
                  <div className="p-3.5 rounded-xl bg-destructive/15 text-destructive text-xs font-semibold leading-relaxed">
                    {validationError}
                  </div>
                )}

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                      Volume Pesanan (kg) <span className="text-destructive">*</span>
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
                    className="font-mono text-xl font-bold h-12"
                    required
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Anda dapat memesan sebagian kuantitas (parsial) dari total panen yang tersedia.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                      Harga Tawar Beli (Rp / kg) <span className="text-destructive">*</span>
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
                    className="font-mono text-xl font-bold h-12"
                    required
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Gunakan harga minta petani atau ajukan penawaran awal Anda.
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
                  label="Tenggat simulasi tawar beli"
                />

                {/* Red Price Acknowledgement */}
                {lampEval.status === "MERAH" && (
                  <PriceAcknowledgement
                    checked={priceAcknowledged}
                    onChange={setPriceAcknowledged}
                    price={proposedPrice}
                    lowerBound={estimate.lowerBound}
                  />
                )}

                {/* Total Value Preview */}
                <div className="p-4 rounded-xl bg-muted/40 border border-border/80 space-y-2">
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span className="font-medium">Total Nilai Pembelian:</span>
                    <PriceLampBadge status={lampEval.status} size="sm" />
                  </div>
                  <p className="text-3xl font-bold font-mono text-primary tabular-nums">
                    {formatRupiah(orderVolume * proposedPrice)}
                  </p>
                  <p className="text-[11px] text-muted-foreground pt-1 border-t border-border/60">
                    Tenggat persetujuan awal: <strong>24 jam</strong> sejak pesanan terkirim.
                  </p>
                </div>

                <Button
                  type="submit"
                  size="default"
                  disabled={lampEval.status === "MERAH" && !priceAcknowledged}
                  className="w-full font-semibold gap-2 text-xs shadow-xs"
                >
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
        description={`Harga penawaran Anda (${formatRupiah(proposedPrice)}/kg) berada di bawah batas kewajaran acuan (${formatRupiah(estimate.lowerBound)} – ${formatRupiah(estimate.upperBound)}). Apakah Anda yakin ingin mengajukan harga penawaran ini ke petani?`}
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
