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
      <div className="relative w-full max-w-2xl bg-white text-zinc-900 rounded-3xl shadow-2xl overflow-hidden p-8 border border-zinc-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-100 transition-colors print:hidden cursor-pointer"
          aria-label="Tutup bukti simulasi"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Big Watermark Banner */}
        <div className="border border-red-500/30 rounded-2xl p-3.5 text-center mb-6 bg-red-50 text-red-800 flex items-center justify-center gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
          <div>
            <p className="font-bold text-xs tracking-wider uppercase">
              BUKTI SIMULASI DIGITAL RESMI : BUKAN BUKTI PEMBAYARAN NYATA
            </p>
            <p className="text-[10px] mt-0.5 text-red-700/80">
              Dokumen pencatatan kesepakatan harga gabah platform SAMBUNG
            </p>
          </div>
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
        </div>

        {/* Receipt Header */}
        <div className="flex items-center justify-between pb-6 border-b border-zinc-200">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#1B4D2E] text-white flex items-center justify-center font-bold shadow-xs">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-xl text-zinc-900 tracking-tight font-display">SAMBUNG</h2>
              <p className="text-xs text-zinc-500">Lembar Rekap Kesepakatan Transaksi Panen</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-zinc-600 font-mono font-bold">No. Dokumen: #{contract.id}</p>
            <p className="text-xs text-zinc-500 mt-0.5">
              Waktu: {new Date(contract.updatedAt).toLocaleDateString("id-ID")}
            </p>
          </div>
        </div>

        {/* Body Details */}
        <div className="py-6 space-y-6">
          {/* Parties */}
          <div className="grid grid-cols-2 gap-6 p-4 bg-zinc-50 rounded-2xl border border-zinc-200 text-xs">
            <div>
              <span className="text-zinc-500 uppercase text-[10px] font-bold tracking-wider">Pihak Penjual (Petani):</span>
              <p className="font-bold text-zinc-900 text-sm mt-1">{contract.farmerName}</p>
              <p className="text-zinc-500 text-[11px] mt-0.5">Wilayah: Kab. Ngawi, Jawa Timur</p>
            </div>
            <div className="border-l border-zinc-200 pl-4">
              <span className="text-zinc-500 uppercase text-[10px] font-bold tracking-wider">Pihak Pembeli (Penggilingan):</span>
              <p className="font-bold text-zinc-900 text-sm mt-1">{contract.buyerName}</p>
              <p className="text-zinc-500 text-[11px] mt-0.5">Wilayah: Kab. Madiun, Jawa Timur</p>
            </div>
          </div>

          {/* Commodity & Value */}
          <div className="border border-zinc-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  <th className="p-3">Uraian Komoditas</th>
                  <th className="p-3 text-right">Volume</th>
                  <th className="p-3 text-right">Harga Satuan</th>
                  <th className="p-3 text-right">Total Nilai</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 font-mono">
                <tr>
                  <td className="p-3.5 font-sans font-semibold text-zinc-900">
                    {contract.grainType} ({contract.grainType === "GKP" ? "Gabah Kering Panen" : "Gabah Kering Giling"})
                  </td>
                  <td className="p-3.5 text-right text-zinc-800">
                    {contract.volume.toLocaleString("id-ID")} kg
                  </td>
                  <td className="p-3.5 text-right text-zinc-800">
                    {formatRupiah(contract.activePrice)}
                  </td>
                  <td className="p-3.5 text-right font-bold text-[#1B4D2E] text-sm">
                    {formatRupiah(contract.activePrice * contract.volume)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Status and Signatures Notice */}
          <div className="pt-4 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-500">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Status Dokumen: <strong className="text-zinc-900">{contract.status.toUpperCase()}</strong></span>
            </span>
            <span className="italic text-[11px]">
              Tercatat pada mesin verifikasi audit SAMBUNG
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-zinc-200 flex justify-end gap-3 print:hidden">
          <Button variant="outline" size="sm" onClick={onClose} className="border-zinc-300 text-zinc-700 hover:bg-zinc-100">
            Tutup
          </Button>
          <Button onClick={handlePrint} size="sm" className="gap-2 font-semibold bg-[#1B4D2E] hover:bg-[#153e24] text-white">
            <Printer className="w-4 h-4" />
            <span>Cetak Dokumen</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
