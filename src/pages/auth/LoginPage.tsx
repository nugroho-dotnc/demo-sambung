import { useState } from "react"
import { useSambungStore } from "@/store/sambungStore"
import { UserRole } from "@/types/domain"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Phone, KeyRound, Lock, User, ShieldCheck, ArrowRight, Sprout, Factory } from "lucide-react"

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
    // Demo quick OTP check (any 4-6 digits)
    if (!otpCode || otpCode.length < 4) {
      setErrorMessage("Masukkan kode OTP 4 digit (misal: 1234)")
      return
    }
    setErrorMessage("")

    // Check if phone matches known demo user
    if (phoneNumber.includes("3456")) {
      // Petani demo
      setRole("petani")
      onLoginSuccess("petani")
    } else if (phoneNumber.includes("9876")) {
      // Pembeli demo
      setRole("pembeli")
      onLoginSuccess("pembeli")
    } else {
      // New account setup (AU-03)
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
    <div className="app-wrap max-w-lg mx-auto py-12 px-4">
      {/* Mode Switch Tabs */}
      <div className="flex bg-muted p-1 rounded-xl mb-6 border border-border">
        <button
          onClick={() => {
            setAuthMode("user")
            setErrorMessage("")
            setStep("phone")
          }}
          className={`flex-1 py-2.5 rounded-lg text-body-sm font-bold transition-all min-h-[44px] flex items-center justify-center gap-2 ${
            authMode === "user"
              ? "bg-primary text-white dark:text-[#182117] shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Petani & Pembeli (OTP)</span>
        </button>
        <button
          onClick={() => {
            setAuthMode("admin")
            setErrorMessage("")
          }}
          className={`flex-1 py-2.5 rounded-lg text-body-sm font-bold transition-all min-h-[44px] flex items-center justify-center gap-2 ${
            authMode === "admin"
              ? "bg-primary text-white dark:text-[#182117] shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Admin Portal</span>
        </button>
      </div>

      {/* USER FLOW (AU-01, AU-02, AU-03) */}
      {authMode === "user" && (
        <Card className="border border-border shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-bold font-display text-foreground">
              {step === "phone" && "Masuk atau Daftar dengan Nomor HP"}
              {step === "otp" && "Verifikasi Kode OTP"}
              {step === "profile" && "Lengkapi Peran & Profil Akun"}
            </CardTitle>
            <p className="text-body-sm text-muted-foreground mt-1">
              {step === "phone" && "Masukkan nomor HP Anda untuk menerima kode verifikasi simulasi."}
              {step === "otp" && `Kode simulasi telah dikirim ke nomor ${phoneNumber}`}
              {step === "profile" && "Pilih salah satu peran tetap untuk akun Anda."}
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-lg bg-destructive/15 text-destructive text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            {step === "phone" && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-body-sm font-semibold text-foreground mb-1.5">
                    Nomor Handphone (WhatsApp / SMS)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="081234567890"
                      className="pl-9 font-mono font-medium"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Demo: Gunakan <code>081234567890</code> untuk Petani atau <code>081398765432</code> untuk Pembeli.
                  </p>
                </div>

                <Button type="submit" className="w-full font-bold gap-2">
                  <span>Kirim Kode OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
            )}

            {step === "otp" && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-body-sm font-semibold text-foreground mb-1.5">
                    Masukkan Kode OTP 4 Digit
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="Contoh: 1234"
                      className="pl-9 font-mono tracking-widest text-center text-xl font-bold"
                      autoFocus
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2 text-xs">
                    <span className="text-muted-foreground">Demo: Masukkan angka bebas (misal 1234)</span>
                    <button
                      type="button"
                      onClick={() => setStep("phone")}
                      className="text-primary font-semibold hover:underline"
                    >
                      Ubah Nomor
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full font-bold">
                  Verifikasi & Masuk
                </Button>
              </form>
            )}

            {step === "profile" && (
              <form onSubmit={handleCompleteProfile} className="space-y-4">
                <div>
                  <label className="block text-body-sm font-semibold text-foreground mb-1.5">
                    Pilih Peran Akun (Satu peran per akun)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedRole("petani")}
                      className={`p-3.5 rounded-lg border text-left transition-all min-h-[44px] ${
                        selectedRole === "petani"
                          ? "border-primary bg-primary/10 ring-2 ring-primary font-bold text-foreground"
                          : "border-border bg-card text-muted-foreground"
                      }`}
                    >
                      <p className="flex items-center gap-2 text-sm font-bold"><Sprout className="h-4 w-4 text-primary" aria-hidden="true" />Petani</p>
                      <p className="text-[11px] opacity-80 mt-0.5">Jual gabah panen</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole("pembeli")}
                      className={`p-3.5 rounded-lg border text-left transition-all min-h-[44px] ${
                        selectedRole === "pembeli"
                          ? "border-primary bg-primary/10 ring-2 ring-primary font-bold text-foreground"
                          : "border-border bg-card text-muted-foreground"
                      }`}
                    >
                      <p className="flex items-center gap-2 text-sm font-bold"><Factory className="h-4 w-4 text-primary" aria-hidden="true" />Pembeli</p>
                      <p className="text-[11px] opacity-80 mt-0.5">Beli gabah / gilingan</p>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-body-sm font-semibold text-foreground mb-1.5">
                    Nama Lengkap / Kontak
                  </label>
                  <Input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Contoh: Bpk. Ahmad Subandi"
                  />
                </div>

                <div>
                  <label className="block text-body-sm font-semibold text-foreground mb-1.5">
                    Nama Usaha / Kelompok Tani (Opsional)
                  </label>
                  <Input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Contoh: Poktan Harapan Jaya"
                  />
                </div>

                {/* DEC-014g: Explicit Unchecked Terms Agreement */}
                <div className="p-3.5 rounded-lg border border-border bg-muted/40 space-y-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-ring"
                    />
                    <span className="text-xs text-foreground leading-relaxed">
                      Saya secara sadar menyetujui <strong>Ketentuan Layanan & Informasi Pemrosesan Data</strong> bahwa transaksi bersifat simulasi tanpa komisi dan nomor HP hanya dibuka saat kesepakatan disetujui bersama.
                    </span>
                  </label>
                </div>

                <Button type="submit" className="w-full font-bold">
                  Selesaikan Pendaftaran
                </Button>
              </form>
            )}
          </CardContent>

          <CardFooter className="pt-0 justify-center text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              Keamanan Data Dilindungi Enkripsi
            </span>
          </CardFooter>
        </Card>
      )}

      {/* ADMIN FLOW (AU-04) */}
      {authMode === "admin" && (
        <Card className="border border-border shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-bold font-display text-foreground">
              Portal Akses Admin Pengelola
            </CardTitle>
            <p className="text-body-sm text-muted-foreground mt-1">
              Khusus pengelola operasional SAMBUNG untuk pemantauan dan pengelolaan parameter.
            </p>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <div className="p-3 rounded-lg bg-destructive/15 text-destructive text-xs font-semibold mb-4">
                {errorMessage}
              </div>
            )}
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-body-sm font-semibold text-foreground mb-1.5">
                  Email Admin
                </label>
                <Input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@sambung.id"
                />
              </div>

              <div>
                <label className="block text-body-sm font-semibold text-foreground mb-1.5">
                  Kata Sandi
                </label>
                <Input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <Button type="submit" className="w-full font-bold gap-2">
                <Lock className="w-4 h-4" />
                <span>Masuk ke Panel Admin</span>
              </Button>
            </form>
          </CardContent>
          <CardFooter className="pt-0 justify-center text-xs text-muted-foreground">
            Kredensial bawaan demo: admin@sambung.id / admin123
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
