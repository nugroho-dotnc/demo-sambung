import { KontrakSimulasi } from "@/types/domain"
import { formatRupiah } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Printer, X, Sprout, ShieldCheck, AlertTriangle } from "lucide-react"

interface SimulationReceiptModalProps {
  isOpen: boolean
  contract: KontrakSimulasi
  onClose: () => void
}

export function SimulationReceiptModal({ isOpen, contract, onClose }: SimulationReceiptModalProps) {
  if (!isOpen) return null

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white text-zinc-900 rounded-2xl shadow-2xl overflow-hidden p-8 border border-zinc-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-700 rounded-md print:hidden"
          aria-label="Tutup bukti simulasi"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Big Watermark Banner */}
        <div className="border-2 border-dashed border-red-500/40 rounded-xl p-3 text-center mb-6 bg-red-50 text-red-700 flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
          <div>
            <p className="font-extrabold text-xs tracking-wider uppercase">
              BUKTI SIMULASI DIGITAL RESMI — BUKAN BUKTI PEMBAYARAN NYATA
            </p>
            <p className="text-[10px] mt-0.5 opacity-90">
              Sistem Informasi Harga & Transaksi Simulasi Gabah SAMBUNG
            </p>
          </div>
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
        </div>

        {/* Receipt Header */}
        <div className="flex items-center justify-between pb-6 border-b border-zinc-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-extrabold text-xl text-zinc-900 tracking-tight">SAMBUNG</h2>
              <p className="text-xs text-zinc-500">Lembar Rekap Kesepakatan Simulasi</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-zinc-500 font-mono">No. Dokumen: #{contract.id}</p>
            <p className="text-xs text-zinc-500">
              Waktu: {new Date(contract.updatedAt).toLocaleDateString("id-ID")}
            </p>
          </div>
        </div>

        {/* Body Details */}
        <div className="py-6 space-y-6">
          {/* Parties */}
          <div className="grid grid-cols-2 gap-6 p-4 bg-zinc-50 rounded-xl border border-zinc-200 text-xs">
            <div>
              <span className="text-zinc-500 uppercase font-bold tracking-wider">Pihak Penjual:</span>
              <p className="font-bold text-zinc-900 text-sm mt-1">{contract.farmerName}</p>
              <p className="text-zinc-600 mt-0.5">Kontak: {contract.farmerPhone}</p>
            </div>
            <div className="border-l border-zinc-200 pl-4">
              <span className="text-zinc-500 uppercase font-bold tracking-wider">Pihak Pembeli:</span>
              <p className="font-bold text-zinc-900 text-sm mt-1">{contract.buyerName}</p>
              <p className="text-zinc-600 mt-0.5">Kontak: {contract.buyerPhone}</p>
            </div>
          </div>

          {/* Commodity & Value */}
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 text-xs font-bold text-zinc-500 uppercase">
                <th className="py-2">Uraian Komoditas</th>
                <th className="py-2 text-right">Volume (kg)</th>
                <th className="py-2 text-right">Harga Satuan</th>
                <th className="py-2 text-right">Total Nilai</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              <tr>
                <td className="py-3 font-semibold text-zinc-900">
                  {contract.grainType} (Gabah {contract.grainType === "GKP" ? "Kering Panen" : "Kering Giling"})
                </td>
                <td className="py-3 text-right font-mono text-zinc-900">
                  {contract.volume.toLocaleString("id-ID")} kg
                </td>
                <td className="py-3 text-right font-mono text-zinc-900">
                  {formatRupiah(contract.activePrice)}
                </td>
                <td className="py-3 text-right font-mono font-bold text-emerald-800 text-base">
                  {formatRupiah(contract.activePrice * contract.volume)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Status and Signatures Notice */}
          <div className="pt-4 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Status Dokumen: <strong>{contract.status.toUpperCase()}</strong></span>
            </span>
            <span className="italic">
              Tercatat pada mesin status audit SAMBUNG v0.2
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-zinc-200 flex justify-end gap-3 print:hidden">
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
          <Button onClick={handlePrint} size="sm" className="gap-2 font-semibold">
            <Printer className="w-4 h-4" />
            <span>Cetak Dokumen</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
