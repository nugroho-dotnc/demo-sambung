import { useState } from "react"
import { useSambungStore } from "@/store/sambungStore"
import { formatRupiah } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle } from "lucide-react"

interface AdminModerationPageProps {
  onBack?: () => void
}

export function AdminModerationPage({ onBack: _onBack }: AdminModerationPageProps) {
  const { offers, setOfferModeration } = useSambungStore()
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null)
  const [issueNote, setIssueNote] = useState("")

  const handleApplyIssue = (offerId: string) => {
    if (!issueNote.trim()) {
      alert("Catatan perbaikan wajib diisi.")
      return
    }
    setOfferModeration(offerId, "Sedang diminta perbaikan", issueNote.trim())
    setSelectedOfferId(null)
    setIssueNote("")
    alert("Catatan perbaikan berhasil dikirim ke petani.")
  }

  const handleResolveIssue = (offerId: string) => {
    setOfferModeration(offerId, "Ditutup")
    alert("Temuan moderasi berhasil ditutup. Tawaran kini berstatus bersih.")
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* 2. Breadcrumbs, Judul Halaman, Deskripsi Singkat */}
      <div className="pt-1 border-b border-border/80 pb-4">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
          <span>SAMBUNG</span>
          <span>/</span>
          <span className="text-foreground">MODERASI TAWARAN</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
          Moderasi & Pengawasan Tawaran Panen
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Beri catatan perbaikan informasi kepada petani tanpa menyembunyikan tawaran atau membatalkan pesanan.
        </p>
      </div>

      {/* 4. Konten Utama Panel (Daftar Tawaran Moderasi) */}
      <div className="space-y-4">
        {offers.map((offer) => {
          const isFlagged = offer.moderationStatus === "Sedang diminta perbaikan"
          const isPendingReview = offer.moderationStatus === "Menunggu Peninjauan"

          return (
            <Card
              key={offer.id}
              className={`border transition-all ${
                isFlagged
                  ? "border-amber-300 dark:border-amber-800 bg-amber-50/20 dark:bg-amber-950/20"
                  : "border-border bg-card"
              }`}
            >
              <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-card border px-2.5 py-1 rounded-md text-foreground">
                      #{offer.id}
                    </span>
                    <Badge variant={isFlagged ? "destructive" : isPendingReview ? "secondary" : "default"}>
                      {offer.moderationStatus}
                    </Badge>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-secondary text-secondary-foreground">
                      {offer.grainType} ({offer.availableVolume.toLocaleString("id-ID")} kg)
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Kec. {offer.district}, {offer.regency}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-foreground text-body-base">
                      {offer.farmerName} · {formatRupiah(offer.askingPrice)} /kg
                    </h4>
                    {offer.moderationIssue && (
                      <p className="text-xs text-amber-700 dark:text-amber-300 mt-1 p-2 bg-amber-100/50 dark:bg-amber-950/60 rounded-md">
                        <strong>Catatan Admin:</strong> {offer.moderationIssue}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {isFlagged || isPendingReview ? (
                    <Button
                      size="sm"
                      onClick={() => handleResolveIssue(offer.id)}
                      className="gap-1.5 font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Tutup Temuan (Bersih)</span>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedOfferId(selectedOfferId === offer.id ? null : offer.id)
                        setIssueNote("")
                      }}
                      className="gap-1.5 font-semibold text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>Minta Perbaikan</span>
                    </Button>
                  )}
                </div>
              </CardContent>

              {/* Form Input for Issue */}
              {selectedOfferId === offer.id && (
                <div className="p-5 border-t border-border bg-card space-y-3 animate-in slide-in-from-top-2">
                  <label className="block text-xs font-bold text-foreground">
                    Tuliskan Catatan Temuan / Permintaan Perbaikan kepada Petani:
                  </label>
                  <textarea
                    rows={2}
                    value={issueNote}
                    onChange={(e) => setIssueNote(e.target.value)}
                    placeholder="Contoh: Keterangan akses jalan truk penggilingan perlu diperjelas..."
                    className="w-full rounded-md border border-input p-3 text-body-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-[3px] focus-visible:outline-ring"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedOfferId(null)}>
                      Batal
                    </Button>
                    <Button size="sm" onClick={() => handleApplyIssue(offer.id)} className="font-bold">
                      Kirim Catatan ke Petani
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
