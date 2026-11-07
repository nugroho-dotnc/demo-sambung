import { useState } from "react"
import { useSambungStore } from "@/store/sambungStore"
import { formatRupiah } from "@/lib/utils"
import { calculateFairPrice, evaluatePriceLamp } from "@/lib/priceEngine"
import { PriceLampBadge } from "@/components/domain/PriceLampBadge"
import { PriceRangeSlider } from "@/components/domain/PriceRangeSlider"
import { SimulationReceiptModal } from "@/pages/shared/SimulationReceiptModal"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Phone,
  CheckCircle2,
  Printer,
  Send,
  ArrowLeft,
  Sprout,
  Building2,
  Check,
  RotateCcw
} from "lucide-react"

interface PetaniContractDetailPageProps {
  contractId: string
  onBack: () => void
}

export function PetaniContractDetailPage({ contractId, onBack }: PetaniContractDetailPageProps) {
  const {
    contracts,
    counterOffer,
    acceptPrice,
    confirmCompletion
  } = useSambungStore()

  const [counterPriceInput, setCounterPriceInput] = useState<number>(6800)
  const [showCounterBox, setShowCounterBox] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)

  const contract = contracts.find((c) => c.id === contractId)

  if (!contract) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <p className="text-muted-foreground">Kontrak #{contractId} tidak ditemukan.</p>
        <Button onClick={onBack}>Kembali</Button>
      </div>
    )
  }

  const isMenunggu = contract.status === "Menunggu Kesepakatan"
  const isDisetujui = contract.status === "Disetujui"
  const isSelesai = contract.status === "Selesai"
  const isWaitingFarmer = isMenunggu && contract.activeProposedBy === "pembeli"

  const rendemen = contract.grainType === "GKP" ? 0.5338 : 0.63
  const benchmark = calculateFairPrice(contract.grainType, "Jawa Timur", 13500, rendemen)
  const lamp = evaluatePriceLamp(contract.activePrice, benchmark.lowerBound, benchmark.upperBound)
  const totalValue = contract.volume * contract.activePrice

  const handleAcceptPrice = () => {
    try {
      acceptPrice(contract.id)
      alert("Harga pesanan disetujui! Status kontrak kini beralih ke 'Disetujui'. Nomor telepon pembeli kini terbuka.")
    } catch (err: unknown) {
      alert((err as Error).message)
    }
  }

  const handleSendCounterOffer = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      counterOffer(contract.id, counterPriceInput)
      setShowCounterBox(false)
      alert(`Tawaran harga balik Rp${counterPriceInput.toLocaleString("id-ID")}/kg berhasil dikirimkan ke pembeli!`)
    } catch (err: unknown) {
      alert((err as Error).message)
    }
  }

  const handleFarmerComplete = () => {
    try {
      confirmCompletion(contract.id)
      alert("Konfirmasi pemenuhan panen berhasil dicatat!")
    } catch (err: unknown) {
      alert((err as Error).message)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Back Button & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="self-start gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Pesanan & Kontrak</span>
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-muted text-muted-foreground border border-border">
            Kontrak #{contract.id}
          </span>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-md ${
              isDisetujui
                ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                : isMenunggu
                ? "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                : "bg-muted text-foreground border border-border"
            }`}
          >
            {contract.status}
          </span>
        </div>
      </div>

      {/* 3-Step Progress Stepper matching Petani.dc.html lines 328-332 */}
      <Card className="p-4 bg-card border border-border/80">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2 p-2 rounded-lg font-semibold bg-[#EAF1E7] text-[#2D4828] dark:bg-primary/20 dark:text-primary-foreground">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white dark:text-[#182117] text-[11px] font-bold">
              <Check className="w-3 h-3" />
            </span>
            <span>1. Pesanan Diterima</span>
          </div>

          <div
            className={`flex items-center gap-2 p-2 rounded-lg font-medium ${
              isMenunggu
                ? "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 font-semibold"
                : isDisetujui || isSelesai
                ? "bg-[#EAF1E7] text-[#2D4828] dark:bg-primary/20 dark:text-primary-foreground font-semibold"
                : "text-muted-foreground"
            }`}
          >
            <span
              className={`flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-bold ${
                isDisetujui || isSelesai
                  ? "bg-primary text-white dark:text-[#182117]"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {isDisetujui || isSelesai ? <Check className="w-3 h-3" /> : "2"}
            </span>
            <span>2. Kesepakatan Harga</span>
          </div>

          <div
            className={`flex items-center gap-2 p-2 rounded-lg font-medium ${
              isSelesai
                ? "bg-[#EAF1E7] text-[#2D4828] dark:bg-primary/20 dark:text-primary-foreground font-semibold"
                : isDisetujui
                ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 font-semibold"
                : "text-muted-foreground"
            }`}
          >
            <span
              className={`flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-bold ${
                isSelesai
                  ? "bg-primary text-white dark:text-[#182117]"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {isSelesai ? <Check className="w-3 h-3" /> : "3"}
            </span>
            <span>3. Tanda Tangan & Selesai</span>
          </div>
        </div>
      </Card>

      {/* Main Contract Card */}
      <Card className="p-6 sm:p-8 bg-card border border-border/80 space-y-6">
        <div>
          <h2 className="text-xl font-bold font-display text-foreground">
            Kontrak Jual-Beli Gabah Petani
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Dokumen simulasi kesepakatan transaksi gabah terverifikasi SAMBUNG.
          </p>
        </div>

        {/* Counterpart Buyer & Farmer Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-muted/40 border border-border/60">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Sprout className="w-3.5 h-3.5 text-primary" />
              <span>Pihak Penjual (Anda)</span>
            </span>
            <p className="text-sm font-bold text-foreground">{contract.farmerName}</p>
            <p className="text-xs text-muted-foreground">Kelompok Tani Sumber Makmur · Karawang</p>
          </div>

          <div className="space-y-1 border-t sm:border-t-0 sm:border-l pt-3 sm:pt-0 sm:pl-4 border-border/60">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-primary" />
              <span>Pihak Pembeli</span>
            </span>
            <p className="text-sm font-bold text-foreground">{contract.buyerName}</p>
            {isDisetujui ? (
              <div className="flex items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-semibold border border-emerald-200">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{contract.buyerPhone}</span>
                </span>
                <span className="text-[11px] text-muted-foreground">Kontak terbuka</span>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Kontak telepon terbuka otomatis setelah harga disetujui.
              </p>
            )}
          </div>
        </div>

        {/* Contract Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-border/80 text-xs">
          <div>
            <span className="text-muted-foreground block text-[11px]">Komoditas</span>
            <strong className="font-semibold text-foreground text-sm">{contract.grainType}</strong>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Volume Panen</span>
            <strong className="font-semibold text-foreground text-sm">
              {contract.volume.toLocaleString("id-ID")} kg
            </strong>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Harga Tawar Aktif</span>
            <strong className="font-bold text-foreground text-sm font-mono text-primary">
              {formatRupiah(contract.activePrice)}/kg
            </strong>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Total Nilai Kontrak</span>
            <strong className="font-bold text-foreground text-sm font-mono">
              {formatRupiah(totalValue)}
            </strong>
          </div>
        </div>

        {/* Price Lamp Verification Card */}
        <div className="p-4 rounded-xl bg-card border border-border/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">Evaluasi Rentang Wajar:</span>
            <PriceLampBadge status={lamp.status} size="sm" />
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Harga {formatRupiah(contract.activePrice)} berada di dalam estimasi rentang wajar ({formatRupiah(benchmark.lowerBound)}  -  {formatRupiah(benchmark.upperBound)}) dan di atas HPP Rp6.500/kg.
          </p>
        </div>

        {/* Negotiation Box with 4-color threshold slider (if pending) */}
        {isMenunggu && showCounterBox && (
          <div className="p-5 rounded-xl bg-muted/40 border border-border/80 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">
                Tentukan Harga Tawar Balik ke Pembeli
              </h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowCounterBox(false)}
                className="text-xs"
              >
                Batal
              </Button>
            </div>

            <PriceRangeSlider
              value={counterPriceInput}
              min={Math.max(5000, benchmark.lowerBound - 1000)}
              max={benchmark.upperBound + 1000}
              lowerBound={benchmark.lowerBound}
              upperBound={benchmark.upperBound}
              tolerancePercent={0.03}
              onChange={setCounterPriceInput}
              label="Harga Tawar Balik (Rp / kg)"
            />

            <div className="flex justify-end pt-2">
              <Button
                size="sm"
                onClick={handleSendCounterOffer}
                className="gap-1.5 text-xs font-semibold shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Tawaran Balik ({formatRupiah(counterPriceInput)}/kg)</span>
              </Button>
            </div>
          </div>
        )}

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/80">
          <div className="text-xs text-muted-foreground">
            {contract.confirmedByFarmer && (
              <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
                <Check className="w-3.5 h-3.5" />
                <span>Anda telah mengonfirmasi pemenuhan panen.</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isWaitingFarmer && !showCounterBox && (
              <>
                <Button
                  size="sm"
                  onClick={handleAcceptPrice}
                  className="text-xs font-semibold shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Setujui Harga Ini</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setCounterPriceInput(contract.activePrice)
                    setShowCounterBox(true)
                  }}
                  className="text-xs font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Ajukan Harga Lain</span>
                </Button>
              </>
            )}

            {isDisetujui && !contract.confirmedByFarmer && (
              <Button
                size="sm"
                onClick={handleFarmerComplete}
                className="text-xs font-semibold shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Konfirmasi Panen Dikirim (1/2 Selesai)</span>
              </Button>
            )}

            {(isDisetujui || isSelesai) && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowReceiptModal(true)}
                className="text-xs gap-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-primary" />
                <span>Cetak Bukti Transaksi</span>
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Simulation Receipt Modal */}
      {showReceiptModal && (
        <SimulationReceiptModal
          isOpen={showReceiptModal}
          contract={contract}
          onClose={() => setShowReceiptModal(false)}
        />
      )}
    </div>
  )
}
