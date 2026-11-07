import { useState } from "react"
import { useSambungStore } from "@/store/sambungStore"
import { formatRupiah } from "@/lib/utils"
import { calculateFairPrice, evaluatePriceLamp } from "@/lib/priceEngine"
import { PriceLampBadge } from "@/components/domain/PriceLampBadge"
import { ConfirmationModal } from "@/components/domain/ConfirmationModal"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sprout, PlusCircle, AlertCircle, Trash2, Calendar, MapPin, Eye } from "lucide-react"

interface MyOffersPageProps {
  onNavigate: (tab: string, targetId?: string) => void
}

export function MyOffersPage({ onNavigate }: MyOffersPageProps) {
  const { currentUser, offers, withdrawOffer } = useSambungStore()
  const [withdrawTargetId, setWithdrawTargetId] = useState<string | null>(null)

  // Filter only this farmer's offers (DEC-015a: farmer only sees their own offers)
  const myOffers = offers.filter((o) => o.farmerId === currentUser.id)
  const totalVolume = myOffers.reduce((acc, o) => acc + o.totalVolume, 0)
  const availableVolume = myOffers.reduce((acc, o) => acc + o.availableVolume, 0)
  const reservedVolume = myOffers.reduce((acc, o) => acc + o.reservedVolume, 0)

  const handleConfirmWithdraw = () => {
    if (withdrawTargetId) {
      withdrawOffer(withdrawTargetId)
      setWithdrawTargetId(null)
      alert("Tawaran panen berhasil ditarik. Semua pesanan yang menunggu kesepakatan otomatis dibatalkan.")
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
          <span className="font-medium">Sambung</span>
          <span className="text-muted-foreground/60">/</span>
          <span className="font-medium text-foreground">Tawaran Panen Saya</span>
        </nav>

        <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Daftar Tawaran Hasil Panen Saya
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Kelola volume, pantau pesanan yang masuk, dan tinjau status publikasi gabah Anda.
            </p>
          </div>

          <Button
            size="default"
            onClick={() => onNavigate("create-offer")}
            className="self-start sm:self-auto gap-2 text-xs font-semibold shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Jual hasil panen</span>
          </Button>
        </div>
      </div>

      {/* Quick Summary KPIs */}
      {myOffers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 bg-card border border-border/80 space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Total Volume Ditawarkan
            </span>
            <p className="font-mono text-2xl font-bold text-foreground">
              {totalVolume.toLocaleString("id-ID")} kg
            </p>
            <p className="text-[10px] text-muted-foreground">Dari {myOffers.length} publikasi panen Anda</p>
          </Card>
          <Card className="p-4 bg-card border border-border/80 space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Stok Siap Dipesan
            </span>
            <p className="font-mono text-2xl font-bold text-primary">
              {availableVolume.toLocaleString("id-ID")} kg
            </p>
            <p className="text-[10px] text-muted-foreground">Tersedia untuk calon pembeli</p>
          </Card>
          <Card className="p-4 bg-card border border-border/80 space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Sedang Dipesan
            </span>
            <p className="font-mono text-2xl font-bold text-amber-700 dark:text-amber-400">
              {reservedVolume.toLocaleString("id-ID")} kg
            </p>
            <p className="text-[10px] text-muted-foreground">Menunggu persetujuan kontrak</p>
          </Card>
        </div>
      )}

      {/* Offers List */}
      <div className="space-y-6">
        {myOffers.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-2">
            <Sprout className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-60" />
            <h3 className="text-lg font-bold text-foreground">Belum Ada Tawaran Panen</h3>
            <p className="text-body-sm text-muted-foreground mt-1 max-w-md mx-auto">
              Anda belum menerbitkan tawaran panen. Terbitkan hasil panen Anda agar penggilingan dan pembeli dapat memesan.
            </p>
            <Button
              className="mt-6 gap-2 font-bold"
              onClick={() => onNavigate("create-offer")}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Buat Tawaran Pertama</span>
            </Button>
          </Card>
        ) : (
          myOffers.map((offer) => {
            const isWithdrawn = offer.publicationStatus === "Ditarik"
            const estimate = calculateFairPrice(
              offer.grainType,
              offer.province,
              13500,
              offer.grainType === "GKP" ? 0.52 : 0.63
            )
            const lamp = evaluatePriceLamp(offer.askingPrice, estimate.lowerBound, estimate.upperBound)

            return (
              <Card
                key={offer.id}
                className={`border overflow-hidden transition-all ${
                  isWithdrawn ? "opacity-70 bg-muted/30 border-border" : "border-border shadow-sm hover:border-primary/40"
                }`}
              >
                <CardHeader className="bg-muted/40 p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-xs font-bold bg-card border px-2.5 py-1 rounded-md text-foreground">
                      #{offer.id}
                    </span>
                    <Badge variant={isWithdrawn ? "muted" : "default"} className="font-bold">
                      {offer.publicationStatus.toUpperCase()}
                    </Badge>
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-secondary text-secondary-foreground">
                      {offer.grainType} ({offer.grainType === "GKP" ? "Panen" : "Giling"})
                    </span>
                    <PriceLampBadge status={lamp.status} size="sm" />
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>Diterbitkan: {new Date(offer.createdAt).toLocaleDateString("id-ID")}</span>
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  {/* Moderation Alert if any (DEC-013f) */}
                  {offer.moderationStatus === "Sedang diminta perbaikan" && (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-start gap-3 text-xs leading-relaxed">
                      <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Catatan Perbaikan dari Pengelola / Admin:</p>
                        <p className="mt-0.5">{offer.moderationIssue}</p>
                      </div>
                    </div>
                  )}

                  {/* Main Grid: Price, Volume Breakdown, Quality */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* 1. Price */}
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground font-semibold">Harga Minta Petani</span>
                      <p className="text-2xl font-extrabold font-mono text-primary">
                        {formatRupiah(offer.askingPrice)}
                        <span className="text-xs font-normal text-muted-foreground ml-1">/kg</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Acuan pasar: {formatRupiah(estimate.lowerBound)}  -  {formatRupiah(estimate.upperBound)}
                      </p>
                    </div>

                    {/* 2. Volume Breakdown (BR-003) */}
                    <div className="space-y-2 md:border-x md:border-border md:px-6">
                      <span className="text-xs text-muted-foreground font-semibold">Distribusi Volume Gabah</span>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-foreground font-medium">Tersedia untuk Pesanan:</span>
                          <span className="font-mono font-bold text-primary">
                            {offer.availableVolume.toLocaleString("id-ID")} kg
                          </span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Dicadangkan (Menunggu):</span>
                          <span className="font-mono">{offer.reservedVolume.toLocaleString("id-ID")} kg</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Kontrak Disetujui:</span>
                          <span className="font-mono">{offer.agreedVolume.toLocaleString("id-ID")} kg</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Selesai Terkonfirmasi:</span>
                          <span className="font-mono">{offer.completedVolume.toLocaleString("id-ID")} kg</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-border font-bold text-foreground">
                          <span>Total Volume Awal:</span>
                          <span className="font-mono">{offer.totalVolume.toLocaleString("id-ID")} kg</span>
                        </div>
                      </div>
                    </div>

                    {/* 3. Location & Quality Details */}
                    <div className="space-y-2 text-xs">
                      <span className="text-xs text-muted-foreground font-semibold">Spesifikasi & Lokasi</span>
                      <div className="flex items-center gap-1.5 text-foreground font-medium">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>Kec. {offer.district}, {offer.regency}, {offer.province}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-muted/60 space-y-1 text-muted-foreground">
                        <p>Kadar Air: <strong className="text-foreground">{typeof offer.moisturePercent === "number" ? `${offer.moisturePercent}%` : offer.moisturePercent}</strong></p>
                        <p>Kadar Hampa: <strong className="text-foreground">{typeof offer.impurityPercent === "number" ? `${offer.impurityPercent}%` : offer.impurityPercent}</strong></p>
                        <p>Siap Panen: <strong className="text-foreground">{offer.readyDate}</strong></p>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onNavigate("offer-detail", offer.id)}
                        className="gap-2 font-semibold text-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Kelola Detail Tawaran</span>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onNavigate("contracts")}
                        className="gap-2 font-medium text-xs"
                      >
                        <span>Pesanan Terkait ({offer.reservedVolume > 0 ? "Ada Pesanan" : "Nol"})</span>
                      </Button>
                    </div>

                    {!isWithdrawn && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setWithdrawTargetId(offer.id)}
                        className="gap-1.5 font-semibold text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Tarik Tawaran</span>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Confirmation Modal for Offer Withdrawal (DEC-013b) */}
      <ConfirmationModal
        isOpen={withdrawTargetId !== null}
        title="Tarik Tawaran Panen dari Publikasi?"
        description="Menarik tawaran ini akan menghentikan pesanan baru dan secara otomatis membatalkan seluruh pesanan yang saat ini berstatus 'Menunggu Kesepakatan' (volume cadangan dikembalikan). Kontrak yang sudah 'Disetujui' tetap berjalan. Tawaran yang ditarik tidak dapat diterbitkan kembali."
        confirmText="Tarik Tawaran Sekarang"
        cancelText="Batal"
        variant="danger"
        onConfirm={handleConfirmWithdraw}
        onCancel={() => setWithdrawTargetId(null)}
      />
    </div>
  )
}
