import { useState } from "react"
import { useSambungStore } from "@/store/sambungStore"
import { formatRupiah } from "@/lib/utils"
import { calculateFairPrice, evaluatePriceLamp } from "@/lib/priceEngine"
import { PriceLampBadge } from "@/components/domain/PriceLampBadge"
import { PriceRangeSlider } from "@/components/domain/PriceRangeSlider"
import { PriceAcknowledgement } from "@/components/domain/PriceAcknowledgement"
import { ConfirmationModal } from "@/components/domain/ConfirmationModal"
import { SimulationReceiptModal } from "@/pages/shared/SimulationReceiptModal"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Phone,
  Lock,
  CheckCircle2,
  Printer,
  History,
  Send,
  ArrowLeft,
  Sprout,
  Building2,
  Info,
  Check
} from "lucide-react"

interface ContractDetailPageProps {
  contractId: string
  onBack: () => void
}

export function ContractDetailPage({ contractId, onBack }: ContractDetailPageProps) {
  const {
    currentRole,
    contracts,
    counterOffer,
    acceptPrice,
    confirmCompletion,
    cancelContract,
    rejectContract
  } = useSambungStore()

  const [counterPriceInput, setCounterPriceInput] = useState<number>(6800)
  const [counterPriceAcknowledged, setCounterPriceAcknowledged] = useState(false)
  const [showCounterBox, setShowCounterBox] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [checklist, setChecklist] = useState({
    identity: true,
    quality: true,
    delivery: true,
  })

  // Confirmation Modal state for Cancellation / Rejection
  const [modalAction, setModalAction] = useState<"cancel" | "reject" | null>(null)

  const contract = contracts.find((c) => c.id === contractId)

  if (!contract) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <p className="text-muted-foreground">Kontrak #{contractId} tidak ditemukan.</p>
        <Button onClick={onBack}>Kembali</Button>
      </div>
    )
  }

  const isFarmer = currentRole === "petani"
  const isBuyer = currentRole === "pembeli"
  const isAdmin = currentRole === "admin"

  const isMenunggu = contract.status === "Menunggu Kesepakatan"
  const isDisetujui = contract.status === "Disetujui"
  const isSelesai = contract.status === "Selesai"
  const isTerminal = isSelesai || contract.status === "Dibatalkan" || contract.status === "Ditolak" || contract.status === "Kedaluwarsa"

  const isPhoneVisible = isDisetujui && !isAdmin

  const canAcceptPrice = isMenunggu && (
    (contract.activeProposedBy === "pembeli" && isFarmer) ||
    (contract.activeProposedBy === "petani" && isBuyer)
  )

  const myConfirmationDone = isFarmer ? contract.confirmedByFarmer : contract.confirmedByBuyer
  const confirmationsCount = (contract.confirmedByFarmer ? 1 : 0) + (contract.confirmedByBuyer ? 1 : 0)
  const otherPartyName = isFarmer ? contract.buyerName : contract.farmerName

  const rendemen = contract.grainType === "GKP" ? 0.5338 : 0.63
  const benchmark = calculateFairPrice(contract.grainType, "Jawa Timur", 13500, rendemen)
  const totalValue = contract.volume * contract.activePrice
  const counterLampEval = evaluatePriceLamp(counterPriceInput, benchmark.lowerBound, benchmark.upperBound)

  const handleAcceptPrice = () => {
    try {
      acceptPrice(contract.id)
      alert("Harga disetujui! Status kontrak kini beralih ke 'Disetujui'. Nomor telepon kedua pihak kini saling terbuka.")
    } catch (err: unknown) {
      alert((err as Error).message)
    }
  }

  const handleSendCounterOffer = (e: React.FormEvent) => {
    e.preventDefault()
    if (counterLampEval.status === "MERAH" && !counterPriceAcknowledged) {
      alert("Harap setujui pernyataan pemahaman harga di bawah batas wajar terlebih dahulu.")
      return
    }
    try {
      counterOffer(contract.id, counterPriceInput)
      setShowCounterBox(false)
      alert(`Tawaran harga baru Rp${counterPriceInput.toLocaleString("id-ID")}/kg berhasil diajukan!`)
    } catch (err: unknown) {
      alert((err as Error).message)
    }
  }

  const handleConfirmCompletion = () => {
    try {
      confirmCompletion(contract.id)
      alert("Penyelesaian transaksi berhasil dikonfirmasi.")
    } catch (err: unknown) {
      alert((err as Error).message)
    }
  }

  const handleModalSubmit = (reason?: string) => {
    const finalReason = reason || "Tidak ada alasan spesifik"
    if (modalAction === "cancel") {
      cancelContract(contract.id, finalReason)
      alert("Kontrak berhasil dibatalkan.")
    } else if (modalAction === "reject") {
      rejectContract(contract.id, finalReason)
      alert("Pesanan berhasil ditolak.")
    }
    setModalAction(null)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Breadcrumb & Navigation */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span>SAMBUNG</span>
            <span>/</span>
            <button onClick={onBack} className="hover:text-foreground hover:underline">
              KONTRAK
            </button>
            <span>/</span>
            <span className="text-foreground">#{contract.id}</span>
          </div>

          <button
            onClick={onBack}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke daftar</span>
          </button>
        </div>

        <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Tinjau kontrak #{contract.id}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {isMenunggu
                ? "Periksa pihak, komoditas, dan harga. Menunggu kesepakatan kedua pihak."
                : isDisetujui
                ? "Kontrak telah disetujui bersama. Silakan koordinasikan pengambilan dan penimbangan."
                : "Rincian status dan arsip riwayat kontrak simulasi."}
            </p>
          </div>

          <div className="self-start sm:self-auto flex items-center gap-2">
            <span className="px-3 py-1 rounded-md bg-muted text-muted-foreground text-xs font-semibold">
              {contract.status === "Menunggu Kesepakatan" ? "Draf kontrak" : contract.status}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReceiptModal(true)}
              className="text-xs gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Bukti</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Stepper matching mockup */}
      <Card className="p-3 bg-card border border-border/80">
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className={`flex items-center gap-2 p-2 rounded-lg font-medium ${isMenunggu ? "bg-[#EAF1E7] text-[#2D4828] dark:bg-primary/20 dark:text-primary-foreground font-semibold" : "text-muted-foreground"}`}>
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-xs font-bold">1</span>
            <div>
              <p className="font-semibold">Draf</p>
              <p className="text-[10px] opacity-80">{isMenunggu ? "Saat ini" : "Selesai"}</p>
            </div>
          </div>

          <div className={`flex items-center gap-2 p-2 rounded-lg font-medium ${isDisetujui ? "bg-[#EAF1E7] text-[#2D4828] dark:bg-primary/20 dark:text-primary-foreground font-semibold" : "text-muted-foreground"}`}>
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-muted text-xs font-bold">2</span>
            <div>
              <p className="font-semibold">Persetujuan</p>
              <p className="text-[10px] opacity-80">{isDisetujui ? "Saat ini" : "Kedua pihak"}</p>
            </div>
          </div>

          <div className={`flex items-center gap-2 p-2 rounded-lg font-medium ${isSelesai ? "bg-[#EAF1E7] text-[#2D4828] dark:bg-primary/20 dark:text-primary-foreground font-semibold" : "text-muted-foreground"}`}>
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-muted text-xs font-bold">3</span>
            <div>
              <p className="font-semibold">Pelaksanaan</p>
              <p className="text-[10px] opacity-80">{isSelesai ? "Selesai" : "Setelah disetujui"}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Main 2 Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Para Pihak & Rincian Kesepakatan (~7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Para Pihak */}
          <Card className="p-6 space-y-4">
            <div>
              <h3 className="font-bold text-base text-foreground">Para pihak</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Identitas pihak pada draf kontrak</p>
            </div>

            <div className="space-y-4 pt-2">
              {/* Penjual */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#EAF1E7] text-[#2D4828] dark:bg-primary/20 dark:text-primary-foreground mt-0.5">
                  <Sprout className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Penjual
                  </span>
                  <p className="text-sm font-bold text-foreground">
                    {contract.farmerName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Kab. Ngawi, Jawa Timur
                  </p>
                  {isPhoneVisible && contract.farmerPhone && (
                    <p className="text-xs font-mono font-bold text-primary mt-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{contract.farmerPhone}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t border-border/60" />

              {/* Pembeli */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-secondary text-secondary-foreground mt-0.5">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Pembeli
                  </span>
                  <p className="text-sm font-bold text-foreground">
                    {contract.buyerName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Kab. Madiun, Jawa Timur
                  </p>
                  {isPhoneVisible && contract.buyerPhone && (
                    <p className="text-xs font-mono font-bold text-primary mt-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{contract.buyerPhone}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {!isPhoneVisible && !isTerminal && (
              <div className="p-3 rounded-lg bg-muted/60 border border-border/80 text-[11px] text-muted-foreground flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 shrink-0" />
                <span>Nomor telepon terkunci dan otomatis terbuka setelah kedua pihak menyetujui harga kontrak.</span>
              </div>
            )}
          </Card>

          {/* Card 2: Rincian Kesepakatan */}
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-base text-foreground">Rincian kesepakatan</h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-border/60">
                <span className="text-muted-foreground">Komoditas</span>
                <span className="font-bold text-foreground">{contract.volume.toLocaleString("id-ID")} kg {contract.grainType}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border/60">
                <span className="text-muted-foreground">Volume</span>
                <span className="font-bold text-foreground">{contract.volume.toLocaleString("id-ID")} kg</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border/60">
                <span className="text-muted-foreground">Harga per kg</span>
                <span className="font-bold text-foreground">Rp{contract.activePrice.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border/60">
                <span className="text-muted-foreground">Periode berlaku</span>
                <span className="font-bold text-foreground">12 Okt - 9 Nov 2026</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground font-semibold">Nilai komoditas</span>
                <span className="font-extrabold text-base text-foreground">{formatRupiah(totalValue)}</span>
              </div>
            </div>

            <p className="pt-2 border-t border-border/60 text-[11px] text-muted-foreground leading-relaxed">
              Nilai komoditas = {contract.volume.toLocaleString("id-ID")} kg × Rp{contract.activePrice.toLocaleString("id-ID")}/kg. Biaya lain tidak tercantum pada acuan.
            </p>
          </Card>

          {/* Counter-Offer Box with PriceRangeSlider */}
          {showCounterBox && (
            <Card className="p-6 space-y-4 border-2 border-primary/40 bg-card">
              <div>
                <h4 className="font-bold text-base text-foreground">
                  Ajukan Negosiasi Ulang Harga (Rp / kg)
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Pilih nominal harga menggunakan sistem slider dengan batas toleransi warna.
                </p>
              </div>

              <form onSubmit={handleSendCounterOffer} className="space-y-4">
                <PriceRangeSlider
                  value={counterPriceInput}
                  min={5000}
                  max={8500}
                  lowerBound={benchmark.lowerBound}
                  upperBound={benchmark.upperBound}
                  tolerancePercent={0.05}
                  onChange={(val) => setCounterPriceInput(val)}
                  label="Tawaran Harga Balik Baru"
                />

                {counterLampEval.status === "MERAH" && (
                  <PriceAcknowledgement
                    checked={counterPriceAcknowledged}
                    onChange={setCounterPriceAcknowledged}
                    price={counterPriceInput}
                    lowerBound={benchmark.lowerBound}
                  />
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCounterBox(false)}
                    className="text-xs"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={counterLampEval.status === "MERAH" && !counterPriceAcknowledged}
                    className="gap-2 text-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim Penawaran Harga</span>
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Negotiation Price History Timeline */}
          {contract.priceHistory && contract.priceHistory.length > 0 && (
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-primary" />
                <h4 className="font-bold text-sm text-foreground">
                  Riwayat Negosiasi Harga
                </h4>
              </div>

              <div className="space-y-3">
                {contract.priceHistory.map((item) => (
                  <div
                    key={item.version}
                    className="p-3 rounded-lg border border-border/70 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">Putaran #{item.version}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-secondary text-secondary-foreground">
                          {item.proposedByRole === "petani" ? "Tawaran Petani" : "Tawaran Pembeli"}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{item.proposedAt}</p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-sm text-foreground">Rp{item.price.toLocaleString("id-ID")}/kg</p>
                      <PriceLampBadge status={item.lampStatus} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right Column: Pemeriksaan Harga & Checklist (~5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card 1: Pemeriksaan Harga */}
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-base text-foreground">Pemeriksaan harga</h3>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EAF1E7] text-[#2D4828] dark:bg-primary/20 dark:text-primary-foreground text-xs font-semibold border border-primary/20">
              <Check className="w-3.5 h-3.5" />
              <span>Hijau · dalam rentang wajar</span>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Harga dalam kontrak</p>
              <p className="font-display text-3xl font-extrabold text-foreground tracking-tight">
                Rp{contract.activePrice.toLocaleString("id-ID")} <span className="text-sm font-normal text-muted-foreground">/kg</span>
              </p>
            </div>

            <div className="pt-3 border-t border-border/80 space-y-1">
              <p className="text-xs text-muted-foreground">Rentang wajar GKP</p>
              <p className="font-bold text-sm text-[#246447] dark:text-[#A9D6B0]">
                Rp{benchmark.lowerBound.toLocaleString("id-ID")} - {benchmark.upperBound.toLocaleString("id-ID")}/kg
              </p>
              <p className="text-[11px] text-muted-foreground pt-1">
                Harga kontrak berada dalam rentang wajar di acuan.
              </p>
            </div>
          </Card>

          {/* Card 2: Sebelum Menyetujui */}
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-base text-foreground">Sebelum menyetujui</h3>

            <div className="space-y-3 text-xs">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.identity}
                  onChange={(e) => setChecklist({ ...checklist, identity: e.target.checked })}
                  className="rounded border-border text-primary focus:ring-primary mt-0.5"
                />
                <span className="text-muted-foreground font-medium">Pastikan identitas kedua pihak benar.</span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.quality}
                  onChange={(e) => setChecklist({ ...checklist, quality: e.target.checked })}
                  className="rounded border-border text-primary focus:ring-primary mt-0.5"
                />
                <span className="text-muted-foreground font-medium">Konfirmasi mutu dan penimbangan.</span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.delivery}
                  onChange={(e) => setChecklist({ ...checklist, delivery: e.target.checked })}
                  className="rounded border-border text-primary focus:ring-primary mt-0.5"
                />
                <span className="text-muted-foreground font-medium">Sepakati angkut, pembayaran, dan potongan secara tertulis.</span>
              </label>
            </div>

            <p className="pt-3 border-t border-border/60 text-[11px] text-muted-foreground leading-relaxed">
              Status hijau menilai harga, bukan menjamin semua syarat kontrak.
            </p>
          </Card>
        </div>
      </div>

      {/* Bottom Action Bar matching mockup */}
      <Card className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border/80">
        <div>
          <p className="text-xs font-semibold text-foreground">
            {isMenunggu
              ? "Siap dengan isi kesepakatan?"
              : isDisetujui
              ? "Tahap Penyelesaian & Pengambilan Gabah"
              : "Status Kontrak Selesai / Ditutup"}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {isMenunggu
              ? "Persetujuan Anda akan diteruskan kepada pihak lain."
              : isDisetujui
              ? "Konfirmasikan bila gabah telah ditimbang dan diserahterimakan."
              : "Transaksi simulasi telah berakhir dan tersimpan dalam arsip."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-end sm:self-auto">
          {/* Waiting stage actions */}
          {isMenunggu && !isAdmin && (
            <>
              {isFarmer && contract.priceHistory.length <= 1 && (
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => setModalAction("reject")}
                  className="text-xs text-destructive hover:bg-destructive/10"
                >
                  Tolak Pesanan
                </Button>
              )}

              <Button
                variant="outline"
                size="default"
                onClick={() => setShowCounterBox(true)}
                className="text-xs"
              >
                Negosiasi ulang
              </Button>

              {canAcceptPrice && (
                <div className="flex flex-col items-end">
                  <Button
                    size="default"
                    onClick={handleAcceptPrice}
                    className="text-xs gap-1.5 shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Terima Rp{contract.activePrice.toLocaleString("id-ID")}/kg</span>
                  </Button>
                  <span className="text-[10px] text-muted-foreground mt-0.5">
                    Putaran #{contract.priceHistory.length}
                  </span>
                </div>
              )}
            </>
          )}

          {/* Agreed stage actions */}
          {isDisetujui && !isAdmin && (
            <>
              <Button
                variant="outline"
                size="default"
                onClick={() => setModalAction("cancel")}
                className="text-xs text-destructive hover:bg-destructive/10"
              >
                Batalkan
              </Button>

              {!myConfirmationDone ? (
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                  <span className="text-[11px] font-medium text-muted-foreground">
                    Status: {confirmationsCount}/2 Diselesaikan
                  </span>
                  <Button
                    size="default"
                    onClick={handleConfirmCompletion}
                    className="text-xs gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Konfirmasi Selesai</span>
                  </Button>
                </div>
              ) : (
                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-right">
                  <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                    Anda sudah mengonfirmasi (1/2)
                  </p>
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                    Menunggu konfirmasi penyelesaian dari {otherPartyName}.
                  </p>
                </div>
              )}
            </>
          )}

          {/* Admin supervisor indicator */}
          {isAdmin && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-lg">
              <Lock className="w-3.5 h-3.5" />
              <span>Mode Pengawasan Admin (Hanya Memantau)</span>
            </div>
          )}
        </div>
      </Card>

      {/* Disclaimer */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
        <Info className="w-3.5 h-3.5 shrink-0" />
        <span>
          Data dari gambar acuan untuk simulasi desain. Bukan harga langsung atau pembaruan pasar.
        </span>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalAction !== null}
        onCancel={() => setModalAction(null)}
        onConfirm={handleModalSubmit}
        title={modalAction === "cancel" ? "Batalkan Kontrak Simulasi" : "Tolak Pesanan Pembeli"}
        description={
          modalAction === "cancel"
            ? "Membatalkan kontrak akan melepaskan volume gabah kembali ke stok yang tersedia dan mencatat alasan pembatalan ini di dalam log sistem."
            : "Menolak pesanan akan mengembalikan volume yang dicadangkan ke stok tawaran panen Anda."
        }
        confirmText={modalAction === "cancel" ? "Ya, Batalkan Kontrak" : "Ya, Tolak Pesanan"}
        cancelText="Batal"
        variant="danger"
        requireReason={true}
      />

      {/* Simulation Receipt Modal */}
      <SimulationReceiptModal
        contract={contract}
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
      />
    </div>
  )
}
