import { useSambungStore } from "@/store/sambungStore"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Shield } from "lucide-react"

interface AdminAuditLogPageProps {
  onBack?: () => void
}

export function AdminAuditLogPage({ onBack: _onBack }: AdminAuditLogPageProps) {
  const { auditLogs } = useSambungStore()

  return (
    <div className="w-full space-y-6">
      {/* Breadcrumb & Header */}
      <div className="pt-1 border-b border-border/80 pb-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
          <span className="font-medium">Sambung</span>
          <span className="text-muted-foreground/60">/</span>
          <span className="font-medium text-foreground">Log Audit Sistem</span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight">
          Log Audit Peristiwa Bisnis
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
          Catatan kronologis mutasi status transaksi, perubahan parameter, dan aksi operasional pengguna.
        </p>
      </div>

      {/* Main Table Card */}
      <Card className="rounded-xl border border-border/80 overflow-hidden shadow-2xs">
        <CardHeader className="py-4 px-5 sm:px-6 border-b border-border/80 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold text-foreground">
            Daftar Aktivitas Sistem Terlacak ({auditLogs.length} Entri)
          </CardTitle>
          <div className="flex items-center gap-1.5 text-xs text-primary font-medium bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
            <Shield className="w-3.5 h-3.5" />
            <span>Kredensial & OTP tidak dicatat</span>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/80 bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Waktu</th>
                <th className="py-3 px-4 font-semibold">Pelaku (Peran)</th>
                <th className="py-3 px-4 font-semibold">Aksi Bisnis</th>
                <th className="py-3 px-4 font-semibold">Target Objek</th>
                <th className="py-3 px-4 font-semibold">Rincian Peristiwa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-muted-foreground whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString("id-ID")}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-foreground whitespace-nowrap">
                    {log.actorName}{" "}
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-secondary text-secondary-foreground border border-border/40 ml-1">
                      {log.actorRole}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-primary whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-muted-foreground whitespace-nowrap">
                    {log.targetType}: #{log.targetId}
                  </td>
                  <td className="py-3.5 px-4 text-foreground leading-relaxed">
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
