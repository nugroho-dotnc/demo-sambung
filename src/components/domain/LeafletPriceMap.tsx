import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { ProvincialPriceComparison } from "@/types/domain"
import { formatRupiah } from "@/lib/utils"
import indonesiaGeoJson from "@/data/indonesia-provinces.json"
import { RotateCcw } from "lucide-react"

interface LeafletPriceMapProps {
  data: ProvincialPriceComparison[]
  selectedProvince: string
  onSelectProvince: (province: string) => void
  theme?: "light" | "dark"
}

// Normalisasi nama provinsi dari GeoJSON BAKOSURTANAL ke format SAMBUNG
function normalizeProvinceName(geoName: string): string {
  const upper = geoName.toUpperCase().trim()
  if (upper === "JAWA BARAT") return "Jawa Barat"
  if (upper === "JAWA TENGAH") return "Jawa Tengah"
  if (upper === "JAWA TIMUR") return "Jawa Timur"
  if (upper === "PROBANTEN" || upper === "BANTEN") return "Banten"
  if (upper === "BALI") return "Bali"
  if (upper === "NUSATENGGARA BARAT" || upper === "NUSA TENGGARA BARAT") return "NTB"
  if (upper === "LAMPUNG") return "Lampung"
  if (upper === "SUMATERA SELATAN") return "Sumatera Selatan"
  if (upper === "SUMATERA UTARA") return "Sumatera Utara"
  if (upper === "SULAWESI SELATAN") return "Sulawesi Selatan"
  if (upper.includes("IRIAN") || upper.includes("PAPUA")) return "Papua"
  if (upper === "DAERAH ISTIMEWA YOGYAKARTA") return "DI Yogyakarta"
  if (upper === "DKI JAKARTA") return "DKI Jakarta"
  if (upper === "DI. ACEH" || upper === "ACEH") return "Aceh"
  if (upper === "SUMATERA BARAT") return "Sumatera Barat"
  if (upper === "RIAU") return "Riau"
  if (upper === "JAMBI") return "Jambi"
  if (upper === "BENGKULU") return "Bengkulu"
  if (upper === "BANGKA BELITUNG") return "Bangka Belitung"
  if (upper === "KALIMANTAN BARAT") return "Kalimantan Barat"
  if (upper === "KALIMANTAN TENGAH") return "Kalimantan Tengah"
  if (upper === "KALIMANTAN SELATAN") return "Kalimantan Selatan"
  if (upper === "KALIMANTAN TIMUR") return "Kalimantan Timur"
  if (upper === "SULAWESI UTARA") return "Sulawesi Utara"
  if (upper === "SULAWESI TENGAH") return "Sulawesi Tengah"
  if (upper === "SULAWESI TENGGARA") return "Sulawesi Tenggara"
  if (upper === "GORONTALO") return "Gorontalo"
  if (upper === "MALUKU") return "Maluku"
  if (upper === "MALUKU UTARA") return "Maluku Utara"
  if (upper === "NUSA TENGGARA TIMUR") return "NTT"
  return geoName
}

export function LeafletPriceMap({
  data,
  selectedProvince,
  onSelectProvince,
  theme = "light"
}: LeafletPriceMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null)

  // Hitung warna choropleth kontinu berpusat 0% (DEC-019a)
  const getStyleForProvince = (provName: string, isSelected: boolean) => {
    const provData = data.find(
      (d) => d.province.toLowerCase() === provName.toLowerCase()
    )

    const isAvailable = provData?.isAvailable ?? false
    let fillColor = theme === "dark" ? "#334155" : "#E2E8F0"
    let borderColor = theme === "dark" ? "#475569" : "#CBD5E1"

    if (isAvailable && provData) {
      const diff = provData.percentageDiff

      if (diff < 0) {
        // Lebih murah dari median (Gradasi Hijau / Forest Green)
        if (diff <= -3.5) {
          fillColor = theme === "dark" ? "#1E4C33" : "#246447"
          borderColor = theme === "dark" ? "#2B6846" : "#1B4D36"
        } else if (diff <= -1.5) {
          fillColor = theme === "dark" ? "#285F41" : "#357A57"
          borderColor = theme === "dark" ? "#3B7C59" : "#286043"
        } else {
          fillColor = theme === "dark" ? "#34724F" : "#4A936C"
          borderColor = theme === "dark" ? "#498C64" : "#397454"
        }
      } else if (diff === 0) {
        // Tepat di median
        fillColor = theme === "dark" ? "#556425" : "#8A9A3A"
        borderColor = theme === "dark" ? "#6E8131" : "#69762B"
      } else {
        // Lebih mahal dari median (Gradasi Kuning / Emas / Terracotta)
        if (diff >= 5.0) {
          fillColor = theme === "dark" ? "#8A3B18" : "#C86B3C"
          borderColor = theme === "dark" ? "#A94E23" : "#9B4E27"
        } else if (diff >= 2.0) {
          fillColor = theme === "dark" ? "#8C5E13" : "#E59824"
          borderColor = theme === "dark" ? "#AB761C" : "#B87618"
        } else {
          fillColor = theme === "dark" ? "#8C7118" : "#F4A62A"
          borderColor = theme === "dark" ? "#A98B22" : "#C88319"
        }
      }
    }

    if (isSelected) {
      borderColor = theme === "dark" ? "#FFD55A" : "#1B3B18"
    }

    return {
      fillColor,
      weight: isSelected ? 3.5 : 1.2,
      opacity: 1,
      color: borderColor,
      fillOpacity: isSelected ? 0.9 : isAvailable ? 0.72 : 0.45
    }
  }

  // Inisialisasi peta Leaflet
  useEffect(() => {
    if (!mapContainerRef.current) return

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }

    // Pusat geografis Indonesia
    const map = L.map(mapContainerRef.current, {
      center: [-2.2, 117.8],
      zoom: 5,
      minZoom: 4,
      maxZoom: 9,
      zoomControl: false, // Dibuat rapi di sudut kanan atas
      attributionControl: true
    })

    mapInstanceRef.current = map

    // Zoom control teratur di kanan atas
    L.control.zoom({ position: "topright" }).addTo(map)

    // Tile Layer: OpenStreetMap resmi tanpa watermark dan tanpa API key!
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
    }).addTo(map)

    // Layer GeoJSON Resmi Kepulauan Indonesia
    const geoLayer = L.geoJSON(indonesiaGeoJson as GeoJSON.GeoJsonObject, {
      style: (feature) => {
        const rawName = (feature?.properties as { Propinsi?: string })?.Propinsi || ""
        const provName = normalizeProvinceName(rawName)
        const isSelected = selectedProvince.toLowerCase() === provName.toLowerCase()
        return getStyleForProvince(provName, isSelected)
      },
      onEachFeature: (feature, layer) => {
        const rawName = (feature.properties as { Propinsi?: string })?.Propinsi || ""
        const provName = normalizeProvinceName(rawName)
        const provData = data.find(
          (d) => d.province.toLowerCase() === provName.toLowerCase()
        )

        // Tooltip elegan
        const priceLabel = provData?.isAvailable ? formatRupiah(provData.price) : "Belum Ada Data"
        const diffLabel = provData?.isAvailable
          ? `${provData.percentageDiff > 0 ? "+" : ""}${provData.percentageDiff}% vs median`
          : "Survei harga belum mencukupi"

        const tooltipContent = `
          <div style="font-family: inherit; padding: 4px 6px; min-width: 140px;">
            <div style="font-weight: 800; font-size: 13px; color: #1e293b; margin-bottom: 2px;">
              ${provName}
            </div>
            <div style="font-family: monospace; font-size: 14px; font-weight: 700; color: #166534;">
              ${priceLabel}
            </div>
            <div style="font-size: 11px; font-weight: 600; color: #64748b; margin-top: 2px;">
              ${diffLabel}
            </div>
          </div>
        `

        layer.bindTooltip(tooltipContent, {
          sticky: true,
          direction: "auto",
          className: "leaflet-sambung-tooltip"
        })

        // Event hover & click
        layer.on({
          mouseover: (e) => {
            const target = e.target as L.Path
            target.setStyle({
              weight: 2.5,
              fillOpacity: 0.95
            })
            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
              target.bringToFront()
            }
          },
          mouseout: (e) => {
            const target = e.target as L.Path
            const isSel = selectedProvince.toLowerCase() === provName.toLowerCase()
            target.setStyle(getStyleForProvince(provName, isSel))
          },
          click: () => {
            onSelectProvince(provName)
          }
        })
      }
    }).addTo(map)

    geoJsonLayerRef.current = geoLayer

    // Penyesuaian ukuran otomatis
    setTimeout(() => {
      map.invalidateSize()
    }, 200)

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [data, theme])

  // Update highlight gaya saat provinsi yang dipilih berubah
  useEffect(() => {
    if (!geoJsonLayerRef.current) return

    geoJsonLayerRef.current.eachLayer((layer: any) => {
      const rawName = layer.feature?.properties?.Propinsi || ""
      const provName = normalizeProvinceName(rawName)
      const isSelected = selectedProvince.toLowerCase() === provName.toLowerCase()
      layer.setStyle(getStyleForProvince(provName, isSelected))

      if (isSelected && layer.bringToFront) {
        layer.bringToFront()
      }
    })
  }, [selectedProvince, theme])

  const handleResetFocus = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([-2.2, 117.8], 5, { animate: true })
    }
  }

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-border bg-card shadow-md">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Floating Action: Reset Zoom */}
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={handleResetFocus}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card/90 backdrop-blur-md border border-border text-xs font-bold text-foreground shadow-sm hover:bg-card hover:text-primary transition-all min-h-[40px]"
          title="Kembalikan tampilan peta ke seluruh kepulauan Indonesia"
        >
          <RotateCcw className="w-3.5 h-3.5 text-primary" />
          <span>Fokus Nasional</span>
        </button>
      </div>

      {/* Floating Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-20 p-3.5 rounded-xl bg-card/95 backdrop-blur-md border border-border shadow-lg text-xs space-y-2 max-w-xs">
        <div className="flex items-center justify-between">
          <p className="font-bold text-foreground">Legenda Disparitas Wilayah</p>
          <span className="text-[10px] text-muted-foreground">vs Median Nasional</span>
        </div>

        <div className="grid grid-cols-1 gap-1.5 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-sm bg-[#246447] border border-[#1B4D36] shrink-0" />
            <span className="text-foreground font-medium">Lebih Murah (&lt; 0% dari median)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-sm bg-[#8A9A3A] border border-[#69762B] shrink-0" />
            <span className="text-foreground font-medium">Setara Median (0%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-sm bg-[#C86B3C] border border-[#9B4E27] shrink-0" />
            <span className="text-foreground font-medium">Lebih Mahal (&gt; 0% dari median)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-sm bg-[#CBD5E1] dark:bg-[#334155] border border-border shrink-0" />
            <span className="text-muted-foreground">Data Pengamatan Belum Cukup</span>
          </div>
        </div>

        <p className="text-[10px] text-muted-foreground pt-1.5 border-t border-border">
          Arahkan kursor atau sentuh pulau untuk melihat harga gabah wilayah tersebut.
        </p>
      </div>
    </div>
  )
}
