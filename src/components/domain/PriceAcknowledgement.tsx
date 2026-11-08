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
    <div className={`p-4.5 rounded-2xl border border-red-300 dark:border-red-900 bg-red-50/70 dark:bg-red-950/40 space-y-3.5 shadow-2xs ${className}`}>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300 shrink-0 mt-0.5">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div className="text-xs leading-relaxed">
          <p className="font-bold text-red-900 dark:text-red-200">
            Peringatan: Harga Jauh di Bawah Rentang Wajar
          </p>
          <p className="text-red-800/80 dark:text-red-300/80 mt-0.5">
            Harga Rp{price.toLocaleString("id-ID")}/kg berada {diffStr} di bawah batas acuan wajar pemerintah (Rp{lowerBound.toLocaleString("id-ID")}/kg). Menyetujui atau menerbitkan harga ini berisiko menurunkan pendapatan petani.
          </p>
        </div>
      </div>

      <label className="flex items-start gap-3 p-2.5 rounded-xl bg-white/70 dark:bg-red-900/30 border border-red-200 dark:border-red-800/60 hover:bg-white dark:hover:bg-red-900/50 transition-colors cursor-pointer select-none min-h-[44px]">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="mt-0.5 w-4.5 h-4.5 rounded border-red-400 text-red-600 focus:ring-red-500 cursor-pointer accent-[#DC2626]"
        />
        <span className="text-xs font-semibold text-foreground leading-normal">
          Saya memahami peringatan harga ini dan ingin melanjutkan transaksi dengan harga tersebut secara sadar.
        </span>
      </label>
    </div>
  )
}
