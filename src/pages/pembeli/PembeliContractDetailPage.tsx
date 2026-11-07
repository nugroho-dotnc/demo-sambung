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

interface PembeliContractDetailPageProps {
  contractId: string
  onBack: () => void
}

export function PembeliContractDetailPage({ contractId, onBack }: PembeliContractDetailPageProps) {
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
        <p className="text-muted-foreground">Pesanan/Kontrak #{contractId} tidak ditemukan.</p>
        <Button onClick={onBack}>Kembali</Button>
      </div>
    )
  }

  const isMenunggu = contract.status === "Menunggu Kesepakatan"
  const isDisetujui = contract.status === "Disetujui"
  const isSelesai = contract.status === "Selesai"
  const isWaitingBuyer = isMenunggu && contract.activeProposedBy === "petani"

  const rendemen = contract.grainType === "GKP" ? 0.5338 : 0.63
  const benchmark = calculateFairPrice(contract.grainType, "Jawa Timur", 13500, rendemen)
  const lamp = evaluatePriceLamp(contract.activePrice, benchmark.lowerBound, benchmark.upperBound)
  const totalValue = contract.volume * contract.activePrice

  const handleAcceptPrice = () => {
    try {
      acceptPrice(contract.id)
      alert("Harga tawar petani disetujui! Status kontrak kini beralih ke 'Disetujui'. Nomor telepon kedua pihak kini saling terbuka.")
    } catch (err: unknown) {
      alert((err as Error).message)
    }
  }

  const handleSendCounterOffer = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      counterOffer(contract.id, counterPriceInput)
      setShowCounterBox(false)
      alert(`Penawaran harga baru Rp${counterPriceInput.toLocaleString("id-ID")}/kg berhasil diajukan ke petani!`)
    } catch (err: unknown) {
      alert((err as Error).message)
    }
  }

  const handleBuyerComplete = () => {
    try {
      confirmCompletion(contract.id)
      alert("Konfirmasi penerimaan gabah berhasil dicatat!")
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
                ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200"
                : isMenunggu
                ? "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200"
                : "bg-muted text-foreground border border-border"
            }`}
          >
            {contract.status}
          </span>
        </div>
      </div>

      {/* Main Contract Card */}
      <Card className="p-6 sm:p-8 bg-card border border-border/80 space-y-6">
        <div>
          <h2 className="text-xl font-bold font-display text-foreground">
            Rincian Pesanan & Kontrak Pasokan
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Dokumen kesepakatan pasokan gabah langsung antara penggilingan dan petani mitra.
          </p>
        </div>

        {/* Counterpart Buyer & Farmer Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-muted/40 border border-border/60">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-primary" />
              <span>Pihak Pembeli (Anda)</span>
            </span>
            <p className="text-sm font-bold text-foreground">{contract.buyerName}</p>
            <p className="text-xs text-muted-foreground">Produsen Penggilingan Beras</p>
          </div>

          <div className="space-y-1 border-t sm:border-t-0 sm:border-l pt-3 sm:pt-0 sm:pl-4 border-border/60">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Sprout className="w-3.5 h-3.5 text-primary" />
              <span>Petani Penyedia Pasokan</span>
            </span>
            <p className="text-sm font-bold text-foreground">{contract.farmerName}</p>
            {isDisetujui ? (
              <div className="flex items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-semibold border border-emerald-200">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{contract.farmerPhone}</span>
                </span>
                <span className="text-[11px] text-muted-foreground">Kontak terbuka</span>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Kontak petani dilindungi privasi dan otomatis terbuka setelah harga disetujui.
              </p>
            )}
          </div>
        </div>

        {/* Contract Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-border/80 text-xs">
          <div>
            <span className="text-muted-foreground block text-[11px]">Komoditas Gabah</span>
            <strong className="font-semibold text-foreground text-sm">{contract.grainType}</strong>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Volume Pasokan</span>
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
            <span className="text-muted-foreground block text-[11px]">Total Nilai Pesanan</span>
            <strong className="font-bold text-foreground text-sm font-mono">
              {formatRupiah(totalValue)}
            </strong>
          </div>
        </div>

        {/* Price Lamp Verification Card */}
        <div className="p-4 rounded-xl bg-card border border-border/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">Pemeriksaan Lampu Harga:</span>
            <PriceLampBadge status={lamp.status} size="sm" />
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Harga {formatRupiah(contract.activePrice)}/kg diperiksa terhadap acuan wajar ({formatRupiah(benchmark.lowerBound)}  -  {formatRupiah(benchmark.upperBound)}) berbasis konversi rendemen beras produsen Jawa Timur.
          </p>
        </div>

        {/* Negotiation Box with 4-color threshold slider (if pending) */}
        {isMenunggu && showCounterBox && (
          <div className="p-5 rounded-xl bg-muted/40 border border-border/80 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">
                Ajukan Penawaran Harga Baru ke Petani
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
                <span>Kirim Penawaran ({formatRupiah(counterPriceInput)}/kg)</span>
              </Button>
            </div>
          </div>
        )}

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/80">
          <div className="text-xs text-muted-foreground">
            {contract.confirmedByBuyer && (
              <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
                <Check className="w-3.5 h-3.5" />
                <span>Anda telah mengonfirmasi penerimaan gabah.</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isWaitingBuyer && !showCounterBox && (
              <>
                <Button
                  size="sm"
                  onClick={handleAcceptPrice}
                  className="text-xs font-semibold shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Setujui Harga Petani</span>
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
                  <span>Ajukan Tawar Balik</span>
                </Button>
              </>
            )}

            {isDisetujui && !contract.confirmedByBuyer && (
              <Button
                size="sm"
                onClick={handleBuyerComplete}
                className="text-xs font-semibold shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Konfirmasi Gabah Diterima (1/2 Selesai)</span>
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
