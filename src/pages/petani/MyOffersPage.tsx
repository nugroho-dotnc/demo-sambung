import { useState } from "react"
import { useSambungStore } from "@/store/sambungStore"
import { formatRupiah } from "@/lib/utils"
import { calculateFairPrice, evaluatePriceLamp } from "@/lib/priceEngine"
import { PriceLampBadge } from "@/components/domain/PriceLampBadge"
import { ConfirmationModal } from "@/components/domain/ConfirmationModal"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sprout,
  PlusCircle,
  AlertCircle,
  Trash2,
  Calendar,
  MapPin,
  Eye,
  ArrowRight,
  TrendingUp,
  PackageCheck,
  Clock3,
  Layers
} from "lucide-react"

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
  const agreedVolume = myOffers.reduce((acc, o) => acc + o.agreedVolume, 0)

  const handleConfirmWithdraw = () => {
    if (withdrawTargetId) {
      withdrawOffer(withdrawTargetId)
      setWithdrawTargetId(null)
      alert("Tawaran panen berhasil ditarik. Semua pesanan yang menunggu kesepakatan otomatis dibatalkan.")
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-7 pb-14">
      {/* Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/70">
        <div>
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            <span>Sambung</span>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-primary font-bold">Ruang Petani</span>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-foreground">Tawaran Panen</span>
          </nav>

          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Daftar Tawaran Hasil Panen
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola volume pasokan, pantau pesanan pembeli yang masuk, dan verifikasi kewajaran harga pasar.
          </p>
        </div>

        <Button
          onClick={() => onNavigate("create-offer")}
          className="self-start sm:self-auto gap-2 text-xs font-semibold shadow-sm hover:shadow"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Jual Hasil Panen</span>
        </Button>
      </div>

      {/* KPI Stats Suite */}
      {myOffers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 bg-card border-border/80 shadow-2xs hover:border-primary/30 transition-all">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Terdaftar</span>
              <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Layers className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="font-mono text-2xl font-bold text-foreground tabular-nums">
              {totalVolume.toLocaleString("id-ID")} <span className="text-xs font-sans font-normal text-muted-foreground">kg</span>
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">Dari {myOffers.length} publikasi panen aktif</p>
          </Card>

          <Card className="p-4 bg-card border-border/80 shadow-2xs hover:border-primary/30 transition-all">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">Stok Siap Pesan</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                <PackageCheck className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="font-mono text-2xl font-bold text-primary tabular-nums">
              {availableVolume.toLocaleString("id-ID")} <span className="text-xs font-sans font-normal text-muted-foreground">kg</span>
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">Tersedia langsung di katalog pembeli</p>
          </Card>

          <Card className="p-4 bg-card border-border/80 shadow-2xs hover:border-amber-400/40 transition-all">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">Menunggu Respon</span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                <Clock3 className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="font-mono text-2xl font-bold text-amber-700 dark:text-amber-400 tabular-nums">
              {reservedVolume.toLocaleString("id-ID")} <span className="text-xs font-sans font-normal text-muted-foreground">kg</span>
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">Volume terikat pesanan menunggu</p>
          </Card>

          <Card className="p-4 bg-card border-border/80 shadow-2xs hover:border-primary/30 transition-all">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">Sepakat & Selesai</span>
              <div className="w-7 h-7 rounded-lg bg-muted text-foreground flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-primary" />
              </div>
            </div>
            <p className="font-mono text-2xl font-bold text-foreground tabular-nums">
              {agreedVolume.toLocaleString("id-ID")} <span className="text-xs font-sans font-normal text-muted-foreground">kg</span>
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">Kontrak berjalan atau terkirim</p>
          </Card>
        </div>
      )}

      {/* Offers List */}
      <div className="space-y-5">
        {myOffers.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-2 bg-card/60">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
              <Sprout className="w-7 h-7" />
            </div>
            <h3 className="font-display text-lg font-bold text-foreground">Belum Ada Tawaran Panen</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
              Anda belum menerbitkan tawaran panen gabah. Terbitkan hasil panen Anda agar penggilingan dan produsen beras dapat mengajukan pesanan langsung.
            </p>
            <Button
              className="mt-6 gap-2 font-semibold shadow-xs"
              onClick={() => onNavigate("create-offer")}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Buat Tawaran Panen Sekarang</span>
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

            // Calculate percentage shares for visual progress bar
            const total = Math.max(1, offer.totalVolume)
            const availPct = Math.round((offer.availableVolume / total) * 100)
            const resPct = Math.round((offer.reservedVolume / total) * 100)
            const agreedPct = Math.round(((offer.agreedVolume + offer.completedVolume) / total) * 100)

            return (
              <Card
                key={offer.id}
                className={`border overflow-hidden transition-all duration-200 ${
                  isWithdrawn
                    ? "opacity-65 bg-muted/20 border-border/80"
                    : "border-border/85 bg-card shadow-xs hover:shadow-md hover:border-primary/40"
                }`}
              >
                {/* Header bar */}
                <CardHeader className="bg-muted/30 px-6 py-4 border-b border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-xs font-bold bg-card border border-border px-2.5 py-1 rounded-md text-foreground shadow-2xs">
                      #{offer.id}
                    </span>
                    <Badge variant={isWithdrawn ? "outline" : "default"} className="font-semibold text-xs">
                      {offer.publicationStatus.toUpperCase()}
                    </Badge>
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-secondary text-secondary-foreground border border-border/60">
                      {offer.grainType} · {offer.grainType === "GKP" ? "Panen Basah" : "Giling Siap Olah"}
                    </span>
                    <PriceLampBadge status={lamp.status} size="sm" />
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    <span>Diterbitkan: <strong>{new Date(offer.createdAt).toLocaleDateString("id-ID")}</strong></span>
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  {/* Moderation Alert if any (DEC-013f) */}
                  {offer.moderationStatus === "Sedang diminta perbaikan" && (
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex items-start gap-3 text-xs leading-relaxed">
                      <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-amber-950 dark:text-amber-200">Catatan Perbaikan dari Tim Moderasi:</p>
                        <p className="mt-0.5">{offer.moderationIssue}</p>
                      </div>
                    </div>
                  )}

                  {/* Main Grid: Price, Volume Breakdown, Quality */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    {/* 1. Price Column (4 cols) */}
                    <div className="md:col-span-4 space-y-3">
                      <div>
                        <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">Harga Minta Petani</span>
                        <div className="mt-1 flex items-baseline gap-1">
                          <p className="text-3xl font-bold font-mono text-primary tabular-nums tracking-tight">
                            {formatRupiah(offer.askingPrice)}
                          </p>
                          <span className="text-xs text-muted-foreground">/kg</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-muted/40 border border-border/70 text-xs space-y-1.5">
                        <div className="flex justify-between text-muted-foreground">
                          <span>Acuan Rentang Wajar:</span>
                          <span className="font-semibold text-foreground font-mono">
                            {formatRupiah(estimate.lowerBound)} - {formatRupiah(estimate.upperBound)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-muted-foreground pt-1 border-t border-border/60">
                          <span>Evaluasi Pasar:</span>
                          <span className="text-foreground font-semibold">{lamp.message}</span>
                        </div>
                      </div>
                    </div>

                    {/* 2. Volume Breakdown (5 cols) */}
                    <div className="md:col-span-5 space-y-3 md:border-x md:border-border/70 md:px-6">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">Distribusi Volume Gabah</span>
                        <span className="text-xs font-mono font-bold text-foreground">
                          {offer.totalVolume.toLocaleString("id-ID")} kg Total
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
                            title={`Menunggu: ${offer.reservedVolume} kg (${resPct}%)`}
                          />
                        )}
                        {agreedPct > 0 && (
                          <div
                            style={{ width: `${agreedPct}%` }}
                            className="h-full bg-primary/70 rounded-sm"
                            title={`Sepakat/Selesai: ${offer.agreedVolume + offer.completedVolume} kg (${agreedPct}%)`}
                          />
                        )}
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-foreground font-medium">
                            <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-500 shrink-0" />
                            <span>Tersedia untuk Pesanan:</span>
                          </span>
                          <span className="font-mono font-bold text-primary tabular-nums">
                            {offer.availableVolume.toLocaleString("id-ID")} kg
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                            <span>Dicadangkan (Menunggu):</span>
                          </span>
                          <span className="font-mono tabular-nums text-foreground">{offer.reservedVolume.toLocaleString("id-ID")} kg</span>
                        </div>

                        <div className="flex items-center justify-between text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-primary/70 shrink-0" />
                            <span>Disetujui / Selesai:</span>
                          </span>
                          <span className="font-mono tabular-nums text-foreground">
                            {(offer.agreedVolume + offer.completedVolume).toLocaleString("id-ID")} kg
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 3. Specs & Location (3 cols) */}
                    <div className="md:col-span-3 space-y-2 text-xs">
                      <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">Lokasi & Mutu</span>
                      <div className="flex items-start gap-1.5 text-foreground font-medium pt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        <span className="leading-tight">Kec. {offer.district}, {offer.regency}, {offer.province}</span>
                      </div>

                      <div className="p-3 rounded-xl bg-muted/40 border border-border/70 space-y-1 text-muted-foreground">
                        <p className="flex justify-between">
                          <span>Kadar Air:</span>
                          <strong className="text-foreground font-mono">{typeof offer.moisturePercent === "number" ? `${offer.moisturePercent}%` : offer.moisturePercent}</strong>
                        </p>
                        <p className="flex justify-between">
                          <span>Kotoran:</span>
                          <strong className="text-foreground font-mono">{typeof offer.impurityPercent === "number" ? `${offer.impurityPercent}%` : offer.impurityPercent}</strong>
                        </p>
                        <p className="flex justify-between pt-1 border-t border-border/60">
                          <span>Siap Panen:</span>
                          <strong className="text-foreground">{offer.readyDate}</strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t border-border/70 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => onNavigate("offer-detail", offer.id)}
                        className="gap-2 font-semibold text-xs shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Kelola Detail Tawaran</span>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onNavigate("contracts")}
                        className="gap-1.5 font-medium text-xs border-border/80"
                      >
                        <span>Pesanan Terkait</span>
                        {offer.reservedVolume > 0 && (
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        )}
                        <ArrowRight className="w-3 h-3 text-muted-foreground" />
                      </Button>
                    </div>

                    {!isWithdrawn && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setWithdrawTargetId(offer.id)}
                        className="gap-1.5 font-medium text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
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
