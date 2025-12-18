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
    <div className="min-h-screen flex bg-white p-2">
      
      {/* Left Image Section */}
      <div className="w-1/2 flex items-center justify-center">
        <img
          src="/assets/login.jpg"
          alt="Clinic illustration"
          className="w-full h-full object-cover rounded-2xl"
        />
      </div>

      {/* Right Login Section */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl p-8">
          
          {/* Logo */}
          <div className="text-center">
            <img
              src="/assets/slotsure.svg"
              alt="SlotSure"
              className="mx-auto h-28"
            />
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <div>
              <label className="text-sm text-gray-700">
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                required
                className="
                  mt-1 w-full border rounded-lg px-3 py-2
                  focus:outline-none focus:ring-2 focus:ring-purple-500
                "
                placeholder="clinic@email.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-700">
                Password
              </label>
              <input
                type="password"
                autoComplete="current-password"
                required
                className="
                  mt-1 w-full border rounded-lg px-3 py-2
                  focus:outline-none focus:ring-2 focus:ring-purple-500
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
                bg-black text-white
                transition-all duration-300 ease-out
                hover:bg-purple-600 hover:-translate-y-1
                active:translate-y-0 active:bg-purple-700
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
