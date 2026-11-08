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
      { label: "Surplus produksi beras wilayah Ngawi-Bojonegoro", impact: "Menurunkan harga", width: "65%", type: "down" },
      { label: "Ketersediaan stok penggilingan lokal", impact: "Menurunkan harga", width: "50%", type: "down" },
      { label: "Permintaan pasar luar provinsi", impact: "Menaikkan harga", width: "35%", type: "up" },
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
    <div className="max-w-6xl mx-auto space-y-24 pb-24">
      {/* 1. Hero Section matching Main.dc.html (#beranda) */}
      <section id="beranda" className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 pt-4 scroll-mt-24">
        {/* Left Copy */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <Database className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            <span>Data PIHPS & BPS Nasional · Pembaruan Mingguan</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-foreground tracking-tight leading-[1.12]">
            Harga gabah yang wajar,{" "}
            <span className="text-emerald-800 dark:text-emerald-400">terbuka untuk semua.</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
            SAMBUNG menyambungkan petani dengan pembeli penggilingan beras, lalu menampilkan rentang harga wajar, acuan pasar, dan alasan faktual di balik selisih harga antardaerah.
          </p>

          <div className="flex flex-wrap gap-3.5 justify-center lg:justify-start pt-2">
            <Button
              size="lg"
              onClick={() => scrollToSection("papan-harga")}
              className="gap-2.5 shadow-sm cursor-pointer text-sm font-bold"
            >
              <TrendingUp className="w-4.5 h-4.5" />
              <span>Lihat Harga Hari Ini</span>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => onNavigate("auth-login")}
              className="gap-2.5 cursor-pointer text-sm font-semibold"
            >
              <LogIn className="w-4.5 h-4.5 text-primary" />
              <span>Masuk Petani & Pembeli</span>
            </Button>
          </div>

          <div className="pt-1 flex items-center justify-center lg:justify-start gap-4 text-xs text-muted-foreground font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              100% Gratis Petani
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              Tanpa Potongan Komisi
            </span>
            <span>·</span>
            <span className="text-muted-foreground/80">Acuan Berbasis Data</span>
          </div>
        </div>

        {/* Right Benchmark Card */}
        <Card className="w-full lg:w-[450px] p-7 sm:p-8 space-y-6 bg-gradient-to-b from-card via-card to-emerald-50/20 dark:to-emerald-950/20 border border-border shadow-md rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Harga Acuan Gabah (GKP) · Nasional
            </span>
            <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800">
              Data Resmi Bapanas
            </span>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-5xl font-black text-foreground tracking-tight tabular-nums">
                  Rp7.000
                </span>
                <span className="text-sm font-semibold text-muted-foreground">/kg</span>
              </div>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                <span>+Rp500 di atas HPP resmi (Rp6.500)</span>
              </p>
            </div>

            {/* Sparkline trend */}
            <div className="w-32 h-12 flex flex-col justify-end">
              <svg width="128" height="42" viewBox="0 0 120 40" className="overflow-visible" aria-label="Tren harga naik dalam 8 pekan terakhir">
                <defs>
                  <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#15803D" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#15803D" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polygon
                  points="0,28 17,24.4 34,22 51,17.2 68,14.8 85,12.4 102,8.8 119,10 119,40 0,40"
                  fill="url(#sparklineGrad)"
                />
                <polyline
                  points="0,28 17,24.4 34,22 51,17.2 68,14.8 85,12.4 102,8.8 119,10"
                  fill="none"
                  stroke="#15803D"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Harga rata-rata nasional stabil di atas batas bawah jaminan pemerintah, dengan kenaikan bertahap 8 pekan terakhir.
          </p>

          <div className="h-px bg-border" />

          {/* Quick Horizon Pills */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="p-3.5 rounded-2xl bg-muted/50 border border-border/80 space-y-1">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Prakiraan 2 Pekan</span>
              <p className="text-xl font-black text-foreground font-display tabular-nums">Rp7.150</p>
              <span className="text-[11px] text-muted-foreground block font-mono">Rentang 80%: 6.950 – 7.350</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-muted/50 border border-border/80 space-y-1">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Prakiraan 4 Pekan</span>
              <p className="text-xl font-black text-foreground font-display tabular-nums">Rp7.300</p>
              <span className="text-[11px] text-muted-foreground block font-mono">Rentang 80%: 6.900 – 7.700</span>
            </div>
          </div>
        </Card>
      </section>

      {/* 2. Three Contextual Fact Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-card border border-border shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Disparitas Antarprovinsi</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <span className="font-display text-4xl font-black text-foreground tracking-tight tabular-nums block">
            45%
          </span>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Selisih harga beras antara provinsi sentra produksi terendah dan provinsi kepulauan konsumen tertinggi pekan Oktober 2026 (PIHPS).
          </p>
        </Card>

        <Card className="p-6 bg-card border border-border shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Jaminan HPP Gabah</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <span className="font-display text-4xl font-black text-foreground tracking-tight tabular-nums block">
            Rp6.500
          </span>
          <p className="text-xs text-muted-foreground leading-relaxed">
            HPP resmi gabah GKP per kg yang ditetapkan pemerintah, sementara transaksi riil 2026 di sentra Jawa berkisar Rp6.800 – Rp7.400.
          </p>
        </Card>

        <Card className="p-6 bg-card border border-border shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Faktor Anomali Cuaca</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              <Database className="w-4 h-4" />
            </span>
          </div>
          <span className="font-display text-4xl font-black text-foreground tracking-tight tabular-nums block">
            73%
          </span>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Wilayah sentra diprakirakan mengalami curah hujan di bawah normal pada fase tanam akhir tahun berdasarkan observasi BMKG.
          </p>
        </Card>
      </section>

      {/* 3. Papan Harga 2 Sisi Section (#papan-harga) with in-place table toggle */}
      <section id="papan-harga" className="space-y-6 pt-4 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Transparansi Rantai Pasok</span>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-foreground tracking-tight">
              Papan Rantai Harga 2 Sisi
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ikuti pembentukan nilai dari gabah basah di tangan petani hingga beras di piring konsumen. Pantau farmer's share secara terbuka tanpa perantara tersembunyi.
            </p>
          </div>

          <Button
            size="default"
            variant="outline"
            onClick={() => setShowPriceTable(!showPriceTable)}
            className="self-start sm:self-auto gap-2 text-xs font-semibold cursor-pointer"
          >
            {showPriceTable ? (
              <>
                <Check className="w-3.5 h-3.5 text-primary" />
                <span>Tampilkan Alur Kartu</span>
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
          <Card className="p-6 sm:p-7 bg-card border border-border shadow-xs space-y-5 rounded-2xl animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
              <div>
                <h3 className="text-base font-bold text-foreground font-display">
                  Tabel Komparasi Rantai Pasok Beras Nasional
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Data simulasi marjin harga dari tingkat hulu (petani) hingga hilir (pasar eceran konsumen).
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDownloadCSV}
                className="self-start sm:self-auto gap-2 text-xs font-semibold cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh CSV Lengkap</span>
              </Button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/70">
                  <tr className="border-b border-border text-muted-foreground uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4 font-bold">Tingkat Rantai Pasok</th>
                    <th className="py-3 px-4 font-bold">Komoditas Acuan</th>
                    <th className="py-3 px-4 font-bold text-right">Harga Acuan</th>
                    <th className="py-3 px-4 font-bold">Keterangan Marjin</th>
                    <th className="py-3 px-4 font-bold text-right">Porsi Nilai</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/80">
                  {CHAIN_TABLE_DATA.map((row, idx) => (
                    <tr key={idx} className="hover:bg-muted/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-foreground">{row.level}</td>
                      <td className="py-3 px-4 text-muted-foreground">{row.commodity}</td>
                      <td className="py-3 px-4 text-right font-black font-display text-foreground tabular-nums text-sm">{row.price}</td>
                      <td className="py-3 px-4 text-muted-foreground">{row.note}</td>
                      <td className="py-3 px-4 text-right font-bold text-primary font-mono">{row.share}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-emerald-950 dark:text-emerald-200">
                  Farmer's Share: 82,9% · Total Selisih Rantai Pasok: Rp2.620/kg (17,1%)
                </span>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                  Harga gabah petani mencerminkan porsi yang sangat sehat terhadap harga beras akhir di tingkat konsumen.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shrink-0 shadow-2xs">
                Kondisi Sehat
              </span>
            </div>
          </Card>
        ) : (
          <>
            {/* 4-Stage Value Chain Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-6 bg-card border border-border shadow-xs space-y-4 rounded-2xl relative group hover:border-slate-300 dark:hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    1. Gabah Petani (GKP)
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center">
                    <Sprout className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-black font-display text-foreground tabular-nums">Rp7.000</p>
                  <span className="text-xs text-muted-foreground font-medium">per kg gabah panen basah</span>
                </div>
                <div className="pt-3 border-t border-border text-xs text-muted-foreground">
                  HPP resmi pemerintah <span className="font-semibold text-foreground">Rp6.500/kg</span>
                </div>
              </Card>

              <Card className="p-6 bg-card border border-border shadow-xs space-y-4 rounded-2xl relative group hover:border-slate-300 dark:hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    2. Beras Petani (Konversi)
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-muted text-foreground flex items-center justify-center">
                    <Percent className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-black font-display text-foreground tabular-nums">Rp12.730</p>
                  <span className="text-xs text-muted-foreground font-medium">per kg setara beras giling</span>
                </div>
                <div className="pt-3 border-t border-border text-xs text-muted-foreground">
                  Rendemen giling standar <span className="font-semibold text-foreground">~55%</span>
                </div>
              </Card>

              <Card className="p-6 bg-card border border-border shadow-xs space-y-4 rounded-2xl relative group hover:border-slate-300 dark:hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    3. Penggilingan (Produsen)
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-muted text-foreground flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-black font-display text-foreground tabular-nums">Rp14.380</p>
                  <span className="text-xs text-muted-foreground font-medium">per kg beras grosir giling</span>
                </div>
                <div className="pt-3 border-t border-border text-xs text-muted-foreground">
                  Marjin pengeringan & olah <span className="font-semibold text-foreground">+Rp1.650</span>
                </div>
              </Card>

              <Card className="p-6 bg-card border border-border shadow-xs space-y-4 rounded-2xl relative group hover:border-slate-300 dark:hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    4. Eceran Konsumen
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-muted text-foreground flex items-center justify-center">
                    <Store className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-black font-display text-foreground tabular-nums">Rp15.350</p>
                  <span className="text-xs text-muted-foreground font-medium">per kg eceran pasar rakyat</span>
                </div>
                <div className="pt-3 border-t border-border text-xs text-muted-foreground">
                  Rata-rata nasional PIHPS <span className="font-semibold text-foreground">+Rp970</span>
                </div>
              </Card>
            </div>

            {/* Farmer Share Highlight Banner */}
            <div className="p-5 sm:p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-foreground font-display">
                    Porsi Petani (Farmer's Share): 83%
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Total selisih harga dari petani ke konsumen adalah Rp2.620/kg (17% marjin rantai distribusi). Berada dalam rentang wajar dan adil.
                  </p>
                </div>
              </div>
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 shrink-0">
                Kondisi Sehat
              </span>
            </div>
          </>
        )}
      </section>

      {/* 4. Peta Disparitas Antardaerah Section (#peta-disparitas) with in-place map replacement */}
      <section id="peta-disparitas" className="space-y-6 pt-4 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Geospasial Komoditas</span>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-foreground tracking-tight">
              Peta Disparitas Harga Antardaerah
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Pilih provinsi untuk melihat harga acuan dan faktor pendorong mengapa harganya berbeda dari wilayah lain. Tanpa perlu mendaftar akun.
            </p>
          </div>

          <Button
            size="default"
            variant="outline"
            onClick={() => setShowInteractiveMap(!showInteractiveMap)}
            className="self-start sm:self-auto gap-2 text-xs font-semibold cursor-pointer"
          >
            {showInteractiveMap ? (
              <>
                <Table className="w-3.5 h-3.5 text-primary" />
                <span>Tampilkan Ringkasan & Faktor</span>
              </>
            ) : (
              <>
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>Tampilkan Peta Spasial</span>
              </>
            )}
          </Button>
        </div>

        {/* In-place Replacement: Interactive Leaflet Map vs Province Selector & Factors */}
        {showInteractiveMap ? (
          <Card className="p-6 sm:p-7 bg-card border border-border shadow-xs space-y-5 rounded-2xl animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
              <div>
                <h3 className="text-base font-bold text-foreground font-display">
                  Peta Spasial Disparitas Harga Gabah & Beras
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Klik pada provinsi mana pun untuk memeriksa harga acuan regional dan selisihnya terhadap acuan nasional.
                </p>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3.5 text-xs text-muted-foreground flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block shadow-2xs" />
                  <span className="font-medium">Lebih Murah (&lt; -2%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-2xs" />
                  <span className="font-medium">Dekat Acuan</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-600 inline-block shadow-2xs" />
                  <span className="font-medium">Lebih Mahal (&gt; +2%)</span>
                </div>
              </div>
            </div>

            {/* Map Container */}
            <div className="h-[460px] rounded-2xl overflow-hidden border border-border shadow-inner">
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-muted/60 border border-border text-xs">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span className="font-bold text-foreground">Wilayah Terpilih: {selectedProvinceName}</span>
                <span className="text-muted-foreground">· Data acuan resmi BPS & PIHPS Bank Indonesia</span>
              </div>
              <button
                onClick={() => setShowInteractiveMap(false)}
                className="text-primary hover:underline font-bold cursor-pointer flex items-center gap-1 shrink-0"
              >
                <span>Lihat rincian faktor pendorong</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Province Buttons Grid */}
            <Card className="lg:col-span-7 p-6 bg-card border border-border shadow-xs space-y-5 rounded-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Pilih Provinsi Acuan
                </span>
                <span className="text-xs text-muted-foreground font-medium">Klik untuk melihat analisis</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PROVINCE_PREVIEWS.map((prov, idx) => {
                  const isSelected = selectedProvinceIdx === idx
                  return (
                    <button
                      key={prov.code}
                      onClick={() => {
                        setSelectedProvinceIdx(idx)
                        setSelectedProvinceName(prov.name)
                      }}
                      className={`p-3.5 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-50/80 text-foreground ring-2 ring-emerald-500/20 dark:bg-emerald-950/60 shadow-xs"
                          : "border-border bg-card hover:bg-muted/70 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-display px-1.5 py-0.5 rounded bg-muted text-foreground">{prov.code}</span>
                        {isSelected && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                      </div>
                      <p className="text-xs font-bold text-foreground mt-2 truncate">{prov.name}</p>
                      <p className="text-xs font-black text-emerald-700 dark:text-emerald-400 mt-0.5 tabular-nums">{prov.price}</p>
                    </button>
                  )
                })}
              </div>

              <div className="pt-3 flex items-center justify-between text-xs text-muted-foreground border-t border-border">
                <span>Sumber: PIHPS Bank Indonesia (Pembaruan Terkini)</span>
                <button
                  onClick={() => setShowInteractiveMap(true)}
                  className="hover:text-primary transition-colors cursor-pointer flex items-center gap-1 font-bold text-primary"
                >
                  <span>Tampilkan seluruh provinsi di peta</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </Card>

            {/* Selected Province Analysis & Factors */}
            <Card className="lg:col-span-5 p-6 bg-card border border-border shadow-xs space-y-5 rounded-2xl">
              <div>
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                  Analisis Wilayah Terpilih
                </span>
                <div className="flex items-baseline justify-between gap-2 mt-1">
                  <h3 className="text-2xl font-black font-display text-foreground">
                    {activeProvince.name}
                  </h3>
                  <span className="text-xs font-bold text-muted-foreground">
                    {activeProvince.status}
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-4xl font-black font-display text-foreground tabular-nums">
                    {activeProvince.price}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">/kg beras medium</span>
                </div>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 font-bold mt-1">
                  {activeProvince.diff}
                </p>
              </div>

              <div className="h-px bg-border" />

              <div className="space-y-3.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Mengapa harga di sini berbeda?
                </h4>

                <div className="space-y-3">
                  {activeProvince.factors.map((factor, fIdx) => (
                    <div key={fIdx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-foreground font-medium">{factor.label}</span>
                        <span
                          className={`text-[11px] font-bold ${
                            factor.type === "up" ? "text-amber-700 dark:text-amber-400" : "text-emerald-700 dark:text-emerald-400"
                          }`}
                        >
                          {factor.impact}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            factor.type === "up" ? "bg-amber-500" : "bg-emerald-600"
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

      {/* 5. Cara Membaca Lampu Harga (#lampu) */}
      <section id="lampu" className="space-y-6 pt-4 scroll-mt-24">
        <div className="space-y-1.5 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Sistem Deteksi Kewajaran</span>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-foreground tracking-tight">
            Cara Membaca Lampu Harga
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Setiap penawaran dan kontrak di SAMBUNG diperiksa terhadap rentang harga wajar daerahnya. Lampu selalu disertai alasan tertulis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Hijau: Wajar */}
          <Card className="p-6 bg-card border border-border shadow-xs space-y-3.5 rounded-2xl hover:border-emerald-300 transition-all">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Wajar (Hijau)</span>
            </span>
            <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
              Harga berada di dalam rentang wajar daerah Anda. Transaksi dinilai adil, seimbang bagi petani dan penggilingan, serta aman dilanjutkan.
            </p>
          </Card>

          {/* Kuning: Perlu dicek */}
          <Card className="p-6 bg-card border border-border shadow-xs space-y-3.5 rounded-2xl hover:border-amber-300 transition-all">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200 border border-amber-300 dark:border-amber-800">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Perlu Perhatian (Kuning)</span>
            </span>
            <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
              Harga mendekati atau sedikit di luar rentang wajar (toleransi ±3%). Bandingkan dengan acuan pasar daerah sebelum menyepakati kontrak.
            </p>
          </Card>

          {/* Merah: Tidak wajar */}
          <Card className="p-6 bg-card border border-border shadow-xs space-y-3.5 rounded-2xl hover:border-red-300 transition-all">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-red-50 text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-300 dark:border-red-800">
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Jauh di Bawah (Merah)</span>
            </span>
            <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
              Harga jauh di bawah HPP atau plafon wajar. Sistem menyertakan peringatan risiko kerugian dan mewajibkan konfirmasi sadar sebelum dipublikasi.
            </p>
          </Card>
        </div>

        <p className="text-xs text-muted-foreground font-medium">
          Lampu harga adalah estimasi berdasarkan data historis dan acuan pasar daerah, bukan jaminan harga jual tunggal.
        </p>
      </section>

      {/* 6. Alur 5 Langkah Transaksi (#alur) */}
      <section id="alur" className="space-y-6 pt-4 scroll-mt-24">
        <div className="space-y-1.5 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Proses Transaksi Praktis</span>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-foreground tracking-tight">
            Dari Panen Sampai Kontrak, dalam 5 Langkah
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Alur dibuat ringkas dan jelas, dirancang agar ramah digunakan petani di lapangan melalui telepon genggam.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              step: "01",
              title: "Daftar Akun",
              desc: "Isian minimal: nama, nomor HP WhatsApp aktif, dan lokasi kecamatan."
            },
            {
              step: "02",
              title: "Pasang Panen",
              desc: "Pilih komoditas GKP/GKG, perkiraan tonase panen, dan harga tawar per kg."
            },
            {
              step: "03",
              title: "Cek Lampu",
              desc: "Rentang harga wajar dan lampu evaluasi muncul seketika sebelum terbit."
            },
            {
              step: "04",
              title: "Terima Pesanan",
              desc: "Produsen memesan sebagian atau seluruh volume; petani bisa menawar balik."
            },
            {
              step: "05",
              title: "Kontrak Digital",
              desc: "Kedua pihak sepakat harga, kontak dibuka otomatis, dan struk tercetak."
            }
          ].map((item) => (
            <Card key={item.step} className="p-5 sm:p-6 bg-card border border-border shadow-xs rounded-2xl flex flex-col justify-between space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition-all">
              <div>
                <span className="font-display text-2xl font-black text-emerald-700 dark:text-emerald-400 block mb-2 font-mono">
                  {item.step}
                </span>
                <h3 className="font-bold text-sm text-foreground mb-1 font-display">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 7. SAMBUNG Untuk Siapa? (#peran) */}
      <section id="peran" className="space-y-6 pt-4 scroll-mt-24">
        <div className="space-y-1.5 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Ekosistem Pengguna</span>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-foreground tracking-tight">
            SAMBUNG untuk Siapa?
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Dirancang khusus untuk memberdayakan seluruh pemangku kepentingan mata rantai agrikultur beras Indonesia.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Petani */}
          <Card className="p-6 bg-card border border-border shadow-xs flex flex-col justify-between space-y-5 rounded-2xl hover:border-emerald-300 transition-all">
            <div className="space-y-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center shadow-2xs">
                <Sprout className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-foreground font-display">Petani & Poktan</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Ketahui harga acuan wajar, temukan mitra pembeli alternatif terpercaya, dan simpan bukti kesepakatan transaksi digital. 100% gratis.
              </p>
            </div>
            <Button
              size="default"
              variant="outline"
              onClick={() => handleRoleDirectLogin("petani")}
              className="w-full text-xs justify-between group cursor-pointer font-bold"
            >
              <span>Ruang Petani</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>

          {/* Card 2: Produsen */}
          <Card className="p-6 bg-card border border-border shadow-xs flex flex-col justify-between space-y-5 rounded-2xl hover:border-emerald-300 transition-all">
            <div className="space-y-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center shadow-2xs">
                <Factory className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-foreground font-display">Penggilingan Beras</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Katalog pasokan panen siap angkut, pantau kewajaran harga beli antarkabupaten, dan pesan gabah langsung tanpa komisi perantara.
              </p>
            </div>
            <Button
              size="default"
              variant="outline"
              onClick={() => handleRoleDirectLogin("pembeli")}
              className="w-full text-xs justify-between group cursor-pointer font-bold"
            >
              <span>Dasbor Pembeli</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>

          {/* Card 3: Admin / Pengawas */}
          <Card className="p-6 border border-border shadow-xs flex flex-col justify-between space-y-5 bg-card rounded-2xl hover:border-emerald-300 transition-all">
            <div className="space-y-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center shadow-2xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-foreground font-display">Dinas & Pengawas</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Kelola parameter acuan harga, verifikasi moderasi tawaran panen, audit log transaksi, dan pantau disparitas regional.
              </p>
            </div>
            <Button
              size="default"
              variant="outline"
              onClick={() => handleRoleDirectLogin("admin")}
              className="w-full text-xs justify-between group cursor-pointer font-bold"
            >
              <span>Panel Pengawas</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>

          {/* Card 4: Warga Publik */}
          <Card className="p-6 border border-border shadow-xs flex flex-col justify-between space-y-5 bg-card rounded-2xl hover:border-emerald-300 transition-all">
            <div className="space-y-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center shadow-2xs">
                <Globe2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-foreground font-display">Masyarakat Publik</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Buka peta disparitas dan papan harga 2 sisi untuk melihat transparansi marjin petani vs konsumen secara terbuka.
              </p>
            </div>
            <Button
              size="default"
              variant="outline"
              onClick={() => scrollToSection("papan-harga")}
              className="w-full text-xs justify-between group cursor-pointer font-bold"
            >
              <span>Papan & Peta Publik</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>
        </div>
      </section>

      {/* 8. Pusat Bantuan & Ketentuan (#bantuan) */}
      <section id="bantuan" className="space-y-8 pt-8 border-t border-border scroll-mt-24">
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Tanya Jawab</span>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-foreground tracking-tight">
            Pertanyaan Umum & Bantuan
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Pertanyaan yang sering diajukan mengenai cara kerja platform SAMBUNG dan transparansi data transaksi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {FAQS.map((faq, i) => (
            <Card key={i} className="p-6 bg-card border border-border shadow-xs space-y-2.5 rounded-2xl">
              <h4 className="text-sm font-bold text-foreground flex items-start gap-2.5 leading-snug">
                <span className="text-primary font-display font-black text-base shrink-0">Q.</span>
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed pl-6">
                {faq.a}
              </p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
