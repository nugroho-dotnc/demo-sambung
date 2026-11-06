import { useSambungStore } from "@/store/sambungStore"
import {
  Home,
  FileText,
  TrendingUp,
  ScrollText,
  Map,
  LayoutGrid,
  ShoppingBag,
  ShieldAlert,
  SlidersHorizontal,
  Users,
  History,
  Cpu,
  BarChart3,
  ExternalLink,
  HelpCircle,
  X
} from "lucide-react"

interface SidebarProps {
  activeTab: string
  onNavigate: (tab: string) => void
  onCloseMobile?: () => void
}

interface NavItem {
  id: string
  label: string
  icon: typeof Home
}

export function Sidebar({ activeTab, onNavigate, onCloseMobile }: SidebarProps) {
  const { currentRole } = useSambungStore()

  const getNavItems = (): NavItem[] => {
    switch (currentRole) {
      case "petani":
        return [
          { id: "petani-dashboard", label: "Beranda Petani", icon: Home },
          { id: "my-offers", label: "Tawaran Saya", icon: FileText },
          { id: "price-board", label: "Papan Harga 2 Sisi", icon: TrendingUp },
          { id: "contracts", label: "Kontrak", icon: ScrollText },
          { id: "price-map", label: "Peta Publik", icon: Map },
        ]
      case "pembeli":
        return [
          { id: "pembeli-dashboard", label: "Dasbor Produsen", icon: LayoutGrid },
          { id: "supply-catalog", label: "Katalog Pasokan", icon: ShoppingBag },
          { id: "price-board", label: "Papan Harga 2 Sisi", icon: TrendingUp },
          { id: "contracts", label: "Kontrak & Pesanan", icon: ScrollText },
          { id: "price-map", label: "Peta Publik", icon: Map },
        ]
      case "admin":
        return [
          { id: "admin-dashboard", label: "Dasbor Admin", icon: BarChart3 },
          { id: "admin-moderation", label: "Moderasi Tawaran", icon: ShieldAlert },
          { id: "admin-parameters", label: "Parameter Harga", icon: SlidersHorizontal },
          { id: "admin-users", label: "Manajemen Pengguna", icon: Users },
          { id: "admin-audit", label: "Log Audit Sistem", icon: History },
          { id: "admin-model", label: "Evaluasi Model AI", icon: Cpu },
        ]
      default:
        return [
          { id: "public-home", label: "Beranda", icon: Home },
          { id: "price-board", label: "Papan Harga 2 Sisi", icon: TrendingUp },
          { id: "price-map", label: "Peta Publik", icon: Map },
          { id: "help", label: "Pusat Bantuan", icon: HelpCircle },
        ]
    }
  }

  const items = getNavItems()

  const handleItemClick = (id: string) => {
    onNavigate(id)
    if (onCloseMobile) onCloseMobile()
  }

  return (
    <div className="w-60 h-full flex flex-col justify-between overflow-hidden select-none bg-card/70 dark:bg-card/40">
      <div className="p-4 space-y-5">
        {/* Mobile close button header */}
        <div className="flex items-center justify-between lg:hidden pb-2 border-b border-border">
          <span className="text-xs font-bold text-foreground">Menu Navigasi</span>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Workspace Title */}
        <div>
          <p className="px-3 text-[11px] font-bold tracking-wider uppercase text-muted-foreground">
            Ruang Kerja
          </p>

          <nav className="mt-2 space-y-1">
            {items.map((item) => {
              const Icon = item.icon
              const isActive =
                activeTab === item.id ||
                (item.id === "my-offers" && activeTab === "create-offer") ||
                (item.id === "supply-catalog" && activeTab === "supply-detail")
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 text-left cursor-pointer ${
                    isActive
                      ? "bg-[#EAF1E7] text-[#2D4828] font-semibold dark:bg-primary/25 dark:text-primary-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? "text-[#2D4828] dark:text-primary-foreground" : "text-muted-foreground"}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Help & Guide Box */}
      <div className="p-4 border-t border-border/80 bg-card/30">
        <div className="p-3 rounded-lg border border-border/70 bg-card space-y-1">
          <p className="text-xs font-semibold text-foreground">Butuh panduan?</p>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Pahami harga wajar dan langkah transaksi.
          </p>
          <button
            onClick={() => handleItemClick("help")}
            className="pt-1 flex items-center gap-1 text-xs font-medium text-foreground hover:text-primary transition-colors cursor-pointer"
          >
            <span>Buka pusat bantuan</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  )
}
