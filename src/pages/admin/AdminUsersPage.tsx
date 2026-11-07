import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, UserX } from "lucide-react"

interface AdminUsersPageProps {
  onBack?: () => void
}

export function AdminUsersPage({ onBack: _onBack }: AdminUsersPageProps) {
  const [closurePendingUsers, setClosurePendingUsers] = useState<string[]>([])

  const userList = [
    {
      id: "usr-petani-01",
      name: "Pak Subur",
      role: "Petani",
      phone: "0812-3456-7890",
      location: "Pagaden, Subang, Jawa Barat",
      business: "Poktan Subur Makmur",
      status: "Aktif"
    },
    {
      id: "usr-pembeli-01",
      name: "H. Hendra",
      role: "Pembeli",
      phone: "0813-9876-5432",
      location: "Telagasari, Karawang, Jawa Barat",
      business: "CV Sumber Pangan Nusantara",
      status: "Aktif"
    },
    {
      id: "usr-petani-02",
      name: "Pak Dedi Setiadi",
      role: "Petani",
      phone: "0812-8888-1111",
      location: "Telagasari, Karawang, Jawa Barat",
      business: "Poktan Tani Subur",
      status: "Aktif"
    },
    {
      id: "usr-petani-03",
      name: "Pak Slamet Riyadi",
      role: "Petani",
      phone: "0813-7777-2222",
      location: "Masaran, Sragen, Jawa Tengah",
      business: "Poktan Makmur Jaya",
      status: "Aktif"
    }
  ]

  const handleToggleClosureRequest = (userId: string) => {
    if (closurePendingUsers.includes(userId)) {
      setClosurePendingUsers(closurePendingUsers.filter((id) => id !== userId))
      alert(`Permohonan penutupan akun #${userId} dibatalkan.`)
    } else {
      setClosurePendingUsers([...closurePendingUsers, userId])
      alert(
        `Permohonan penutupan akun #${userId} dicatat. Akun dilarang membuat transaksi baru, dan data pribadi akan dihapus/dianonimkan setelah semua kontrak aktif selesai.`
      )
    }
  }

  return (
    <div className="w-full space-y-6">
      {/* Breadcrumb & Header */}
      <div className="pt-1 border-b border-border/80 pb-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
          <span className="font-medium">Sambung</span>
          <span className="text-muted-foreground/60">/</span>
          <span className="font-medium text-foreground">Manajemen Pengguna</span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight">
          Daftar Pengguna & Perlindungan Privasi
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
          Pengawasan profil pengguna dengan penyamaran nomor telepon wajib.
        </p>
      </div>

      {/* Main Table Card */}
      <Card className="rounded-xl border border-border/80 overflow-hidden shadow-2xs">
        <CardHeader className="py-4 px-5 sm:px-6 border-b border-border/80">
          <CardTitle className="text-base font-bold text-foreground">Pengguna Terdaftar</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/80 bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">ID Pengguna</th>
                <th className="py-3 px-4 font-semibold">Nama & Usaha</th>
                <th className="py-3 px-4 font-semibold">Peran (Tetap)</th>
                <th className="py-3 px-4 font-mono font-semibold">Nomor HP Tersamar</th>
                <th className="py-3 px-4 font-semibold">Wilayah Operasional</th>
                <th className="py-3 px-4 font-semibold">Status Akun</th>
                <th className="py-3 px-4 text-right font-semibold">Aksi Penutupan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {userList.map((user) => {
                const isPendingClosure = closurePendingUsers.includes(user.id)
                const maskedPhone = user.phone.slice(0, 4) + "-****-" + user.phone.slice(-4)

                return (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs text-muted-foreground">
                      #{user.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.business}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="secondary" className="font-semibold">
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-foreground">
                      {maskedPhone}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-muted-foreground">
                      {user.location}
                    </td>
                    <td className="py-3.5 px-4">
                      {isPendingClosure ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                          <UserX className="w-3.5 h-3.5" />
                          <span>Penutupan Tertunda</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-price-within">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Aktif Normal</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant={isPendingClosure ? "outline" : "ghost"}
                        size="sm"
                        onClick={() => handleToggleClosureRequest(user.id)}
                        className={`text-xs ${isPendingClosure ? "text-primary" : "text-destructive hover:bg-destructive/10"}`}
                      >
                        {isPendingClosure ? "Batal Tutup" : "Simulasi Tutup Akun"}
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
