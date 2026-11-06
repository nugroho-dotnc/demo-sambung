import { useState } from "react"
import { useSambungStore } from "@/store/sambungStore"
import { UserRole } from "@/types/domain"
import { Users, RotateCcw, ChevronUp, ChevronDown, Check, Globe2, Sprout, Factory, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RoleSwitcherProps {
  onRoleChanged?: (newRole: UserRole) => void
}

export function RoleSwitcher({ onRoleChanged }: RoleSwitcherProps) {
  const { currentRole, setRole, resetToSeedData } = useSambungStore()
  const [isOpen, setIsOpen] = useState(false)

  const roles: { id: UserRole; title: string; subtitle: string; icon: typeof Globe2 }[] = [
    {
      id: "public",
      title: "Publik / Tamu",
      subtitle: "Tanpa login, lihat harga & peta",
      icon: Globe2
    },
    {
      id: "petani",
      title: "Petani (Pak Subur)",
      subtitle: "Subang, Jual panen & terima tawaran",
      icon: Sprout
    },
    {
      id: "pembeli",
      title: "Pembeli (CV Sumber Pangan)",
      subtitle: "Karawang, Cari pasokan & ajukan harga",
      icon: Factory
    },
    {
      id: "admin",
      title: "Admin Operasional",
      subtitle: "Pengawasan, parameter, audit",
      icon: ShieldCheck
    }
  ]

  const handleSelect = (role: UserRole) => {
    setRole(role)
    if (onRoleChanged) onRoleChanged(role)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Expanded Menu */}
      {isOpen && (
        <div className="mb-3 w-72 sm:w-80 bg-card text-card-foreground border-2 border-primary/40 rounded-xl shadow-2xl p-4 animate-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                Simulasi Peran Lomba
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Tutup
            </button>
          </div>

          <div className="space-y-1.5">
            {roles.map((r) => {
              const isActive = currentRole === r.id
              return (
                <button
                  key={r.id}
                  onClick={() => handleSelect(r.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-all min-h-[44px] ${
                    isActive
                      ? "bg-primary text-white dark:text-[#182117] font-bold shadow-xs"
                      : "hover:bg-accent text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <r.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <div className="leading-tight">
                      <p className="text-body-base font-semibold">{r.title}</p>
                      <p className={`text-xs ${isActive ? "text-white/80 dark:text-[#182117]/80" : "text-muted-foreground"}`}>
                        {r.subtitle}
                      </p>
                    </div>
                  </div>
                  {isActive && <Check className="w-4 h-4 shrink-0" />}
                </button>
              )
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (confirm("Reset seluruh data transaksi simulasi ke data awal?")) {
                  resetToSeedData()
                  alert("Data simulasi berhasil direset!")
                }
              }}
              className="w-full text-xs text-destructive hover:bg-destructive/10 border-destructive/30 gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data Simulasi</span>
            </Button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-primary text-white dark:text-[#182117] shadow-lg hover:bg-primary-hover transition-all border-2 border-white/20 dark:border-black/20 font-bold text-body-base min-h-[44px] focus-visible:outline-2 focus-visible:outline-ring"
        aria-label="Buka simulasi ganti peran"
      >
        {currentRole === "petani" && <Sprout className="h-5 w-5" aria-hidden="true" />}
        {currentRole === "pembeli" && <Factory className="h-5 w-5" aria-hidden="true" />}
        {currentRole === "admin" && <ShieldCheck className="h-5 w-5" aria-hidden="true" />}
        {currentRole === "public" && <Globe2 className="h-5 w-5" aria-hidden="true" />}
        <span className="text-xs sm:text-sm capitalize font-bold">
          Peran: {currentRole}
        </span>
        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
      </button>
    </div>
  )
}
