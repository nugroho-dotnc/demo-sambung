import { ContractStatus } from "@/types/domain"
import { Clock, CheckCircle2, Award, XCircle, Ban, AlertCircle } from "lucide-react"
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
      className: "bg-amber-50 text-amber-800 border-amber-300/80 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/80"
    },
    Disetujui: {
      label: confirmedCount === 1 ? "Disetujui (1/2 Selesai)" : "Disetujui",
      icon: CheckCircle2,
      className: "bg-emerald-50 text-emerald-800 border-emerald-300/80 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/80"
    },
    Selesai: {
      label: "Selesai (2/2)",
      icon: Award,
      className: "bg-primary/15 text-primary border-primary/30 font-bold dark:bg-primary/20 dark:text-primary"
    },
    Ditolak: {
      label: "Ditolak",
      icon: XCircle,
      className: "bg-destructive/10 text-destructive border-destructive/30"
    },
    Dibatalkan: {
      label: "Dibatalkan",
      icon: Ban,
      className: "bg-muted/80 text-muted-foreground border-border/80"
    },
    Kedaluwarsa: {
      label: "Kedaluwarsa (24 Jam)",
      icon: AlertCircle,
      className: "bg-muted/80 text-muted-foreground border-border/80 italic"
    }
  }

  const config = configs[status] || configs["Menunggu Kesepakatan"]
  const Icon = config.icon

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-2xs transition-colors",
        config.className,
        className
      )}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{config.label}</span>
    </span>
  )
}
