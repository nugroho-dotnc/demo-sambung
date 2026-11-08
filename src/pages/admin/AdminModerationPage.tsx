import { useState } from "react"
import { useSambungStore } from "@/store/sambungStore"
import { formatRupiah } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, ShieldAlert } from "lucide-react"

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
    <div className="max-w-6xl mx-auto space-y-7 pb-14">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/70">
        <div>
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            <span>SAMBUNG</span>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-primary font-bold">ADMIN</span>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-foreground">MODERASI TAWARAN</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
            Moderasi & Pengawasan Tawaran Panen
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Beri catatan perbaikan informasi kepada petani tanpa menyembunyikan tawaran atau membatalkan pesanan sepihak.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 text-xs font-semibold text-amber-800 dark:text-amber-300 border border-amber-500/20">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>Pengawasan Non-Destruktif</span>
        </div>
      </div>

      {/* Konten Utama Panel */}
      <div className="space-y-4">
        {offers.map((offer) => {
          const isFlagged = offer.moderationStatus === "Sedang diminta perbaikan"
          const isPendingReview = offer.moderationStatus === "Menunggu Peninjauan"

          return (
            <Card
              key={offer.id}
              className={`border transition-all rounded-2xl overflow-hidden ${
                isFlagged
                  ? "border-amber-400/60 bg-amber-500/5 shadow-xs"
                  : "border-border/80 bg-card shadow-2xs"
              }`}
            >
              <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-card border border-border px-2.5 py-0.5 rounded text-foreground">
                      #{offer.id}
                    </span>
                    <Badge variant={isFlagged ? "destructive" : isPendingReview ? "secondary" : "default"} className="text-xs">
                      {offer.moderationStatus}
                    </Badge>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-secondary text-secondary-foreground border border-border/60">
                      {offer.grainType} · {offer.availableVolume.toLocaleString("id-ID")} kg
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Kec. {offer.district}, {offer.regency}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-foreground text-base">
                      {offer.farmerName} · <span className="font-mono text-primary font-bold">{formatRupiah(offer.askingPrice)} /kg</span>
                    </h4>
                    {offer.moderationIssue && (
                      <div className="text-xs text-amber-900 dark:text-amber-200 mt-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl leading-relaxed">
                        <strong className="text-amber-950 dark:text-amber-100">Catatan Pengawas:</strong> {offer.moderationIssue}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {isFlagged || isPendingReview ? (
                    <Button
                      size="sm"
                      onClick={() => handleResolveIssue(offer.id)}
                      className="gap-1.5 font-bold text-xs shadow-xs"
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
                      className="gap-1.5 font-semibold text-amber-700 dark:text-amber-400 border-amber-400/60 hover:bg-amber-500/10 text-xs"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>Minta Perbaikan</span>
                    </Button>
                  )}
                </div>
              </CardContent>

              {/* Form Input for Issue */}
              {selectedOfferId === offer.id && (
                <div className="p-5 border-t border-border/80 bg-muted/20 space-y-3 animate-in slide-in-from-top-2">
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                    Tuliskan Catatan Temuan / Permintaan Perbaikan kepada Petani:
                  </label>
                  <textarea
                    rows={2}
                    value={issueNote}
                    onChange={(e) => setIssueNote(e.target.value)}
                    placeholder="Contoh: Keterangan akses jalan truk penggilingan perlu diperjelas, kadar air tampak melebihi batas toleransi..."
                    className="w-full rounded-xl border border-input p-3 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary bg-card"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedOfferId(null)} className="text-xs">
                      Batal
                    </Button>
                    <Button size="sm" onClick={() => handleApplyIssue(offer.id)} className="font-bold text-xs shadow-xs">
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
