import { Card } from "@/components/ui/card"
import { ShieldCheck, BookOpen, Lock, AlertCircle } from "lucide-react"

export function HelpAndPrivacyPage() {
  const glossary = [
    {
      term: "GKP (Gabah Kering Panen)",
      definition: "Gabah hasil panen segar dari sawah dengan kadar air berkisar 20% - 25%. Memiliki acuan rendemen konversi standar 53,38% ke beras medium."
    },
    {
      term: "GKG (Gabah Kering Giling)",
      definition: "Gabah siap giling yang telah dikeringkan dengan kadar air sekitar 14%. Memiliki acuan rendemen konversi standar 63% ke beras."
    },
    {
      term: "Tawaran Panen (Offer)",
      definition: "Publikasi volume dan batas harga gabah oleh kelompok tani. Satu tawaran dapat melayani beberapa pesanan pembelian parsial dari berbagai mitra."
    },
    {
      term: "Kontrak Simulasi",
      definition: "Catatan kesepakatan transaksi simulasi digital tanpa perantara komersial atau potongan platform, bertujuan mengikat komitmen jadwal dan harga antara petani dan pembeli."
    },
    {
      term: "Lampu Harga (Price Lamp)",
      definition: "Indikator otomatis kewajaran harga: Hijau (Wajar, dalam rentang acuan), Kuning (Peringatan toleransi batas 3%), Merah (Peringatan harga di bawah acuan wajar, wajib konfirmasi sadar)."
    },
    {
      term: "Reservasi Volume Atomik",
      definition: "Pencadangan otomatis sebagian volume gabah saat pembeli mengirim pesanan untuk mencegah terjadinya penjualan ganda (overbooking)."
    }
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-7 pb-14">
      {/* Header */}
      <div className="pb-4 border-b border-border/70">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
          <span>SAMBUNG</span>
          <span className="text-muted-foreground/50">/</span>
          <span className="text-foreground">BANTUAN & KEBIJAKAN DATA</span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
          Pusat Bantuan, Glosarium & Kebijakan Privasi
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Pelajari istilah domain komoditas gabah, batasan transaksi simulasi, dan komitmen perlindungan data privasi petani.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Glossary Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold font-display text-foreground">Glosarium Istilah Domain Komoditas</h2>
          </div>

          <div className="space-y-3">
            {glossary.map((g, idx) => (
              <Card key={idx} className="p-4 bg-card border-border/80 shadow-2xs rounded-2xl">
                <h3 className="font-bold text-sm text-primary">{g.term}</h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  {g.definition}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Privacy Policy Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold font-display text-foreground">Kebijakan Privasi & Batasan Layanan</h2>
          </div>

          <Card className="p-6 bg-card border-border/80 shadow-xs rounded-2xl space-y-5">
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">Perlindungan Nomor Telepon</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Nomor kontak petani dan pembeli <strong>hanya saling terbuka</strong> saat kontrak berada pada status <strong>Disetujui</strong>. Sebelum kesepakatan harga dan setelah kontrak Selesai atau Dibatalkan, nomor kontak langsung ditutup kembali.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 pt-4 border-t border-border/70">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">Anonimitas pada Panel Pengawas (Admin)</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Pengawas operasional hanya dapat melihat nomor telepon dalam bentuk tersamar (contoh: <code>0812-****-7890</code>). Pengawas tidak memiliki tombol atau wewenang untuk membuka nomor kontak lengkap.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 pt-4 border-t border-border/70">
              <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">Presisi Lokasi Maksimal Tingkat Kecamatan</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Data lokasi panen pada katalog hanya dibatasi sampai tingkat kecamatan, kabupaten/kota, dan provinsi. Alamat rumah atau titik koordinat GPS presisi tidak pernah dipublikasikan di katalog terbuka.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 pt-4 border-t border-border/70">
              <div className="p-2 rounded-xl bg-secondary text-secondary-foreground shrink-0 mt-0.5 border border-border/60">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">Status Transaksi Bersifat Bebas Komisi</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Platform SAMBUNG tidak memungut biaya komisi perantara dari petani atau pembeli. Seluruh pembayaran dan logistik diatur langsung secara transparan antar mitra yang bersepakat.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
