import {
  TawaranPanen,
  KontrakSimulasi,
  PriceObservation,
  ForecastItem,
  UserProfile,
  GlobalParameters,
  ProvincialPriceComparison
} from "@/types/domain"

export const INITIAL_PARAMETERS: GlobalParameters = {
  orderExpiryHours: 24, // DEC-005c
  fairPriceToleranceDelta: 0.03, // 3% DEC-006c
  rendemenGKP: 0.52, // Rendemen standar GKP ke Beras
  rendemenGKG: 0.63, // Rendemen standar GKG ke Beras
  lastUpdated: "2026-11-06T10:00:00Z"
}

export const SEED_USERS: Record<string, UserProfile> = {
  public: {
    id: "usr-guest",
    role: "public",
    name: "Tamu / Publik",
    phone: "-",
    province: "Nasional",
    regency: "-",
    district: "-"
  },
  petani: {
    id: "usr-petani-01",
    role: "petani",
    name: "Pak Subur",
    phone: "0812-3456-7890",
    province: "Jawa Barat",
    regency: "Subang",
    district: "Pagaden",
    businessName: "Poktan Subur Makmur"
  },
  pembeli: {
    id: "usr-pembeli-01",
    role: "pembeli",
    name: "H. Hendra",
    phone: "0813-9876-5432",
    province: "Jawa Barat",
    regency: "Karawang",
    district: "Telagasari",
    businessName: "CV Sumber Pangan Nusantara"
  },
  admin: {
    id: "usr-admin-01",
    role: "admin",
    name: "Admin Pusat SAMBUNG",
    phone: "0811-2233-4455",
    email: "admin@sambung.id",
    province: "DKI Jakarta",
    regency: "Jakarta Pusat",
    district: "Gambir"
  }
}

export const SEED_OBSERVATIONS: PriceObservation[] = [
  {
    id: "obs-01",
    commodity: "GKP",
    marketLevel: "Petani",
    province: "Jawa Barat",
    price: 6800,
    period: "Pekan I November 2026",
    date: "2026-11-05",
    unit: "Rp/kg",
    source: "BPS / Survei Pasar"
  },
  {
    id: "obs-02",
    commodity: "GKG",
    marketLevel: "Petani",
    province: "Jawa Barat",
    price: 7600,
    period: "Pekan I November 2026",
    date: "2026-11-05",
    unit: "Rp/kg",
    source: "BPS / Survei Pasar"
  },
  {
    id: "obs-03",
    commodity: "Beras Produsen",
    marketLevel: "Penggilingan / Produsen",
    province: "Jawa Barat",
    price: 13500,
    period: "Pekan I November 2026",
    date: "2026-11-05",
    unit: "Rp/kg",
    source: "PIHPS / Penggilingan"
  },
  {
    id: "obs-04",
    commodity: "Beras Eceran",
    marketLevel: "Eceran",
    province: "Jawa Barat",
    price: 15200,
    period: "Pekan I November 2026",
    date: "2026-11-05",
    unit: "Rp/kg",
    source: "PIHPS Pasar Tradisional"
  },
  // Jawa Tengah
  {
    id: "obs-05",
    commodity: "GKP",
    marketLevel: "Petani",
    province: "Jawa Tengah",
    price: 6600,
    period: "Pekan I November 2026",
    date: "2026-11-05",
    unit: "Rp/kg",
    source: "BPS / Survei Pasar"
  },
  {
    id: "obs-06",
    commodity: "GKG",
    marketLevel: "Petani",
    province: "Jawa Tengah",
    price: 7400,
    period: "Pekan I November 2026",
    date: "2026-11-05",
    unit: "Rp/kg",
    source: "BPS / Survei Pasar"
  },
  {
    id: "obs-07",
    commodity: "Beras Produsen",
    marketLevel: "Penggilingan / Produsen",
    province: "Jawa Tengah",
    price: 13200,
    period: "Pekan I November 2026",
    date: "2026-11-05",
    unit: "Rp/kg",
    source: "PIHPS / Penggilingan"
  },
  // Jawa Timur
  {
    id: "obs-08",
    commodity: "GKP",
    marketLevel: "Petani",
    province: "Jawa Timur",
    price: 6900,
    period: "Pekan I November 2026",
    date: "2026-11-05",
    unit: "Rp/kg",
    source: "BPS / Survei Pasar"
  },
  {
    id: "obs-09",
    commodity: "GKG",
    marketLevel: "Petani",
    province: "Jawa Timur",
    price: 7700,
    period: "Pekan I November 2026",
    date: "2026-11-05",
    unit: "Rp/kg",
    source: "BPS / Survei Pasar"
  },
  {
    id: "obs-10",
    commodity: "Beras Produsen",
    marketLevel: "Penggilingan / Produsen",
    province: "Jawa Timur",
    price: 13600,
    period: "Pekan I November 2026",
    date: "2026-11-05",
    unit: "Rp/kg",
    source: "PIHPS / Penggilingan"
  },
  // Sulawesi Selatan
  {
    id: "obs-11",
    commodity: "GKP",
    marketLevel: "Petani",
    province: "Sulawesi Selatan",
    price: 6400,
    period: "Pekan I November 2026",
    date: "2026-11-05",
    unit: "Rp/kg",
    source: "BPS / Survei Pasar"
  },
  {
    id: "obs-12",
    commodity: "Beras Produsen",
    marketLevel: "Penggilingan / Produsen",
    province: "Sulawesi Selatan",
    price: 12800,
    period: "Pekan I November 2026",
    date: "2026-11-05",
    unit: "Rp/kg",
    source: "PIHPS / Penggilingan"
  }
]

export const SEED_PROVINCIAL_COMPARISONS: ProvincialPriceComparison[] = [
  { province: "Jawa Barat", price: 6800, medianPrice: 6700, percentageDiff: 1.49, isAvailable: true },
  { province: "Jawa Tengah", price: 6600, medianPrice: 6700, percentageDiff: -1.49, isAvailable: true },
  { province: "Jawa Timur", price: 6900, medianPrice: 6700, percentageDiff: 2.99, isAvailable: true },
  { province: "Sulawesi Selatan", price: 6400, medianPrice: 6700, percentageDiff: -4.48, isAvailable: true },
  { province: "Sumatera Utara", price: 7100, medianPrice: 6700, percentageDiff: 5.97, isAvailable: true },
  { province: "Lampung", price: 6700, medianPrice: 6700, percentageDiff: 0.00, isAvailable: true },
  { province: "NTB", price: 6500, medianPrice: 6700, percentageDiff: -2.99, isAvailable: true },
  { province: "Banten", price: 6850, medianPrice: 6700, percentageDiff: 2.24, isAvailable: true },
  { province: "Sumatera Selatan", price: 6650, medianPrice: 6700, percentageDiff: -0.75, isAvailable: true },
  { province: "Bali", price: 7200, medianPrice: 6700, percentageDiff: 7.46, isAvailable: true },
  { province: "Papua", price: 0, medianPrice: 6700, percentageDiff: 0, isAvailable: false }
]

export const SEED_FORECASTS: ForecastItem[] = [
  {
    id: "fc-01",
    province: "Jawa Barat",
    horizonWeeks: 2,
    riceProducerPrice: 13700,
    gkpEstimate: 6950,
    gkgEstimate: 7750,
    confidenceInterval80: [6700, 7200],
    method: "Model AI (Ensemble)",
    isFallback: false,
    shapContributions: [
      { feature: "Tren Musim Tanam Subang", impact: 150, description: "Penurunan pasokan lokal jelang panen raya mendorong harga gabah naik." },
      { feature: "Harga Beras Grosir Cipinang", impact: 120, description: "Kenaikan harga beli grosir beras menarik harga gabah ke atas." },
      { feature: "Biaya Transportasi & Logistik", impact: -40, description: "Efisiensi rute distribusi menekan margin selisih antardaerah." }
    ],
    updatedAt: "2026-11-06T08:00:00Z"
  },
  {
    id: "fc-02",
    province: "Jawa Barat",
    horizonWeeks: 4,
    riceProducerPrice: 13900,
    gkpEstimate: 7050,
    gkgEstimate: 7850,
    confidenceInterval80: [6600, 7500],
    method: "Model AI (Ensemble)",
    isFallback: false,
    shapContributions: [
      { feature: "Curah Hujan & Iklim Musiman", impact: 180, description: "Tingkat kelembapan panen diperkirakan mempengaruhi kadar air gabah." },
      { feature: "Permintaan Penggilingan Besar", impact: 140, description: "Kapasitas serap penggilingan di Karawang & Subang stabil tinggi." }
    ],
    updatedAt: "2026-11-06T08:00:00Z"
  },
  {
    id: "fc-03",
    province: "Jawa Tengah",
    horizonWeeks: 2,
    riceProducerPrice: 13350,
    gkpEstimate: 6680,
    gkgEstimate: 7480,
    confidenceInterval80: [6450, 6900],
    method: "Model AI (Ensemble)",
    isFallback: false,
    shapContributions: [
      { feature: "Stok Gudang Penggilingan", impact: -80, description: "Persediaan gabah giling mencukupi kebutuhan 2 pekan ke depan." }
    ],
    updatedAt: "2026-11-06T08:00:00Z"
  },
  {
    id: "fc-04",
    province: "Sulawesi Selatan",
    horizonWeeks: 2,
    riceProducerPrice: 12900,
    gkpEstimate: 6450,
    gkgEstimate: 7220,
    confidenceInterval80: [6200, 6700],
    method: "Prakiraan Baseline",
    isFallback: true, // Evaluasi unit provinsi ini mengaktifkan baseline terevaluasi
    shapContributions: [
      { feature: "Baseline Rata-rata Bergerak", impact: 0, description: "Menggunakan estimasi baseline historis yang terevaluasi karena keterbatasan data latih mutakhir." }
    ],
    updatedAt: "2026-11-06T08:00:00Z"
  }
]

export const SEED_OFFERS: TawaranPanen[] = [
  {
    id: "of-01",
    farmerId: "usr-petani-01",
    farmerName: "Pak Subur",
    farmerPhone: "0812-3456-7890",
    grainType: "GKP",
    province: "Jawa Barat",
    regency: "Subang",
    district: "Pagaden",
    totalVolume: 5000,
    availableVolume: 3500, // 5000 - 1500 (reserved)
    reservedVolume: 1500,
    agreedVolume: 0,
    completedVolume: 0,
    askingPrice: 6800, // Hijau di Jawa Barat
    moisturePercent: 21.5,
    impurityPercent: 4.0,
    readyDate: "2026-11-10",
    publicationStatus: "Terbit",
    moderationStatus: "Bersih",
    createdAt: "2026-11-06T07:00:00Z",
    updatedAt: "2026-11-06T07:00:00Z"
  },
  {
    id: "of-02",
    farmerId: "usr-petani-02",
    farmerName: "Pak Dedi Setiadi",
    farmerPhone: "0812-8888-1111",
    grainType: "GKG",
    province: "Jawa Barat",
    regency: "Karawang",
    district: "Telagasari",
    totalVolume: 10000,
    availableVolume: 6000, // 10000 - 4000 (agreed)
    reservedVolume: 0,
    agreedVolume: 4000,
    completedVolume: 0,
    askingPrice: 7600, // Hijau GKG di Jawa Barat
    moisturePercent: 14.0,
    impurityPercent: 2.0,
    readyDate: "2026-11-08",
    publicationStatus: "Terbit",
    moderationStatus: "Bersih",
    createdAt: "2026-11-05T09:00:00Z",
    updatedAt: "2026-11-05T09:00:00Z"
  },
  {
    id: "of-03",
    farmerId: "usr-petani-03",
    farmerName: "Pak Slamet Riyadi",
    farmerPhone: "0813-7777-2222",
    grainType: "GKP",
    province: "Jawa Tengah",
    regency: "Sragen",
    district: "Masaran",
    totalVolume: 4000,
    availableVolume: 4000,
    reservedVolume: 0,
    agreedVolume: 0,
    completedVolume: 0,
    askingPrice: 6100, // Kuning (sedikit di bawah wajar)
    moisturePercent: "Belum diukur",
    impurityPercent: "Belum diukur",
    readyDate: "Belum ditentukan",
    publicationStatus: "Terbit",
    moderationStatus: "Bersih",
    createdAt: "2026-11-06T08:30:00Z",
    updatedAt: "2026-11-06T08:30:00Z"
  },
  {
    id: "of-04",
    farmerId: "usr-petani-04",
    farmerName: "Pak Wayan Sudarma",
    farmerPhone: "0819-6666-3333",
    grainType: "GKG",
    province: "Bali",
    regency: "Tabanan",
    district: "Marga",
    totalVolume: 2500,
    availableVolume: 2500,
    reservedVolume: 0,
    agreedVolume: 0,
    completedVolume: 0,
    askingPrice: 8400, // Kuning (di atas wajar)
    moisturePercent: 13.5,
    impurityPercent: 1.5,
    readyDate: "2026-11-12",
    publicationStatus: "Terbit",
    moderationStatus: "Sedang diminta perbaikan", // Temuan moderasi
    moderationIssue: "Data lokasi panen perlu dilengkapi dengan keterangan akses jalan truk penggilingan.",
    createdAt: "2026-11-06T06:15:00Z",
    updatedAt: "2026-11-06T06:15:00Z"
  },
  {
    id: "of-05",
    farmerId: "usr-petani-05",
    farmerName: "Poktan Sumber Rejeki",
    farmerPhone: "0852-5555-4444",
    grainType: "GKP",
    province: "Sulawesi Selatan",
    regency: "Pinrang",
    district: "Mattiro Bulu",
    totalVolume: 8000,
    availableVolume: 8000,
    reservedVolume: 0,
    agreedVolume: 0,
    completedVolume: 0,
    askingPrice: 5600, // Merah (jauh di bawah wajar)
    moisturePercent: 23.0,
    impurityPercent: 5.0,
    readyDate: "2026-11-15",
    publicationStatus: "Terbit",
    moderationStatus: "Bersih",
    createdAt: "2026-11-06T07:45:00Z",
    updatedAt: "2026-11-06T07:45:00Z"
  }
]

export const SEED_CONTRACTS: KontrakSimulasi[] = [
  {
    id: "ctr-01",
    offerId: "of-01",
    buyerId: "usr-pembeli-01",
    buyerName: "CV Sumber Pangan Nusantara",
    buyerPhone: "0813-9876-5432",
    farmerId: "usr-petani-01",
    farmerName: "Pak Subur",
    farmerPhone: "0812-3456-7890",
    grainType: "GKP",
    volume: 1500, // Pesanan parsial (dari total 5000 kg)
    status: "Menunggu Kesepakatan",
    initialPrice: 6800,
    activePrice: 6800,
    activeProposedBy: "pembeli",
    priceHistory: [
      {
        version: 1,
        price: 6800,
        proposedByRole: "pembeli",
        proposedByName: "CV Sumber Pangan Nusantara",
        proposedAt: "2026-11-06T09:00:00Z",
        lampStatus: "HIJAU"
      }
    ],
    expiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(), // 24 jam ke depan
    createdAt: "2026-11-06T09:00:00Z",
    updatedAt: "2026-11-06T09:00:00Z",
    confirmedByFarmer: false,
    confirmedByBuyer: false,
    isSimulation: true
  },
  {
    id: "ctr-02",
    offerId: "of-02",
    buyerId: "usr-pembeli-01",
    buyerName: "CV Sumber Pangan Nusantara",
    buyerPhone: "0813-9876-5432",
    farmerId: "usr-petani-02",
    farmerName: "Pak Dedi Setiadi",
    farmerPhone: "0812-8888-1111",
    grainType: "GKG",
    volume: 4000,
    status: "Disetujui",
    initialPrice: 7600,
    activePrice: 7550,
    activeProposedBy: "petani",
    priceHistory: [
      {
        version: 1,
        price: 7500,
        proposedByRole: "pembeli",
        proposedByName: "CV Sumber Pangan Nusantara",
        proposedAt: "2026-11-05T10:00:00Z",
        lampStatus: "HIJAU"
      },
      {
        version: 2,
        price: 7550,
        proposedByRole: "petani",
        proposedByName: "Pak Dedi Setiadi",
        proposedAt: "2026-11-05T11:00:00Z",
        lampStatus: "HIJAU"
      }
    ],
    expiresAt: "2026-11-06T10:00:00Z",
    createdAt: "2026-11-05T10:00:00Z",
    updatedAt: "2026-11-05T11:30:00Z",
    confirmedByFarmer: false,
    confirmedByBuyer: false,
    isSimulation: true
  }
]
