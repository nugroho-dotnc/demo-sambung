import { useState, useEffect } from "react"
import {
  TawaranPanen,
  KontrakSimulasi,
  PriceObservation,
  GlobalParameters,
  UserProfile,
  UserRole,
  AuditLogItem,
  GrainType,
  PriceLampStatus
} from "@/types/domain"
import {
  INITIAL_PARAMETERS,
  SEED_USERS,
  SEED_OFFERS,
  SEED_CONTRACTS,
  SEED_OBSERVATIONS
} from "@/mock/seedData"
import { evaluatePriceLamp, calculateFairPrice } from "@/lib/priceEngine"

interface SambungState {
  currentRole: UserRole
  currentUser: UserProfile
  theme: "light" | "dark"
  selectedRegion: string
  offers: TawaranPanen[]
  contracts: KontrakSimulasi[]
  observations: PriceObservation[]
  parameters: GlobalParameters
  auditLogs: AuditLogItem[]
}

const STORAGE_KEY = "sambung_app_state_v2"

function loadInitialState(): SambungState {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      return {
        ...parsed,
        selectedRegion: parsed.selectedRegion || "Jawa Timur"
      }
    } catch {
      // Fallback
    }
  }
  return {
    currentRole: "public",
    currentUser: SEED_USERS.public,
    theme: "light",
    selectedRegion: "Jawa Timur",
    offers: SEED_OFFERS,
    contracts: SEED_CONTRACTS,
    observations: SEED_OBSERVATIONS,
    parameters: INITIAL_PARAMETERS,
    auditLogs: [
      {
        id: "log-init",
        timestamp: new Date().toISOString(),
        actorRole: "admin",
        actorName: "Sistem",
        action: "Inisialisasi Sistem",
        targetType: "DataHarga",
        targetId: "sys-init",
        details: "Data awal berhasil dimuat untuk simulasi."
      }
    ]
  }
}

// Global in-memory state and subscriber listeners for reactive updates
let globalState: SambungState = loadInitialState()
const listeners = new Set<() => void>()

function notify() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(globalState))
  listeners.forEach((listener) => listener())
}

function updateState(updater: (prev: SambungState) => SambungState) {
  globalState = updater(globalState)
  notify()
}

export function useSambungStore() {
  const [state, setState] = useState<SambungState>(globalState)

  useEffect(() => {
    const handleUpdate = () => setState({ ...globalState })
    listeners.add(handleUpdate)
    return () => {
      listeners.delete(handleUpdate)
    }
  }, [])

  // Sync theme class with document root
  useEffect(() => {
    if (state.theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [state.theme])

  // --- ACTIONS ---

  const setRole = (role: UserRole) => {
    updateState((prev) => ({
      ...prev,
      currentRole: role,
      currentUser: SEED_USERS[role] || prev.currentUser
    }))
  }

  const toggleTheme = () => {
    updateState((prev) => ({
      ...prev,
      theme: prev.theme === "light" ? "dark" : "light"
    }))
  }

  const logAudit = (action: string, targetType: AuditLogItem["targetType"], targetId: string, details: string) => {
    const newLog: AuditLogItem = {
      id: "log-" + Date.now(),
      timestamp: new Date().toISOString(),
      actorRole: globalState.currentRole,
      actorName: globalState.currentUser.name,
      action,
      targetType,
      targetId,
      details
    }
    updateState((prev) => ({
      ...prev,
      auditLogs: [newLog, ...prev.auditLogs]
    }))
  }

  // Petani: Create Offer (FR-004)
  const createOffer = (data: {
    grainType: GrainType
    province: string
    regency: string
    district: string
    totalVolume: number
    askingPrice: number
    moisturePercent?: number | "Belum diukur"
    impurityPercent?: number | "Belum diukur"
    readyDate?: string | "Belum ditentukan"
  }) => {
    const newOffer: TawaranPanen = {
      id: "of-" + Date.now(),
      farmerId: globalState.currentUser.id,
      farmerName: globalState.currentUser.name,
      farmerPhone: globalState.currentUser.phone,
      grainType: data.grainType,
      province: data.province,
      regency: data.regency,
      district: data.district,
      totalVolume: data.totalVolume,
      availableVolume: data.totalVolume,
      reservedVolume: 0,
      agreedVolume: 0,
      completedVolume: 0,
      askingPrice: Math.round(data.askingPrice),
      moisturePercent: data.moisturePercent ?? "Belum diukur",
      impurityPercent: data.impurityPercent ?? "Belum diukur",
      readyDate: data.readyDate ?? "Belum ditentukan",
      publicationStatus: "Terbit",
      moderationStatus: "Bersih",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    updateState((prev) => ({
      ...prev,
      offers: [newOffer, ...prev.offers]
    }))

    logAudit("Buat Tawaran Panen", "Tawaran", newOffer.id, `Petani menerbitkan tawaran ${newOffer.grainType} ${newOffer.totalVolume} kg seharga Rp${newOffer.askingPrice}/kg di ${newOffer.district}.`)
    return newOffer
  }

  // Petani: Tarik Tawaran (DEC-013b, DEC-013e, FR-004)
  const withdrawOffer = (offerId: string) => {
    const offer = globalState.offers.find((o) => o.id === offerId)
    if (!offer || offer.publicationStatus === "Ditarik") return

    // Batalkan pesanan Menunggu yang belum kedaluwarsa, kembalikan volume cadangan
    const updatedContracts = globalState.contracts.map((c) => {
      if (c.offerId === offerId && c.status === "Menunggu Kesepakatan") {
        return {
          ...c,
          status: "Dibatalkan" as const,
          cancelReason: "Tawaran panen ditarik oleh pemilik (Petani)",
          updatedAt: new Date().toISOString()
        }
      }
      return c
    })

    const updatedOffers = globalState.offers.map((o) => {
      if (o.id === offerId) {
        return {
          ...o,
          publicationStatus: "Ditarik" as const,
          availableVolume: o.availableVolume + o.reservedVolume,
          reservedVolume: 0,
          updatedAt: new Date().toISOString()
        }
      }
      return o
    })

    updateState((prev) => ({
      ...prev,
      offers: updatedOffers,
      contracts: updatedContracts
    }))

    logAudit("Tarik Tawaran", "Tawaran", offerId, `Petani menarik tawaran panen ${offerId}. Semua pesanan yang menunggu kesepakatan dibatalkan.`)
  }

  // Pembeli: Ajukan Pesanan Parsial (FR-007, BR-004)
  const createOrder = (offerId: string, volume: number, proposedPrice: number) => {
    const offer = globalState.offers.find((o) => o.id === offerId)
    if (!offer) throw new Error("Tawaran tidak ditemukan")
    if (offer.publicationStatus === "Ditarik") throw new Error("Tawaran telah ditarik")
    if (volume > offer.availableVolume) throw new Error("Volume melebihi stok yang tersedia")

    // Cek lampu harga acuan untuk pengajuan pesanan
    const estimate = calculateFairPrice(offer.grainType, offer.province, 13500, offer.grainType === "GKP" ? 0.52 : 0.63)
    const lampEval = evaluatePriceLamp(proposedPrice, estimate.lowerBound, estimate.upperBound)

    const newContract: KontrakSimulasi = {
      id: "ctr-" + Date.now(),
      offerId,
      buyerId: globalState.currentUser.id,
      buyerName: globalState.currentUser.name,
      buyerPhone: globalState.currentUser.phone,
      farmerId: offer.farmerId,
      farmerName: offer.farmerName,
      farmerPhone: offer.farmerPhone,
      grainType: offer.grainType,
      volume,
      status: "Menunggu Kesepakatan",
      initialPrice: Math.round(proposedPrice),
      activePrice: Math.round(proposedPrice),
      activeProposedBy: "pembeli",
      priceHistory: [
        {
          version: 1,
          price: Math.round(proposedPrice),
          proposedByRole: "pembeli",
          proposedByName: globalState.currentUser.name,
          proposedAt: new Date().toISOString(),
          lampStatus: lampEval.status,
          isConfirmedRedWarning: lampEval.status === "MERAH"
        }
      ],
      expiresAt: new Date(Date.now() + globalState.parameters.orderExpiryHours * 3600 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      confirmedByFarmer: false,
      confirmedByBuyer: false,
      isSimulation: true
    }

    // Reservasi volume secara atomik
    const updatedOffers = globalState.offers.map((o) => {
      if (o.id === offerId) {
        return {
          ...o,
          availableVolume: o.availableVolume - volume,
          reservedVolume: o.reservedVolume + volume,
          updatedAt: new Date().toISOString()
        }
      }
      return o
    })

    updateState((prev) => ({
      ...prev,
      offers: updatedOffers,
      contracts: [newContract, ...prev.contracts]
    }))

    logAudit("Ajukan Pesanan", "Kontrak", newContract.id, `Pembeli mengajukan pesanan ${volume} kg @ Rp${proposedPrice}/kg pada tawaran ${offerId}. Volume dicadangkan.`)
    return newContract
  }

  // Negosiasi: Ajukan Harga Balik (FR-009, BR-006)
  const counterOffer = (contractId: string, newPrice: number) => {
    const contract = globalState.contracts.find((c) => c.id === contractId)
    if (!contract || contract.status !== "Menunggu Kesepakatan") {
      throw new Error("Kontrak tidak dalam status menunggu negosiasi")
    }

    const offer = globalState.offers.find((o) => o.id === contract.offerId)
    const estimate = calculateFairPrice(contract.grainType, offer?.province || "Jawa Barat", 13500, contract.grainType === "GKP" ? 0.52 : 0.63)
    const lampEval = evaluatePriceLamp(newPrice, estimate.lowerBound, estimate.upperBound)

    const newHistoryItem = {
      version: contract.priceHistory.length + 1,
      price: Math.round(newPrice),
      proposedByRole: globalState.currentRole as "petani" | "pembeli",
      proposedByName: globalState.currentUser.name,
      proposedAt: new Date().toISOString(),
      lampStatus: lampEval.status as PriceLampStatus,
      isConfirmedRedWarning: lampEval.status === "MERAH"
    }

    const updatedContracts = globalState.contracts.map((c) => {
      if (c.id === contractId) {
        return {
          ...c,
          activePrice: Math.round(newPrice),
          activeProposedBy: globalState.currentRole as "petani" | "pembeli",
          priceHistory: [...c.priceHistory, newHistoryItem],
          updatedAt: new Date().toISOString()
        }
      }
      return c
    })

    updateState((prev) => ({
      ...prev,
      contracts: updatedContracts
    }))

    logAudit("Tawar Balik", "Kontrak", contractId, `${globalState.currentUser.name} mengajukan tawaran harga baru Rp${newPrice}/kg (v${newHistoryItem.version}).`)
  }

  // Terima Harga Aktif -> Disetujui (FR-010, BR-006, DEC-005g)
  const acceptPrice = (contractId: string) => {
    const contract = globalState.contracts.find((c) => c.id === contractId)
    if (!contract || contract.status !== "Menunggu Kesepakatan") {
      throw new Error("Kontrak tidak valid untuk diterima")
    }

    // Pindahkan dari reservasi ke volume Disetujui pada tawaran panen
    const updatedOffers = globalState.offers.map((o) => {
      if (o.id === contract.offerId) {
        return {
          ...o,
          reservedVolume: Math.max(0, o.reservedVolume - contract.volume),
          agreedVolume: o.agreedVolume + contract.volume,
          updatedAt: new Date().toISOString()
        }
      }
      return o
    })

    const updatedContracts = globalState.contracts.map((c) => {
      if (c.id === contractId) {
        return {
          ...c,
          status: "Disetujui" as const,
          updatedAt: new Date().toISOString()
        }
      }
      return c
    })

    updateState((prev) => ({
      ...prev,
      offers: updatedOffers,
      contracts: updatedContracts
    }))

    logAudit("Terima Harga", "Kontrak", contractId, `Harga aktif Rp${contract.activePrice}/kg disetujui. Status beralih ke Disetujui. Kontak kedua pihak saling terbuka.`)
  }

  // Konfirmasi Selesai Dua Pihak (FR-025, BR-008, DEC-005h)
  const confirmCompletion = (contractId: string) => {
    const contract = globalState.contracts.find((c) => c.id === contractId)
    if (!contract || contract.status !== "Disetujui") {
      throw new Error("Hanya kontrak Disetujui yang dapat dikonfirmasi selesai")
    }

    const isFarmer = globalState.currentRole === "petani"
    const isBuyer = globalState.currentRole === "pembeli"

    const farmerDone = isFarmer ? true : contract.confirmedByFarmer
    const buyerDone = isBuyer ? true : contract.confirmedByBuyer

    const isBothDone = farmerDone && buyerDone

    const updatedContracts = globalState.contracts.map((c) => {
      if (c.id === contractId) {
        return {
          ...c,
          confirmedByFarmer: farmerDone,
          confirmedByBuyer: buyerDone,
          status: isBothDone ? ("Selesai" as const) : ("Disetujui" as const),
          updatedAt: new Date().toISOString()
        }
      }
      return c
    })

    // Jika sudah Selesai (keduanya konfirmasi), pindahkan volume Disetujui ke Selesai
    let updatedOffers = globalState.offers
    if (isBothDone) {
      updatedOffers = globalState.offers.map((o) => {
        if (o.id === contract.offerId) {
          return {
            ...o,
            agreedVolume: Math.max(0, o.agreedVolume - contract.volume),
            completedVolume: o.completedVolume + contract.volume,
            updatedAt: new Date().toISOString()
          }
        }
        return o
      })
    }

    updateState((prev) => ({
      ...prev,
      offers: updatedOffers,
      contracts: updatedContracts
    }))

    logAudit(
      "Konfirmasi Selesai",
      "Kontrak",
      contractId,
      isBothDone
        ? `Kedua pihak telah mengonfirmasi. Kontrak Selesai penuh. Nomor kontak lawan disembunyikan kembali.`
        : `${globalState.currentUser.name} mengonfirmasi selesai (1/2 konfirmasi). Menunggu pihak lain.`
    )
  }

  // Batalkan Kontrak (FR-024, BR-007, DEC-005i)
  const cancelContract = (contractId: string, reason: string) => {
    if (!reason || reason.trim() === "") throw new Error("Alasan pembatalan wajib diisi")

    const contract = globalState.contracts.find((c) => c.id === contractId)
    if (!contract || contract.status === "Selesai" || contract.status === "Dibatalkan" || contract.status === "Ditolak") {
      throw new Error("Kontrak tidak dapat dibatalkan pada status saat ini")
    }

    // Kembalikan volume terkait ke volume tersedia
    const updatedOffers = globalState.offers.map((o) => {
      if (o.id === contract.offerId) {
        if (contract.status === "Menunggu Kesepakatan") {
          return {
            ...o,
            reservedVolume: Math.max(0, o.reservedVolume - contract.volume),
            availableVolume: o.availableVolume + contract.volume,
            updatedAt: new Date().toISOString()
          }
        } else if (contract.status === "Disetujui") {
          return {
            ...o,
            agreedVolume: Math.max(0, o.agreedVolume - contract.volume),
            availableVolume: o.availableVolume + contract.volume,
            updatedAt: new Date().toISOString()
          }
        }
      }
      return o
    })

    const updatedContracts = globalState.contracts.map((c) => {
      if (c.id === contractId) {
        return {
          ...c,
          status: "Dibatalkan" as const,
          cancelReason: reason,
          updatedAt: new Date().toISOString()
        }
      }
      return c
    })

    updateState((prev) => ({
      ...prev,
      offers: updatedOffers,
      contracts: updatedContracts
    }))

    logAudit("Batalkan Kontrak", "Kontrak", contractId, `Kontrak dibatalkan oleh ${globalState.currentUser.name}. Alasan: ${reason}. Volume dilepaskan kembali.`)
  }

  // Tolak Pesanan Menunggu oleh Petani (FR-024, BR-007)
  const rejectContract = (contractId: string, reason: string) => {
    if (!reason || reason.trim() === "") throw new Error("Alasan penolakan wajib diisi")

    const contract = globalState.contracts.find((c) => c.id === contractId)
    if (!contract || contract.status !== "Menunggu Kesepakatan") {
      throw new Error("Hanya pesanan yang menunggu kesepakatan yang dapat ditolak")
    }

    const updatedOffers = globalState.offers.map((o) => {
      if (o.id === contract.offerId) {
        return {
          ...o,
          reservedVolume: Math.max(0, o.reservedVolume - contract.volume),
          availableVolume: o.availableVolume + contract.volume,
          updatedAt: new Date().toISOString()
        }
      }
      return o
    })

    const updatedContracts = globalState.contracts.map((c) => {
      if (c.id === contractId) {
        return {
          ...c,
          status: "Ditolak" as const,
          cancelReason: reason,
          updatedAt: new Date().toISOString()
        }
      }
      return c
    })

    updateState((prev) => ({
      ...prev,
      offers: updatedOffers,
      contracts: updatedContracts
    }))

    logAudit("Tolak Pesanan", "Kontrak", contractId, `Petani menolak pesanan. Alasan: ${reason}. Volume dikembalikan.`)
  }

  // Admin Moderation (FR-021, DEC-013c/f/g)
  const setOfferModeration = (offerId: string, status: TawaranPanen["moderationStatus"], issue?: string) => {
    const updatedOffers = globalState.offers.map((o) => {
      if (o.id === offerId) {
        return {
          ...o,
          moderationStatus: status,
          moderationIssue: issue ?? o.moderationIssue,
          updatedAt: new Date().toISOString()
        }
      }
      return o
    })

    updateState((prev) => ({
      ...prev,
      offers: updatedOffers
    }))

    logAudit("Moderasi Tawaran", "Tawaran", offerId, `Admin mengubah status moderasi menjadi '${status}'. Catatan: ${issue || "-"}`)
  }

  // Update Global Parameters (FR-019)
  const updateParameters = (newParams: Partial<GlobalParameters>) => {
    updateState((prev) => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        ...newParams,
        lastUpdated: new Date().toISOString()
      }
    }))
    logAudit("Ubah Parameter", "Parameter", "global-config", `Admin memperbarui parameter operasional sistem.`)
  }

  const setSelectedRegion = (region: string) => {
    updateState((prev) => ({
      ...prev,
      selectedRegion: region
    }))
  }

  // Reset Demo Data
  const resetToSeedData = () => {
    localStorage.removeItem(STORAGE_KEY)
    globalState = {
      currentRole: "public",
      currentUser: SEED_USERS.public,
      theme: "light",
      selectedRegion: "Jawa Timur",
      offers: SEED_OFFERS,
      contracts: SEED_CONTRACTS,
      observations: SEED_OBSERVATIONS,
      parameters: INITIAL_PARAMETERS,
      auditLogs: [
        {
          id: "log-reset-" + Date.now(),
          timestamp: new Date().toISOString(),
          actorRole: "admin",
          actorName: "Sistem",
          action: "Reset Data Simulasi",
          targetType: "DataHarga",
          targetId: "sys-reset",
          details: "Data simulasi dan transaksi direset kembali ke kondisi awal seed."
        }
      ]
    }
    notify()
  }

  return {
    ...state,
    selectedRegion: state.selectedRegion || "Jawa Timur",
    setSelectedRegion,
    setRole,
    toggleTheme,
    createOffer,
    withdrawOffer,
    createOrder,
    counterOffer,
    acceptPrice,
    confirmCompletion,
    cancelContract,
    rejectContract,
    setOfferModeration,
    updateParameters,
    resetToSeedData
  }
}
