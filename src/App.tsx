import { useState, useEffect } from "react"
import { useSambungStore } from "@/store/sambungStore"
import { UserRole } from "@/types/domain"
import { Topbar } from "@/components/layout/Topbar"
import { Sidebar } from "@/components/layout/Sidebar"
import { RoleSwitcher } from "@/components/layout/RoleSwitcher"

// Public & Auth Pages
import { HomePage } from "@/pages/public/HomePage"
import { PriceBoardPage } from "@/pages/public/PriceBoardPage"
import { PriceMapPage } from "@/pages/public/PriceMapPage"
import { HelpAndPrivacyPage } from "@/pages/public/HelpAndPrivacyPage"
import { LoginPage } from "@/pages/auth/LoginPage"

// Petani Pages
import { PetaniDashboard } from "@/pages/petani/PetaniDashboard"
import { CreateOfferPage } from "@/pages/petani/CreateOfferPage"
import { MyOffersPage } from "@/pages/petani/MyOffersPage"
import { PetaniContractsPage } from "@/pages/petani/PetaniContractsPage"
import { PetaniContractDetailPage } from "@/pages/petani/PetaniContractDetailPage"

// Pembeli Pages
import { PembeliDashboard } from "@/pages/pembeli/PembeliDashboard"
import { SupplyCatalogPage } from "@/pages/pembeli/SupplyCatalogPage"
import { SupplyDetailPage } from "@/pages/pembeli/SupplyDetailPage"
import { PembeliContractsPage } from "@/pages/pembeli/PembeliContractsPage"
import { PembeliContractDetailPage } from "@/pages/pembeli/PembeliContractDetailPage"

// Shared Pages
import { ContractsListPage } from "@/pages/shared/ContractsListPage"
import { ContractDetailPage } from "@/pages/shared/ContractDetailPage"

// Admin Pages
import { AdminDashboard } from "@/pages/admin/AdminDashboard"
import { AdminParametersPage } from "@/pages/admin/AdminParametersPage"
import { AdminModerationPage } from "@/pages/admin/AdminModerationPage"
import { AdminUsersPage } from "@/pages/admin/AdminUsersPage"
import { AdminAuditLogPage } from "@/pages/admin/AdminAuditLogPage"
import { AdminModelEvalPage } from "@/pages/admin/AdminModelEvalPage"

// Strict RBAC Tab Whitelists for each role
const ROLE_PERMITTED_TABS: Record<UserRole, string[]> = {
  public: ["public-home", "auth-login"],
  petani: [
    "petani-dashboard",
    "create-offer",
    "my-offers",
    "contracts",
    "contract-detail",
    "price-board",
    "price-map",
    "help",
  ],
  pembeli: [
    "pembeli-dashboard",
    "supply-catalog",
    "supply-detail",
    "contracts",
    "contract-detail",
    "price-board",
    "price-map",
    "help",
  ],
  admin: [
    "admin-dashboard",
    "admin-parameters",
    "admin-moderation",
    "admin-users",
    "admin-audit",
    "admin-model",
    "contracts",
    "contract-detail",
    "price-board",
    "price-map",
    "help",
  ],
}

export function App() {
  const { currentRole, setRole } = useSambungStore()
  const [activeTab, setActiveTab] = useState<string>("public-home")
  const [targetId, setTargetId] = useState<string>("")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Enforce RBAC tab check whenever role changes
  useEffect(() => {
    const allowed = ROLE_PERMITTED_TABS[currentRole] || ["public-home"]
    if (!allowed.includes(activeTab)) {
      switch (currentRole) {
        case "petani":
          setActiveTab("petani-dashboard")
          break
        case "pembeli":
          setActiveTab("pembeli-dashboard")
          break
        case "admin":
          setActiveTab("admin-dashboard")
          break
        case "public":
        default:
          setActiveTab("public-home")
          break
      }
    }
  }, [currentRole, activeTab])

  const handleNavigate = (tab: string, id?: string) => {
    // RBAC Guard: block unauthorized tabs
    const allowed = ROLE_PERMITTED_TABS[currentRole] || ["public-home"]
    if (!allowed.includes(tab)) {
      const fallbackTab = currentRole === "public" ? "public-home" : `${currentRole}-dashboard`
      setActiveTab(fallbackTab)
      return
    }
    setActiveTab(tab)
    if (id) setTargetId(id)
    setSidebarOpen(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleRoleChanged = (newRole: UserRole) => {
    setRole(newRole)
    setSidebarOpen(false)
  }

  // Footer navigation respecting RBAC (Public scrolls in-page, internal navigates tabs)
  const handleFooterNav = (target: "help" | "price-board" | "price-map") => {
    if (currentRole === "public") {
      const sectionMap = {
        help: "bantuan",
        "price-board": "papan-harga",
        "price-map": "peta-disparitas",
      }
      const sectionId = sectionMap[target]
      if (activeTab !== "public-home") {
        setActiveTab("public-home")
        setTimeout(() => {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" })
        }, 100)
      } else {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    } else {
      handleNavigate(target)
    }
  }

  // RBAC: Public visitors NEVER have an internal workspace sidebar.
  // Internal roles (petani, pembeli, admin) ALWAYS have their workspace sidebar.
  const showSidebar = currentRole !== "public"

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20">
      {/* Top Header Bar */}
      <Topbar
        activeTab={activeTab}
        onNavigate={handleNavigate}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 flex min-h-[calc(100vh-3.75rem)]">
        {/* Left Sidebar for internal roles & workspace pages: strictly non-scrollable */}
        {showSidebar && (
          <>
            {/* Desktop persistent sidebar: fixed to viewport, NO scrollbar */}
            <aside className="hidden lg:block w-60 shrink-0 border-r border-border/80 bg-card/60 dark:bg-card/40 select-none">
              <div className="sticky top-15 h-[calc(100vh-3.75rem)] overflow-hidden">
                <Sidebar
                  activeTab={activeTab}
                  onNavigate={handleNavigate}
                />
              </div>
            </aside>

            {/* Mobile backdrop drawer */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs lg:hidden animate-in fade-in duration-150"
                onClick={() => setSidebarOpen(false)}
              >
                <div
                  className="w-64 h-full bg-card shadow-xl overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Sidebar
                    activeTab={activeTab}
                    onNavigate={handleNavigate}
                    onCloseMobile={() => setSidebarOpen(false)}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {/* Main Content Area + Integrated Footer for internal roles */}
        <div className="flex-1 flex flex-col min-w-0">
          <main
            className={`flex-1 min-w-0 transition-colors ${
              showSidebar
                ? "bg-[#F9FAFB] dark:bg-background/95 p-4 sm:p-6 lg:p-8"
                : "bg-background py-6 sm:py-8"
            }`}
          >
            {/* PUBLIC FLOW (Only accessible by public visitors) */}
            {currentRole === "public" && (
              <>
                {activeTab === "public-home" && <HomePage onNavigate={handleNavigate} />}
                {activeTab === "auth-login" && (
                  <LoginPage
                    onLoginSuccess={(role) => {
                      switch (role) {
                        case "petani":
                          setActiveTab("petani-dashboard")
                          break
                        case "pembeli":
                          setActiveTab("pembeli-dashboard")
                          break
                        case "admin":
                          setActiveTab("admin-dashboard")
                          break
                        default:
                          setActiveTab("public-home")
                      }
                    }}
                  />
                )}
              </>
            )}

            {/* PETANI FLOW (Only accessible by petani role) */}
            {currentRole === "petani" && (
              <>
                {activeTab === "petani-dashboard" && <PetaniDashboard onNavigate={handleNavigate} />}
                {activeTab === "create-offer" && (
                  <CreateOfferPage onSuccess={() => handleNavigate("my-offers")} />
                )}
                {activeTab === "my-offers" && <MyOffersPage onNavigate={handleNavigate} />}
                {activeTab === "contracts" && (
                  <PetaniContractsPage onNavigate={handleNavigate} />
                )}
                {activeTab === "contract-detail" && (
                  <PetaniContractDetailPage
                    contractId={targetId || "ctr-01"}
                    onBack={() => handleNavigate("contracts")}
                  />
                )}
                {activeTab === "price-board" && <PriceBoardPage />}
                {activeTab === "price-map" && <PriceMapPage />}
                {activeTab === "help" && <HelpAndPrivacyPage />}
              </>
            )}

            {/* PEMBELI FLOW (Only accessible by pembeli/produsen role) */}
            {currentRole === "pembeli" && (
              <>
                {activeTab === "pembeli-dashboard" && <PembeliDashboard onNavigate={handleNavigate} />}
                {activeTab === "supply-catalog" && <SupplyCatalogPage onNavigate={handleNavigate} />}
                {activeTab === "supply-detail" && (
                  <SupplyDetailPage
                    offerId={targetId || "of-01"}
                    onBack={() => handleNavigate("supply-catalog")}
                    onSuccess={(contractId) => handleNavigate("contract-detail", contractId)}
                  />
                )}
                {activeTab === "contracts" && (
                  <PembeliContractsPage onNavigate={handleNavigate} />
                )}
                {activeTab === "contract-detail" && (
                  <PembeliContractDetailPage
                    contractId={targetId || "ctr-01"}
                    onBack={() => handleNavigate("contracts")}
                  />
                )}
                {activeTab === "price-board" && <PriceBoardPage />}
                {activeTab === "price-map" && <PriceMapPage />}
                {activeTab === "help" && <HelpAndPrivacyPage />}
              </>
            )}

            {/* ADMIN FLOW (Only accessible by dinas/admin role) */}
            {currentRole === "admin" && (
              <>
                {activeTab === "admin-dashboard" && <AdminDashboard onNavigate={handleNavigate} />}
                {activeTab === "admin-parameters" && (
                  <AdminParametersPage onBack={() => handleNavigate("admin-dashboard")} />
                )}
                {activeTab === "admin-moderation" && (
                  <AdminModerationPage onBack={() => handleNavigate("admin-dashboard")} />
                )}
                {activeTab === "admin-users" && (
                  <AdminUsersPage onBack={() => handleNavigate("admin-dashboard")} />
                )}
                {activeTab === "admin-audit" && (
                  <AdminAuditLogPage onBack={() => handleNavigate("admin-dashboard")} />
                )}
                {activeTab === "admin-model" && (
                  <AdminModelEvalPage onBack={() => handleNavigate("admin-dashboard")} />
                )}
                {activeTab === "contracts" && (
                  <ContractsListPage onNavigate={handleNavigate} />
                )}
                {activeTab === "contract-detail" && (
                  <ContractDetailPage
                    contractId={targetId || "ctr-01"}
                    onBack={() => handleNavigate("contracts")}
                  />
                )}
                {activeTab === "price-board" && <PriceBoardPage />}
                {activeTab === "price-map" && <PriceMapPage />}
                {activeTab === "help" && <HelpAndPrivacyPage />}
              </>
            )}
          </main>

          {/* Clean Integrated Footer: strictly merged with content column, never cuts under sidebar */}
          <footer className="border-t border-border/80 bg-card py-5 text-xs text-muted-foreground transition-colors mt-auto">
            <div className={`px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left ${!showSidebar ? "max-w-6xl mx-auto w-full" : ""}`}>
              <div>
                <p className="font-semibold text-foreground">
                  SAMBUNG — Sistem Agrikultur Modern Berbasis Unggulan Nilai Gabah
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Pasar pertanian yang lebih adil · Transparansi rantai pasok dan simulasi kesepakatan gabah
                </p>
              </div>

              <div className="flex items-center gap-4 text-[11px]">
                <button
                  onClick={() => handleFooterNav("help")}
                  className="hover:text-foreground hover:underline cursor-pointer"
                >
                  Ketentuan & Privasi
                </button>
                <span>·</span>
                <button
                  onClick={() => handleFooterNav("price-board")}
                  className="hover:text-foreground hover:underline cursor-pointer"
                >
                  Papan Harga 2 Sisi
                </button>
                <span>·</span>
                <button
                  onClick={() => handleFooterNav("price-map")}
                  className="hover:text-foreground hover:underline cursor-pointer"
                >
                  Peta Publik
                </button>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Floating Demo Role Switcher for seamless role switching */}
      <RoleSwitcher onRoleChanged={handleRoleChanged} />
    </div>
  )
}

export default App
