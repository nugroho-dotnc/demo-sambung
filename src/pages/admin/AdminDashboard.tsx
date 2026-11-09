import { useSambungStore } from "@/store/sambungStore"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users,
  Cpu,
  ArrowRight,
  Database,
  Layers,
  TrendingUp,
  FileText
} from "lucide-react"

interface AdminDashboardProps {
  onNavigate: (tab: string) => void
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { offers, contracts, auditLogs, observations } = useSambungStore()

  const activeContracts = contracts.filter((c) => c.status === "Menunggu Kesepakatan" || c.status === "Disetujui")

  return (
    <div className="max-w-6xl mx-auto space-y-7 pb-14">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/70">
        <div>
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            <span>SAMBUNG</span>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-primary font-bold">PORTAL SUPERVISI</span>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-foreground">PENGAWASAN SISTEM</span>
          </nav>

          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Pusat Pengawasan & Tata Kelola
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Pemantauan integritas transaksi simulasi, konfigurasi parameter harga, dan audit tata kelola platform.
          </p>
        </div>

        <Button
          onClick={() => onNavigate("admin-price-data")}
          variant="outline"
          className="self-start sm:self-auto gap-2 text-xs font-semibold border-border/80 shadow-2xs"
        >
          <Database className="w-3.5 h-3.5 text-primary" />
          <span>Data Observasi & Parameter</span>
        </Button>
      </div>

      {/* 4 Summary Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 bg-card border-border/80 shadow-xs space-y-2 rounded-2xl">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider">Tawaran Panen</span>
            <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="font-display font-mono text-3xl font-bold text-foreground tabular-nums">{offers.length}</p>
          <p className="text-[11px] text-muted-foreground">
            {offers.filter((o) => o.publicationStatus === "Terbit").length} pasokan aktif di katalog
          </p>
        </Card>

        <Card className="p-5 bg-card border-border/80 shadow-xs space-y-2 rounded-2xl">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">Kontrak Berjalan</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="font-display font-mono text-3xl font-bold text-primary tabular-nums">{activeContracts.length}</p>
          <p className="text-[11px] text-muted-foreground">
            Dalam tahap tawar atau disetujui
          </p>
        </Card>

        <Card className="p-5 bg-card border-border/80 shadow-xs space-y-2 rounded-2xl">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">Titik Observasi Harga</span>
            <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Database className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="font-display font-mono text-3xl font-bold text-foreground tabular-nums">
            {observations.length}
          </p>
          <p className="text-[11px] text-muted-foreground">
            Data harga pasar regional aktif
          </p>
        </Card>

        <Card className="p-5 bg-card border-border/80 shadow-xs space-y-2 rounded-2xl">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">Log Audit Aktivitas</span>
            <div className="w-7 h-7 rounded-lg bg-muted text-foreground flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-primary" />
            </div>
          </div>
          <p className="font-display font-mono text-3xl font-bold text-foreground tabular-nums">{auditLogs.length}</p>
          <p className="text-[11px] text-muted-foreground">
            Peristiwa bisnis terekam aman
          </p>
        </Card>
      </div>

      {/* Navigation Quick Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Data & Parameter Harga */}
        <Card className="p-6 bg-card border-border/80 shadow-xs rounded-2xl flex flex-col justify-between space-y-4">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-foreground font-bold">
              <Database className="w-5 h-5 text-primary" />
              <h3 className="text-base font-bold">Data & Parameter Harga</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Observasi data harga pasar lintas provinsi dan konfigurasi ambang batas toleransi HPP pemerintah.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate("admin-price-data")}
            className="w-full justify-between text-xs font-semibold border-border/80"
          >
            <span>Buka Observasi Harga</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Card>

        {/* Manajemen Pengguna */}
        <Card className="p-6 bg-card border-border/80 shadow-xs rounded-2xl flex flex-col justify-between space-y-4">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-foreground font-bold">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="text-base font-bold">Manajemen Pengguna</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Daftar akun petani dan pembeli. Nomor telepon tetap tersamar demi privasi sesuai tata kelola privasi platform.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate("admin-users")}
            className="w-full justify-between text-xs font-semibold border-border/80"
          >
            <span>Kelola Daftar Pengguna</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Card>

        {/* Evaluasi Model AI */}
        <Card className="p-6 bg-card border-border/80 shadow-xs rounded-2xl flex flex-col justify-between space-y-4">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-foreground font-bold">
              <Cpu className="w-5 h-5 text-primary" />
              <h3 className="text-base font-bold">Evaluasi Model AI</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Periksa metrik walk-forward MASE, horizon 2 & 4 pekan, dan status kelayakan publikasi model peramalan harga.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate("admin-model")}
            className="w-full justify-between text-xs font-semibold border-border/80"
          >
            <span>Lihat Evaluasi Model</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Card>
      </div>

      {/* Recent Audit Logs Table */}
      <Card className="p-6 bg-card border-border/80 shadow-xs rounded-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border/70">
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

        <div className="overflow-x-auto border border-border/80 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/80 bg-muted/40 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <th className="p-3">Waktu</th>
                <th className="p-3">Aktor</th>
                <th className="p-3">Aksi / Mutasi</th>
                <th className="p-3">Detail Peristiwa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {auditLogs.slice(0, 5).map((log) => (
                <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3 text-muted-foreground font-mono text-[11px] whitespace-nowrap">{log.timestamp}</td>
                  <td className="p-3 font-semibold text-foreground whitespace-nowrap">{log.actorName}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-muted text-foreground border border-border">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground truncate max-w-xs">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
