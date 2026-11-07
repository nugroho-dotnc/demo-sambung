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
  Edit3
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
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <p className="text-muted-foreground">Tawaran panen #{offerId} tidak ditemukan.</p>
        <Button onClick={onBack}>Kembali ke Tawaran Saya</Button>
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

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Breadcrumb & Navigation */}
      <div>
        <div className="flex items-center justify-between">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="font-medium">Sambung</span>
            <span className="text-muted-foreground/60">/</span>
            <button onClick={onBack} className="font-medium hover:text-foreground hover:underline cursor-pointer">Tawaran Saya</button>
            <span className="text-muted-foreground/60">/</span>
            <span className="font-semibold text-foreground font-mono">#{offer.id}</span>
          </nav>

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
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Detail Tawaran #{offer.id}
              </h1>
              <Badge variant={isWithdrawn ? "muted" : "default"}>
                {offer.publicationStatus.toUpperCase()}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Komoditas {offer.grainType} ({offer.grainType === "GKP" ? "Gabah Kering Panen" : "Gabah Kering Giling"}) · Lokasi {offer.regency}, {offer.province}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <PriceLampBadge status={lamp.status} size="default" />
          </div>
        </div>
      </div>

      {/* Moderation Notice if any (C18) */}
      {offer.moderationStatus === "Sedang diminta perbaikan" && (
        <Card className="p-4 bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-xs">Pemberitahuan Peninjauan / Moderasi Admin</p>
                <p className="text-xs mt-0.5">{offer.moderationIssue || "Ada data tawaran yang perlu diperbaiki sebelum pesanan lanjutan."}</p>
                {reportedFixed && (
                  <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 mt-1">
                    ✓ Anda telah menyatakan perbaikan sudah dilakukan. Menunggu review Admin.
                  </p>
                )}
              </div>
            </div>

            {!reportedFixed && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleMarkFixed}
                className="shrink-0 text-xs border-amber-400 text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/40"
              >
                Sudah Diperbaiki
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
          <Card className="p-6 space-y-4">
            <h2 className="font-bold text-base text-foreground">Distribusi dan Invarian Volume</h2>
            <p className="text-xs text-muted-foreground">
              Tersedia = Total ({offer.totalVolume.toLocaleString("id-ID")} kg) - Reservasi ({offer.reservedVolume.toLocaleString("id-ID")} kg) - Disetujui ({offer.agreedVolume.toLocaleString("id-ID")} kg) - Selesai ({offer.completedVolume.toLocaleString("id-ID")} kg)
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Tersedia</span>
                <p className="font-mono text-xl font-bold text-primary mt-1">
                  {offer.availableVolume.toLocaleString("id-ID")}
                </p>
                <span className="text-[10px] text-muted-foreground">kg siap pesan</span>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">Reservasi</span>
                <p className="font-mono text-xl font-bold text-amber-800 dark:text-amber-300 mt-1">
                  {offer.reservedVolume.toLocaleString("id-ID")}
                </p>
                <span className="text-[10px] text-muted-foreground">kg menunggu</span>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300">Disetujui</span>
                <p className="font-mono text-xl font-bold text-blue-800 dark:text-blue-300 mt-1">
                  {offer.agreedVolume.toLocaleString("id-ID")}
                </p>
                <span className="text-[10px] text-muted-foreground">kg sepakat</span>
              </div>

              <div className="p-3 rounded-xl bg-muted border border-border text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Selesai</span>
                <p className="font-mono text-xl font-bold text-foreground mt-1">
                  {offer.completedVolume.toLocaleString("id-ID")}
                </p>
                <span className="text-[10px] text-muted-foreground">kg terkirim</span>
              </div>
            </div>
          </Card>

          {/* Card 2: Spesifikasi & Parameter Mutu */}
          <Card className="p-6 space-y-4">
            <h2 className="font-bold text-base text-foreground">Spesifikasi Panen & Lokasi</h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-border/70">
                <span className="text-muted-foreground">Jenis Gabah</span>
                <span className="font-semibold text-foreground">{offer.grainType} ({offer.grainType === "GKP" ? "Panen" : "Giling"})</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/70">
                <span className="text-muted-foreground">Kadar Air</span>
                <span className="font-semibold text-foreground">
                  {typeof offer.moisturePercent === "number" ? `${offer.moisturePercent}%` : offer.moisturePercent}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/70">
                <span className="text-muted-foreground">Kadar Hampa / Kotoran</span>
                <span className="font-semibold text-foreground">
                  {typeof offer.impurityPercent === "number" ? `${offer.impurityPercent}%` : offer.impurityPercent}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/70">
                <span className="text-muted-foreground">Tanggal Siap Panen</span>
                <span className="font-semibold text-foreground">{offer.readyDate}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">Lokasi Pengambilan</span>
                <span className="font-semibold text-foreground">Kec. {offer.district}, {offer.regency}, {offer.province}</span>
              </div>
            </div>
          </Card>

          {/* Card 3: Daftar Pesanan / Kontrak Terkait */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-foreground">Pesanan & Kontrak Terkait</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Daftar transaksi yang berasal dari tawaran pasokan ini</p>
              </div>
              <Badge variant="outline">{relatedContracts.length} Transaksi</Badge>
            </div>

            {relatedContracts.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground border border-dashed rounded-xl">
                Belum ada pesanan yang masuk untuk tawaran ini.
              </div>
            ) : (
              <div className="space-y-2">
                {relatedContracts.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => onNavigate("contract-detail", c.id)}
                    className="p-3.5 rounded-xl border border-border/80 hover:border-primary/40 bg-card hover:bg-muted/40 transition-colors cursor-pointer flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-mono text-foreground">#{c.id}</span>
                        <span className="font-semibold text-foreground">{c.buyerName}</span>
                      </div>
                      <p className="text-muted-foreground text-[11px]">
                        Volume: {c.volume.toLocaleString("id-ID")} kg · Harga Aktif: {formatRupiah(c.activePrice)}/kg
                      </p>
                    </div>

                    <div className="text-right">
                      <Badge variant={c.status === "Disetujui" ? "default" : "muted"}>
                        {c.status}
                      </Badge>
                      <span className="block text-[10px] text-primary font-medium mt-1">Buka Detail →</span>
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
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-sm text-foreground">Acuan Harga Pasar (Jawa Timur)</h3>
            <div className="p-4 rounded-xl bg-muted/60 border border-border/80 space-y-2">
              <span className="text-xs text-muted-foreground">Harga Minta yang Ditetapkan:</span>
              <p className="font-mono text-2xl font-bold text-foreground">
                {formatRupiah(offer.askingPrice)}
                <span className="text-xs font-normal text-muted-foreground ml-1">/kg</span>
              </p>
              <div className="pt-2 border-t border-border/60 text-xs space-y-1 text-muted-foreground">
                <div className="flex justify-between">
                  <span>Rentang Acuan Wajar:</span>
                  <span className="font-semibold text-foreground">
                    {formatRupiah(benchmark.lowerBound)} - {formatRupiah(benchmark.upperBound)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Status Lampu:</span>
                  <PriceLampBadge status={lamp.status} size="sm" />
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate("price-board")}
              className="w-full text-xs"
            >
              Lihat Detail Papan Rantai Harga
            </Button>
          </Card>

          {/* Action Box sesuai Status Publikasi */}
          <Card className="p-6 space-y-4 border-2 border-primary/20">
            <h3 className="font-bold text-sm text-foreground">Tindakan Tawaran</h3>

            {isDraft && (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Tawaran ini masih berupa draf dan belum tampil di katalog publik pembeli.
                </p>
                <Button
                  onClick={() => onNavigate("create-offer")}
                  className="w-full gap-2 text-xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Lanjutkan & Terbitkan Draf</span>
                </Button>
              </div>
            )}

            {isPublished && (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Tawaran ini sedang aktif di katalog. Anda dapat menarik tawaran bila panen batal atau telah dialihkan.
                </p>
                <Button
                  variant="destructive"
                  onClick={() => setShowWithdrawConfirm(true)}
                  className="w-full gap-2 text-xs min-h-[44px]"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Tarik Tawaran dari Katalog</span>
                </Button>
              </div>
            )}

            {isWithdrawn && (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-muted text-xs text-muted-foreground">
                  Tawaran ini telah ditarik secara permanen dan tidak dapat diaktifkan kembali.
                </div>
                <Button
                  onClick={() => onNavigate("create-offer")}
                  className="w-full gap-2 text-xs"
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
