import { useState } from "react"
import { useSambungStore } from "@/store/sambungStore"
import { formatRupiah } from "@/lib/utils"
import { calculateFairPrice, evaluatePriceLamp } from "@/lib/priceEngine"
import { PriceLampBadge } from "@/components/domain/PriceLampBadge"
import { ConfirmationModal } from "@/components/domain/ConfirmationModal"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  AlertCircle,
  Trash2,
  Edit3,
  Calendar,
  MapPin,
  CheckCircle2,
  TrendingUp,
  FileText,
  ChevronRight
} from "lucide-react"

interface PetaniOfferDetailPageProps {
  offerId: string
  onBack: () => void
  onNavigate: (tab: string, targetId?: string) => void
}

export function PetaniOfferDetailPage({ offerId, onBack, onNavigate }: PetaniOfferDetailPageProps) {
  const { offers, contracts, withdrawOffer } = useSambungStore()
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false)
  const [reportedFixed, setReportedFixed] = useState(false)

  const offer = offers.find((o) => o.id === offerId)

  if (!offer) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <p className="text-muted-foreground text-sm">Tawaran panen #{offerId} tidak ditemukan dalam catatan sistem.</p>
        <Button onClick={onBack} size="sm">Kembali ke Tawaran Saya</Button>
      </div>
    )
  }

  const relatedContracts = contracts.filter((c) => c.offerId === offer.id)
  const isWithdrawn = offer.publicationStatus === "Ditarik"
  const isDraft = (offer.publicationStatus as string) === "Draf"
  const isPublished = offer.publicationStatus === "Terbit"

  const rendemen = offer.grainType === "GKP" ? 0.5338 : 0.63
  const benchmark = calculateFairPrice(offer.grainType, offer.province, 13500, rendemen)
  const lamp = evaluatePriceLamp(offer.askingPrice, benchmark.lowerBound, benchmark.upperBound)

  const waitingOrdersCount = relatedContracts.filter((c) => c.status === "Menunggu Kesepakatan").length
  const agreedOrdersCount = relatedContracts.filter((c) => c.status === "Disetujui").length

  const handleWithdraw = () => {
    withdrawOffer(offer.id)
    setShowWithdrawConfirm(false)
    alert("Tawaran panen berhasil ditarik. Semua pesanan yang masih 'Menunggu' dibatalkan otomatis.")
  }

  const handleMarkFixed = () => {
    setReportedFixed(true)
    alert("Laporan perbaikan berhasil dikirim ke Admin. Penanda akan ditinjau kembali.")
  }

  // Volume segment shares
  const total = Math.max(1, offer.totalVolume)
  const availPct = Math.round((offer.availableVolume / total) * 100)
  const resPct = Math.round((offer.reservedVolume / total) * 100)
  const agreedPct = Math.round(((offer.agreedVolume + offer.completedVolume) / total) * 100)

  return (
    <div className="max-w-6xl mx-auto space-y-7 pb-14">
      {/* Breadcrumb & Navigation */}
      <div>
        <div className="flex items-center justify-between pb-2">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Sambung</span>
            <span className="text-muted-foreground/50">/</span>
            <button onClick={onBack} className="hover:text-foreground hover:underline cursor-pointer">Tawaran Panen</button>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-primary font-mono font-bold">#{offer.id}</span>
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
                Detail Tawaran Panen
              </h1>
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-muted border border-border text-foreground">
                #{offer.id}
              </span>
              <Badge variant={isWithdrawn ? "outline" : "default"} className="font-bold text-xs">
                {offer.publicationStatus.toUpperCase()}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Komoditas {offer.grainType} ({offer.grainType === "GKP" ? "Gabah Kering Panen" : "Gabah Kering Giling"}) · {offer.regency}, {offer.province}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <PriceLampBadge status={lamp.status} size="default" />
          </div>
        </div>
      </div>

      {/* Moderation Notice if any (C18) */}
      {offer.moderationStatus === "Sedang diminta perbaikan" && (
        <Card className="p-4 bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-xs uppercase tracking-wider text-amber-950 dark:text-amber-200">
                  Pemberitahuan Peninjauan / Moderasi Admin
                </p>
                <p className="text-xs leading-relaxed text-amber-900 dark:text-amber-300">
                  {offer.moderationIssue || "Ada data tawaran yang perlu diperbaiki sebelum pesanan lanjutan dapat diproses."}
                </p>
                {reportedFixed && (
                  <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Anda telah menyatakan perbaikan sudah dilakukan. Menunggu konfirmasi peninjau.</span>
                  </p>
                )}
              </div>
            </div>

            {!reportedFixed && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleMarkFixed}
                className="shrink-0 text-xs border-amber-400/80 text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/40"
              >
                Tandai Sudah Diperbaiki
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Main 2-Column Grid 7:5 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Data Panen & Distribusi Volume */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Distribusi Volume (C11) */}
          <Card className="p-6 bg-card border-border/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-base text-foreground">Distribusi & Invarian Volume</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Total Volume Terdaftar: <strong className="font-mono text-foreground">{offer.totalVolume.toLocaleString("id-ID")} kg</strong>
                </p>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                Status: {offer.availableVolume > 0 ? "Tersedia" : "Penuh Terpesan"}
              </span>
            </div>

            {/* Visual segmented progress bar */}
            <div className="h-3 w-full rounded-full bg-muted/80 overflow-hidden flex p-0.5 gap-0.5">
              {availPct > 0 && (
                <div
                  style={{ width: `${availPct}%` }}
                  className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-sm"
                  title={`Tersedia: ${offer.availableVolume} kg (${availPct}%)`}
                />
              )}
              {resPct > 0 && (
                <div
                  style={{ width: `${resPct}%` }}
                  className="h-full bg-amber-500 rounded-sm"
                  title={`Reservasi: ${offer.reservedVolume} kg (${resPct}%)`}
                />
              )}
              {agreedPct > 0 && (
                <div
                  style={{ width: `${agreedPct}%` }}
                  className="h-full bg-primary/70 rounded-sm"
                  title={`Disetujui/Selesai: ${offer.agreedVolume + offer.completedVolume} kg (${agreedPct}%)`}
                />
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">Tersedia</span>
                <p className="font-mono text-xl font-bold text-emerald-800 dark:text-emerald-300 mt-1 tabular-nums">
                  {offer.availableVolume.toLocaleString("id-ID")}
                </p>
                <span className="text-[10px] text-muted-foreground">kg siap pesan</span>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">Reservasi</span>
                <p className="font-mono text-xl font-bold text-amber-800 dark:text-amber-300 mt-1 tabular-nums">
                  {offer.reservedVolume.toLocaleString("id-ID")}
                </p>
                <span className="text-[10px] text-muted-foreground">kg menunggu</span>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300">Disetujui</span>
                <p className="font-mono text-xl font-bold text-blue-800 dark:text-blue-300 mt-1 tabular-nums">
                  {offer.agreedVolume.toLocaleString("id-ID")}
                </p>
                <span className="text-[10px] text-muted-foreground">kg sepakat</span>
              </div>

              <div className="p-3.5 rounded-xl bg-muted/60 border border-border text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Selesai</span>
                <p className="font-mono text-xl font-bold text-foreground mt-1 tabular-nums">
                  {offer.completedVolume.toLocaleString("id-ID")}
                </p>
                <span className="text-[10px] text-muted-foreground">kg terkirim</span>
              </div>
            </div>
          </Card>

          {/* Card 2: Spesifikasi & Parameter Mutu */}
          <Card className="p-6 bg-card border-border/80 shadow-xs space-y-4">
            <h2 className="font-bold text-base text-foreground">Spesifikasi Panen & Lokasi Pengambilan</h2>

            <div className="divide-y divide-border/60 text-xs">
              <div className="flex justify-between py-2.5">
                <span className="text-muted-foreground">Jenis Gabah</span>
                <span className="font-semibold text-foreground">{offer.grainType} ({offer.grainType === "GKP" ? "Gabah Kering Panen" : "Gabah Kering Giling"})</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-muted-foreground">Kadar Air</span>
                <span className="font-semibold text-foreground font-mono">
                  {typeof offer.moisturePercent === "number" ? `${offer.moisturePercent}%` : offer.moisturePercent}
                </span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-muted-foreground">Kadar Hampa / Kotoran</span>
                <span className="font-semibold text-foreground font-mono">
                  {typeof offer.impurityPercent === "number" ? `${offer.impurityPercent}%` : offer.impurityPercent}
                </span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-muted-foreground">Tanggal Siap Panen</span>
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  <span>{offer.readyDate}</span>
                </span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-muted-foreground">Lokasi Pengambilan</span>
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span>Kec. {offer.district}, {offer.regency}, {offer.province}</span>
                </span>
              </div>
            </div>
          </Card>

          {/* Card 3: Daftar Pesanan / Kontrak Terkait */}
          <Card className="p-6 bg-card border-border/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-foreground">Pesanan & Kontrak Terkait</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Daftar transaksi yang diajukan pembeli untuk tawaran ini</p>
              </div>
              <Badge variant="outline" className="font-mono text-xs">
                {relatedContracts.length} Transaksi
              </Badge>
            </div>

            {relatedContracts.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground border border-dashed rounded-xl bg-muted/20">
                <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                <span>Belum ada pesanan yang masuk untuk tawaran ini.</span>
              </div>
            ) : (
              <div className="space-y-2.5">
                {relatedContracts.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => onNavigate("contract-detail", c.id)}
                    className="p-4 rounded-xl border border-border/80 hover:border-primary/50 bg-card hover:bg-muted/30 transition-all cursor-pointer flex items-center justify-between text-xs group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-mono text-foreground">#{c.id}</span>
                        <span className="font-semibold text-foreground">{c.buyerName}</span>
                        <span className="text-[10px] text-muted-foreground">· ID Pasokan: {c.offerId}</span>
                      </div>
                      <p className="text-muted-foreground text-[11px]">
                        Volume: <strong className="text-foreground font-mono">{c.volume.toLocaleString("id-ID")} kg</strong> · Harga Aktif: <strong className="text-primary font-mono">{formatRupiah(c.activePrice)}/kg</strong>
                      </p>
                    </div>

                    <div className="text-right flex items-center gap-3">
                      <Badge variant={c.status === "Disetujui" ? "default" : "outline"} className="text-xs">
                        {c.status}
                      </Badge>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column (5 cols): Harga & Acuan + Action Bar */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card: Acuan Harga Wajar (C06) */}
          <Card className="p-6 bg-card border-border/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground">Acuan Harga Wajar</h3>
              <span className="text-[11px] font-medium text-muted-foreground">{offer.province}</span>
            </div>

            <div className="p-4 rounded-xl bg-muted/40 border border-border/70 space-y-2.5">
              <span className="text-xs text-muted-foreground font-medium">Harga Minta yang Ditetapkan:</span>
              <p className="font-mono text-3xl font-bold text-primary tabular-nums">
                {formatRupiah(offer.askingPrice)}
                <span className="text-xs font-normal text-muted-foreground ml-1">/kg</span>
              </p>

              <div className="pt-2.5 border-t border-border/60 text-xs space-y-1.5 text-muted-foreground">
                <div className="flex justify-between">
                  <span>Rentang Acuan Wajar:</span>
                  <span className="font-semibold text-foreground font-mono">
                    {formatRupiah(benchmark.lowerBound)} - {formatRupiah(benchmark.upperBound)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Status Indikator:</span>
                  <PriceLampBadge status={lamp.status} size="sm" />
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate("price-board")}
              className="w-full text-xs gap-1.5 border-border/80"
            >
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              <span>Lihat Detail Papan Rantai Harga</span>
            </Button>
          </Card>

          {/* Action Box sesuai Status Publikasi */}
          <Card className="p-6 bg-card border-2 border-primary/20 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-foreground">Tindakan Publikasi</h3>

            {isDraft && (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Tawaran ini masih berupa draf dan belum tampil di katalog publik pembeli.
                </p>
                <Button
                  onClick={() => onNavigate("create-offer")}
                  className="w-full gap-2 text-xs font-semibold shadow-xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Lanjutkan & Terbitkan Draf</span>
                </Button>
              </div>
            )}

            {isPublished && (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Tawaran ini sedang aktif di katalog publik. Anda dapat menarik tawaran bila panen batal atau telah dialihkan ke pihak lain.
                </p>
                <Button
                  variant="destructive"
                  onClick={() => setShowWithdrawConfirm(true)}
                  className="w-full gap-2 text-xs font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Tarik Tawaran dari Katalog</span>
                </Button>
              </div>
            )}

            {isWithdrawn && (
              <div className="space-y-3">
                <div className="p-3.5 rounded-lg bg-muted text-xs text-muted-foreground leading-relaxed">
                  Tawaran ini telah ditarik secara permanen dan tidak dapat diaktifkan kembali.
                </div>
                <Button
                  onClick={() => onNavigate("create-offer")}
                  className="w-full gap-2 text-xs font-semibold"
                >
                  <span>Buat Tawaran Baru</span>
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Confirmation Modal for Withdrawal (C15 ImpactConfirm) */}
      <ConfirmationModal
        isOpen={showWithdrawConfirm}
        onCancel={() => setShowWithdrawConfirm(false)}
        onConfirm={handleWithdraw}
        title="Konfirmasi Penarikan Tawaran Panen"
        description={`Menarik tawaran #${offer.id} akan berdampak langsung: (1) Sebanyak ${waitingOrdersCount} pesanan berstatus 'Menunggu Kesepakatan' akan otomatis DIBATALKAN, (2) Stok dicadangkan (${offer.reservedVolume.toLocaleString("id-ID")} kg) dilepas, (3) Sebanyak ${agreedOrdersCount} kontrak yang telah 'Disetujui' TETAP BERJALAN. Tawaran yang ditarik tidak dapat diterbitkan kembali. Lanjutkan?`}
        confirmText="Tarik Tawaran Sekarang"
        cancelText="Batal"
        variant="danger"
      />
    </div>
  )
}
