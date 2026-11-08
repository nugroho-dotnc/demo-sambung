import { useState } from "react"
import { useSambungStore } from "@/store/sambungStore"
import { formatRupiah } from "@/lib/utils"
import { calculateFairPrice, evaluatePriceLamp } from "@/lib/priceEngine"
import { PriceLampBadge } from "@/components/domain/PriceLampBadge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ScrollText,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Building2,
  Check
} from "lucide-react"

interface PetaniContractsPageProps {
  onNavigate: (tab: string, targetId?: string) => void
}

export function PetaniContractsPage({ onNavigate }: PetaniContractsPageProps) {
  const { currentUser, contracts, acceptPrice } = useSambungStore()
  const [filterTab, setFilterTab] = useState<"semua" | "pesanan" | "disetujui" | "selesai">("semua")

  // Filter only farmer's contracts
  const myContracts = contracts.filter((c) => c.farmerId === currentUser.id)

  const filteredContracts = myContracts.filter((c) => {
    if (filterTab === "pesanan") return c.status === "Menunggu Kesepakatan"
    if (filterTab === "disetujui") return c.status === "Disetujui"
    if (filterTab === "selesai") return c.status === "Selesai"
    return true
  })

  const pendingOrdersCount = myContracts.filter((c) => c.status === "Menunggu Kesepakatan").length
  const activeContractsCount = myContracts.filter((c) => c.status === "Disetujui").length

  const handleQuickAccept = (contractId: string) => {
    try {
      acceptPrice(contractId)
      alert("Harga pesanan disetujui! Status beralih ke 'Disetujui'. Nomor telepon kedua pihak kini saling terbuka.")
    } catch (err: unknown) {
      alert((err as Error).message)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-7 pb-14">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/70">
        <div>
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            <span>Sambung</span>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-primary font-bold">Ruang Petani</span>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-foreground">Pesanan & Kontrak</span>
          </nav>

          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Pesanan Masuk dan Kontrak Digital
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Semua pesanan diverifikasi otomatis terhadap rentang harga wajar wilayah Anda.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            {pendingOrdersCount} Pesanan Menunggu Respon
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-border/70">
        <button
          onClick={() => setFilterTab("semua")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            filterTab === "semua"
              ? "bg-primary text-white dark:text-[#182117] shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          Semua ({myContracts.length})
        </button>
        <button
          onClick={() => setFilterTab("pesanan")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            filterTab === "pesanan"
              ? "bg-primary text-white dark:text-[#182117] shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <span>Pesanan Masuk</span>
          {pendingOrdersCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-black font-bold">
              {pendingOrdersCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setFilterTab("disetujui")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            filterTab === "disetujui"
              ? "bg-primary text-white dark:text-[#182117] shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          Disetujui ({activeContractsCount})
        </button>
        <button
          onClick={() => setFilterTab("selesai")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            filterTab === "selesai"
              ? "bg-primary text-white dark:text-[#182117] shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          Selesai ({myContracts.filter((c) => c.status === "Selesai").length})
        </button>
      </div>

      {/* Contracts / Orders List */}
      <div className="space-y-4">
        {filteredContracts.length === 0 ? (
          <Card className="p-12 text-center space-y-3 bg-card border border-border/80 rounded-2xl shadow-xs">
            <ScrollText className="w-10 h-10 text-muted-foreground/60 mx-auto stroke-1" />
            <h3 className="text-base font-bold text-foreground">Belum ada dokumen pada tab ini</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Saat ada pembeli mengajukan pesanan terhadap hasil panen Anda, rincian pesanan akan otomatis muncul di sini.
            </p>
          </Card>
        ) : (
          filteredContracts.map((contract) => {
            const isWaitingFarmer = contract.status === "Menunggu Kesepakatan" && contract.activeProposedBy === "pembeli"
            const totalVal = contract.volume * contract.activePrice

            return (
              <Card
                key={contract.id}
                className="p-5 sm:p-6 bg-card border-border/80 hover:border-primary/40 transition-all rounded-2xl shadow-xs space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-bold text-foreground">
                          {contract.buyerName}
                        </strong>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Terverifikasi</span>
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                        Kontrak #{contract.id} · ID Pasokan {contract.offerId}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-md text-xs font-semibold ${
                        contract.status === "Disetujui"
                          ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30"
                          : contract.status === "Menunggu Kesepakatan"
                          ? "bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/30"
                          : contract.status === "Selesai"
                          ? "bg-muted text-muted-foreground border border-border"
                          : "bg-rose-500/10 text-rose-800 dark:text-rose-300"
                      }`}
                    >
                      {contract.status === "Menunggu Kesepakatan" ? "Menunggu Kesepakatan" : contract.status}
                    </span>
                  </div>
                </div>

                {/* Details row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3.5 border-y border-border/70 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[11px] font-medium">Komoditas & Volume</span>
                    <strong className="font-semibold text-foreground text-sm font-mono mt-0.5 block">
                      {contract.volume.toLocaleString("id-ID")} kg <span className="font-sans text-xs text-muted-foreground">({contract.grainType})</span>
                    </strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px] font-medium">Harga Tawar Aktif</span>
                    <strong className="font-semibold text-primary text-sm font-mono mt-0.5 block">
                      {formatRupiah(contract.activePrice)}/kg
                    </strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px] font-medium">Total Nilai Pesanan</span>
                    <strong className="font-bold text-foreground text-sm font-mono mt-0.5 block">
                      {formatRupiah(totalVal)}
                    </strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px] font-medium">Evaluasi Lampu Harga</span>
                    <div className="mt-1">
                      {(() => {
                        const rend = contract.grainType === "GKP" ? 0.5338 : 0.63
                        const bench = calculateFairPrice(contract.grainType, "Jawa Timur", 13500, rend)
                        const lamp = evaluatePriceLamp(contract.activePrice, bench.lowerBound, bench.upperBound)
                        return <PriceLampBadge status={lamp.status} size="sm" />
                      })()}
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="text-[11px] text-muted-foreground">
                    {isWaitingFarmer ? (
                      <span className="text-amber-700 dark:text-amber-400 font-semibold">
                        Pembeli mengajukan harga ini. Silakan terima atau ajukan tawar balik.
                      </span>
                    ) : contract.status === "Disetujui" ? (
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Kontrak disetujui. Nomor kontak terbuka untuk koordinasi pengiriman.</span>
                      </span>
                    ) : (
                      <span>Tercatat pada buku transaksi digital SAMBUNG.</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isWaitingFarmer && (
                      <Button
                        size="sm"
                        onClick={() => handleQuickAccept(contract.id)}
                        className="text-xs font-semibold shadow-xs gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Terima Harga</span>
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onNavigate("contract-detail", contract.id)}
                      className="text-xs gap-1.5 border-border/80"
                    >
                      <span>Buka Kontrak & Negosiasi</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
