import { ContractStatus } from "@/types/domain"
import { Clock, CheckCircle, Award, XCircle, Ban, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ContractStatusBadgeProps {
  status: ContractStatus
  confirmedCount?: number // 0, 1, atau 2
  className?: string
}

export function ContractStatusBadge({ status, confirmedCount, className }: ContractStatusBadgeProps) {
  const configs: Record<ContractStatus, { label: string; icon: React.ElementType; className: string }> = {
    "Menunggu Kesepakatan": {
      label: "Menunggu Kesepakatan",
      icon: Clock,
      className: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800"
    },
    Disetujui: {
      label: confirmedCount === 1 ? "Disetujui (1/2 Selesai)" : "Disetujui",
      icon: CheckCircle,
      className: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800"
    },
    Selesai: {
      label: "Selesai (2/2)",
      icon: Award,
      className: "bg-primary/15 text-primary border-primary/30 font-bold"
    },
    Ditolak: {
      label: "Ditolak",
      icon: XCircle,
      className: "bg-destructive/15 text-destructive border-destructive/30"
    },
    Dibatalkan: {
      label: "Dibatalkan",
      icon: Ban,
      className: "bg-muted text-muted-foreground border-border"
    },
    Kedaluwarsa: {
      label: "Kedaluwarsa (24 Jam)",
      icon: AlertCircle,
      className: "bg-muted text-muted-foreground border-border italic"
    }
  }

  const config = configs[status] || configs["Menunggu Kesepakatan"]
  const Icon = config.icon

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border",
        config.className,
        className
      )}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{config.label}</span>
    </span>
  )
}
