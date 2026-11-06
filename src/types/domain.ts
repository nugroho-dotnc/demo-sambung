// Domain Types for SAMBUNG

export type UserRole = "public" | "petani" | "pembeli" | "admin"

export type GrainType = "GKP" | "GKG"

export type PriceLampStatus = "HIJAU" | "KUNING" | "MERAH" | "TIDAK_TERSEDIA"

export type ContractStatus = 
  | "Menunggu Kesepakatan"
  | "Disetujui"
  | "Selesai"
  | "Ditolak"
  | "Dibatalkan"
  | "Kedaluwarsa"

export type OfferPublicationStatus = "Terbit" | "Ditarik"

export type ModerationStatus = "Bersih" | "Sedang diminta perbaikan" | "Menunggu Peninjauan" | "Ditutup"

export interface UserProfile {
  id: string
  role: UserRole
  name: string
  phone: string // Tersamar bila dilihat Admin / bukan pihak kontrak
  email?: string // Khusus Admin
  province: string
  regency: string
  district: string
  businessName?: string // Kelompok tani / Penggilingan
}

export interface TawaranPanen {
  id: string
  farmerId: string
  farmerName: string
  farmerPhone: string // Hanya terbuka bagi pembeli pada kontrak yang Disetujui
  grainType: GrainType
  province: string
  regency: string
  district: string
  totalVolume: number // kg
  availableVolume: number // kg (total - reserved - agreed - completed)
  reservedVolume: number // kg (pada pesanan Menunggu)
  agreedVolume: number // kg (pada pesanan Disetujui)
  completedVolume: number // kg (pada pesanan Selesai)
  askingPrice: number // Rp / kg (rupiah bulat)
  moisturePercent?: number | "Belum diukur" // Kadar air (%)
  impurityPercent?: number | "Belum diukur" // Kadar hampa/kotoran (%)
  readyDate?: string | "Belum ditentukan" // Tanggal gabah siap
  publicationStatus: OfferPublicationStatus
  moderationStatus: ModerationStatus
  moderationIssue?: string
  createdAt: string
  updatedAt: string
}

export interface PriceHistoryItem {
  version: number
  price: number // Rp / kg
  proposedByRole: "petani" | "pembeli"
  proposedByName: string
  proposedAt: string
  lampStatus: PriceLampStatus
  isConfirmedRedWarning?: boolean
}

export interface KontrakSimulasi {
  id: string
  offerId: string
  buyerId: string
  buyerName: string
  buyerPhone: string
  farmerId: string
  farmerName: string
  farmerPhone: string
  grainType: GrainType
  volume: number // kg
  status: ContractStatus
  initialPrice: number // Rp / kg
  activePrice: number // Rp / kg
  activeProposedBy: "petani" | "pembeli"
  priceHistory: PriceHistoryItem[]
  expiresAt: string // ISO timestamp (tenggat 24 jam)
  createdAt: string
  updatedAt: string
  confirmedByFarmer: boolean
  confirmedByBuyer: boolean
  cancelReason?: string
  isSimulation: true // BR-001: Selalu bertanda simulasi
}

export interface FairPriceEstimate {
  grainType: GrainType
  province: string
  period: string
  riceProducerPrice: number // Rp / kg
  rendemen: number // misal 0.52 untuk GKP, 0.63 untuk GKG
  p10Ratio: number
  p90Ratio: number
  lowerBoundOriginal: number
  upperBoundOriginal: number
  lowerBound: number // L operasional (dibulatkan)
  upperBound: number // U operasional (dibulatkan)
  tolerancePercent: number // delta, default 3% (0.03)
  isAvailable: boolean
}

export interface PriceObservation {
  id: string
  commodity: "GKP" | "GKG" | "Beras Produsen" | "Beras Eceran"
  marketLevel: "Petani" | "Penggilingan / Produsen" | "Eceran"
  province: string
  price: number
  period: string
  date: string
  unit: "Rp/kg"
  source: string // misal "BPS / PIHPS"
}

export interface ProvincialPriceComparison {
  province: string
  price: number
  medianPrice: number
  percentageDiff: number // bertanda: negatif lebih murah, positif lebih mahal
  isAvailable: boolean
}

export interface ForecastItem {
  id: string
  province: string
  horizonWeeks: 2 | 4
  riceProducerPrice: number
  gkpEstimate: number
  gkgEstimate: number
  confidenceInterval80: [number, number]
  method: "Model AI (Ensemble)" | "Prakiraan Baseline"
  isFallback: boolean
  shapContributions: {
    feature: string
    impact: number // positif atau negatif dalam persen / rupiah
    description: string
  }[]
  updatedAt: string
}

export interface AuditLogItem {
  id: string
  timestamp: string
  actorRole: UserRole
  actorName: string
  action: string
  targetType: "Tawaran" | "Kontrak" | "Parameter" | "DataHarga" | "Pengguna"
  targetId: string
  details: string
}

export interface GlobalParameters {
  orderExpiryHours: number // Awal 24 jam
  fairPriceToleranceDelta: number // Awal 0.03 (3%)
  rendemenGKP: number // Awal 0.52
  rendemenGKG: number // Awal 0.63
  lastUpdated: string
}
