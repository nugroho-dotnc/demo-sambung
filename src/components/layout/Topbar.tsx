import { useState } from "react"
import { useSambungStore } from "@/store/sambungStore"
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
  Check
} from "lucide-react"

interface TopbarProps {
  onToggleSidebar?: () => void
  sidebarOpen?: boolean
  activeTab: string
  onNavigate: (tab: string) => void
}

const provinces = [
  "Jawa Timur",
  "Jawa Tengah",
  "Jawa Barat",
  "Sumatera Utara",
  "Sulawesi Selatan",
  "Lampung",
  "Kalimantan Selatan",
  "Bali",
]

export function Topbar({ onToggleSidebar, sidebarOpen, activeTab, onNavigate }: TopbarProps) {
  const { currentRole, currentUser, theme, toggleTheme, setRole } = useSambungStore()
  const [regionMenuOpen, setRegionMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState("Jawa Timur")

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

  return (
    <header className="sticky top-0 z-40 w-full h-15 border-b border-border/80 bg-card/95 backdrop-blur-md transition-colors">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger + Brand */}
        <div className="flex items-center gap-3">
          {currentRole !== "public" && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Buka menu navigasi"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <button
            onClick={() => onNavigate(currentRole === "public" ? "public-home" : `${currentRole}-dashboard`)}
            className="flex items-center gap-2.5 text-left group"
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
                Pasar pertanian yang lebih adil
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
          {/* Data Acuan / Wireframe Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/80 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider border border-border/60">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>Simulasi Data Acuan</span>
          </div>

          {/* Region Dropdown Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setRegionMenuOpen(!regionMenuOpen)
                setProfileMenuOpen(false)
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-muted border border-border/60 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span>{selectedRegion}</span>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </button>

            {regionMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-48 rounded-xl border border-border bg-card p-1.5 shadow-lg z-50 text-xs">
                <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Pilih Wilayah Acuan
                </p>
                <div className="mt-1 space-y-0.5">
                  {provinces.map((prov) => (
                    <button
                      key={prov}
                      onClick={() => handleSelectRegion(prov)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
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
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Ganti mode tampilan"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Profile / Login Button */}
          {currentRole === "public" ? (
            <Button
              size="sm"
              onClick={() => onNavigate("auth-login")}
              className="gap-1.5 font-semibold text-xs shadow-xs"
            >
              <User className="w-3.5 h-3.5" />
              <span>Masuk / Daftar</span>
            </Button>
          ) : (
            <div className="relative">
              <button
                onClick={() => {
                  setProfileMenuOpen(!profileMenuOpen)
                  setRegionMenuOpen(false)
                }}
                className="flex items-center justify-center w-8.5 h-8.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold hover:ring-2 hover:ring-primary/30 transition-all"
                aria-label="Menu akun"
              >
                {getInitials(currentUser.name || "TN")}
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-56 rounded-xl border border-border bg-card p-2 shadow-lg z-50 text-xs">
                  <div className="px-2 py-1.5 border-b border-border mb-1">
                    <p className="font-semibold text-foreground truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{currentUser.businessName || currentUser.role.toUpperCase()}</p>
                  </div>
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false)
                      onNavigate("help")
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-foreground hover:bg-muted transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>Pusat Bantuan & Panduan</span>
                  </button>
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false)
                      setRole("public")
                      onNavigate("public-home")
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-destructive hover:bg-destructive/10 transition-colors mt-1"
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
