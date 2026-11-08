import { useState } from "react"
import { useSambungStore } from "@/store/sambungStore"
import { UserRole } from "@/types/domain"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Phone, KeyRound, Lock, User, ShieldCheck, ArrowRight, Sprout, Building2 } from "lucide-react"

interface LoginPageProps {
  onLoginSuccess: (role: UserRole) => void
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const { setRole } = useSambungStore()
  const [authMode, setAuthMode] = useState<"user" | "admin">("user")
  const [step, setStep] = useState<"phone" | "otp" | "profile">("phone")

  // Form states
  const [phoneNumber, setPhoneNumber] = useState("081234567890")
  const [otpCode, setOtpCode] = useState("")
  const [selectedRole, setSelectedRole] = useState<"petani" | "pembeli">("petani")
  const [fullName, setFullName] = useState("")
  const [businessName, setBusinessName] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false) // DEC-014g: Tidak tercentang otomatis!

  // Admin form state
  const [adminEmail, setAdminEmail] = useState("admin@sambung.id")
  const [adminPassword, setAdminPassword] = useState("admin123")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault()
    if (!phoneNumber || phoneNumber.length < 10) {
      setErrorMessage("Nomor HP tidak valid (minimal 10 digit)")
      return
    }
    setErrorMessage("")
    setStep("otp")
  }

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    if (!otpCode || otpCode.length < 4) {
      setErrorMessage("Masukkan kode OTP 4 digit (misal: 1234)")
      return
    }
    setErrorMessage("")

    if (phoneNumber.includes("3456")) {
      setRole("petani")
      onLoginSuccess("petani")
    } else if (phoneNumber.includes("9876")) {
      setRole("pembeli")
      onLoginSuccess("pembeli")
    } else {
      setStep("profile")
    }
  }

  const handleCompleteProfile = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim()) {
      setErrorMessage("Nama lengkap wajib diisi")
      return
    }
    if (!agreedToTerms) {
      setErrorMessage("Anda harus menyetujui Ketentuan Layanan & Kebijakan Data secara sadar.")
      return
    }
    setErrorMessage("")
    setRole(selectedRole)
    onLoginSuccess(selectedRole)
  }

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (adminEmail === "admin@sambung.id" && adminPassword === "admin123") {
      setRole("admin")
      onLoginSuccess("admin")
    } else {
      setErrorMessage("Kredensial Admin tidak cocok. Gunakan admin@sambung.id / admin123")
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto py-12 px-4">
      {/* Brand Emblem */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-primary text-white dark:text-[#182117] flex items-center justify-center mx-auto mb-3 shadow-md">
          <Sprout className="w-7 h-7" />
        </div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
          Gerbang Masuk SAMBUNG
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Infrastruktur Intelijen Komoditas Gabah & Kesepakatan Digital Terpercaya
        </p>
      </div>

      {/* Mode Switch Tabs */}
      <div className="flex bg-muted/60 p-1 rounded-2xl mb-6 border border-border/80 shadow-2xs">
        <button
          onClick={() => {
            setAuthMode("user")
            setErrorMessage("")
            setStep("phone")
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[44px] flex items-center justify-center gap-2 cursor-pointer ${
            authMode === "user"
              ? "bg-primary text-white dark:text-[#182117] shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Petani & Produsen (OTP)</span>
        </button>
        <button
          onClick={() => {
            setAuthMode("admin")
            setErrorMessage("")
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[44px] flex items-center justify-center gap-2 cursor-pointer ${
            authMode === "admin"
              ? "bg-primary text-white dark:text-[#182117] shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Portal Pengawas (Admin)</span>
        </button>
      </div>

      {/* USER FLOW (AU-01, AU-02, AU-03) */}
      {authMode === "user" && (
        <Card className="border border-border/80 shadow-lg rounded-2xl bg-card overflow-hidden">
          <CardHeader className="text-center pb-4 pt-6 px-6 bg-muted/20 border-b border-border/70">
            <CardTitle className="text-lg font-bold font-display text-foreground">
              {step === "phone" && "Masuk atau Daftar dengan Nomor HP"}
              {step === "otp" && "Verifikasi Kode OTP Simulasi"}
              {step === "profile" && "Lengkapi Peran & Profil Usaha"}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              {step === "phone" && "Masukkan nomor HP Anda untuk menerima kode verifikasi simulasi instan."}
              {step === "otp" && `Kode verifikasi telah dikirim ke nomor ${phoneNumber}`}
              {step === "profile" && "Pilih salah satu peran tetap untuk ruang kerja Anda."}
            </p>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-destructive/15 text-destructive text-xs font-semibold leading-relaxed">
                {errorMessage}
              </div>
            )}

            {step === "phone" && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground">
                    Nomor Handphone (WhatsApp / SMS)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="081234567890"
                      className="pl-10 font-mono font-bold text-sm h-11"
                    />
                  </div>
                  <div className="p-3 rounded-xl bg-muted/40 border border-border/70 space-y-1 text-[11px] text-muted-foreground">
                    <p className="font-semibold text-foreground">Pintasan Cepat Akun Demo:</p>
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setPhoneNumber("081234567890")}
                        className="px-2.5 py-1 rounded-md bg-card border border-border font-mono font-bold text-primary hover:border-primary/50 cursor-pointer"
                      >
                        Petani (081234567890)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPhoneNumber("081398765432")}
                        className="px-2.5 py-1 rounded-md bg-card border border-border font-mono font-bold text-primary hover:border-primary/50 cursor-pointer"
                      >
                        Pembeli (081398765432)
                      </button>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full font-bold gap-2 text-xs shadow-xs h-11">
                  <span>Kirim Kode OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
            )}

            {step === "otp" && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground">
                    Masukkan Kode OTP 4 Digit
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="Contoh: 1234"
                      className="pl-10 font-mono tracking-widest text-center text-xl font-bold h-12"
                      autoFocus
                    />
                  </div>
                  <div className="flex justify-between items-center pt-1 text-xs">
                    <span className="text-muted-foreground text-[11px]">Masukkan angka bebas (misal 1234)</span>
                    <button
                      type="button"
                      onClick={() => setStep("phone")}
                      className="text-primary font-semibold hover:underline cursor-pointer"
                    >
                      Ubah Nomor
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full font-bold text-xs shadow-xs h-11">
                  Verifikasi & Masuk Ruang Kerja
                </Button>
              </form>
            )}

            {step === "profile" && (
              <form onSubmit={handleCompleteProfile} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground">
                    Pilih Peran Akun (Satu peran tetap per akun)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedRole("petani")}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedRole === "petani"
                          ? "border-primary bg-primary/10 ring-2 ring-primary font-bold text-foreground"
                          : "border-border/80 bg-card text-muted-foreground hover:bg-muted/40"
                      }`}
                    >
                      <p className="flex items-center gap-2 text-sm font-bold text-foreground">
                        <Sprout className="h-4 w-4 text-primary" />
                        <span>Petani</span>
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">Jual gabah panen</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRole("pembeli")}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedRole === "pembeli"
                          ? "border-primary bg-primary/10 ring-2 ring-primary font-bold text-foreground"
                          : "border-border/80 bg-card text-muted-foreground hover:bg-muted/40"
                      }`}
                    >
                      <p className="flex items-center gap-2 text-sm font-bold text-foreground">
                        <Building2 className="h-4 w-4 text-primary" />
                        <span>Pembeli</span>
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">Beli gabah / gilingan</p>
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground">
                    Nama Lengkap / Kontak
                  </label>
                  <Input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Contoh: Bpk. Ahmad Subandi"
                    className="h-11"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground">
                    Nama Usaha / Kelompok Tani (Opsional)
                  </label>
                  <Input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Contoh: Poktan Harapan Jaya"
                    className="h-11"
                  />
                </div>

                {/* DEC-014g: Explicit Unchecked Terms Agreement */}
                <div className="p-3.5 rounded-xl border border-border/80 bg-muted/30 space-y-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-ring"
                    />
                    <span className="text-xs text-foreground leading-relaxed">
                      Saya secara sadar menyetujui <strong>Ketentuan Layanan & Informasi Pemrosesan Data</strong> bahwa transaksi bersifat simulasi tanpa komisi perantara dan nomor HP hanya dibuka saat kesepakatan disetujui bersama.
                    </span>
                  </label>
                </div>

                <Button type="submit" className="w-full font-bold text-xs shadow-xs h-11">
                  Selesaikan Pendaftaran & Masuk
                </Button>
              </form>
            )}
          </CardContent>

          <CardFooter className="pt-0 pb-5 justify-center text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Keamanan Data Dilindungi Enkripsi Privasi</span>
            </span>
          </CardFooter>
        </Card>
      )}

      {/* ADMIN FLOW (AU-04) */}
      {authMode === "admin" && (
        <Card className="border border-border/80 shadow-lg rounded-2xl bg-card overflow-hidden">
          <CardHeader className="text-center pb-4 pt-6 px-6 bg-muted/20 border-b border-border/70">
            <CardTitle className="text-lg font-bold font-display text-foreground">
              Portal Akses Pengawas Sistem
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Khusus pengelola operasional SAMBUNG untuk supervisi dan konfigurasi parameter harga.
            </p>
          </CardHeader>
          <CardContent className="p-6">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-destructive/15 text-destructive text-xs font-semibold mb-4 leading-relaxed">
                {errorMessage}
              </div>
            )}
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground">
                  Email Admin
                </label>
                <Input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@sambung.id"
                  className="h-11"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground">
                  Kata Sandi
                </label>
                <Input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 font-mono"
                />
              </div>

              <Button type="submit" className="w-full font-bold gap-2 text-xs shadow-xs h-11">
                <Lock className="w-4 h-4" />
                <span>Masuk ke Panel Pengawas</span>
              </Button>
            </form>
          </CardContent>
          <CardFooter className="pt-0 pb-5 justify-center text-xs text-muted-foreground font-mono">
            Kredensial demo: admin@sambung.id / admin123
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
