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
      containerClass: "bg-price-within-surface text-price-within border-price-within/30 dark:bg-price-within-surface dark:text-price-within dark:border-price-within/40",
    },
    KUNING: {
      label: "Perlu Perhatian",
      detail: "Mendekati atau di luar batas wajar",
      icon: AlertTriangle,
      containerClass: "bg-price-caution-surface text-price-caution border-price-caution/30 dark:bg-price-caution-surface dark:text-price-caution dark:border-price-caution/40",
    },
    MERAH: {
      label: "Jauh di Bawah Wajar",
      detail: "Risiko kerugian harga jual",
      icon: AlertOctagon,
      containerClass: "bg-price-low-surface text-price-low border-price-low/40 dark:bg-price-low-surface dark:text-price-low dark:border-price-low/50",
    },
    TIDAK_TERSEDIA: {
      label: "Acuan Belum Tersedia",
      detail: "Data pasar historis belum cukup",
      icon: HelpCircle,
      containerClass: "bg-muted/80 text-muted-foreground border-border/80",
    }
  }

  const config = configs[status] || configs.TIDAK_TERSEDIA
  const Icon = config.icon

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1 rounded-md",
    default: "px-2.5 py-1 text-xs sm:text-sm gap-1.5 rounded-lg",
    lg: "px-3 py-1.5 text-sm gap-2 font-semibold rounded-lg"
  }

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    default: "w-4 h-4",
    lg: "w-4.5 h-4.5"
  }

  return (
    <div
      className={cn(
        "inline-flex items-center border font-medium shadow-2xs transition-colors",
        config.containerClass,
        sizeClasses[size],
        className
      )}
      title={config.detail}
    >
      <Icon className={cn("shrink-0", iconSizes[size])} />
      <span>{config.label}</span>
      {showDetailText && (
        <span className="opacity-80 text-xs font-normal">({config.detail})</span>
      )}
    </div>
  )
}
