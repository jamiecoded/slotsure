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

  useEffect(() => {
    if (!session) {
      navigate("/")
      return
    }
    fetchAppointments()
  }, [session])

  function isAtRisk(appointmentTime) {
  const now = new Date()
  const apptTime = new Date(appointmentTime)
  const diffInHours = (apptTime - now) / (1000 * 60 * 60)

  return diffInHours <= 24 && diffInHours > 0
}


  async function fetchAppointments() {
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .order("appointment_time", { ascending: true })

  if (error) return

  setAppointments(data)

  // Auto-mark at-risk appointments
  data.forEach((appt) => {
    if (
      appt.status === "scheduled" &&
      isAtRisk(appt.appointment_time)
    ) {
      updateStatus(appt.id, "at_risk")
    }
  })
}

  function generateToken() {
  return crypto.randomUUID()
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
  if (error.code === "23505") {
    alert("This time slot is already booked. Please choose another time.")
  } else {
    alert(error.message)
  }
}

    setLoading(false)
  }

  async function updateStatus(id, newStatus) {
  const { error } = await supabase
    .from("appointments")
    .update({ status: newStatus })
    .eq("id", id)

  if (!error) fetchAppointments()
  else alert(error.message)
}


  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <button
          onClick={() => supabase.auth.signOut()}
          className="bg-black text-white text-sm px-4 py-2 border rounded hover:bg-white hover:text-black hover:border-black hover:cursor-pointer"
          >
          Logout
        </button>
      </div>


      {/* Create Appointment */}
      <form
        onSubmit={createAppointment}
        className="mt-6 bg-white p-4 rounded-lg border space-y-3 max-w-xl"
      >
        <h2 className="font-semibold">New Appointment</h2>

        <input
          required
          className="w-full border rounded px-3 py-2"
          placeholder="Patient name"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
        />

        <input
          type="email"
          className="w-full border rounded px-3 py-2"
          placeholder="Patient email (optional)"
          value={patientEmail}
          onChange={(e) => setPatientEmail(e.target.value)}
        />

        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Service (optional)"
          value={service}
          onChange={(e) => setService(e.target.value)}
        />

        <input
          type="datetime-local"
          required
          className="w-full border rounded px-3 py-2"
          value={appointmentTime}
          onChange={(e) => setAppointmentTime(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-4 py-2 border rounded disabled:opacity-60  hover:bg-white hover:text-black hover:border-black hover:cursor-pointer"
        >
          {loading ? "Creating..." : "Create Appointment"}
        </button>
      </form>

      {/* Appointments List */}
      <div className="mt-8 max-w-xl">
        {appointments.length === 0 ? (
          <p className="text-gray-500">No appointments yet</p>
        ) : (
          <ul className="space-y-2">
  {appointments.map((appt) => (
    <li
      key={appt.id}
      className={`border rounded p-4 flex justify-between items-center
    ${
      appt.status === "at_risk"
        ? "bg-orange-50 border-orange-300"
        : "bg-white"
    }`}
    >
      <div>
        <p className="font-medium">{appt.patient_name}</p>
        <p className="text-sm text-gray-600">
          {new Date(appt.appointment_time).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
        <p className="text-xs uppercase text-gray-400">
          {appt.status}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Confirmation link:
        </p>
        <input
          readOnly
          className="text-xs w-full border rounded px-2 py-1 mt-1"
          value={`${window.location.origin}/confirm/${appt.confirmation_token}`}
        />

      </div>

      <div className="flex gap-2">
        {(appt.status === "scheduled" ||
          appt.status === "at_risk") && (
          <button
            onClick={() => updateStatus(appt.id, "confirmed")}
            className="text-sm px-3 py-1 border rounded hover:bg-gray-100"
          >
            Confirm
          </button>
        )}

        {appt.status !== "cancelled" &&
          appt.status !== "completed" && (
            <button
              onClick={() => updateStatus(appt.id, "cancelled")}
              className="text-sm px-3 py-1 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
          )}

        {appt.status === "confirmed" && (
          <button
            onClick={() => updateStatus(appt.id, "completed")}
            className="text-sm px-3 py-1 border rounded hover:bg-gray-100"
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
  )
}
