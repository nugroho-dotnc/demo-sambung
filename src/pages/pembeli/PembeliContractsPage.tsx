import { useState } from "react"
import { useSambungStore } from "@/store/sambungStore"
import { formatRupiah } from "@/lib/utils"
import { calculateFairPrice, evaluatePriceLamp } from "@/lib/priceEngine"
import { PriceLampBadge } from "@/components/domain/PriceLampBadge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ScrollText,
  Sprout,
  ChevronRight,
  Check,
  ShieldCheck
} from "lucide-react"

interface PembeliContractsPageProps {
  onNavigate: (tab: string, targetId?: string) => void
}

export function PembeliContractsPage({ onNavigate }: PembeliContractsPageProps) {
  const { currentUser, contracts } = useSambungStore()
  const [filterTab, setFilterTab] = useState<"semua" | "menunggu" | "disetujui" | "selesai">("semua")

  // Filter only buyer's contracts
  const myContracts = contracts.filter((c) => c.buyerId === currentUser.id)

  const filteredContracts = myContracts.filter((c) => {
    if (filterTab === "menunggu") return c.status === "Menunggu Kesepakatan"
    if (filterTab === "disetujui") return c.status === "Disetujui"
    if (filterTab === "selesai") return c.status === "Selesai"
    return true
  })

  const pendingCount = myContracts.filter((c) => c.status === "Menunggu Kesepakatan").length
  const activeCount = myContracts.filter((c) => c.status === "Disetujui").length

  return (
    <div className="max-w-6xl mx-auto space-y-7 pb-14">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/70">
        <div>
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            <span>Sambung</span>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-primary font-bold">Ruang Pembeli</span>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-foreground">Pesanan & Kontrak</span>
          </nav>

          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Pesanan dan Kontrak Pembeli
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Pantau status setiap pesanan pasokan sampai kontrak ditandatangani dan transaksi selesai.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            {myContracts.length} Total Pesanan Terdaftar
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
          onClick={() => setFilterTab("menunggu")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            filterTab === "menunggu"
              ? "bg-primary text-white dark:text-[#182117] shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <span>Menunggu Respon</span>
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-black font-bold">
              {pendingCount}
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
          Disetujui ({activeCount})
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

      {/* Orders List */}
      <div className="space-y-4">
        {filteredContracts.length === 0 ? (
          <Card className="p-12 text-center space-y-3 bg-card border border-border/80 rounded-2xl shadow-xs">
            <ScrollText className="w-10 h-10 text-muted-foreground/60 mx-auto stroke-1" />
            <h3 className="text-base font-bold text-foreground">Belum ada pesanan pada kategori ini</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Kunjungi katalog pasokan untuk mencari gabah panen dari kelompok tani dan mengajukan pesanan baru.
            </p>
            <Button
              size="sm"
              onClick={() => onNavigate("supply-catalog")}
              className="mt-2 text-xs shadow-xs"
            >
              Buka Katalog Pasokan
            </Button>
          </Card>
        ) : (
          filteredContracts.map((contract) => {
            const isFarmerCountered = contract.status === "Menunggu Kesepakatan" && contract.activeProposedBy === "petani"
            const totalVal = contract.volume * contract.activePrice

            // 4-step progress mapping
            const stepIndex =
              contract.status === "Selesai"
                ? 4
                : contract.status === "Disetujui"
                ? 3
                : contract.status === "Menunggu Kesepakatan"
                ? 1
                : 1

            return (
              <Card
                key={contract.id}
                className="p-5 sm:p-6 bg-card border-border/80 hover:border-primary/40 transition-all rounded-2xl shadow-xs space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Sprout className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-bold text-foreground">
                          {contract.farmerName}
                        </strong>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-muted text-muted-foreground border border-border flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-primary" />
                          <span>Petani Terverifikasi</span>
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                        Kontrak #{contract.id} · ID Pasokan {contract.offerId}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-md text-xs font-semibold self-start sm:self-auto ${
                      contract.status === "Disetujui"
                        ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30"
                        : contract.status === "Menunggu Kesepakatan"
                        ? "bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/30"
                        : contract.status === "Selesai"
                        ? "bg-muted text-muted-foreground border border-border"
                        : "bg-rose-500/10 text-rose-800 dark:text-rose-300"
                    }`}
                  >
                    {isFarmerCountered ? "Petani Mengajukan Tawar Balik" : contract.status}
                  </span>
                </div>

                {/* 4-step visual stepper */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                  <div className="flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                    <span>1. Dipesan</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 font-medium ${
                      stepIndex >= 2 ? "text-emerald-700 dark:text-emerald-400" : "text-muted-foreground"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center ${
                        stepIndex >= 2 ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {stepIndex >= 2 ? <Check className="w-2.5 h-2.5" /> : "2"}
                    </span>
                    <span>2. Disetujui Petani</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 font-medium ${
                      stepIndex >= 3 ? "text-emerald-700 dark:text-emerald-400" : "text-muted-foreground"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center ${
                        stepIndex >= 3 ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {stepIndex >= 3 ? <Check className="w-2.5 h-2.5" /> : "3"}
                    </span>
                    <span>3. Kontrak Dibuat</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 font-medium ${
                      stepIndex >= 4 ? "text-emerald-700 dark:text-emerald-400" : "text-muted-foreground"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center ${
                        stepIndex >= 4 ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {stepIndex >= 4 ? <Check className="w-2.5 h-2.5" /> : "4"}
                    </span>
                    <span>4. Ditandatangani</span>
                  </div>
                </div>

                {/* Details row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3.5 border-y border-border/70 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[11px] font-medium">Volume Dipesan</span>
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
                    <span className="text-muted-foreground block text-[11px] font-medium">Lampu Kewajaran</span>
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

                {/* Footer action */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="text-[11px] text-muted-foreground">
                    {isFarmerCountered ? (
                      <span className="text-amber-700 dark:text-amber-400 font-semibold">
                        Petani mengajukan harga baru. Buka detail untuk menyetujui atau menawar balik.
                      </span>
                    ) : (
                      <span>Pembayaran dan pengiriman diatur langsung dengan petani tanpa potongan komisi platform.</span>
                    )}
                  </div>

                  <Button
                    size="sm"
                    variant={isFarmerCountered ? "default" : "outline"}
                    onClick={() => onNavigate("contract-detail", contract.id)}
                    className="text-xs gap-1.5 shadow-xs border-border/80"
                  >
                    <span>{isFarmerCountered ? "Tinjau Tawar Balik" : "Lihat Kontrak & Detail"}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
