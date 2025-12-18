import { Routes, Route } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "./services/supabase"

import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import ConfirmAppointment from "./pages/ConfirmAppointment"

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <Routes>
      {/* Public route */}
      <Route
        path="/confirm/:token"
        element={<ConfirmAppointment />}
      />

      {/* Auth routes */}
      <Route
        path="/"
        element={<Login session={session} />}
      />

      <Route
        path="/dashboard"
        element={<Dashboard session={session} />}
      />
    </Routes>
  )
}

export default App
