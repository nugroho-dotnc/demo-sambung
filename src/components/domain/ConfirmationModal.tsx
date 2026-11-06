import { useState } from "react"
import { AlertOctagon, AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ConfirmationModalProps {
  isOpen: boolean
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: "danger" | "warning" | "default"
  requireReason?: boolean
  reasonPlaceholder?: string
  onConfirm: (reason?: string) => void
  onCancel: () => void
}

export function ConfirmationModal({
  isOpen,
  title,
  description,
  confirmText = "Lanjutkan",
  cancelText = "Kembali",
  variant = "warning",
  requireReason = false,
  reasonPlaceholder = "Tuliskan alasan...",
  onConfirm,
  onCancel
}: ConfirmationModalProps) {
  const [reason, setReason] = useState("")
  const [error, setError] = useState("")

  if (!isOpen) return null

  const handleConfirm = () => {
    if (requireReason && !reason.trim()) {
      setError("Alasan wajib diisi sebelum melanjutkan.")
      return
    }
    setError("")
    onConfirm(reason.trim())
    setReason("")
  }

  const handleCancel = () => {
    setError("")
    setReason("")
    onCancel()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-card text-card-foreground border border-border rounded-xl shadow-xl overflow-hidden p-6 sm:p-7">
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-md focus-visible:outline-2 focus-visible:outline-ring"
          aria-label="Tutup dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4 mb-4">
          <div
            className={`p-3 rounded-full shrink-0 ${
              variant === "danger"
                ? "bg-destructive/15 text-destructive"
                : "bg-price-caution-surface text-price-caution"
            }`}
          >
            {variant === "danger" ? (
              <AlertOctagon className="w-6 h-6" />
            ) : (
              <AlertTriangle className="w-6 h-6" />
            )}
          </div>
          <div>
            <h3 className="text-display-sm font-bold text-foreground">
              {title}
            </h3>
            <p className="text-body-sm text-muted-foreground mt-1.5 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {requireReason && (
          <div className="mt-4 mb-4">
            <label className="block text-body-sm font-semibold text-foreground mb-1.5">
              Alasan Pembatalan / Penolakan <span className="text-destructive">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                if (error) setError("")
              }}
              placeholder={reasonPlaceholder}
              rows={3}
              className="w-full rounded-md border border-input bg-card p-3 text-body-base text-foreground placeholder:text-muted-foreground focus-visible:outline-[3px] focus-visible:outline-ring"
            />
            {error && <p className="text-xs text-destructive mt-1 font-medium">{error}</p>}
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6 pt-4 border-t border-border">
          <Button variant="outline" onClick={handleCancel}>
            {cancelText}
          </Button>
          <Button
            variant={variant === "danger" ? "destructive" : "default"}
            onClick={handleConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}
