import { useSambungStore } from "@/store/sambungStore"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield } from "lucide-react"

interface AdminAuditLogPageProps {
  onBack: () => void
}

export function AdminAuditLogPage({ onBack }: AdminAuditLogPageProps) {
  const { auditLogs } = useSambungStore()

  return (
    <div className="app-wrap space-y-8 pb-16">
      {/* Header */}
      <div className="pt-2 border-b border-border/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 mb-2 text-xs">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Ringkasan Admin</span>
          </Button>
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            <span>SAMBUNG</span>
            <span>/</span>
            <span className="text-foreground">LOG AUDIT SISTEM</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
            Log Audit Peristiwa Bisnis
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Catatan kronologis mutasi status transaksi, perubahan parameter, dan aksi operasional pengguna.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
          <CardTitle className="text-base">Daftar Aktivitas Sistem Terlacak ({auditLogs.length} Entri)</CardTitle>
          <div className="flex items-center gap-1.5 text-xs text-primary font-semibold">
            <Shield className="w-3.5 h-3.5" />
            <span>Kredensial & OTP tidak dicatat</span>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-body-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-xs font-bold text-muted-foreground uppercase">
                <th className="py-3 px-4">Waktu</th>
                <th className="py-3 px-4">Pelaku (Peran)</th>
                <th className="py-3 px-4">Aksi Bisnis</th>
                <th className="py-3 px-4">Target Objek</th>
                <th className="py-3 px-4">Rincian Peristiwa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-accent/40 transition-colors">
                  <td className="py-3 px-4 font-mono text-muted-foreground whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString("id-ID")}
                  </td>
                  <td className="py-3 px-4 font-semibold text-foreground whitespace-nowrap">
                    {log.actorName}{" "}
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground ml-1">
                      {log.actorRole}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-primary whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 font-mono text-muted-foreground whitespace-nowrap">
                    {log.targetType}: #{log.targetId}
                  </td>
                  <td className="py-3 px-4 text-foreground leading-relaxed">
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
