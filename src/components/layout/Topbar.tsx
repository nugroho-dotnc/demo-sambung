import { useState } from "react"
import { useSambungStore } from "@/store/sambungStore"
import { UserRole } from "@/types/domain"
import { Button } from "@/components/ui/button"
import {
  Sprout,
  MapPin,
  ChevronDown,
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
  User,
  ShieldCheck,
  Check,
  RotateCcw,
  Users,
  Globe2,
  Factory,
  Bell,
  Settings
} from "lucide-react"

interface TopbarProps {
  onToggleSidebar?: () => void
  sidebarOpen?: boolean
  activeTab: string
  onNavigate: (tab: string) => void
  onRoleChanged?: (newRole: UserRole) => void
}

export const provinces = [
  "Jawa Timur",
  "Jawa Tengah",
  "Jawa Barat",
  "Sumatera Utara",
  "Sulawesi Selatan",
  "Lampung",
  "Kalimantan Selatan",
  "Bali",
]

export const demoRoles: { id: UserRole; title: string; subtitle: string; icon: typeof Globe2 }[] = [
  {
    id: "public",
    title: "Publik / Tamu",
    subtitle: "Informasi harga & peta tanpa login",
    icon: Globe2,
  },
  {
    id: "petani",
    title: "Petani (Pak Subur)",
    subtitle: "Subang, jual panen & terima tawaran",
    icon: Sprout,
  },
  {
    id: "pembeli",
    title: "Pembeli (CV Sumber Pangan)",
    subtitle: "Karawang, cari pasokan & pesan gabah",
    icon: Factory,
  },
  {
    id: "admin",
    title: "Admin Operasional",
    subtitle: "Pengawasan, moderasi, audit & model",
    icon: ShieldCheck,
  },
]

export function Topbar({ onToggleSidebar, sidebarOpen, activeTab, onNavigate, onRoleChanged }: TopbarProps) {
  const { currentRole, currentUser, theme, toggleTheme, setRole, resetToSeedData, selectedRegion, setSelectedRegion } = useSambungStore()
  const [regionMenuOpen, setRegionMenuOpen] = useState(false)
  const [roleMenuOpen, setRoleMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [notifMenuOpen, setNotifMenuOpen] = useState(false)

  // Generate initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
  }

  const handleSelectRegion = (region: string) => {
    setSelectedRegion(region)
    setRegionMenuOpen(false)
  }

  const handleSwitchRole = (newRole: UserRole) => {
    setRole(newRole)
    setRoleMenuOpen(false)
    setProfileMenuOpen(false)
    if (onRoleChanged) onRoleChanged(newRole)
  }

  const handleResetData = () => {
    if (confirm("Reset seluruh data transaksi simulasi ke data awal?")) {
      resetToSeedData()
      setRoleMenuOpen(false)
      setProfileMenuOpen(false)
      alert("Data transaksi simulasi berhasil direset ke kondisi awal.")
    }
  }

  // Smooth scroll to landing section instead of changing pages
  const handleScrollToSection = (sectionId: string) => {
    if (activeTab !== "public-home") {
      onNavigate("public-home")
      setTimeout(() => {
        const el = document.getElementById(sectionId)
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, 100)
    } else {
      const el = document.getElementById(sectionId)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
  }

  const currentRoleInfo = demoRoles.find((r) => r.id === currentRole) || demoRoles[0]
  const CurrentRoleIcon = currentRoleInfo.icon

  return (
    <header className="sticky top-0 z-40 w-full h-15 border-b border-border/80 bg-card/95 backdrop-blur-md transition-colors">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger + Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Buka menu navigasi"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => onNavigate(currentRole === "public" ? "public-home" : `${currentRole}-dashboard`)}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-white dark:text-[#182117] shadow-2xs group-hover:opacity-95 transition-opacity">
              <Sprout className="w-4.5 h-4.5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-lg text-foreground tracking-tight">
                SAMBUNG
              </span>
              <span className="hidden sm:inline text-border/80">|</span>
              <span className="hidden sm:inline text-xs text-muted-foreground font-normal">
                Pasar gabah adil dan transparan
              </span>
            </div>
          </button>
        </div>

        {/* Public Nav Links (Scrolls to landing sections smoothly without changing pages) */}
        {currentRole === "public" && (
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => handleScrollToSection("beranda")}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
            >
              Beranda
            </button>
            <button
              onClick={() => handleScrollToSection("papan-harga")}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
            >
              Papan Harga
            </button>
            <button
              onClick={() => handleScrollToSection("peta-disparitas")}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
            >
              Peta Disparitas
            </button>
            <button
              onClick={() => handleScrollToSection("bantuan")}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
            >
              Bantuan
            </button>
          </nav>
        )}

        {/* Right Utility Toolbar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Role Switcher Menu in Topbar (desktop only; on mobile relocated to sidebar) */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => {
                setRoleMenuOpen(!roleMenuOpen)
                setRegionMenuOpen(false)
                setProfileMenuOpen(false)
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-muted/80 text-foreground hover:bg-muted border border-border/80 transition-colors cursor-pointer"
              title="Ganti Peran Simulasi"
              aria-label="Pilih peran simulasi"
            >
              <CurrentRoleIcon className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:inline font-medium text-muted-foreground">Peran:</span>
              <span className="font-semibold">{currentRoleInfo.title.split(" ")[0]}</span>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-72 rounded-xl border border-border bg-card p-2 shadow-xl z-50 text-xs animate-in fade-in-50 duration-100">
                <div className="flex items-center justify-between px-2 py-1.5 border-b border-border mb-1">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-primary" />
                    <span className="font-bold text-[11px] text-foreground uppercase tracking-wider">
                      Simulasi Peran Lomba
                    </span>
                  </div>
                  <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">
                    Demo
                  </span>
                </div>

                <div className="space-y-1 mt-1">
                  {demoRoles.map((r) => {
                    const isActive = currentRole === r.id
                    const RoleIcon = r.icon
                    return (
                      <button
                        key={r.id}
                        onClick={() => handleSwitchRole(r.id)}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer min-h-[44px] ${
                          isActive
                            ? "bg-primary text-white dark:text-[#182117] font-semibold"
                            : "text-foreground hover:bg-muted"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <RoleIcon className="w-4 h-4 shrink-0" />
                          <div className="truncate">
                            <p className="font-medium text-xs truncate">{r.title}</p>
                            <p className={`text-[10px] truncate ${isActive ? "text-white/80 dark:text-[#182117]/80" : "text-muted-foreground"}`}>
                              {r.subtitle}
                            </p>
                          </div>
                        </div>
                        {isActive && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
                      </button>
                    )
                  })}
                </div>

                <div className="mt-2 pt-2 border-t border-border">
                  <button
                    onClick={handleResetData}
                    className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3 text-muted-foreground" />
                    <span>Reset Data Simulasi Awal</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Region Dropdown Selector (desktop only; on mobile relocated to sidebar) */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => {
                setRegionMenuOpen(!regionMenuOpen)
                setRoleMenuOpen(false)
                setProfileMenuOpen(false)
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-muted border border-border/60 transition-colors cursor-pointer"
              aria-label="Pilih wilayah acuan"
            >
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span>{selectedRegion}</span>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </button>

            {regionMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-48 rounded-xl border border-border bg-card p-1.5 shadow-lg z-50 text-xs animate-in fade-in-50 duration-100">
                <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Pilih Wilayah Acuan
                </p>
                <div className="mt-1 space-y-0.5">
                  {provinces.map((prov) => (
                    <button
                      key={prov}
                      onClick={() => handleSelectRegion(prov)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                        selectedRegion === prov
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      <span>{prov}</span>
                      {selectedRegion === prov && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Ganti mode tampilan"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* In-App Notifications Button (for authenticated internal roles) */}
          {currentRole !== "public" && (
            <div className="relative">
              <button
                onClick={() => {
                  setNotifMenuOpen(!notifMenuOpen)
                  setProfileMenuOpen(false)
                  setRegionMenuOpen(false)
                  setRoleMenuOpen(false)
                }}
                className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                aria-label="Buka notifikasi"
                title="Notifikasi"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground shadow-2xs">
                  2
                </span>
              </button>

              {notifMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-72 rounded-xl border border-border bg-card p-2 shadow-xl z-50 text-xs animate-in fade-in-50 duration-100">
                  <div className="flex items-center justify-between px-2 py-1.5 border-b border-border mb-1">
                    <span className="font-bold text-[11px] text-foreground uppercase tracking-wider">
                      Notifikasi Terbaru
                    </span>
                    <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">
                      2 Baru
                    </span>
                  </div>

                  <div className="space-y-1 py-1">
                    <button
                      onClick={() => {
                        setNotifMenuOpen(false)
                        onNavigate("notifications")
                      }}
                      className="w-full p-2 rounded-lg text-left hover:bg-muted transition-colors cursor-pointer"
                    >
                      <p className="font-semibold text-foreground text-xs">Penawaran Masuk Baru</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                        CV Sumber Pangan mengajukan pesanan 1.000 kg gabah GKP.
                      </p>
                    </button>
                    <button
                      onClick={() => {
                        setNotifMenuOpen(false)
                        onNavigate("notifications")
                      }}
                      className="w-full p-2 rounded-lg text-left hover:bg-muted transition-colors cursor-pointer"
                    >
                      <p className="font-semibold text-foreground text-xs">Pembaruan Acuan Wajar</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                        Rentang wajar Jawa Timur pekan ini: Rp6.650 - Rp6.940/kg.
                      </p>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-border">
                    <button
                      onClick={() => {
                        setNotifMenuOpen(false)
                        onNavigate("notifications")
                      }}
                      className="w-full py-1.5 rounded-lg text-center font-semibold text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                    >
                      Lihat Semua Notifikasi
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Profile / Login Button */}
          {currentRole === "public" ? (
            <Button
              size="sm"
              onClick={() => onNavigate("auth-login")}
              className="h-8 px-2.5 sm:px-3 gap-1.5 font-semibold text-xs rounded-lg shadow-2xs cursor-pointer"
            >
              <User className="w-3.5 h-3.5 shrink-0" />
              <span className="sm:hidden">Masuk</span>
              <span className="hidden sm:inline">Masuk / Daftar</span>
            </Button>
          ) : (
            <div className="relative">
              <button
                onClick={() => {
                  setProfileMenuOpen(!profileMenuOpen)
                  setNotifMenuOpen(false)
                  setRegionMenuOpen(false)
                  setRoleMenuOpen(false)
                }}
                className="flex items-center justify-center w-8.5 h-8.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold hover:ring-2 hover:ring-primary/30 transition-all cursor-pointer"
                aria-label="Menu akun"
              >
                {getInitials(currentUser.name || "TN")}
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-60 rounded-xl border border-border bg-card p-2 shadow-lg z-50 text-xs animate-in fade-in-50 duration-100">
                  <div className="px-2 py-1.5 border-b border-border mb-1">
                    <p className="font-semibold text-foreground truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{currentUser.businessName || currentUser.role.toUpperCase()}</p>
                  </div>
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false)
                      onNavigate("profile")
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-foreground hover:bg-muted transition-colors cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>Profil & Pengaturan Akun</span>
                  </button>
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false)
                      onNavigate("help")
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-foreground hover:bg-muted transition-colors cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>Pusat Bantuan & Kebijakan</span>
                  </button>
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false)
                      handleSwitchRole("public")
                      onNavigate("public-home")
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-destructive hover:bg-destructive/10 transition-colors mt-1 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar Akun</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
