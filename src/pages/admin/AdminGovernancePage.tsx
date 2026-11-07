import { useState } from "react"
import { AdminUsersPage } from "@/pages/admin/AdminUsersPage"
import { AdminAuditLogPage } from "@/pages/admin/AdminAuditLogPage"
import { AdminModelEvalPage } from "@/pages/admin/AdminModelEvalPage"
import { Card } from "@/components/ui/card"
import { Users, History, Cpu } from "lucide-react"

interface AdminGovernancePageProps {
  onBack: () => void
  initialSubTab?: "users" | "audit" | "model"
}

export function AdminGovernancePage({ onBack, initialSubTab = "users" }: AdminGovernancePageProps) {
  const [subTab, setSubTab] = useState<"users" | "audit" | "model">(initialSubTab)

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Module Navigation Tabs */}
      <Card className="p-2 bg-card/95 backdrop-blur-md border border-border/80 sticky top-16 z-30 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setSubTab("users")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-colors cursor-pointer ${
              subTab === "users"
                ? "bg-primary text-white dark:text-[#182117] shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Manajemen Pengguna</span>
          </button>

          <button
            onClick={() => setSubTab("audit")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-colors cursor-pointer ${
              subTab === "audit"
                ? "bg-primary text-white dark:text-[#182117] shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Log Audit Sistem</span>
          </button>

          <button
            onClick={() => setSubTab("model")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-colors cursor-pointer ${
              subTab === "model"
                ? "bg-primary text-white dark:text-[#182117] shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Evaluasi Model AI</span>
          </button>
        </div>
      </Card>

      {/* Subpage Content */}
      <div>
        {subTab === "users" && <AdminUsersPage onBack={onBack} />}
        {subTab === "audit" && <AdminAuditLogPage onBack={onBack} />}
        {subTab === "model" && <AdminModelEvalPage onBack={onBack} />}
      </div>
    </div>
  )
}
