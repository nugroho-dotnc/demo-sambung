import { useState, useEffect } from "react"
import { useSambungStore } from "@/store/sambungStore"
import { UserRole } from "@/types/domain"
import { provinces, demoRoles } from "./Topbar"
import {
  Home,
  FileText,
  TrendingUp,
  ScrollText,
  Map,
  LayoutGrid,
  ShoppingBag,
  BarChart3,
  HelpCircle,
  X,
  Scale,
  Database,
  History,
  Calendar,
  SlidersHorizontal,
  Users,
  Cpu,
  ChevronDown,
  MapPin,
  Check,
  RotateCcw
} from "lucide-react"

interface SidebarProps {
  activeTab: string
  onNavigate: (tab: string) => void
  onCloseMobile?: () => void
}

interface SubNavItem {
  id: string
  label: string
  icon: typeof Home
}

interface NavItem {
  id: string
  label: string
  icon: typeof Home
  children?: SubNavItem[]
}

export function Sidebar({ activeTab, onNavigate, onCloseMobile }: SidebarProps) {
  const { currentRole, setRole, resetToSeedData, selectedRegion, setSelectedRegion } = useSambungStore()
  const [roleMenuOpen, setRoleMenuOpen] = useState(false)
  const [regionMenuOpen, setRegionMenuOpen] = useState(false)

  const currentRoleInfo = demoRoles.find((r) => r.id === currentRole) || demoRoles[0]
  const CurrentRoleIcon = currentRoleInfo.icon

  const handleSwitchRole = (newRole: UserRole) => {
    setRole(newRole)
    setRoleMenuOpen(false)
    setRegionMenuOpen(false)
    switch (newRole) {
      case "petani":
        onNavigate("petani-dashboard")
        break
      case "pembeli":
        onNavigate("pembeli-dashboard")
        break
      case "admin":
        onNavigate("admin-dashboard")
        break
      default:
        onNavigate("public-home")
        break
    }
    if (onCloseMobile) onCloseMobile()
  }

  const handleSelectRegion = (region: string) => {
    setSelectedRegion(region)
    setRegionMenuOpen(false)
  }

  const handleResetData = () => {
    if (confirm("Reset seluruh data transaksi simulasi ke data awal?")) {
      resetToSeedData()
      setRoleMenuOpen(false)
      alert("Data transaksi simulasi berhasil direset ke kondisi awal.")
    }
  }

  const getNavItems = (): NavItem[] => {
    switch (currentRole) {
      case "petani":
        return [
          { id: "petani-dashboard", label: "Beranda Petani", icon: Home },
          { id: "my-offers", label: "Tawaran Saya", icon: FileText },
          { id: "contracts", label: "Kontrak & Pesanan", icon: ScrollText },
          {
            id: "market-cluster",
            label: "Acuan Harga & Pasar",
            icon: Scale,
            children: [
              { id: "fair-price", label: "Acuan Harga Wajar", icon: Scale },
              { id: "price-board", label: "Papan Rantai Harga", icon: TrendingUp },
              { id: "price-map", label: "Peta Disparitas", icon: Map },
              { id: "forecast", label: "Prakiraan Pasar AI", icon: Calendar },
            ],
          },
        ]
      case "pembeli":
        return [
          { id: "pembeli-dashboard", label: "Dasbor Pembeli", icon: LayoutGrid },
          { id: "supply-catalog", label: "Katalog Pasokan", icon: ShoppingBag },
          { id: "contracts", label: "Kontrak & Pesanan", icon: ScrollText },
          {
            id: "market-cluster",
            label: "Acuan Harga & Pasar",
            icon: Scale,
            children: [
              { id: "fair-price", label: "Acuan Harga Wajar", icon: Scale },
              { id: "price-board", label: "Papan Rantai Harga", icon: TrendingUp },
              { id: "price-map", label: "Peta Disparitas", icon: Map },
              { id: "forecast", label: "Prakiraan Pasar AI", icon: Calendar },
            ],
          },
        ]
      case "admin":
        return [
          { id: "admin-dashboard", label: "Dasbor Pengawasan", icon: BarChart3 },
          {
            id: "price-cluster",
            label: "Data & Parameter Harga",
            icon: Database,
            children: [
              { id: "admin-price-data", label: "Observasi Data Harga", icon: Database },
              { id: "admin-parameters", label: "Parameter Toleransi & HPP", icon: SlidersHorizontal },
            ],
          },
          {
            id: "governance-cluster",
            label: "Tata Kelola & Audit",
            icon: History,
            children: [
              { id: "admin-users", label: "Manajemen Pengguna", icon: Users },
              { id: "admin-audit", label: "Log Audit Sistem", icon: History },
              { id: "admin-model", label: "Evaluasi Model AI", icon: Cpu },
            ],
          },
        ]
      default:
        return [
          { id: "public-home", label: "Beranda", icon: Home },
          {
            id: "market-cluster",
            label: "Informasi Pasar Gabah",
            icon: Scale,
            children: [
              { id: "fair-price", label: "Detail Acuan Wajar", icon: Scale },
              { id: "price-board", label: "Papan Rantai Harga", icon: TrendingUp },
              { id: "price-map", label: "Peta Disparitas", icon: Map },
              { id: "forecast", label: "Prakiraan Pasar AI", icon: Calendar },
            ],
          },
          { id: "help", label: "Pusat Bantuan", icon: HelpCircle },
        ]
    }
  }

  const items = getNavItems()

  // Track expanded cluster state
  const [expandedClusters, setExpandedClusters] = useState<Record<string, boolean>>({
    "market-cluster": true,
    "price-cluster": true,
    "governance-cluster": true,
  })

  // Whenever activeTab changes, auto-expand the cluster it belongs to
  useEffect(() => {
    items.forEach((item) => {
      if (item.children?.some((child) => child.id === activeTab)) {
        setExpandedClusters((prev) => ({ ...prev, [item.id]: true }))
      }
    })
  }, [activeTab, items])

  const handleParentClick = (item: NavItem) => {
    if (item.children && item.children.length > 0) {
      const isCurrentlyExpanded = !!expandedClusters[item.id]
      setExpandedClusters((prev) => ({
        ...prev,
        [item.id]: !isCurrentlyExpanded,
      }))
      const isTabInCluster = item.children.some((c) => c.id === activeTab)
      if (!isCurrentlyExpanded && !isTabInCluster) {
        onNavigate(item.children[0].id)
        if (onCloseMobile) onCloseMobile()
      }
    } else {
      onNavigate(item.id)
      if (onCloseMobile) onCloseMobile()
    }
  }

  const handleChildClick = (childId: string) => {
    onNavigate(childId)
    if (onCloseMobile) onCloseMobile()
  }

  return (
    <div className="w-full lg:w-60 h-full flex flex-col justify-between overflow-y-auto select-none bg-card/90 dark:bg-[#0D1510]/90 border-r border-border/80">
      <div className="p-4 space-y-5">
        {/* Mobile close button header */}
        <div className="flex items-center justify-between lg:hidden pb-3 border-b border-border">
          <span className="text-xs font-bold text-foreground">Menu Navigasi</span>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Simulation & Region Controls */}
        <div className="lg:hidden pb-4 border-b border-border space-y-2.5">
          <p className="px-1 text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
            Simulasi & Wilayah
          </p>

          <div className="space-y-2">
            <div>
              <button
                onClick={() => {
                  setRoleMenuOpen(!roleMenuOpen)
                  setRegionMenuOpen(false)
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  roleMenuOpen
                    ? "bg-muted border-primary text-foreground"
                    : "bg-muted/70 text-foreground hover:bg-muted border-border"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <CurrentRoleIcon className="w-4 h-4 text-primary shrink-0" />
                  <span className="font-normal text-muted-foreground">Peran:</span>
                  <span className="font-bold truncate">{currentRoleInfo.title.split(" ")[0]}</span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform duration-200 ${
                    roleMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {roleMenuOpen && (
                <div className="mt-2 p-2 rounded-xl border border-border bg-card shadow-xl space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
                  {demoRoles.map((r) => {
                    const isActive = currentRole === r.id
                    const RoleIcon = r.icon
                    return (
                      <button
                        key={r.id}
                        onClick={() => handleSwitchRole(r.id)}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer min-h-[40px] ${
                          isActive
                            ? "bg-primary text-white dark:text-[#05200E] font-semibold"
                            : "text-foreground hover:bg-muted"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <RoleIcon className="w-4 h-4 shrink-0" />
                          <div className="truncate">
                            <p className="font-medium text-xs truncate">{r.title}</p>
                            <p
                              className={`text-[10px] truncate ${
                                isActive ? "text-white/80 dark:text-[#05200E]/80" : "text-muted-foreground"
                              }`}
                            >
                              {r.subtitle}
                            </p>
                          </div>
                        </div>
                        {isActive && <Check className="w-4 h-4 shrink-0 ml-1" />}
                      </button>
                    )
                  })}

                  <div className="pt-2 mt-1.5 border-t border-border">
                    <button
                      onClick={handleResetData}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer font-medium"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>Reset Data Simulasi</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => {
                  setRegionMenuOpen(!regionMenuOpen)
                  setRoleMenuOpen(false)
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  regionMenuOpen
                    ? "bg-muted border-primary text-foreground"
                    : "bg-muted/70 text-foreground hover:bg-muted border-border"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span className="font-bold truncate">{selectedRegion}</span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform duration-200 ${
                    regionMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {regionMenuOpen && (
                <div className="mt-2 p-1.5 rounded-xl border border-border bg-card shadow-xl max-h-48 overflow-y-auto space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                  {provinces.map((prov) => (
                    <button
                      key={prov}
                      onClick={() => handleSelectRegion(prov)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left transition-colors cursor-pointer ${
                        selectedRegion === prov
                          ? "bg-primary/10 text-primary font-bold"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      <span>{prov}</span>
                      {selectedRegion === prov && <Check className="w-3.5 h-3.5 text-primary" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Workspace Nav Rail */}
        <div>
          <p className="px-2.5 text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
            Menu Ruang Kerja
          </p>

          <nav className="mt-2.5 space-y-1">
            {items.map((item) => {
              const Icon = item.icon
              const hasChildren = !!(item.children && item.children.length > 0)
              const isExpanded = !!expandedClusters[item.id]

              const isDirectActive = activeTab === item.id ||
                (item.id === "my-offers" && (activeTab === "create-offer" || activeTab === "offer-detail")) ||
                (item.id === "supply-catalog" && activeTab === "supply-detail") ||
                (item.id === "contracts" && activeTab === "contract-detail")

              const isChildActiveInCluster = hasChildren && item.children!.some((c) => c.id === activeTab)
              const isParentActive = isDirectActive || isChildActiveInCluster

              return (
                <div key={item.id} className="relative">
                  <button
                    onClick={() => handleParentClick(item)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 text-left cursor-pointer ${
                      isParentActive
                        ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-300 font-bold border border-emerald-200/80 dark:border-emerald-800/80 shadow-2xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/70 border border-transparent font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isParentActive ? "text-emerald-700 dark:text-emerald-400" : "text-muted-foreground"
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {hasChildren && (
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform duration-200 ${
                          isExpanded ? "rotate-180 text-foreground" : ""
                        }`}
                      />
                    )}
                  </button>

                  {/* Sub-menu (Indent with crisp connector line) */}
                  {hasChildren && isExpanded && (
                    <div className="ml-3 pl-3.5 my-1.5 space-y-1 border-l-2 border-border/80 dark:border-border/60 animate-in fade-in slide-in-from-top-1 duration-150">
                      {item.children!.map((sub) => {
                        const SubIcon = sub.icon
                        const isSubActive = activeTab === sub.id

                        return (
                          <button
                            key={sub.id}
                            onClick={() => handleChildClick(sub.id)}
                            className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs w-full text-left transition-all duration-150 cursor-pointer min-h-[34px] ${
                              isSubActive
                                ? "bg-primary/10 text-primary font-bold dark:bg-primary/20 dark:text-primary"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50 font-medium"
                            }`}
                          >
                            <SubIcon
                              className={`w-3.5 h-3.5 shrink-0 ${
                                isSubActive ? "text-primary" : "text-muted-foreground"
                              }`}
                            />
                            <span className="truncate">{sub.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}
