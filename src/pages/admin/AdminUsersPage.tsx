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
      {/* 2. Breadcrumbs, Judul Halaman, Deskripsi Singkat */}
      <div className="pt-1 border-b border-border/80 pb-4">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
          <span>SAMBUNG</span>
          <span>/</span>
          <span className="text-foreground">MANAJEMEN PENGGUNA</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
          Daftar Pengguna & Perlindungan Privasi
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Pengawasan profil pengguna dengan penyamaran nomor telepon wajib.
        </p>
      </div>

      {/* 4. Konten Utama Panel (Tabel Pengguna) */}
      <Card>
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-base">Pengguna Terdaftar</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-body-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-xs font-bold text-muted-foreground uppercase">
                <th className="py-3 px-4">ID Pengguna</th>
                <th className="py-3 px-4">Nama & Usaha</th>
                <th className="py-3 px-4">Peran (Tetap)</th>
                <th className="py-3 px-4 font-mono">Nomor HP Tersamar</th>
                <th className="py-3 px-4">Wilayah Operasional</th>
                <th className="py-3 px-4">Status Akun</th>
                <th className="py-3 px-4 text-right">Aksi Penutupan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {userList.map((user) => {
                const isPendingClosure = closurePendingUsers.includes(user.id)
                const maskedPhone = user.phone.slice(0, 4) + "-****-" + user.phone.slice(-4)

                return (
                  <tr key={user.id} className="hover:bg-accent/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs text-muted-foreground">
                      #{user.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.business}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="secondary" className="font-bold">
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                      {maskedPhone}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-muted-foreground">
                      {user.location}
                    </td>
                    <td className="py-3.5 px-4">
                      {isPendingClosure ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                          <UserX className="w-3.5 h-3.5" />
                          <span>Penutupan Tertunda</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-price-within">
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
