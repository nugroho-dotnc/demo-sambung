import { useSambungStore } from "@/store/sambungStore"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ShieldAlert,
  Users,
  Cpu,
  ArrowRight,
  Database
} from "lucide-react"

interface AdminDashboardProps {
  onNavigate: (tab: string) => void
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { offers, contracts, auditLogs } = useSambungStore()

  const pendingModeration = offers.filter((o) => o.moderationStatus === "Sedang diminta perbaikan")
  const activeContracts = contracts.filter((c) => c.status === "Menunggu Kesepakatan" || c.status === "Disetujui")

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span>SAMBUNG</span>
          <span>/</span>
          <span className="text-foreground">DASBOR ADMIN</span>
        </div>

        <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Ringkasan Pengawasan Sistem
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Pusat pemantauan integritas transaksi simulasi, konfigurasi parameter, dan moderasi tawaran panen.
            </p>
          </div>

          <Button
            onClick={() => onNavigate("admin-price-data")}
            variant="outline"
            className="self-start sm:self-auto gap-2 text-xs"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Data & Parameter Harga</span>
          </Button>
        </div>
      </div>

      {/* 4 Summary Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-5 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">Total Tawaran Panen</p>
          <p className="font-display text-3xl font-extrabold text-foreground">{offers.length}</p>
          <p className="text-[11px] text-muted-foreground">
            {offers.filter((o) => o.publicationStatus === "Terbit").length} penawaran aktif
          </p>
        </Card>

        <Card className="p-5 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">Kontrak Berjalan</p>
          <p className="font-display text-3xl font-extrabold text-[#246447] dark:text-[#A9D6B0]">{activeContracts.length}</p>
          <p className="text-[11px] text-muted-foreground">
            Negosiasi & disetujui
          </p>
        </Card>

        <Card className="p-5 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">Temuan Moderasi</p>
          <p className={`font-display text-3xl font-extrabold ${pendingModeration.length > 0 ? "text-[#C86B3C]" : "text-foreground"}`}>
            {pendingModeration.length}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {pendingModeration.length > 0 ? "Perlu tindak lanjut" : "Semua bersih"}
          </p>
        </Card>

        <Card className="p-5 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">Log Audit Aktivitas</p>
          <p className="font-display text-3xl font-extrabold text-foreground">{auditLogs.length}</p>
          <p className="text-[11px] text-muted-foreground">
            Peristiwa bisnis terekam
          </p>
        </Card>
      </div>

      {/* Navigation Quick Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Moderasi */}
        <Card className="p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-foreground font-bold">
              <ShieldAlert className="w-4.5 h-4.5 text-[#C86B3C]" />
              <h3 className="text-sm">Moderasi Tawaran</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Tinjau tawaran harga anomali atau data mencurigakan. Petani diberi catatan tanpa memblokir akses secara sepihak.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate("admin-moderation")}
            className="w-full justify-between text-xs font-semibold"
          >
            <span>Buka Moderasi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Card>

        {/* Manajemen Pengguna */}
        <Card className="p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-foreground font-bold">
              <Users className="w-4.5 h-4.5 text-primary" />
              <h3 className="text-sm">Manajemen Pengguna</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Daftar akun petani dan pembeli. Nomor telepon tetap tersamar demi privasi sesuai tata kelola platform.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate("admin-users")}
            className="w-full justify-between text-xs font-semibold"
          >
            <span>Kelola Pengguna</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Card>

        {/* Evaluasi Model AI */}
        <Card className="p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-foreground font-bold">
              <Cpu className="w-4.5 h-4.5 text-primary" />
              <h3 className="text-sm">Evaluasi Model AI</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Periksa metrik walk-forward MASE, horizon 2 & 4 pekan, dan status kelayakan publikasi model peramalan harga.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate("admin-model")}
            className="w-full justify-between text-xs font-semibold"
          >
            <span>Lihat Evaluasi Model</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Card>
      </div>

      {/* Recent Audit Logs Table */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-foreground">Aktivitas Sistem Terkini</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Jejak mutasi transaksi dan parameter operasional</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("admin-governance")}
            className="text-xs font-semibold text-primary"
          >
            Lihat Semua Log
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/80 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <th className="py-2.5">Waktu</th>
                <th className="py-2.5">Aktor</th>
                <th className="py-2.5">Aksi / Mutasi</th>
                <th className="py-2.5">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {auditLogs.slice(0, 5).map((log) => (
                <tr key={log.id} className="hover:bg-muted/40 transition-colors">
                  <td className="py-3 text-muted-foreground font-mono text-[11px]">{log.timestamp}</td>
                  <td className="py-3 font-semibold text-foreground">{log.actorName}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-muted text-foreground">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 text-muted-foreground truncate max-w-xs">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
