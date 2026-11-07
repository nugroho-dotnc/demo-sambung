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
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
          <span className="font-medium">Sambung</span>
          <span className="text-muted-foreground/60">/</span>
          <span className="font-medium text-foreground">Kontrak & Kesepakatan</span>
        </nav>

        <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Daftar Kontrak & Kesepakatan
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Pantau status pesanan, tanggapi penawaran harga, dan selesaikan kesepakatan transaksi.
            </p>
          </div>

          <div className="self-start sm:self-auto flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-xs text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>Simulasi Kesepakatan Resmi</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground mr-2 shrink-0">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter:</span>
        </div>
        {statuses.map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 min-h-[36px] ${
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
          <Card className="p-12 text-center border-dashed border-2">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-60" />
            <h3 className="text-lg font-bold text-foreground">Tidak Ada Kontrak Ditemukan</h3>
            <p className="text-body-sm text-muted-foreground mt-1 max-w-md mx-auto">
              Belum ada transaksi simulasi dengan status &apos;{filterStatus}&apos;.
            </p>
          </Card>
        ) : (
          filteredContracts.map((ctr) => {
            const isMenunggu = ctr.status === "Menunggu Kesepakatan"
            const isDisetujui = ctr.status === "Disetujui"

            return (
              <Card
                key={ctr.id}
                className={`border transition-all hover:border-primary/50 ${
                  isMenunggu
                    ? "border-amber-300 dark:border-amber-800/80 bg-amber-50/20 dark:bg-amber-950/20"
                    : isDisetujui
                    ? "border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/20 dark:bg-emerald-950/20"
                    : "border-border bg-card"
                }`}
              >
                <CardContent className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* Left Column: ID & Parties */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-xs font-bold bg-card border px-2.5 py-1 rounded-md text-foreground">
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
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-secondary text-secondary-foreground">
                        {ctr.grainType}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg text-foreground">
                        {currentRole === "petani"
                          ? `Pembeli: ${ctr.buyerName}`
                          : `Petani: ${ctr.farmerName}`}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Volume pesanan: <strong>{ctr.volume.toLocaleString("id-ID")} kg</strong> · Merujuk tawaran #{ctr.offerId}
                      </p>
                    </div>

                    {isMenunggu && (
                      <div className="inline-flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          Tenggat 24 jam berakhir: {new Date(ctr.expiresAt).toLocaleTimeString("id-ID")} WIB
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Price & Action */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-border">
                    <div className="text-left sm:text-right">
                      <span className="text-xs text-muted-foreground font-semibold">Harga Aktif Terakhir</span>
                      <p className="text-2xl font-extrabold font-mono text-primary">
                        {formatRupiah(ctr.activePrice)}
                        <span className="text-xs font-normal text-muted-foreground ml-1">/kg</span>
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Total Nilai: {formatRupiah(ctr.activePrice * ctr.volume)}
                      </p>
                    </div>

                    <Button
                      onClick={() => onNavigate("contract-detail", ctr.id)}
                      className="gap-2 font-bold shrink-0 shadow-xs"
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
