import { useId } from "react"
import { AlertOctagon, AlertTriangle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { PriceLampStatus } from "@/types/domain"

interface PriceRangeSliderProps {
  value: number
  min: number
  max: number
  lowerBound: number
  upperBound: number
  tolerancePercent: number
  onChange: (value: number) => void
  label: string
  askingPrice?: number
  disabled?: boolean
}

const statusMeta: Record<PriceLampStatus, { label: string; icon: typeof CheckCircle2 }> = {
  HIJAU: { label: "Dalam rentang wajar", icon: CheckCircle2 },
  KUNING: { label: "Perlu perhatian", icon: AlertTriangle },
  MERAH: { label: "Jauh di bawah rentang", icon: AlertOctagon },
  TIDAK_TERSEDIA: { label: "Acuan belum tersedia", icon: AlertTriangle },
}

function getStatus(value: number, lower: number, upper: number, tolerance: number): PriceLampStatus {
  if (!lower || !upper) return "TIDAK_TERSEDIA"
  if (value >= lower && value <= upper) return "HIJAU"
  if (value >= lower * (1 - tolerance) || value > upper) return "KUNING"
  return "MERAH"
}

export function PriceRangeSlider({
  value,
  min,
  max,
  lowerBound,
  upperBound,
  tolerancePercent,
  onChange,
  label,
  askingPrice,
  disabled = false,
}: PriceRangeSliderProps) {
  const id = useId()
  const redEnd = Math.max(min, lowerBound * (1 - tolerancePercent))
  const yellowStart = Math.max(redEnd, lowerBound)
  const clampedValue = Math.min(max, Math.max(min, value))
  const status = getStatus(value, lowerBound, upperBound, tolerancePercent)
  const MetaIcon = statusMeta[status].icon
  const position = (amount: number) => Math.min(100, Math.max(0, ((amount - min) / Math.max(1, max - min)) * 100))
  const percent = position(clampedValue)
  const redEndPosition = position(redEnd)
  const yellowStartPosition = position(yellowStart)
  const upperBoundPosition = position(upperBound)

  return (
    <fieldset className="price-slider rounded-2xl border border-border bg-card p-5 shadow-xs" disabled={disabled}>
      <legend className="sr-only">{label}</legend>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-foreground font-display">{label}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Geser pengatur untuk memilih nominal harga per kilogram.</p>
        </div>
        <div className="text-right">
          <output htmlFor={id} className="price-slider-value price-value text-2xl font-extrabold text-foreground font-display tracking-tight">
            Rp{value.toLocaleString("id-ID")}
          </output>
          <p className="text-[11px] text-muted-foreground font-medium">per kilogram</p>
        </div>
      </div>

      <div className="relative mt-6 px-1">
        <div className="price-slider-track h-2.5 rounded-full overflow-hidden" aria-hidden="true">
          <span className="price-slider-zone bg-red-400 dark:bg-red-600" style={{ width: `${redEndPosition}%` }} />
          <span className="price-slider-zone bg-amber-400 dark:bg-amber-500" style={{ left: `${redEndPosition}%`, width: `${yellowStartPosition - redEndPosition}%` }} />
          <span className="price-slider-zone bg-emerald-500 dark:bg-emerald-400" style={{ left: `${yellowStartPosition}%`, width: `${upperBoundPosition - yellowStartPosition}%` }} />
          <span className="price-slider-zone bg-amber-400 dark:bg-amber-500" style={{ left: `${upperBoundPosition}%`, right: 0 }} />
        </div>
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={1}
          value={clampedValue}
          onChange={(event) => onChange(Number(event.target.value))}
          aria-label={label}
          className="price-slider-input"
        />
        <span className="price-slider-thumb" style={{ left: `${percent}%` }} aria-hidden="true" />
        <span className="price-slider-marker w-0.5 h-4 bg-foreground/60 rounded-full" style={{ left: `${position(lowerBound)}%` }} aria-hidden="true" />
        <span className="price-slider-marker w-0.5 h-4 bg-foreground/60 rounded-full" style={{ left: `${upperBoundPosition}%` }} aria-hidden="true" />
      </div>

      <div className="mt-2.5 grid grid-cols-3 items-start text-[11px] font-mono leading-tight text-muted-foreground">
        <span>Rp{min.toLocaleString("id-ID")}</span>
        <span className="text-center font-sans font-semibold text-foreground/80">
          Acuan Rentang Wajar<br />
          <span className="font-mono text-emerald-700 dark:text-emerald-400">Rp{lowerBound.toLocaleString("id-ID")} - Rp{upperBound.toLocaleString("id-ID")}</span>
        </span>
        <span className="text-right">Rp{max.toLocaleString("id-ID")}</span>
      </div>

      <div className={cn("mt-4 flex items-start gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-medium border shadow-2xs", {
        "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900": status === "HIJAU",
        "bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-900": status === "KUNING",
        "bg-red-50 text-red-800 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-900": status === "MERAH",
        "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700": status === "TIDAK_TERSEDIA",
      })}>
        <MetaIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="leading-relaxed">
          <strong>{statusMeta[status].label}</strong>. {askingPrice && status === "HIJAU" ? `Harga minta petani Rp${askingPrice.toLocaleString("id-ID")}/kg.` : "Periksa alasan dan detail acuan sebelum melanjutkan."}
        </span>
      </div>
    </fieldset>
  )
}
