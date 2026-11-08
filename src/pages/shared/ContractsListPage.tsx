import { useState } from "react"
import { useSambungStore } from "@/store/sambungStore"
import { ContractStatus } from "@/types/domain"
import { formatRupiah } from "@/lib/utils"
import { ContractStatusBadge } from "@/components/domain/ContractStatusBadge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, ArrowRight, Clock, ShieldCheck, Filter } from "lucide-react"

interface ContractsListPageProps {
  onNavigate: (tab: string, contractId?: string) => void
}

export function ContractsListPage({ onNavigate }: ContractsListPageProps) {
  const { currentRole, currentUser, contracts } = useSambungStore()
  const [filterStatus, setFilterStatus] = useState<string>("Semua")

  // Filter contracts based on current user role (Petani sees their sold, Pembeli sees their bought)
  const myContracts = contracts.filter((c) => {
    if (currentRole === "petani") return c.farmerId === currentUser.id
    if (currentRole === "pembeli") return c.buyerId === currentUser.id
    return true // Admin sees all for monitoring
  })

  const filteredContracts = myContracts.filter((c) => {
    if (filterStatus === "Semua") return true
    return c.status === filterStatus
  })

  const statuses: ("Semua" | ContractStatus)[] = [
    "Semua",
    "Menunggu Kesepakatan",
    "Disetujui",
    "Selesai",
    "Dibatalkan",
    "Ditolak"
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-7 pb-14">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/70">
        <div>
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            <span>Sambung</span>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-primary font-bold">Ruang Kerja</span>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-foreground">Daftar Kontrak</span>
          </nav>

          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Buku Kontrak & Transaksi Digital
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Pantau status pesanan, tanggapi penawaran tawar balik harga, dan cetak bukti kesepakatan transaksi.
          </p>
        </div>

        <div className="self-start sm:self-auto flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 text-xs font-semibold text-primary border border-primary/20">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Buku Transaksi Terenkripsi</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-border/70">
        <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground mr-1 shrink-0">
          <Filter className="w-3.5 h-3.5" />
          <span>Status:</span>
        </div>
        {statuses.map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              filterStatus === st
                ? "bg-primary text-white dark:text-[#182117] shadow-xs"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Contracts List */}
      <div className="space-y-4">
        {filteredContracts.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-2 bg-card rounded-2xl shadow-xs">
            <FileText className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
            <h3 className="text-base font-bold text-foreground">Tidak Ada Kontrak Ditemukan</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
              Belum ada transaksi simulasi dengan filter status &apos;{filterStatus}&apos;.
            </p>
          </Card>
        ) : (
          filteredContracts.map((ctr) => {
            const isMenunggu = ctr.status === "Menunggu Kesepakatan"
            const isDisetujui = ctr.status === "Disetujui"

            return (
              <Card
                key={ctr.id}
                className={`border transition-all rounded-2xl overflow-hidden ${
                  isMenunggu
                    ? "border-amber-400/50 bg-amber-500/5 hover:border-amber-400 shadow-xs"
                    : isDisetujui
                    ? "border-emerald-500/40 bg-emerald-500/5 hover:border-emerald-500 shadow-xs"
                    : "border-border/80 bg-card hover:border-primary/40 shadow-2xs"
                }`}
              >
                <CardContent className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* Left Column: ID & Parties */}
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-card border border-border px-2.5 py-0.5 rounded text-foreground">
                        #{ctr.id}
                      </span>
                      <ContractStatusBadge
                        status={ctr.status}
                        confirmedCount={
                          ctr.confirmedByFarmer && ctr.confirmedByBuyer
                            ? 2
                            : ctr.confirmedByFarmer || ctr.confirmedByBuyer
                            ? 1
                            : 0
                        }
                      />
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-secondary text-secondary-foreground border border-border/60">
                        {ctr.grainType}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-foreground">
                        {currentRole === "petani"
                          ? `Pembeli: ${ctr.buyerName}`
                          : `Petani: ${ctr.farmerName}`}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Volume pesanan: <strong className="font-mono text-foreground">{ctr.volume.toLocaleString("id-ID")} kg</strong> · Merujuk penawaran panen #{ctr.offerId}
                      </p>
                    </div>

                    {isMenunggu && (
                      <div className="inline-flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          Tenggat kesepakatan: {new Date(ctr.expiresAt).toLocaleTimeString("id-ID")} WIB
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Price & Action */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-border/70">
                    <div className="text-left sm:text-right">
                      <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">Harga Aktif Terakhir</span>
                      <p className="text-2xl font-bold font-mono text-primary tabular-nums mt-0.5">
                        {formatRupiah(ctr.activePrice)}
                        <span className="text-xs font-sans font-normal text-muted-foreground ml-1">/kg</span>
                      </p>
                      <p className="text-[11px] text-muted-foreground font-mono">
                        Total Nilai: {formatRupiah(ctr.activePrice * ctr.volume)}
                      </p>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => onNavigate("contract-detail", ctr.id)}
                      className="gap-2 font-semibold shrink-0 shadow-xs text-xs"
                    >
                      <span>Buka & Tindak Lanjuti</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
