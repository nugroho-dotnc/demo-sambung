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
  Check,
  Calendar
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
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <p className="text-muted-foreground text-sm">Kontrak #{contractId} tidak ditemukan dalam sistem.</p>
        <Button onClick={onBack} size="sm">Kembali ke Daftar</Button>
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
    <div className="max-w-6xl mx-auto space-y-7 pb-14">
      {/* Breadcrumb & Navigation */}
      <div>
        <div className="flex items-center justify-between pb-2">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span>SAMBUNG</span>
            <span className="text-muted-foreground/50">/</span>
            <button onClick={onBack} className="hover:text-foreground hover:underline cursor-pointer">
              KONTRAK & PESANAN
            </button>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-primary font-mono font-bold">#{contract.id}</span>
          </nav>

          <button
            onClick={onBack}
            className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke daftar</span>
          </button>
        </div>

        <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/70">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Tinjau Kontrak Transaksi
              </h1>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-muted border border-border text-foreground">
                #{contract.id}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {isMenunggu
                ? "Periksa pihak penjual-pembeli, kuantitas komoditas, dan ajukan kesepakatan harga final."
                : isDisetujui
                ? "Kontrak telah disetujui bersama. Silakan koordinasikan pengambilan fisik dan penimbangan gabah."
                : "Arsip riwayat kontrak simulasi transaksi gabah digital."}
            </p>
          </div>

          <div className="self-start sm:self-auto flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-lg bg-muted text-foreground text-xs font-semibold border border-border">
              {contract.status === "Menunggu Kesepakatan" ? "Draf Negosiasi" : contract.status}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReceiptModal(true)}
              className="text-xs gap-1.5 border-border/80 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-primary" />
              <span>Cetak Bukti</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Stepper matching formal workflow */}
      <Card className="p-3 bg-card border-border/80 shadow-2xs rounded-2xl">
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className={`flex items-center gap-2.5 p-2.5 rounded-xl transition-all ${isMenunggu ? "bg-primary/10 border border-primary/20 text-primary font-semibold" : "text-muted-foreground"}`}>
            <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${isMenunggu ? "bg-primary text-white dark:text-[#182117]" : "bg-muted text-muted-foreground"}`}>1</span>
            <div>
              <p className="font-semibold text-foreground">1. Draf & Negosiasi</p>
              <p className="text-[10px] text-muted-foreground">{isMenunggu ? "Tahap Aktif" : "Selesai"}</p>
            </div>
          </div>

          <div className={`flex items-center gap-2.5 p-2.5 rounded-xl transition-all ${isDisetujui ? "bg-primary/10 border border-primary/20 text-primary font-semibold" : "text-muted-foreground"}`}>
            <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${isDisetujui ? "bg-primary text-white dark:text-[#182117]" : "bg-muted text-muted-foreground"}`}>2</span>
            <div>
              <p className="font-semibold text-foreground">2. Persetujuan Harga</p>
              <p className="text-[10px] text-muted-foreground">{isDisetujui ? "Tahap Aktif" : isSelesai ? "Selesai" : "Menunggu"}</p>
            </div>
          </div>

          <div className={`flex items-center gap-2.5 p-2.5 rounded-xl transition-all ${isSelesai ? "bg-primary/10 border border-primary/20 text-primary font-semibold" : "text-muted-foreground"}`}>
            <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${isSelesai ? "bg-primary text-white dark:text-[#182117]" : "bg-muted text-muted-foreground"}`}>3</span>
            <div>
              <p className="font-semibold text-foreground">3. Serah Terima Fisik</p>
              <p className="text-[10px] text-muted-foreground">{isSelesai ? "Selesai Penuh" : "Setelah disetujui"}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Main 2 Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Para Pihak & Rincian Kesepakatan (~7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Para Pihak */}
          <Card className="p-6 bg-card border-border/80 shadow-xs space-y-4 rounded-2xl">
            <div>
              <h3 className="font-bold text-base text-foreground">Para Pihak Bertransaksi</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Identitas produsen dan kelompok tani pada dokumen kesepakatan</p>
            </div>

            <div className="space-y-4 pt-1">
              {/* Penjual */}
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary mt-0.5">
                  <Sprout className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Pihak Penjual (Petani)
                  </span>
                  <p className="text-sm font-bold text-foreground mt-0.5">
                    {contract.farmerName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Kab. Ngawi, Jawa Timur · ID Anggota #{contract.farmerId}
                  </p>
                  {isPhoneVisible && contract.farmerPhone ? (
                    <p className="text-xs font-mono font-bold text-primary mt-1.5 flex items-center gap-1.5 bg-primary/5 px-2.5 py-1 rounded-lg w-fit">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{contract.farmerPhone}</span>
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="border-t border-border/70" />

              {/* Pembeli */}
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-secondary text-secondary-foreground mt-0.5 border border-border/60">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Pihak Pembeli (Penggilingan / Usaha Beras)
                  </span>
                  <p className="text-sm font-bold text-foreground mt-0.5">
                    {contract.buyerName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Kab. Madiun, Jawa Timur · ID Anggota #{contract.buyerId}
                  </p>
                  {isPhoneVisible && contract.buyerPhone ? (
                    <p className="text-xs font-mono font-bold text-primary mt-1.5 flex items-center gap-1.5 bg-primary/5 px-2.5 py-1 rounded-lg w-fit">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{contract.buyerPhone}</span>
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            {!isPhoneVisible && !isTerminal && (
              <div className="p-3.5 rounded-xl bg-muted/40 border border-border/70 text-[11px] text-muted-foreground flex items-center gap-2.5 leading-relaxed">
                <Lock className="w-4 h-4 text-primary shrink-0" />
                <span>Nomor telepon dan koordinat presisi terlindungi dan terbuka otomatis segera setelah kedua pihak menyetujui nominal harga.</span>
              </div>
            )}
          </Card>

          {/* Card 2: Rincian Kesepakatan */}
          <Card className="p-6 bg-card border-border/80 shadow-xs space-y-4 rounded-2xl">
            <h3 className="font-bold text-base text-foreground">Rincian Komoditas & Kesepakatan</h3>

            <div className="divide-y divide-border/60 text-xs">
              <div className="flex justify-between items-center py-2.5">
                <span className="text-muted-foreground">Jenis Komoditas</span>
                <span className="font-bold text-foreground">{contract.grainType} ({contract.grainType === "GKP" ? "Gabah Kering Panen" : "Gabah Kering Giling"})</span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="text-muted-foreground">Volume Transaksi</span>
                <span className="font-bold font-mono text-foreground">{contract.volume.toLocaleString("id-ID")} kg</span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="text-muted-foreground">Harga Satuan Aktif</span>
                <span className="font-bold font-mono text-primary text-sm">{formatRupiah(contract.activePrice)} /kg</span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="text-muted-foreground">Periode Pelaksanaan</span>
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  <span>12 Okt – 9 Nov 2026</span>
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-muted-foreground font-semibold">Total Nilai Transaksi</span>
                <span className="font-mono text-xl font-bold text-primary">{formatRupiah(totalValue)}</span>
              </div>
            </div>

            <p className="pt-2 border-t border-border/60 text-[11px] text-muted-foreground leading-relaxed">
              Total Nilai = {contract.volume.toLocaleString("id-ID")} kg × {formatRupiah(contract.activePrice)}/kg. Seluruh pembayaran dan logistik diatur langsung antar pihak tanpa biaya perantara platform.
            </p>
          </Card>

          {/* Counter-Offer Box with PriceRangeSlider */}
          {showCounterBox && (
            <Card className="p-6 space-y-4 border-2 border-primary/40 bg-card rounded-2xl shadow-md">
              <div>
                <h4 className="font-bold text-base text-foreground">
                  Ajukan Negosiasi Ulang Harga (Rp / kg)
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Pilih nominal harga menggunakan sistem slider dengan visualisasi lampu toleransi.
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
                    className="text-xs border-border/80"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={counterLampEval.status === "MERAH" && !counterPriceAcknowledged}
                    className="gap-2 text-xs font-semibold shadow-xs"
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
            <Card className="p-6 space-y-4 bg-card border-border/80 shadow-xs rounded-2xl">
              <div className="flex items-center gap-2 pb-2 border-b border-border/70">
                <History className="w-4 h-4 text-primary" />
                <h4 className="font-bold text-sm text-foreground">
                  Riwayat Negosiasi Harga ({contract.priceHistory.length} Putaran)
                </h4>
              </div>

              <div className="space-y-3">
                {contract.priceHistory.map((item) => (
                  <div
                    key={item.version}
                    className="p-3.5 rounded-xl border border-border/70 bg-muted/20 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-foreground">Putaran #{item.version}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-secondary text-secondary-foreground">
                          {item.proposedByRole === "petani" ? "Diajukan Petani" : "Diajukan Pembeli"}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{item.proposedAt}</p>
                    </div>

                    <div className="text-right">
                      <p className="font-mono font-bold text-sm text-foreground">{formatRupiah(item.price)}/kg</p>
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
          <Card className="p-6 bg-card border-border/80 shadow-xs space-y-4 rounded-2xl">
            <h3 className="font-bold text-base text-foreground">Pemeriksaan Kewajaran Harga</h3>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-500/20">
              <Check className="w-3.5 h-3.5" />
              <span>Status Hijau · Dalam Rentang Wajar</span>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Harga Aktif dalam Kontrak</p>
              <p className="font-display text-3xl font-bold font-mono text-primary tracking-tight tabular-nums">
                {formatRupiah(contract.activePrice)} <span className="text-xs font-sans font-normal text-muted-foreground">/kg</span>
              </p>
            </div>

            <div className="pt-3 border-t border-border/70 space-y-1.5">
              <p className="text-[11px] text-muted-foreground font-semibold">Rentang Acuan Model GKP (Jawa Timur)</p>
              <p className="font-mono font-bold text-sm text-foreground">
                {formatRupiah(benchmark.lowerBound)} – {formatRupiah(benchmark.upperBound)} /kg
              </p>
              <p className="text-[11px] text-muted-foreground pt-1 leading-relaxed">
                Harga kontrak berada dalam batas toleransi acuan resmi BPS & Badan Pangan Nasional.
              </p>
            </div>
          </Card>

          {/* Card 2: Sebelum Menyetujui */}
          <Card className="p-6 bg-card border-border/80 shadow-xs space-y-4 rounded-2xl">
            <h3 className="font-bold text-base text-foreground">Daftar Periksa Kesepakatan</h3>

            <div className="space-y-3 text-xs">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.identity}
                  onChange={(e) => setChecklist({ ...checklist, identity: e.target.checked })}
                  className="rounded border-input text-primary focus:ring-primary mt-0.5"
                />
                <span className="text-muted-foreground font-medium">Verifikasi identitas kedua belah pihak sudah benar.</span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.quality}
                  onChange={(e) => setChecklist({ ...checklist, quality: e.target.checked })}
                  className="rounded border-input text-primary focus:ring-primary mt-0.5"
                />
                <span className="text-muted-foreground font-medium">Konfirmasi kadar air, kadar hampa, dan timbangan gabah.</span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.delivery}
                  onChange={(e) => setChecklist({ ...checklist, delivery: e.target.checked })}
                  className="rounded border-input text-primary focus:ring-primary mt-0.5"
                />
                <span className="text-muted-foreground font-medium">Sepakati jadwal angkut, metode pembayaran, dan armada penjemputan.</span>
              </label>
            </div>

            <p className="pt-3 border-t border-border/70 text-[11px] text-muted-foreground leading-relaxed">
              Indikator hijau menilai kewajaran harga secara komparatif, dan tidak menggantikan inspeksi fisik komoditas di lapangan.
            </p>
          </Card>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <Card className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border-border/80 rounded-2xl shadow-xs">
        <div>
          <p className="text-xs font-bold text-foreground">
            {isMenunggu
              ? "Siap menyepakati tawaran harga saat ini?"
              : isDisetujui
              ? "Tahap Penyelesaian & Pengambilan Fisik Gabah"
              : "Status Dokumen Kontrak Selesai / Ditutup"}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {isMenunggu
              ? "Persetujuan Anda akan mengikat harga kontrak dan membuka kontak telepon."
              : isDisetujui
              ? "Konfirmasikan bila gabah telah selesai ditimbang dan diserahterimakan."
              : "Transaksi simulasi telah berakhir dan tersimpan dalam audit log."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-end sm:self-auto">
          {/* Waiting stage actions */}
          {isMenunggu && !isAdmin && (
            <>
              {isFarmer && contract.priceHistory.length <= 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setModalAction("reject")}
                  className="text-xs text-destructive hover:bg-destructive/10 border-border/80"
                >
                  Tolak Pesanan
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCounterBox(true)}
                className="text-xs border-border/80"
              >
                Negosiasi Ulang
              </Button>

              {canAcceptPrice && (
                <div className="flex flex-col items-end">
                  <Button
                    size="sm"
                    onClick={handleAcceptPrice}
                    className="text-xs gap-1.5 font-bold shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Terima {formatRupiah(contract.activePrice)}/kg</span>
                  </Button>
                  <span className="text-[10px] text-muted-foreground font-mono mt-0.5">
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
                size="sm"
                onClick={() => setModalAction("cancel")}
                className="text-xs text-destructive hover:bg-destructive/10 border-border/80"
              >
                Batalkan
              </Button>

              {!myConfirmationDone ? (
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                  <span className="text-[11px] font-medium text-muted-foreground font-mono">
                    Status: {confirmationsCount}/2 Diselesaikan
                  </span>
                  <Button
                    size="sm"
                    onClick={handleConfirmCompletion}
                    className="text-xs gap-1.5 font-semibold shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Konfirmasi Selesai</span>
                  </Button>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-right">
                  <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                    Anda sudah konfirmasi (1/2)
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
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-lg border border-border">
              <Lock className="w-3.5 h-3.5" />
              <span>Mode Pengawasan Admin (Hanya Memantau)</span>
            </div>
          )}
        </div>
      </Card>

      {/* Disclaimer */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
        <Info className="w-3.5 h-3.5 shrink-0" />
        <span>
          Data dari simulasi desain platform SAMBUNG. Menjamin validitas alur kontraktual tanpa manipulasi harga.
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
