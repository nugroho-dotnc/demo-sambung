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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-card text-card-foreground border border-border rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-7">
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
          aria-label="Tutup dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4 mb-4">
          <div
            className={`p-3 rounded-2xl shrink-0 shadow-xs ${
              variant === "danger"
                ? "bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-900"
                : "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900"
            }`}
          >
            {variant === "danger" ? (
              <AlertOctagon className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-foreground tracking-tight">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {requireReason && (
          <div className="mt-4 mb-4">
            <label className="block text-xs font-semibold text-foreground mb-1.5">
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
              className="w-full rounded-xl border border-border bg-card p-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all hover:border-slate-300 dark:hover:border-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent focus-visible:ring-offset-1 focus-visible:ring-offset-background shadow-2xs"
            />
            {error && <p className="text-xs text-destructive mt-1 font-medium">{error}</p>}
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6 pt-4 border-t border-border">
          <Button variant="outline" size="default" onClick={handleCancel}>
            {cancelText}
          </Button>
          <Button
            variant={variant === "danger" ? "destructive" : "default"}
            size="default"
            onClick={handleConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}
