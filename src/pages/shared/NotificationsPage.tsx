import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Bell,
  AlertCircle,
  FileText,
  ScrollText,
  Check,
  ArrowRight,
  Clock
} from "lucide-react"

interface NotificationItem {
  id: string
  title: string
  description: string
  timestamp: string
  isRead: boolean
  targetTab: string
  targetId?: string
  type: "contract" | "moderation" | "price"
}

interface NotificationsPageProps {
  onNavigate: (tab: string, targetId?: string) => void
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-01",
    title: "Pesanan Baru Masuk",
    description: "CV Sumber Pangan mengajukan pesanan 1.500 kg GKP seharga Rp6.800/kg pada tawaran panen Anda.",
    timestamp: "10 menit yang lalu",
    isRead: false,
    targetTab: "contract-detail",
    targetId: "ctr-01",
    type: "contract"
  },
  {
    id: "notif-02",
    title: "Tawaran Harga Balik Diterima",
    description: "Petani Pak Subur menerima harga kesepakatan Rp6.800/kg. Status kontrak kini 'Disetujui'. Nomor telepon telah terbuka.",
    timestamp: "1 jam yang lalu",
    isRead: false,
    targetTab: "contract-detail",
    targetId: "ctr-02",
    type: "contract"
  },
  {
    id: "notif-03",
    title: "Pembaruan Acuan Harga Mingguan",
    description: "Acuan harga gabah GKP Jawa Timur diperbarui ke rentang Rp6.650 - Rp6.940/kg.",
    timestamp: "Kemarin",
    isRead: true,
    targetTab: "price-board",
    type: "price"
  },
  {
    id: "notif-04",
    title: "Pemeriksaan Moderasi Selesai",
    description: "Admin telah memverifikasi perbaikan data tawaran panen Anda.",
    timestamp: "2 hari yang lalu",
    isRead: true,
    targetTab: "my-offers",
    targetId: "of-01",
    type: "moderation"
  }
]

export function NotificationsPage({ onNavigate }: NotificationsPageProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS)
  const [filter, setFilter] = useState<"all" | "unread">("all")

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
  }

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const handleOpenNotification = (notif: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
    )
    onNavigate(notif.targetTab, notif.targetId)
  }

  const filtered = notifications.filter((n) =>
    filter === "unread" ? !n.isRead : true
  )

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div className="max-w-6xl mx-auto space-y-7 pb-14">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/70">
        <div>
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            <span>SAMBUNG</span>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-foreground">NOTIFIKASI AKTIVITAS</span>
          </nav>

          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Notifikasi & Pemberitahuan
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Pemberitahuan perubahan status transaksi, tawar-menawar harga, dan hasil moderasi pasokan.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            className="self-start sm:self-auto gap-2 text-xs border-border/80"
          >
            <Check className="w-3.5 h-3.5 text-primary" />
            <span>Tandai Semua Dibaca</span>
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-border/70 pb-1">
        <button
          onClick={() => setFilter("all")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            filter === "all"
              ? "bg-primary text-white dark:text-[#182117] shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          Semua ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            filter === "unread"
              ? "bg-primary text-white dark:text-[#182117] shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <span>Belum Dibaca</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-black font-bold">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-2 bg-card rounded-2xl shadow-xs">
            <Bell className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
            <p className="font-bold text-foreground">Tidak Ada Notifikasi</p>
            <p className="text-xs text-muted-foreground mt-1">
              {filter === "unread" ? "Semua notifikasi telah dibaca." : "Belum ada riwayat pemberitahuan."}
            </p>
          </Card>
        ) : (
          filtered.map((notif) => {
            const Icon =
              notif.type === "contract"
                ? ScrollText
                : notif.type === "moderation"
                ? AlertCircle
                : FileText

            return (
              <Card
                key={notif.id}
                onClick={() => handleOpenNotification(notif)}
                className={`p-4 sm:p-5 border transition-all cursor-pointer rounded-2xl flex items-start justify-between gap-4 ${
                  !notif.isRead
                    ? "bg-primary/5 border-primary/30 hover:border-primary/60 shadow-xs"
                    : "bg-card border-border/80 hover:bg-muted/30 shadow-2xs"
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div
                    className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                      !notif.isRead
                        ? "bg-primary text-white dark:text-[#182117] shadow-2xs"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-bold text-foreground truncate ${!notif.isRead ? "text-primary" : ""}`}>
                        {notif.title}
                      </p>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {notif.description}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-1">
                      <Clock className="w-3 h-3 text-muted-foreground/70" />
                      <span>{notif.timestamp}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-center">
                  {!notif.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleMarkAsRead(notif.id, e)}
                      className="text-xs text-muted-foreground hover:text-foreground h-8 w-8 p-0"
                      title="Tandai dibaca"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </Button>
                  )}
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
