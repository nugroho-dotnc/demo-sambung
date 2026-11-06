import { GrainType, PriceLampStatus, FairPriceEstimate } from "@/types/domain"

/**
 * Aturan Pembulatan DEC-018a:
 * Batas L/U operasional dibulatkan ke rupiah terdekat, pecahan 0,5 ke atas dibulatkan ke atas.
 */
export function roundToNearestRupiah(value: number): number {
  return Math.round(value)
}

/**
 * Validasi Input DEC-018b:
 * Harga: rupiah bulat (> 0)
 * Volume: maksimal dua desimal (> 0)
 */
export function validatePriceInput(price: number): { isValid: boolean; message?: string } {
  if (isNaN(price) || price <= 0) {
    return { isValid: false, message: "Harga harus berupa angka lebih besar dari 0" }
  }
  if (!Number.isInteger(price)) {
    return { isValid: false, message: "Harga harus berupa rupiah bulat (tanpa pecahan/sen)" }
  }
  return { isValid: true }
}

export function validateVolumeInput(volume: number): { isValid: boolean; message?: string } {
  if (isNaN(volume) || volume <= 0) {
    return { isValid: false, message: "Volume harus berupa angka lebih besar dari 0" }
  }
  const decimalPart = volume.toString().split(".")[1]
  if (decimalPart && decimalPart.length > 2) {
    return { isValid: false, message: "Volume maksimal memiliki 2 angka di belakang koma (contoh: 125.50)" }
  }
  return { isValid: true }
}

/**
 * Hitung Rentang Harga Wajar (BR-009, DEC-007a-f, DEC-018a):
 * q = harga gabah / (harga beras produsen * rendemen jenis)
 * L_asal = Pberas * R * P10(q)
 * U_asal = Pberas * R * P90(q)
 * L/U operasional dibulatkan ke rupiah terdekat
 */
export function calculateFairPrice(
  grainType: GrainType,
  province: string,
  riceProducerPrice: number,
  rendemen: number,
  p10Ratio: number = 0.90,
  p90Ratio: number = 1.00,
  delta: number = 0.03
): FairPriceEstimate {
  if (!riceProducerPrice || riceProducerPrice <= 0 || !rendemen || rendemen <= 0) {
    return {
      grainType,
      province,
      period: "November 2026",
      riceProducerPrice: 0,
      rendemen,
      p10Ratio,
      p90Ratio,
      lowerBoundOriginal: 0,
      upperBoundOriginal: 0,
      lowerBound: 0,
      upperBound: 0,
      tolerancePercent: delta,
      isAvailable: false,
    }
  }

  const basePriceEquivalent = riceProducerPrice * rendemen
  const lowerBoundOriginal = basePriceEquivalent * p10Ratio
  const upperBoundOriginal = basePriceEquivalent * p90Ratio

  const lowerBound = roundToNearestRupiah(lowerBoundOriginal)
  const upperBound = roundToNearestRupiah(upperBoundOriginal)

  return {
    grainType,
    province,
    period: "Pekan I November 2026",
    riceProducerPrice,
    rendemen,
    p10Ratio,
    p90Ratio,
    lowerBoundOriginal,
    upperBoundOriginal,
    lowerBound,
    upperBound,
    tolerancePercent: delta,
    isAvailable: true,
  }
}

/**
 * Evaluasi Lampu Harga (BR-011, BR-012, DEC-006a-d):
 * - Hijau: L <= P <= U
 * - Kuning: L * (1 - delta) <= P < L ATAU P > U
 * - Merah: P < L * (1 - delta)
 * - Tidak Tersedia: acuan belum ada / tidak valid
 */
export function evaluatePriceLamp(
  price: number,
  lowerBound: number,
  upperBound: number,
  delta: number = 0.03
): {
  status: PriceLampStatus
  message: string
  detailMessage: string
  needsConfirmation: boolean
} {
  if (!lowerBound || !upperBound || lowerBound <= 0 || upperBound <= 0 || lowerBound > upperBound) {
    return {
      status: "TIDAK_TERSEDIA",
      message: "Acuan harga belum tersedia",
      detailMessage: "Data historis pasar untuk wilayah atau jenis gabah ini belum memadai untuk membentuk acuan harga wajar.",
      needsConfirmation: false,
    }
  }

  const redThreshold = lowerBound * (1 - delta)

  if (price >= lowerBound && price <= upperBound) {
    return {
      status: "HIJAU",
      message: "Dalam Rentang Wajar",
      detailMessage: `Harga Rp${price.toLocaleString("id-ID")} berada dalam estimasi rentang wajar (Rp${lowerBound.toLocaleString("id-ID")} – Rp${upperBound.toLocaleString("id-ID")}).`,
      needsConfirmation: false,
    }
  }

  if (price >= redThreshold && price < lowerBound) {
    const diff = lowerBound - price
    return {
      status: "KUNING",
      message: "Sedikit di Bawah Rentang Wajar",
      detailMessage: `Harga Rp${price.toLocaleString("id-ID")} berada di bawah batas wajar sebesar Rp${diff.toLocaleString("id-ID")}, namun masih dalam batas toleransi ${delta * 100}%.`,
      needsConfirmation: false,
    }
  }

  if (price > upperBound) {
    const diff = price - upperBound
    return {
      status: "KUNING",
      message: "Di Atas Rentang Wajar",
      detailMessage: `Harga Rp${price.toLocaleString("id-ID")} berada di atas batas wajar sebesar Rp${diff.toLocaleString("id-ID")}. Penjualan dengan harga ini menguntungkan namun mungkin memerlukan negosiasi dengan pembeli.`,
      needsConfirmation: false,
    }
  }

  // price < redThreshold
  const diff = lowerBound - price
  return {
    status: "MERAH",
    message: "Jauh di Bawah Rentang Wajar",
    detailMessage: `Peringatan: Harga Rp${price.toLocaleString("id-ID")} berada jauh di bawah estimasi wajar (selisih -Rp${diff.toLocaleString("id-ID")}, melebihi toleransi ${delta * 100}%). Anda berisiko mengalami kerugian harga jual gabah.`,
    needsConfirmation: true, // DEC-006a: merah memerlukan konfirmasi eksplisit
  }
}
