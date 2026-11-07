import { useState } from "react"
import { useSambungStore } from "@/store/sambungStore"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { LeafletPriceMap } from "@/components/domain/LeafletPriceMap"
import { SEED_PROVINCIAL_COMPARISONS } from "@/mock/seedData"
import {
  TrendingUp,
  LogIn,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Sprout,
  Factory,
  ShieldCheck,
  Globe2,
  ArrowRight,
  Database,
  Building2,
  Store,
  MapPin,
  ChevronRight,
  HelpCircle,
  Percent,
  Check,
  Table,
  Download
} from "lucide-react"

interface HomePageProps {
  onNavigate: (tab: string) => void
}

const PROVINCE_PREVIEWS = [
  {
    code: "JI",
    name: "Jawa Timur",
    price: "Rp15.000",
    diff: "-4,5% dari acuan nasional",
    status: "Sentra Produksi Utama",
    factors: [
      { label: "Dekat sentra produksi padi", impact: "Menurunkan harga", width: "65%", type: "down" },
      { label: "Serapan gudang Bulog tinggi", impact: "Menstabilkan harga", width: "40%", type: "down" },
      { label: "Permintaan kota metropolitan", impact: "Menaikkan harga", width: "35%", type: "up" },
    ]
  },
  {
    code: "JB",
    name: "Jawa Barat",
    price: "Rp16.200",
    diff: "+3,2% dari acuan nasional",
    status: "Wilayah Konsumsi & Lumbung",
    factors: [
      { label: "Tingginya permintaan Jabodetabek", impact: "Menaikkan harga", width: "70%", type: "up" },
      { label: "Biaya logistik antarkabupaten", impact: "Menaikkan harga", width: "45%", type: "up" },
      { label: "Pasokan panen raya Karawang-Subang", impact: "Menahan kenaikan", width: "50%", type: "down" },
    ]
  },
  {
    code: "JT",
    name: "Jawa Tengah",
    price: "Rp15.200",
    diff: "-3,2% dari acuan nasional",
    status: "Sentra Lumbung Pangan",
    factors: [
      { label: "Panen raya di Sragen & Grobogan", impact: "Menurunkan harga", width: "60%", type: "down" },
      { label: "Pasokan lokal melimpah", impact: "Menurunkan harga", width: "45%", type: "down" },
      { label: "Arus distribusi ke provinsi lain", impact: "Menaikkan harga", width: "30%", type: "up" },
    ]
  },
  {
    code: "SN",
    name: "Sulawesi Selatan",
    price: "Rp15.500",
    diff: "-1,3% dari acuan nasional",
    status: "Lumbung Pangan Indonesia Timur",
    factors: [
      { label: "Sentra produksi padi Sidrap & Bone", impact: "Menurunkan harga", width: "55%", type: "down" },
      { label: "Biaya angkut kapal ke kepulauan timur", impact: "Menaikkan harga", width: "40%", type: "up" },
      { label: "Penyaluran cadangan beras SPHP", impact: "Menahan harga", width: "30%", type: "down" },
    ]
  },
  {
    code: "SU",
    name: "Sumatera Utara",
    price: "Rp16.300",
    diff: "+3,8% dari acuan nasional",
    status: "Wilayah Konsumsi Tinggi",
    factors: [
      { label: "Jarak angkut dari sentra Jawa & Aceh", impact: "Menaikkan harga", width: "55%", type: "up" },
      { label: "Permintaan industri pangan daerah", impact: "Menaikkan harga", width: "40%", type: "up" },
      { label: "Pasokan lokal Deli Serdang", impact: "Menahan kenaikan", width: "35%", type: "down" },
    ]
  },
  {
    code: "KS",
    name: "Kalimantan Selatan",
    price: "Rp17.000",
    diff: "+8,3% dari acuan nasional",
    status: "Biaya Logistik Lintas Pulau",
    factors: [
      { label: "Ketergantungan pasokan lintas laut", impact: "Menaikkan harga", width: "65%", type: "up" },
      { label: "Biaya logistik darat & sungai", impact: "Menaikkan harga", width: "45%", type: "up" },
      { label: "Dampak iklim & musim tanam pasang surut", impact: "Menaikkan harga", width: "35%", type: "up" },
    ]
  }
]

const CHAIN_TABLE_DATA = [
  { level: "1. Gabah Petani (GKP)", commodity: "Gabah Kering Panen", price: "Rp7.000", note: "HPP Resmi Pemerintah Rp6.500", share: "45,6%" },
  { level: "2. Petani (Setara Beras)", commodity: "Beras Medium", price: "Rp12.730", note: "Rendemen Giling Gabah ~55%", share: "82,9%" },
  { level: "3. Penggilingan (Produsen)", commodity: "Beras Giling", price: "Rp14.380", note: "Marjin Proses & Pengeringan +Rp1.650", share: "93,7%" },
  { level: "4. Pedagang Besar / Grosir", commodity: "Beras Grosir", price: "Rp14.590", note: "Biaya Logistik & Pengemasan +Rp210", share: "95,1%" },
  { level: "5. Eceran Pasar (Konsumen)", commodity: "Beras Medium I", price: "Rp15.350", note: "Harga Rata-Rata Nasional PIHPS +Rp760", share: "100,0%" },
]

const FAQS = [
  {
    q: "Bagaimana cara kerja lampu harga di SAMBUNG?",
    a: "Lampu harga membandingkan harga penawaran Anda dengan rentang acuan wajar wilayah berdasarkan data historis PIHPS dan BPS. Hijau berarti adil dan wajar, Kuning berarti perlu verifikasi, dan Merah menandakan risiko kerugian atau anomali harga."
  },
  {
    q: "Apakah petani dikenakan biaya atau komisi pendaftaran?",
    a: "Tidak. SAMBUNG 100% gratis untuk petani dan kelompok tani. Tidak ada biaya pendaftaran, potongan komisi kesepakatan, maupun biaya langganan bulanan."
  },
  {
    q: "Kapan nomor kontak antara petani dan produsen dibuka?",
    a: "Nomor WhatsApp dan telepon kedua pihak langsung dibuka secara transparan segera setelah kedua belah pihak menyepakati harga final pada sistem kontrak SAMBUNG."
  },
  {
    q: "Dari mana data acuan harga resmi diperoleh?",
    a: "Data harga acuan disinkronkan secara berkala dari Pusat Informasi Harga Pangan Strategis (PIHPS) Bank Indonesia, Badan Pusat Statistik (BPS), Badan Pangan Nasional (Bapanas), dan BMKG."
  }
]

export function HomePage({ onNavigate }: HomePageProps) {
  const { setRole, theme } = useSambungStore()
  const [selectedProvinceIdx, setSelectedProvinceIdx] = useState(0)
  const [showInteractiveMap, setShowInteractiveMap] = useState(false)
  const [selectedProvinceName, setSelectedProvinceName] = useState("Jawa Timur")
  const [showPriceTable, setShowPriceTable] = useState(false)

  const activeProvince = PROVINCE_PREVIEWS[selectedProvinceIdx]

  const handleRoleDirectLogin = (role: "petani" | "pembeli" | "admin" | "public") => {
    setRole(role)
    switch (role) {
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
        scrollToSection("papan-harga")
        break
    }
  }

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const handleDownloadCSV = () => {
    const csvContent =
      "Tingkat Rantai Pasok,Komoditas,Harga Acuan (Rp/kg),Keterangan Marjin,Porsi Nilai\n" +
      CHAIN_TABLE_DATA.map((row) => `"${row.level}","${row.commodity}","${row.price}","${row.note}","${row.share}"`).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `SAMBUNG_Rantai_Pasok_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-20 pb-20">
      {/* 1. Hero Section matching Main.dc.html (#beranda) */}
      <section id="beranda" className="flex flex-col lg:flex-row items-center gap-12 pt-2 scroll-mt-20">
        {/* Left Copy */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
            <Database className="w-3.5 h-3.5 text-primary" />
            <span>Data PIHPS dan BPS · Pembaruan mingguan</span>
          </div>

          <h1 className="text-display-lg sm:text-display-xl font-display font-extrabold text-foreground tracking-tight leading-tight">
            Harga gabah yang wajar, terbuka untuk semua.
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
            SAMBUNG menyambungkan petani dengan pembeli penggilingan, lalu menunjukkan rentang harga wajar, acuan pasar, dan alasan di balik selisih harga antardaerah.
          </p>

          <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-2">
            <Button
              size="default"
              onClick={() => scrollToSection("papan-harga")}
              className="gap-2 shadow-xs cursor-pointer text-xs"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Lihat harga hari ini</span>
            </Button>
            <Button
              size="default"
              variant="outline"
              onClick={() => onNavigate("auth-login")}
              className="gap-2 cursor-pointer text-xs"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk petani & produsen</span>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Gratis untuk petani · Tanpa komisi transaksi · Harga wajar adalah estimasi, bukan jaminan
          </p>
        </div>

        {/* Right Benchmark Card matching Main.dc.html */}
        <Card className="w-full lg:w-[440px] p-6 sm:p-7 space-y-5 bg-card border border-border/80 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Harga acuan gabah (GKP) · Nasional
            </span>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
              Data acuan resmi
            </span>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
                Rp7.000
              </span>
              <span className="text-sm text-muted-foreground">/kg</span>
            </div>

            {/* Sparkline trend matching mockup */}
            <div className="w-28 h-10 flex flex-col justify-end">
              <svg width="112" height="36" viewBox="0 0 120 40" className="overflow-visible" aria-label="Tren harga naik dalam 8 pekan terakhir">
                <polyline
                  points="0,28 17,24.4 34,22 51,17.2 68,14.8 85,12.4 102,8.8 119,10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                />
              </svg>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Di atas HPP gabah Rp6.500/kg. Harga naik bertahap dalam 8 pekan terakhir.
          </p>

          <div className="h-px bg-border/80" />

          {/* Quick Horizon Pills */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-muted/60 border border-border/50 space-y-1">
              <span className="text-[11px] font-medium text-muted-foreground">Prakiraan 2 pekan</span>
              <p className="text-lg font-bold text-foreground font-display">Rp7.150</p>
              <span className="text-[10px] text-muted-foreground block">Rentang 80%: 6.950 - 7.350</span>
            </div>
            <div className="p-3 rounded-lg bg-muted/60 border border-border/50 space-y-1">
              <span className="text-[11px] font-medium text-muted-foreground">Prakiraan 4 pekan</span>
              <p className="text-lg font-bold text-foreground font-display">Rp7.300</p>
              <span className="text-[10px] text-muted-foreground block">Rentang 80%: 6.900 - 7.700</span>
            </div>
          </div>
        </Card>
      </section>

      {/* 2. Three Contextual Fact Cards matching Main.dc.html */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="p-6 bg-card border border-border/80 space-y-2">
          <span className="font-display text-3xl sm:text-4xl font-extrabold text-foreground">
            45%
          </span>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Selisih harga beras antara provinsi termahal dan termurah pada pekan Oktober 2026 (PIHPS).
          </p>
        </Card>

        <Card className="p-6 bg-card border border-border/80 space-y-2">
          <span className="font-display text-3xl sm:text-4xl font-extrabold text-foreground">
            Rp6.500
          </span>
          <p className="text-xs text-muted-foreground leading-relaxed">
            HPP gabah per kg, sementara harga gabah 2026 sudah sekitar Rp7.000 dan di beberapa daerah menembus Rp8.000.
          </p>
        </Card>

        <Card className="p-6 bg-card border border-border/80 space-y-2">
          <span className="font-display text-3xl sm:text-4xl font-extrabold text-foreground">
            73%
          </span>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Wilayah diprakirakan berhujan rendah pada November 2026 - Januari 2027 akibat El Niño kuat (BMKG).
          </p>
        </Card>
      </section>

      {/* 3. Papan Harga 2 Sisi Section (#papan-harga) with in-place table toggle */}
      <section id="papan-harga" className="space-y-6 pt-4 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted text-[11px] font-semibold text-muted-foreground uppercase tracking-wider border border-border">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              <span>Transparansi Rantai Pasok Beras</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight">
              Papan Rantai Harga 2 Sisi
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Transparansi harga dari gabah di tangan petani hingga beras di piring konsumen. Pantau farmer's share secara terbuka.
            </p>
          </div>

          {/* Toggle Table in place - stays on landing page without navigating away */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowPriceTable(!showPriceTable)}
            className="self-start sm:self-auto gap-1.5 text-xs cursor-pointer"
          >
            {showPriceTable ? (
              <>
                <Check className="w-3.5 h-3.5 text-primary" />
                <span>Tampilkan Alur Ringkas</span>
              </>
            ) : (
              <>
                <Table className="w-3.5 h-3.5 text-primary" />
                <span>Tampilkan Rincian Tabel</span>
              </>
            )}
          </Button>
        </div>

        {/* Conditional View: Detailed Table vs 4-Stage Cards */}
        {showPriceTable ? (
          <Card className="p-5 sm:p-6 bg-card border border-border/80 space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Tabel Komparasi Rantai Pasok Beras Nasional
                </h3>
                <p className="text-xs text-muted-foreground">
                  Data simulasi marjin harga dari tingkat hulu (petani) hingga hilir (pasar eceran konsumen).
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDownloadCSV}
                className="self-start sm:self-auto gap-1.5 text-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh CSV</span>
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-border/80 text-muted-foreground uppercase tracking-wider text-[11px]">
                    <th className="py-2.5 px-3 font-semibold">Tingkat Rantai Pasok</th>
                    <th className="py-2.5 px-3 font-semibold">Komoditas Acuan</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Harga Acuan</th>
                    <th className="py-2.5 px-3 font-semibold">Keterangan Marjin</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Porsi Nilai</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {CHAIN_TABLE_DATA.map((row, idx) => (
                    <tr key={idx} className="hover:bg-muted/40 transition-colors">
                      <td className="py-2.5 px-3 font-medium text-foreground">{row.level}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{row.commodity}</td>
                      <td className="py-2.5 px-3 text-right font-bold font-display text-foreground">{row.price}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{row.note}</td>
                      <td className="py-2.5 px-3 text-right font-semibold text-primary">{row.share}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3.5 rounded-lg bg-muted/60 border border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="font-semibold text-foreground">Farmer's Share: 82,9% · Total Selisih Rantai Pasok: Rp2.620/kg (17,1%)</span>
                <p className="text-[11px] text-muted-foreground">Harga gabah petani mencerminkan porsi yang sehat terhadap harga beras akhir di tingkat konsumen.</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#EAF1E7] text-[#2D4828] dark:bg-primary/20 dark:text-primary-foreground border border-primary/20 shrink-0">
                Rentang Wajar
              </span>
            </div>
          </Card>
        ) : (
          <>
            {/* 4-Stage Value Chain Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-5 bg-card border border-border/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    1. Gabah Petani (GKP)
                  </span>
                  <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                    <Sprout className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold font-display text-foreground">Rp7.000</p>
                  <span className="text-xs text-muted-foreground">per kg gabah panen</span>
                </div>
                <div className="pt-2 border-t border-border/60 text-[11px] text-muted-foreground">
                  HPP resmi pemerintah Rp6.500/kg
                </div>
              </Card>

              <Card className="p-5 bg-card border border-border/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    2. Beras Petani (Konversi)
                  </span>
                  <div className="p-1.5 rounded-md bg-muted text-foreground">
                    <Percent className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold font-display text-foreground">Rp12.730</p>
                  <span className="text-xs text-muted-foreground">per kg setara beras</span>
                </div>
                <div className="pt-2 border-t border-border/60 text-[11px] text-muted-foreground">
                  Estimasi rendemen giling gabah ~55%
                </div>
              </Card>

              <Card className="p-5 bg-card border border-border/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    3. Penggilingan (Produsen)
                  </span>
                  <div className="p-1.5 rounded-md bg-muted text-foreground">
                    <Building2 className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold font-display text-foreground">Rp14.380</p>
                  <span className="text-xs text-muted-foreground">per kg beras giling</span>
                </div>
                <div className="pt-2 border-t border-border/60 text-[11px] text-muted-foreground">
                  Marjin proses & pengeringan +Rp1.650
                </div>
              </Card>

              <Card className="p-5 bg-card border border-border/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    4. Eceran Konsumen
                  </span>
                  <div className="p-1.5 rounded-md bg-muted text-foreground">
                    <Store className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold font-display text-foreground">Rp15.350</p>
                  <span className="text-xs text-muted-foreground">per kg eceran pasar</span>
                </div>
                <div className="pt-2 border-t border-border/60 text-[11px] text-muted-foreground">
                  Harga rata-rata nasional PIHPS
                </div>
              </Card>
            </div>

            {/* Farmer Share Highlight Banner */}
            <div className="p-5 rounded-xl border border-border/80 bg-card/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#EAF1E7] text-[#2D4828] dark:bg-primary/20 dark:text-primary-foreground flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">
                    Porsi Petani (Farmer's Share): 83%
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Total selisih harga dari petani ke konsumen adalah Rp2.620/kg (17% marjin rantai distribusi). Berada dalam rentang wajar.
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#EAF1E7] text-[#2D4828] dark:bg-primary/20 dark:text-primary-foreground border border-primary/20 shrink-0">
                Kondisi Sehat
              </span>
            </div>
          </>
        )}
      </section>

      {/* 4. Peta Disparitas Antardaerah Section (#peta-disparitas) with in-place map replacement */}
      <section id="peta-disparitas" className="space-y-6 pt-4 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted text-[11px] font-semibold text-muted-foreground uppercase tracking-wider border border-border">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span>Peta Disparitas Regional</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight">
              Peta Disparitas Harga Pangan Antardaerah
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Pilih provinsi untuk melihat harga acuan dan faktor pendorong mengapa harganya berbeda dari wilayah lain. Tanpa perlu daftar akun.
            </p>
          </div>

          {/* User Requested: "tombol buka peta interaktif diganti jadi tampilkan peta, lalu nanti peta akan muncul sebagai pengganti tabel" */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowInteractiveMap(!showInteractiveMap)}
            className="self-start sm:self-auto gap-1.5 text-xs cursor-pointer"
          >
            {showInteractiveMap ? (
              <>
                <Table className="w-3.5 h-3.5 text-primary" />
                <span>Tampilkan Ringkasan & Faktor</span>
              </>
            ) : (
              <>
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>Tampilkan Peta</span>
              </>
            )}
          </Button>
        </div>

        {/* In-place Replacement: Interactive Leaflet Map vs Province Selector & Factors */}
        {showInteractiveMap ? (
          <Card className="p-5 sm:p-6 bg-card border border-border/80 space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/60">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Peta Spasial Disparitas Harga Gabah & Beras
                </h3>
                <p className="text-xs text-muted-foreground">
                  Klik pada provinsi mana pun untuk memeriksa harga acuan regional dan selisihnya terhadap acuan nasional.
                </p>
              </div>

              {/* Legend matching LeafletPriceMap styling */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
                  <span>Lebih Murah (&lt; -2%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                  <span>Dekat Acuan</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-600 inline-block" />
                  <span>Lebih Mahal (&gt; +2%)</span>
                </div>
              </div>
            </div>

            {/* Map Container */}
            <div className="h-[440px] rounded-lg overflow-hidden border border-border/60">
              <LeafletPriceMap
                data={SEED_PROVINCIAL_COMPARISONS}
                selectedProvince={selectedProvinceName}
                onSelectProvince={(prov) => {
                  setSelectedProvinceName(prov)
                  const foundIdx = PROVINCE_PREVIEWS.findIndex((p) => p.name === prov)
                  if (foundIdx !== -1) {
                    setSelectedProvinceIdx(foundIdx)
                  }
                }}
                theme={theme}
              />
            </div>

            {/* Selected Province Quick Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-muted/60 border border-border/60 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span className="font-semibold text-foreground">Wilayah Terpilih: {selectedProvinceName}</span>
                <span className="text-muted-foreground">· Data acuan resmi BPS & PIHPS Bank Indonesia</span>
              </div>
              <button
                onClick={() => setShowInteractiveMap(false)}
                className="text-primary hover:underline font-semibold cursor-pointer flex items-center gap-1 shrink-0"
              >
                <span>Lihat rincian faktor pendorong</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Province Buttons Grid */}
            <Card className="lg:col-span-7 p-5 bg-card border border-border/80 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Pilih Provinsi Acuan
                </span>
                <span className="text-xs text-muted-foreground">Klik untuk melihat analisis</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {PROVINCE_PREVIEWS.map((prov, idx) => {
                  const isSelected = selectedProvinceIdx === idx
                  return (
                    <button
                      key={prov.code}
                      onClick={() => {
                        setSelectedProvinceIdx(idx)
                        setSelectedProvinceName(prov.name)
                      }}
                      className={`p-3 rounded-lg border text-left transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary shadow-xs"
                          : "border-border/80 bg-card hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-display">{prov.code}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                      </div>
                      <p className="text-xs font-semibold text-foreground mt-1 truncate">{prov.name}</p>
                      <p className="text-xs font-bold text-primary mt-0.5">{prov.price}</p>
                    </button>
                  )
                })}
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground border-t border-border/60">
                <span>Sumber: PIHPS Bank Indonesia (Pembaruan Terkini)</span>
                <button
                  onClick={() => setShowInteractiveMap(true)}
                  className="hover:text-primary transition-colors cursor-pointer flex items-center gap-1 font-medium"
                >
                  <span>Tampilkan seluruh provinsi di peta interaktif</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </Card>

            {/* Selected Province Analysis & SHAP Factors matching Main.dc.html */}
            <Card className="lg:col-span-5 p-5 bg-card border border-border/80 space-y-4">
              <div>
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Analisis Wilayah Terpilih
                </span>
                <div className="flex items-baseline justify-between gap-2 mt-1">
                  <h3 className="text-xl font-bold font-display text-foreground">
                    {activeProvince.name}
                  </h3>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {activeProvince.status}
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold font-display text-foreground">
                    {activeProvince.price}
                  </span>
                  <span className="text-xs text-muted-foreground">/kg beras medium</span>
                </div>
                <p className="text-xs text-primary font-medium mt-0.5">
                  {activeProvince.diff}
                </p>
              </div>

              <div className="h-px bg-border/80" />

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Mengapa harga di sini berbeda?
                </h4>

                <div className="space-y-3">
                  {activeProvince.factors.map((factor, fIdx) => (
                    <div key={fIdx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-foreground font-medium">{factor.label}</span>
                        <span
                          className={`text-[11px] font-semibold ${
                            factor.type === "up" ? "text-amber-700 dark:text-amber-400" : "text-emerald-700 dark:text-emerald-400"
                          }`}
                        >
                          {factor.impact}
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            factor.type === "up" ? "bg-amber-600 dark:bg-amber-500" : "bg-emerald-600 dark:bg-emerald-500"
                          }`}
                          style={{ width: factor.width }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-muted-foreground leading-relaxed pt-1">
                  Penjelasan faktor spasial-temporal dihitung dari model transmisi harga pasar antarwilayah.
                </p>
              </div>
            </Card>
          </div>
        )}
      </section>

      {/* 5. Cara Membaca Lampu Harga matching Main.dc.html (#lampu) */}
      <section id="lampu" className="space-y-6 pt-4 scroll-mt-20">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted text-[11px] font-semibold text-muted-foreground uppercase tracking-wider border border-border">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
            <span>Transparansi Algoritma</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight">
            Cara membaca lampu harga
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Setiap penawaran dan kontrak di SAMBUNG diperiksa terhadap rentang harga wajar daerahnya. Lampu selalu disertai alasan tertulis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Hijau: Wajar */}
          <Card className="p-6 bg-card border border-border/80 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EAF1E7] text-[#2D4828] dark:bg-primary/20 dark:text-primary-foreground border border-primary/25">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Wajar</span>
            </span>
            <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
              Harga berada di dalam rentang wajar daerah Anda. Transaksi dinilai adil dan aman untuk dilanjutkan.
            </p>
          </Card>

          {/* Kuning: Perlu dicek */}
          <Card className="p-6 bg-card border border-border/80 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Perlu dicek</span>
            </span>
            <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
              Harga mendekati atau sedikit di luar rentang wajar. Bandingkan dengan acuan pasar dan pembeli lain sebelum sepakat.
            </p>
          </Card>

          {/* Merah: Tidak wajar */}
          <Card className="p-6 bg-card border border-border/80 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Tidak wajar</span>
            </span>
            <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
              Harga jauh di bawah HPP atau jauh melampaui plafon wajar. Sistem menyertakan peringatan risiko kerugian.
            </p>
          </Card>
        </div>

        <p className="text-xs text-muted-foreground">
          Lampu harga adalah estimasi berdasarkan data historis dan acuan pasar daerah, bukan jaminan harga jual.
        </p>
      </section>

      {/* 6. Alur 5 Langkah Transaksi matching Main.dc.html (#alur) */}
      <section id="alur" className="space-y-6 pt-4 scroll-mt-20">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted text-[11px] font-semibold text-muted-foreground uppercase tracking-wider border border-border">
            <ArrowRight className="w-3.5 h-3.5 text-primary" />
            <span>Alur Transaksi Mudah</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight">
            Dari panen sampai kontrak, dalam 5 langkah
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Alur dibuat pendek dan jelas, ramah bagi petani dan produsen di lapangan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              step: "1",
              title: "Daftar Akun",
              desc: "Isian minimal dan praktis: nama, nomor HP WhatsApp, dan lokasi kecamatan."
            },
            {
              step: "2",
              title: "Pasang Panen",
              desc: "Pilih komoditas GKP/GKG, perkiraan volume tonase, dan harga tawar per kg."
            },
            {
              step: "3",
              title: "Cek Lampu",
              desc: "Rentang harga wajar dan lampu evaluasi muncul seketika sebelum terbit."
            },
            {
              step: "4",
              title: "Terima Pesanan",
              desc: "Produsen mengajukan pesanan, petani dapat menerima, menawar balik, atau menolak."
            },
            {
              step: "5",
              title: "Kontrak Digital",
              desc: "Kedua pihak menyepakati harga final, nomor kontak terbuka, dan bukti tersimpan."
            }
          ].map((item) => (
            <Card key={item.step} className="p-5 bg-card border border-border/80 flex flex-col justify-between space-y-3">
              <div>
                <span className="font-display text-2xl font-extrabold text-primary block mb-2">
                  {item.step}
                </span>
                <h3 className="font-bold text-sm text-foreground mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 7. SAMBUNG Untuk Siapa? matching Main.dc.html (#peran) */}
      <section id="peran" className="space-y-6 pt-4 scroll-mt-20">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted text-[11px] font-semibold text-muted-foreground uppercase tracking-wider border border-border">
            <Globe2 className="w-3.5 h-3.5 text-primary" />
            <span>Ekosistem Pangan Terpadu</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight">
            SAMBUNG untuk siapa?
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Dirancang khusus untuk memberdayakan seluruh mata rantai agrikultur beras nasional.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Petani */}
          <Card className="p-6 bg-card border border-border/80 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Sprout className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-foreground">Petani & Poktan</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Harga acuan wajar, temukan mitra pembeli alternatif terpercaya, dan simpan bukti kesepakatan transaksi. 100% gratis.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleRoleDirectLogin("petani")}
              className="w-full text-xs justify-between group cursor-pointer"
            >
              <span>Ruang Petani</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Card>

          {/* Card 2: Produsen */}
          <Card className="p-6 bg-card border border-border/80 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Factory className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-foreground">Penggilingan & Produsen</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Katalog pasokan panen siap angkut, pantau kewajaran harga beli antarkabupaten, dan pesan gabah langsung tanpa komisi.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleRoleDirectLogin("pembeli")}
              className="w-full text-xs justify-between group cursor-pointer"
            >
              <span>Dasbor Produsen</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Card>

          {/* Card 3: Admin / Pengawas */}
          <Card className="p-6 border border-border/80 flex flex-col justify-between space-y-4 bg-card">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-foreground">Dinas Pangan & Pengawas</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Kelola parameter acuan harga, verifikasi moderasi tawaran panen, audit log transaksi, dan pantau disparitas regional.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleRoleDirectLogin("admin")}
              className="w-full text-xs justify-between group cursor-pointer"
            >
              <span>Panel Admin</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Card>

          {/* Card 4: Warga Publik */}
          <Card className="p-6 border border-border/80 flex flex-col justify-between space-y-4 bg-card">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Globe2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-foreground">Masyarakat & Warga</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Cukup buka peta harga dan papan harga 2 sisi untuk melihat transparansi marjin petani vs konsumen. Tanpa perlu mendaftar.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => scrollToSection("papan-harga")}
              className="w-full text-xs justify-between group cursor-pointer"
            >
              <span>Papan Harga & Peta</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Card>
        </div>
      </section>

      {/* 8. Pusat Bantuan & Ketentuan (#bantuan) */}
      <section id="bantuan" className="space-y-8 pt-6 border-t border-border/80 scroll-mt-20">
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted text-[11px] font-semibold text-muted-foreground uppercase tracking-wider border border-border">
            <HelpCircle className="w-3.5 h-3.5 text-primary" />
            <span>Pusat Bantuan & Panduan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight">
            Pertanyaan Umum & Bantuan
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Pertanyaan yang sering diajukan mengenai cara kerja platform SAMBUNG dan transparansi data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {FAQS.map((faq, i) => (
            <Card key={i} className="p-5 bg-card border border-border/80 space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-start gap-2">
                <span className="text-primary font-display font-extrabold">Q.</span>
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed pl-5">
                {faq.a}
              </p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
