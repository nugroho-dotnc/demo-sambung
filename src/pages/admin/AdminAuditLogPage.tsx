import { useSambungStore } from "@/store/sambungStore"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Shield } from "lucide-react"

interface AdminAuditLogPageProps {
  onBack?: () => void
}

export function AdminAuditLogPage({ onBack: _onBack }: AdminAuditLogPageProps) {
  const { auditLogs } = useSambungStore()

  return (
    <div className="max-w-6xl mx-auto space-y-7 pb-14">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/70">
        <div>
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            <span>SAMBUNG</span>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-primary font-bold">ADMIN</span>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-foreground">LOG AUDIT SISTEM</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight">
            Log Audit Peristiwa Bisnis
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
            Catatan kronologis mutasi status transaksi, perubahan parameter harga, dan aksi operasional pengguna secara tamper-evident.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-primary font-semibold bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/20">
          <Shield className="w-3.5 h-3.5" />
          <span>Kredensial & OTP Tidak Dicatat</span>
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="rounded-2xl border border-border/80 overflow-hidden shadow-xs bg-card">
        <CardHeader className="py-4 px-6 border-b border-border/70 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold text-foreground">
            Daftar Aktivitas Sistem Terlacak ({auditLogs.length} Entri)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/80 bg-muted/40 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-5 font-semibold">Waktu Terjadi</th>
                <th className="py-3 px-5 font-semibold">Pelaku (Peran)</th>
                <th className="py-3 px-5 font-semibold">Aksi Bisnis</th>
                <th className="py-3 px-5 font-semibold">Target Objek</th>
                <th className="py-3 px-5 font-semibold">Rincian Peristiwa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3.5 px-5 font-mono text-muted-foreground whitespace-nowrap text-[11px]">
                    {new Date(log.timestamp).toLocaleString("id-ID")}
                  </td>
                  <td className="py-3.5 px-5 font-semibold text-foreground whitespace-nowrap">
                    {log.actorName}{" "}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground border border-border/60 ml-1">
                      {log.actorRole}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 font-semibold text-primary whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="py-3.5 px-5 font-mono text-muted-foreground whitespace-nowrap">
                    {log.targetType}: #{log.targetId}
                  </td>
                  <td className="py-3.5 px-5 text-foreground leading-relaxed">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
