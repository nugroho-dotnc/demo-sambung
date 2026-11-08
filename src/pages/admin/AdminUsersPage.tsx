import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, UserX, Users } from "lucide-react"

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
    <div className="max-w-6xl mx-auto space-y-7 pb-14">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/70">
        <div>
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            <span>SAMBUNG</span>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-primary font-bold">ADMIN</span>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-foreground">MANAJEMEN PENGGUNA</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight">
            Daftar Pengguna & Perlindungan Privasi
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
            Pengawasan profil pengguna dengan penyamaran nomor telepon wajib demi pencegahan penyalahgunaan kontak.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 text-xs font-semibold text-primary border border-primary/20">
          <Users className="w-4 h-4 shrink-0" />
          <span>{userList.length} Akun Terdaftar</span>
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="rounded-2xl border border-border/80 overflow-hidden shadow-xs bg-card">
        <CardHeader className="py-4 px-6 border-b border-border/70">
          <CardTitle className="text-base font-bold text-foreground">Pengguna Terdaftar</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/80 bg-muted/40 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-5 font-semibold">ID Pengguna</th>
                <th className="py-3 px-5 font-semibold">Nama & Usaha</th>
                <th className="py-3 px-5 font-semibold">Peran Tetap</th>
                <th className="py-3 px-5 font-semibold">Nomor HP Tersamar</th>
                <th className="py-3 px-5 font-semibold">Wilayah Operasional</th>
                <th className="py-3 px-5 font-semibold">Status Akun</th>
                <th className="py-3 px-5 text-right font-semibold">Aksi Penutupan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {userList.map((user) => {
                const isPendingClosure = closurePendingUsers.includes(user.id)
                const maskedPhone = user.phone.slice(0, 4) + "-****-" + user.phone.slice(-4)

                return (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-5 font-mono text-xs text-muted-foreground font-semibold">
                      #{user.id}
                    </td>
                    <td className="py-3.5 px-5">
                      <p className="font-semibold text-foreground">{user.name}</p>
                      <p className="text-[11px] text-muted-foreground">{user.business}</p>
                    </td>
                    <td className="py-3.5 px-5">
                      <Badge variant="secondary" className="font-semibold text-[10px]">
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-5 font-mono font-bold text-foreground">
                      {maskedPhone}
                    </td>
                    <td className="py-3.5 px-5 text-xs text-muted-foreground">
                      {user.location}
                    </td>
                    <td className="py-3.5 px-5">
                      {isPendingClosure ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                          <UserX className="w-3.5 h-3.5" />
                          <span>Penutupan Tertunda</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Aktif Normal</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <Button
                        variant={isPendingClosure ? "outline" : "ghost"}
                        size="sm"
                        onClick={() => handleToggleClosureRequest(user.id)}
                        className={`text-xs ${isPendingClosure ? "text-primary border-primary/40" : "text-destructive hover:bg-destructive/10"}`}
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
