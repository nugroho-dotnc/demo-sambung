import { useSambungStore } from "@/store/sambungStore"
import { Button } from "@/components/ui/button"
import {
  Sun,
  Moon,
  Sprout,
  User,
  LogOut,
  Bell,
  Menu,
  X
} from "lucide-react"
import { useState } from "react"

interface NavbarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const { currentRole, currentUser, theme, toggleTheme, setRole } = useSambungStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Menu items per role
  const getNavLinks = () => {
    switch (currentRole) {
      case "petani":
        return [
          { id: "petani-dashboard", label: "Beranda Petani" },
          { id: "create-offer", label: "Jual Panen" },
          { id: "my-offers", label: "Tawaran Saya" },
          { id: "contracts", label: "Pesanan / Kontrak" },
          { id: "price-board", label: "Papan Harga" },
        ]
      case "pembeli":
        return [
          { id: "pembeli-dashboard", label: "Dasbor Pembeli" },
          { id: "supply-catalog", label: "Katalog Pasokan" },
          { id: "contracts", label: "Pesanan / Kontrak" },
          { id: "price-board", label: "Papan Harga" },
          { id: "price-map", label: "Peta Harga" },
        ]
      case "admin":
        return [
          { id: "admin-dashboard", label: "Ringkasan" },
          { id: "admin-moderation", label: "Moderasi Tawaran" },
          { id: "admin-parameters", label: "Parameter" },
          { id: "admin-users", label: "Pengguna" },
          { id: "admin-audit", label: "Audit Log" },
          { id: "admin-model", label: "Model AI" },
        ]
      case "public":
      default:
        return [
          { id: "public-home", label: "Beranda" },
          { id: "price-board", label: "Papan Harga" },
          { id: "price-map", label: "Peta Disparitas" },
          { id: "help", label: "Bantuan & Privasi" },
        ]
    }
  }

  const links = getNavLinks()

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId)
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/95 backdrop-blur-md transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex min-h-20 items-center justify-between py-2">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavClick(currentRole === "public" ? "public-home" : `${currentRole}-dashboard`)}
            className="flex items-center gap-2.5 font-display font-extrabold text-display-sm text-primary tracking-tight hover:opacity-90"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-white dark:text-[#182117] shadow-xs">
              <Sprout className="w-5 h-5" />
            </div>
            <span>SAMBUNG</span>
          </button>

          {/* Role Indicator Badge */}
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground border border-border">
            {currentRole === "petani" && "Ruang Petani"}
            {currentRole === "pembeli" && "Ruang Pembeli"}
            {currentRole === "admin" && "Ruang Admin"}
            {currentRole === "public" && "Portal Publik"}
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {links.map((link) => {
            const isActive = activeTab === link.id
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors min-h-[44px] flex items-center ${
                  isActive
                    ? "bg-primary text-white dark:text-[#182117] shadow-xs"
                    : "text-foreground/80 hover:bg-accent hover:text-foreground"
                }`}
              >
                {link.label}
              </button>
            )
          })}
        </nav>

        {/* Right Controls: Theme Toggle & User Info */}
        <div className="flex items-center gap-2">
          {/* Dark/Light Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Ganti mode terang/gelap"
            className="rounded-full"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5 text-foreground" />
            ) : (
              <Sun className="w-5 h-5 text-highlight" />
            )}
          </Button>

          {/* Notification Button */}
          {currentRole !== "public" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleNavClick("contracts")}
              aria-label="Pusat Notifikasi"
              className="rounded-full relative"
            >
              <Bell className="w-5 h-5 text-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive" />
            </Button>
          )}

          {/* User / Login Button */}
          {currentRole === "public" ? (
            <Button
              variant="default"
              size="sm"
              onClick={() => handleNavClick("auth-login")}
              className="gap-2 text-sm font-semibold"
            >
              <User className="w-4 h-4" />
              <span>Masuk / Daftar</span>
            </Button>
          ) : (
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-border">
              <div className="text-right leading-tight">
                <p className="text-xs font-bold text-foreground">{currentUser.name}</p>
                <p className="text-[10px] text-muted-foreground capitalize">{currentUser.businessName || currentUser.role}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setRole("public")}
                title="Keluar ke mode publik"
                className="text-muted-foreground hover:text-destructive"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
            aria-label="Buka menu navigasi"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card p-4 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="pb-2 mb-2 border-b border-border flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Peran: {currentRole.toUpperCase()}
            </span>
            {currentRole !== "public" && (
              <span className="text-xs font-medium text-foreground">{currentUser.name}</span>
            )}
          </div>
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`w-full text-left px-4 py-3 rounded-md font-semibold text-sm min-h-[44px] flex items-center ${
                activeTab === link.id
                  ? "bg-primary text-white dark:text-[#182117] font-bold"
                  : "text-foreground hover:bg-accent"
              }`}
            >
              {link.label}
            </button>
          ))}
          {currentRole !== "public" && (
            <Button
              variant="destructive"
              className="w-full mt-4 justify-start gap-2"
              onClick={() => {
                setRole("public")
                setMobileMenuOpen(false)
                setActiveTab("public-home")
              }}
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar ke Mode Publik</span>
            </Button>
          )}
        </div>
      )}
    </header>
  )
}
