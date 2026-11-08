import { useState } from "react"
import { useSambungStore } from "@/store/sambungStore"
import { ConfirmationModal } from "@/components/domain/ConfirmationModal"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Moon,
  Sun,
  AlertTriangle,
  LogOut,
  HelpCircle,
  FileText,
  UserCheck
} from "lucide-react"

interface ProfilePageProps {
  onNavigate: (tab: string) => void
}

export function ProfilePage({ onNavigate }: ProfilePageProps) {
  const { currentUser, currentRole, setRole, theme, toggleTheme, contracts } = useSambungStore()
  const [showCloseAccountModal, setShowCloseAccountModal] = useState(false)
  const [closureRequested, setClosureRequested] = useState(false)

  const activeTransactions = contracts.filter(
    (c) => c.status === "Menunggu Kesepakatan" || c.status === "Disetujui"
  )

  const handleRequestCloseAccount = () => {
    setClosureRequested(true)
    setShowCloseAccountModal(false)
    alert("Permohonan penutupan akun dicatat. Transaksi baru tidak lagi dapat dibuat. Transaksi yang masih berjalan tetap harus diselesaikan.")
  }

  const handleLogout = () => {
    setRole("public")
    onNavigate("public-home")
  }

  return (
    <div className="max-w-6xl mx-auto space-y-7 pb-14">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/70">
        <div>
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            <span>SAMBUNG</span>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-foreground">PROFIL & PREFERENSI</span>
          </nav>

          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Profil dan Pengaturan Akun
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Informasi identitas ruang kerja, preferensi visual aplikasi, dan pengaturan status akun Anda.
          </p>
        </div>

        <Badge variant="outline" className="self-start sm:self-auto font-mono text-xs px-3 py-1 border-border/80">
          ID Anggota: {currentUser.id}
        </Badge>
      </div>

      {closureRequested && (
        <Card className="p-4 bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs rounded-2xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <p className="font-bold">Permohonan Penutupan Akun Sedang Diproses</p>
              <p className="mt-0.5">
                Akun Anda dalam status penutupan tertunda. Anda tidak dapat membuat tawaran atau pesanan baru. Sebanyak {activeTransactions.length} transaksi aktif masih dapat diselesaikan atau dibatalkan secara sah.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Identitas Akun */}
      <Card className="p-6 bg-card border-border/80 shadow-xs space-y-4 rounded-2xl">
        <div className="flex items-center gap-2 pb-2 border-b border-border/70">
          <UserCheck className="w-4 h-4 text-primary" />
          <h2 className="font-bold text-base text-foreground">Identitas Ruang Kerja</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-muted/40 border border-border/70 space-y-1">
            <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">Nama Pengguna / Usaha:</span>
            <p className="text-sm font-bold text-foreground">{currentUser.name}</p>
            <p className="text-[11px] text-muted-foreground">{currentUser.businessName || "Kelompok Tani Terdaftar"}</p>
          </div>

          <div className="p-4 rounded-xl bg-muted/40 border border-border/70 space-y-1">
            <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">Peran Terverifikasi:</span>
            <div className="flex items-center gap-2 pt-0.5">
              <Badge variant="default" className="uppercase font-bold text-[10px]">
                {currentRole}
              </Badge>
              <span className="text-[11px] text-muted-foreground">Hak akses berbasis peran aktif</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-muted/40 border border-border/70 space-y-1">
            <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">Wilayah Operasional:</span>
            <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span>{currentUser.regency || "Kab. Ngawi"}, {currentUser.province || "Jawa Timur"}</span>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-muted/40 border border-border/70 space-y-1">
            <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">Nomor Kontak Tersamar:</span>
            <p className="text-sm font-mono font-semibold text-foreground">
              {currentUser.phone ? currentUser.phone.replace(/(\d{4})\d{4}(\d{3})/, "$1-****-$2") : "0812-****-789"}
            </p>
            <p className="text-[10px] text-muted-foreground">Hanya terbuka bagi mitra saat kontrak disetujui.</p>
          </div>
        </div>
      </Card>

      {/* Preferensi Tampilan */}
      <Card className="p-6 bg-card border-border/80 shadow-xs space-y-4 rounded-2xl">
        <h2 className="font-bold text-base text-foreground">Preferensi Visual</h2>
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40 border border-border/70">
          <div>
            <p className="text-xs font-bold text-foreground">Tema Antarmuka</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Beralih antara tema Terang (Light) dan Gelap (Dark) untuk kenyamanan pandangan Anda.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="gap-2 text-xs border-border/80"
          >
            {theme === "dark" ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-primary" />}
            <span>{theme === "dark" ? "Mode Terang" : "Mode Gelap"}</span>
          </Button>
        </div>
      </Card>

      {/* Bantuan & Kebijakan */}
      <Card className="p-6 bg-card border-border/80 shadow-xs space-y-4 rounded-2xl">
        <h2 className="font-bold text-base text-foreground">Pusat Bantuan & Kebijakan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <Button
            variant="outline"
            onClick={() => onNavigate("help")}
            className="justify-start gap-3 h-auto py-3.5 px-4 text-left border-border/80 hover:border-primary/40"
          >
            <FileText className="w-4 h-4 text-primary shrink-0" />
            <div>
              <p className="font-bold text-foreground">Ketentuan & Kebijakan Data</p>
              <p className="text-[11px] text-muted-foreground font-normal">Transparansi hak data dan batasan simulasi pasar.</p>
            </div>
          </Button>

          <Button
            variant="outline"
            onClick={() => onNavigate("help")}
            className="justify-start gap-3 h-auto py-3.5 px-4 text-left border-border/80 hover:border-primary/40"
          >
            <HelpCircle className="w-4 h-4 text-primary shrink-0" />
            <div>
              <p className="font-bold text-foreground">Panduan Alur 5 Tindakan</p>
              <p className="text-[11px] text-muted-foreground font-normal">Tata cara transaksi panen gabah aman & transparan.</p>
            </div>
          </Button>
        </div>

        <div className="pt-2 flex justify-end">
          <Button
            variant="outline"
            onClick={handleLogout}
            className="gap-2 text-xs text-destructive hover:bg-destructive/10 border-border/80"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Akun Ruang Kerja</span>
          </Button>
        </div>
      </Card>

      {/* Bagian Terpisah: Penutupan Akun (C15) */}
      <Card className="p-6 space-y-3 border-destructive/30 bg-destructive/5 rounded-2xl">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-destructive/10 text-destructive mt-0.5">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-destructive">Permohonan Penutupan Akun</h3>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Penutupan akun menghentikan hak untuk membuat tawaran baru atau pesanan baru. Transaksi aktif yang sedang berjalan tetap harus diselesaikan atau dibatalkan oleh para pihak. Data transaksi lama tetap diarsipkan dalam log audit secara tersamar.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button
            variant="destructive"
            size="sm"
            disabled={closureRequested}
            onClick={() => setShowCloseAccountModal(true)}
            className="text-xs"
          >
            {closureRequested ? "Permohonan Sudah Diajukan" : "Minta Penutupan Akun"}
          </Button>
        </div>
      </Card>

      {/* Confirmation Modal Penutupan Akun (C15) */}
      <ConfirmationModal
        isOpen={showCloseAccountModal}
        onCancel={() => setShowCloseAccountModal(false)}
        onConfirm={handleRequestCloseAccount}
        title="Ajukan Penutupan Akun SAMBUNG?"
        description={`Apakah Anda yakin ingin mengajukan penutupan akun? Anda saat ini memiliki ${activeTransactions.length} transaksi aktif. Pembuatan transaksi baru akan segera diblokir, dan penghapusan data penuh diproses setelah semua transaksi aktif mencapai status terminal.`}
        confirmText="Ya, Ajukan Penutupan"
        cancelText="Batal"
        variant="danger"
      />
    </div>
  )
}
