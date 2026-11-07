import { Card } from "@/components/ui/card"
import { ShieldCheck, BookOpen, Lock, AlertCircle } from "lucide-react"

export function HelpAndPrivacyPage() {
  const glossary = [
    {
      term: "GKP (Gabah Kering Panen)",
      definition: "Gabah hasil panen dengan kadar air berkisar 20% - 25%. Memiliki acuan rendemen konversi standar 52% ke beras."
    },
    {
      term: "GKG (Gabah Kering Giling)",
      definition: "Gabah siap giling dengan kadar air sekitar 14%. Memiliki acuan rendemen konversi standar 63% ke beras."
    },
    {
      term: "Tawaran Panen",
      definition: "Publikasi volume dan harga gabah oleh petani. Satu tawaran dapat melayani beberapa pesanan pembelian parsial."
    },
    {
      term: "Kontrak Simulasi",
      definition: "Catatan kesepakatan transaksi simulasi digital tanpa pembayaran uang riil, bertujuan untuk mengunci komitmen simulasi antara petani dan pembeli."
    },
    {
      term: "Lampu Harga",
      definition: "Indikator kewajaran harga terhadap acuan pasar: Hijau (Wajar), Kuning (Toleransi 3%), Merah (Peringatan kerugian, wajib konfirmasi sadar)."
    },
    {
      term: "Reservasi Volume Atomik",
      definition: "Pencadangan sebagian volume gabah saat pesanan diajukan oleh pembeli untuk mencegah pesanan ganda (overbooking)."
    }
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="pt-4 border-b border-border pb-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4" />
          <span>PB-05 · Pusat Bantuan & Ketentuan Privasi</span>
        </div>
        <h1 className="text-display-lg font-display font-extrabold text-foreground">
          Bantuan Layanan, Glosarium & Kebijakan Data
        </h1>
        <p className="text-body-base text-muted-foreground mt-1">
          Pelajari istilah domain SAMBUNG, prinsip transaksi simulasi, dan komitmen perlindungan data pribadi pengguna.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Glossary Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold font-display text-foreground">Glosarium Istilah Domain</h2>
          </div>

          <div className="space-y-3">
            {glossary.map((g, idx) => (
              <Card key={idx} className="p-4 bg-card border border-border">
                <h3 className="font-bold text-body-base text-foreground text-primary">{g.term}</h3>
                <p className="text-body-sm text-muted-foreground mt-1 leading-relaxed">
                  {g.definition}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Privacy Policy Column */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold font-display text-foreground">Kebijakan Privasi & Batasan Layanan</h2>
          </div>

          <Card className="p-6 bg-card border border-border space-y-4">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-body-base text-foreground">Perlindungan Nomor Telepon</h4>
                <p className="text-body-sm text-muted-foreground mt-1 leading-relaxed">
                  Nomor HP petani dan pembeli <strong>hanya saling terbuka</strong> saat kontrak berada pada status <strong>Disetujui</strong>. Sebelum kesepakatan dan setelah kontrak Batal atau Selesai, nomor kontak langsung disembunyikan kembali.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-4 border-t border-border">
              <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-body-base text-foreground">Privasi Panel Admin</h4>
                <p className="text-body-sm text-muted-foreground mt-1 leading-relaxed">
                  Admin operasional hanya melihat nomor telepon dalam bentuk tersamar (contoh: <code>0812-****-7890</code>). Admin tidak memiliki tombol atau hak untuk membuka nomor lengkap.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-4 border-t border-border">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-body-base text-foreground">Presisi Lokasi Maksimal Kecamatan</h4>
                <p className="text-body-sm text-muted-foreground mt-1 leading-relaxed">
                  Data lokasi panen hanya dibatasi sampai tingkat kecamatan, kabupaten/kota, dan provinsi. Alamat rumah atau titik koordinat presisi tidak pernah dipublikasikan di katalog.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-4 border-t border-border">
              <BookOpen className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-body-base text-foreground">Status Transaksi 100% Simulasi</h4>
                <p className="text-body-sm text-muted-foreground mt-1 leading-relaxed">
                  Seluruh kontrak dalam platform ini adalah <strong>simulasi</strong> tanpa aliran dana atau komisi komersial. Data kontrak simulasi dilarang dijadikan data latih model AI atau observasi harga resmi.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
