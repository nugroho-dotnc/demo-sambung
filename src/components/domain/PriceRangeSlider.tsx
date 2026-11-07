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
    <fieldset className="price-slider rounded-xl border border-border bg-card p-4" disabled={disabled}>
      <legend className="sr-only">{label}</legend>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-body-sm font-semibold text-foreground">{label}</p>
          <p className="mt-1 text-body-sm text-muted-foreground">Geser untuk memilih harga per kg.</p>
        </div>
        <output htmlFor={id} className="price-slider-value price-value text-xl font-bold text-foreground">
          Rp{value.toLocaleString("id-ID")}
        </output>
      </div>

      <div className="relative mt-5 px-1">
        <div className="price-slider-track" aria-hidden="true">
          <span className="price-slider-zone price-slider-zone-red" style={{ width: `${redEndPosition}%` }} />
          <span className="price-slider-zone price-slider-zone-yellow" style={{ left: `${redEndPosition}%`, width: `${yellowStartPosition - redEndPosition}%` }} />
          <span className="price-slider-zone price-slider-zone-green" style={{ left: `${yellowStartPosition}%`, width: `${upperBoundPosition - yellowStartPosition}%` }} />
          <span className="price-slider-zone price-slider-zone-yellow" style={{ left: `${upperBoundPosition}%`, right: 0 }} />
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
        <span className="price-slider-marker" style={{ left: `${position(lowerBound)}%` }} aria-hidden="true" />
        <span className="price-slider-marker" style={{ left: `${upperBoundPosition}%` }} aria-hidden="true" />
      </div>

      <div className="mt-2 grid grid-cols-3 items-start text-[11px] leading-tight text-muted-foreground">
        <span>Rp{min.toLocaleString("id-ID")}</span>
        <span className="text-center font-medium text-foreground/70">Acuan<br />Rp{lowerBound.toLocaleString("id-ID")} - {upperBound.toLocaleString("id-ID")}</span>
        <span className="text-right">Rp{max.toLocaleString("id-ID")}</span>
      </div>

      <div className={cn("mt-3 flex items-start gap-2 rounded-md px-2.5 py-2 text-xs", {
        "bg-price-within-surface text-price-within": status === "HIJAU",
        "bg-price-caution-surface text-price-caution": status === "KUNING",
        "bg-price-low-surface text-price-low": status === "MERAH",
        "bg-muted text-foreground": status === "TIDAK_TERSEDIA",
      })}>
        <MetaIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>{statusMeta[status].label}. {askingPrice && status === "HIJAU" ? `Harga minta petani Rp${askingPrice.toLocaleString("id-ID")}/kg.` : "Periksa alasan dan detail acuan sebelum melanjutkan."}</span>
      </div>
    </fieldset>
  )
}
