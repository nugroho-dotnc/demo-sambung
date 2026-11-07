import { AlertTriangle } from "lucide-react"

interface PriceAcknowledgementProps {
  checked: boolean
  onChange: (checked: boolean) => void
  price: number
  lowerBound: number
  diffPercent?: number
  disabled?: boolean
  className?: string
}

export function PriceAcknowledgement({
  checked,
  onChange,
  price,
  lowerBound,
  diffPercent,
  disabled = false,
  className = ""
}: PriceAcknowledgementProps) {
  const diffStr = diffPercent !== undefined
    ? `${diffPercent}%`
    : `${Math.abs(Math.round(((price - lowerBound) / lowerBound) * 100))}%`

  return (
    <div className={`p-4 rounded-xl border border-destructive/30 bg-destructive/5 space-y-3 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-destructive/10 text-destructive shrink-0 mt-0.5">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div className="text-xs leading-relaxed">
          <p className="font-bold text-destructive">
            Peringatan: Harga Jauh di Bawah Rentang Wajar
          </p>
          <p className="text-muted-foreground mt-0.5">
            Harga Rp{price.toLocaleString("id-ID")}/kg berada {diffStr} di bawah batas acuan wajar pemerintah (Rp{lowerBound.toLocaleString("id-ID")}/kg). Menyetujui atau menerbitkan harga ini berisiko menurunkan pendapatan petani.
          </p>
        </div>
      </div>

      <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-destructive/10 transition-colors cursor-pointer select-none min-h-[44px]">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="mt-0.5 w-5 h-5 rounded border-destructive text-destructive focus:ring-destructive cursor-pointer accent-[#9B3529]"
        />
        <span className="text-xs font-semibold text-foreground leading-normal">
          Saya memahami peringatan harga ini dan ingin melanjutkan transaksi dengan harga tersebut.
        </span>
      </label>
    </div>
  )
}
