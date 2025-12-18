import { useState, useEffect } from "react"
import { supabase } from "../services/supabase"
import { useNavigate } from "react-router-dom"

export default function Login({ session }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (session) navigate("/dashboard")
  }, [session])

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) alert(error.message)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-black via-neutral-900 to-black p-3">
      
      {/* Left Image Section */}
      <div className="w-1/2 hidden lg:flex items-center justify-center">
        <img
          src="/assets/login.jpg"
          alt="Clinic illustration"
          className="
            w-full h-full object-cover rounded-3xl
            shadow-[0_20px_80px_rgba(0,0,0,0.8)]
          "
        />
      </div>

      {/* Right Login Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <div
          className="
            w-full max-w-md
            bg-white/10 backdrop-blur-xl
            border border-white/20
            rounded-3xl p-10
            shadow-[0_20px_80px_rgba(0,0,0,0.8)]
            text-white
          "
        >
          {/* Logo */}
          <div className="text-center">
            <img
              src="/assets/slotsure-dark.svg"
              alt="SlotSure"
              className="mx-auto h-24"
            />
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label className="text-sm text-purple-200">
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                required
                className="
                  mt-1 w-full rounded-xl px-4 py-3
                  bg-neutral-900/80 border border-neutral-700
                  text-white placeholder-gray-400
                  focus:outline-none focus:border-purple-500
                  transition-all duration-300
                "
                placeholder="clinic@email.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-purple-200">
                Password
              </label>
              <input
                type="password"
                autoComplete="current-password"
                required
                className="
                  mt-1 w-full rounded-xl px-4 py-3
                  bg-neutral-900/80 border border-neutral-700
                  text-white placeholder-gray-400
                  focus:outline-none focus:border-purple-500
                  transition-all duration-300
                "
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full mt-6 py-3 rounded-full
                bg-gradient-to-r from-purple-600 to-purple-500
                hover:from-purple-500 hover:to-purple-400
                text-white font-medium
                transition-all duration-300
                hover:shadow-[0_0_30px_rgba(168,85,247,0.7)]
                active:scale-95
                disabled:opacity-60
              "
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-xs text-gray-400 mt-6 text-center">
            Built for clinics & service businesses
          </p>
        </div>
      </div>
    </div>
  )
}