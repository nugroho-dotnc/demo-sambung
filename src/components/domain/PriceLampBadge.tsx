import { PriceLampStatus } from "@/types/domain"
import { CheckCircle2, AlertTriangle, AlertOctagon, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface PriceLampBadgeProps {
  status: PriceLampStatus
  size?: "sm" | "default" | "lg"
  showDetailText?: boolean
  className?: string
}

export function PriceLampBadge({
  status,
  size = "default",
  showDetailText = false,
  className
}: PriceLampBadgeProps) {
  const configs = {
    HIJAU: {
      label: "Dalam Rentang Wajar",
      detail: "Harga sesuai estimasi pasar",
      icon: CheckCircle2,
      containerClass: "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/80",
      dotClass: "bg-emerald-500",
    },
    KUNING: {
      label: "Perlu Perhatian",
      detail: "Mendekati atau di luar batas wajar",
      icon: AlertTriangle,
      containerClass: "bg-amber-50 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800/80",
      dotClass: "bg-amber-500",
    },
    MERAH: {
      label: "Jauh di Bawah Wajar",
      detail: "Risiko kerugian harga jual",
      icon: AlertOctagon,
      containerClass: "bg-red-50 text-red-800 border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800/80",
      dotClass: "bg-red-500",
    },
    TIDAK_TERSEDIA: {
      label: "Acuan Belum Tersedia",
      detail: "Data pasar historis belum cukup",
      icon: HelpCircle,
      containerClass: "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700",
      dotClass: "bg-slate-400",
    }
  }

  const config = configs[status] || configs.TIDAK_TERSEDIA
  const Icon = config.icon

  const sizeClasses = {
    sm: "px-2.5 py-0.5 text-xs gap-1.5 rounded-lg",
    default: "px-3 py-1 text-xs sm:text-sm gap-2 rounded-xl",
    lg: "px-3.5 py-1.5 text-sm gap-2.5 font-semibold rounded-xl"
  }

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    default: "w-4 h-4",
    lg: "w-4.5 h-4.5"
  }

  return (
    <div
      className={cn(
        "inline-flex items-center border font-semibold shadow-2xs transition-all duration-150 select-none",
        config.containerClass,
        sizeClasses[size],
        className
      )}
      title={config.detail}
    >
      <Icon className={cn("shrink-0", iconSizes[size])} />
      <span>{config.label}</span>
      {showDetailText && (
        <span className="opacity-80 text-xs font-normal">· {config.detail}</span>
      )}
    </div>
  )
}
