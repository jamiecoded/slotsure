import { useEffect, useState } from "react"
import { supabase } from "../services/supabase"
import { useNavigate } from "react-router-dom"

export default function Dashboard({ session }) {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])

  // form state
  const [patientName, setPatientName] = useState("")
  const [patientEmail, setPatientEmail] = useState("")
  const [service, setService] = useState("")
  const [appointmentTime, setAppointmentTime] = useState("")
  const [loading, setLoading] = useState(false)

  // UX polish
  const [actionLoading, setActionLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  // slot recovery
  const [recoveryCandidate, setRecoveryCandidate] = useState(null)
  const [recoveryTime, setRecoveryTime] = useState(null)
  const [waitlist, setWaitlist] = useState([])
  const [wlName, setWlName] = useState("")
  const [wlEmail, setWlEmail] = useState("")
  const [wlTime, setWlTime] = useState("")
  const [cancelledAppointmentId, setCancelledAppointmentId] = useState(null)

  useEffect(() => {
    if (!session) {
      navigate("/")
      return
    }
    fetchAppointments()
    fetchWaitlist()
  }, [session])

  function isAtRisk(appointmentTime) {
    const now = new Date()
    const apptTime = new Date(appointmentTime)
    const diffInHours = (apptTime - now) / (1000 * 60 * 60)
    return diffInHours <= 24 && diffInHours > 0
  }

  function generateToken() {
    return crypto.randomUUID()
  }

  async function fetchAppointments() {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("appointment_time", { ascending: true })

    if (error) return
    setAppointments(data)

    data.forEach((appt) => {
      if (appt.status === "scheduled" && isAtRisk(appt.appointment_time)) {
        updateStatus(appt.id, "at_risk")
      }
    })
  }

  async function fetchWaitlist() {
    const { data, error } = await supabase
      .from("waitlist")
      .select("*")
      .order("created_at", { ascending: true })

    if (!error) setWaitlist(data)
  }

  async function fetchMatchingWaitlist(appointmentTime) {
    const start = new Date(appointmentTime)
    start.setMinutes(0, 0, 0)

    const end = new Date(start)
    end.setHours(end.getHours() + 1)

    const { data } = await supabase
      .from("waitlist")
      .select("*")
      .gte("desired_time", start.toISOString())
      .lt("desired_time", end.toISOString())
      .order("created_at", { ascending: true })

    return data || []
  }

  async function createAppointment(e) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.from("appointments").insert({
      clinic_id: session.user.id,
      patient_name: patientName,
      patient_email: patientEmail || null,
      service: service || null,
      appointment_time: new Date(appointmentTime).toISOString(),
      confirmation_token: generateToken(),
    })

    if (!error) {
      setPatientName("")
      setPatientEmail("")
      setService("")
      setAppointmentTime("")
      fetchAppointments()
    } else {
      alert(
        error.code === "23505"
          ? "This time slot is already booked."
          : error.message
      )
    }

    setLoading(false)
  }

  async function updateStatus(id, newStatus, appointmentTime) {
    setActionLoading(true)

    const { error } = await supabase
      .from("appointments")
      .update({ status: newStatus })
      .eq("id", id)

    if (error) {
      alert(error.message)
      setActionLoading(false)
      return
    }

    if (newStatus === "cancelled") {
      setCancelledAppointmentId(id)
      const matches = await fetchMatchingWaitlist(appointmentTime)
      if (matches.length > 0) {
        setRecoveryCandidate(matches[0])
        setRecoveryTime(appointmentTime)
      }
    } else {
      setRecoveryCandidate(null)
      setRecoveryTime(null)
      setCancelledAppointmentId(null)
    }

    fetchAppointments()
    setActionLoading(false)
  }

  async function promoteFromWaitlist() {
    if (!recoveryCandidate || !cancelledAppointmentId) return
    setActionLoading(true)

    await supabase
      .from("appointments")
      .delete()
      .eq("id", cancelledAppointmentId)

    await supabase.from("appointments").insert({
      clinic_id: session.user.id,
      patient_name: recoveryCandidate.patient_name,
      patient_email: recoveryCandidate.patient_email || null,
      appointment_time: new Date(recoveryTime).toISOString(),
      status: "confirmed",
      confirmation_token: generateToken(),
    })

    await supabase
      .from("waitlist")
      .delete()
      .eq("id", recoveryCandidate.id)

    setRecoveryCandidate(null)
    setRecoveryTime(null)
    setCancelledAppointmentId(null)

    setSuccessMessage("Slot successfully recovered from waitlist.")
    setTimeout(() => setSuccessMessage(""), 3000)

    fetchAppointments()
    fetchWaitlist()
    setActionLoading(false)
  }

  async function addToWaitlist(e) {
    e.preventDefault()

    const { error } = await supabase.from("waitlist").insert({
      clinic_id: session.user.id,
      patient_name: wlName,
      patient_email: wlEmail || null,
      desired_time: new Date(wlTime).toISOString(),
    })

    if (error) {
      alert(error.message)
      return
    }

    setWlName("")
    setWlEmail("")
    setWlTime("")
    fetchWaitlist()
  }

  async function removeFromWaitlist(id) {
    await supabase.from("waitlist").delete().eq("id", id)
    fetchWaitlist()
  }

  return (
<div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white pt-30 sm:pt-28 px-6">
    {/*Header */}
<div
  className="
    fixed top-0 left-0 right-0 z-50
    backdrop-blur-xl bg-black/40
    border-b border-white/10
  "
>
  <div className="relative px-4 sm:px-6 h-auto sm:h-20 py-3 sm:py-0">
    {/* Grainy Effect*/}
    <div className="pointer-events-none absolute inset-0 opacity-20 bg-noise" />

    {/* MOBILE HEADER */}
    <div className="flex flex-col sm:hidden gap-2 relative z-10">
      <div className="flex justify-between items-center">
        <img
          src="/assets/slotsure-dark.svg"
          alt="SlotSure"
          className="h-7"
        />

        <button
          onClick={() => supabase.auth.signOut()}
          className="
            px-3 py-1 rounded-full
            border border-purple-500
            text-purple-400 text-sm
          "
        >
          Logout
        </button>
      </div>

      <h1 className="text-xl font-semibold text-center">
        DASHBOARD
      </h1>
    </div>

    {/* DESKTOP HEADER */}
    <div className="hidden sm:block relative h-20">
      {/* Left */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10">
        <img
          src="/assets/slotsure-dark.svg"
          alt="SlotSure"
          className="h-8"
        />
      </div>

      {/* Center */}
      <h1
        className="
          absolute left-1/2 top-1/2
          -translate-x-1/2 -translate-y-1/2
          text-3xl font-semibold tracking-wide z-10
        "
      >
        DASHBOARD
      </h1>

      {/* Right */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10">
        <button
          onClick={() => supabase.auth.signOut()}
          className="
            px-5 py-2 rounded-full
            border border-purple-500
            text-purple-400
            hover:bg-purple-600 hover:text-white
            transition-all duration-300
            hover:shadow-[0_0_20px_rgba(168,85,247,0.6)]
          "
        >
          Logout
        </button>
      </div>
    </div>
  </div>
</div>




    {successMessage && (
      <div className="mb-6 max-w-xl p-4 rounded-xl bg-purple-900/40 border border-purple-600 text-purple-200">
        {successMessage}
      </div>
    )}

    {/* Main Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* LEFT SECTION */}
      <div className="lg:col-span-2 space-y-8">
        {/* Create Appointment */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 text-purple-300">
            Create Appointment
          </h2>

          <form
            onSubmit={createAppointment}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              required
              placeholder="Patient name"
              className="input-dark"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
            />

            <input
              type="email"
              placeholder="Patient email (optional)"
              className="input-dark"
              value={patientEmail}
              onChange={(e) => setPatientEmail(e.target.value)}
            />

            <input
              placeholder="Service (optional)"
              className="input-dark"
              value={service}
              onChange={(e) => setService(e.target.value)}
            />

            <input
              type="datetime-local"
              required
              className="input-dark"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
            />

            <button
              type="submit"
              disabled={loading}
              className="
                md:col-span-2 mt-2 py-3 rounded-xl
               bg-gradient-to-r from-purple-400 to-purple-900
            text-white
                transition-all duration-300
                hover:shadow-[0_0_10px_rgba(168,85,247,0.6)]
                active:scale-95
                disabled:opacity-50
              "
            >
              {loading ? "Creating..." : "Create Appointment"}
            </button>
          </form>
        </div>

        {/* Appointments List */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 text-purple-300">
            Appointments
          </h2>

          {appointments.length === 0 ? (
            <p className="text-gray-400">No appointments yet</p>
          ) : (
            <ul className="space-y-4">
              {appointments.map((appt) => (
                <li
                  key={appt.id}
                  className={`
                    p-4 rounded-xl border flex justify-between items-center
                    transition-all duration-300
                    ${
                      appt.status === "at_risk"
                        ? "border-orange-500 bg-orange-500/10"
                        : "border-neutral-700 bg-neutral-800/60"
                    }
                    hover:border-purple-500
                  `}
                >
                  <div>
                    <p className="font-medium">{appt.patient_name}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(appt.appointment_time).toLocaleString()}
                    </p>
                    <p className="text-xs uppercase tracking-wide text-purple-400">
                      {appt.status}
                    </p>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          `${window.location.origin}/confirm/${appt.confirmation_token}`
                        )
                      }
                      className="
                        mt-2 text-xs text-purple-400
                        border p-2 rounded-lg
                        hover:text-purple-200
                        hover:cursor-pointer
                        transition
                      "
                    >
                      Copy confirmation link
                    </button>
                  </div>

                  <div className="flex gap-2">
                    {(appt.status === "scheduled" ||
                      appt.status === "at_risk") && (
                      <button
                        disabled={actionLoading}
                        onClick={() =>
                          updateStatus(appt.id, "confirmed")
                        }
                        className="btn-outline"
                      >
                        Confirm
                      </button>
                    )}

                    {appt.status !== "cancelled" &&
                      appt.status !== "completed" && (
                        <button
                          disabled={actionLoading}
                          onClick={() =>
                            updateStatus(
                              appt.id,
                              "cancelled",
                              appt.appointment_time
                            )
                          }
                          className="btn-outline"
                        >
                          Cancel
                        </button>
                      )}

                    {appt.status === "confirmed" && (
                      <button
                        disabled={actionLoading}
                        onClick={() =>
                          updateStatus(appt.id, "completed")
                        }
                        className="btn-outline"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="space-y-8">
        {/* Slot Recovery */}
        {recoveryCandidate && (
          <div className="bg-purple-900/40 border border-purple-600 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-purple-200">
              Recover Cancelled Slot
            </h3>
            <p className="text-sm text-purple-300 mt-1">
              {recoveryCandidate.patient_name} is waiting.
            </p>

            <button
              disabled={actionLoading}
              onClick={promoteFromWaitlist}
              className="
                w-full mt-4 py-3 rounded-xl
                bg-gradient-to-r from-purple-400 to-purple-900
              text-white
                transition-all duration-300
                hover:shadow-[0_0_25px_rgba(168,85,247,0.6)]
                active:scale-95
                disabled:opacity-50
              "
            >
              Book this patient
            </button>
          </div>
        )}

        {/* Waitlist */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 text-purple-300">
            Waitlist
          </h2>

          <form onSubmit={addToWaitlist} className="space-y-3 mb-4">
            <input
              required
              placeholder="Patient name"
              className="input-dark"
              value={wlName}
              onChange={(e) => setWlName(e.target.value)}
            />

            <input
              type="email"
              placeholder="Patient email (optional)"
              className="input-dark"
              value={wlEmail}
              onChange={(e) => setWlEmail(e.target.value)}
            />

            <input
              type="datetime-local"
              required
              className="input-dark"
              value={wlTime}
              onChange={(e) => setWlTime(e.target.value)}
            />

            <button className="btn-primary w-full">
              Add to Waitlist
            </button>
          </form>

          {waitlist.length > 0 && (
            <ul className="space-y-2">
              {waitlist.map((wl) => (
                <li
                  key={wl.id}
                  className="flex justify-between items-center p-3 rounded-lg bg-neutral-800/60 hover:bg-neutral-800 transition"
                >
                  <div>
                    <p className="text-sm">{wl.patient_name}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(wl.desired_time).toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => removeFromWaitlist(wl.id)}
                    className="text-xs text-purple-400 hover:text-purple-200"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  </div>
)
}