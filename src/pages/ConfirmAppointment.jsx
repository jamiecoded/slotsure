import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "../services/supabase"

export default function ConfirmAppointment() {
  const { token } = useParams()
  const [appointment, setAppointment] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAppointment()
  }, [])

  async function fetchAppointment() {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("confirmation_token", token)
      .single()

    if (!error) setAppointment(data)
    setLoading(false)
  }

  async function updateStatus(status) {
    await supabase
      .from("appointments")
      .update({ status })
      .eq("confirmation_token", token)

    fetchAppointment()
  }

  if (loading) return <p>Loading...</p>
  if (!appointment) return <p>Invalid or expired link</p>

  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-neutral-900 to-black px-6">
    <div
      className="
        w-full max-w-md
        bg-white/10 backdrop-blur-xl
        border border-white/20
        rounded-3xl p-8
        shadow-[0_20px_80px_rgba(0,0,0,0.8)]
        text-center text-white
      "
    >
      {/* Logo */}
      <img
        src="/assets/slotsure-dark.svg"
        alt="SlotSure"
        className="mx-auto h-20 mb-4"
      />

      {/* TITLE */}
      <h1 className="text-xl font-semibold tracking-wide">
        APPOINTMENT CONFIRMATION
      </h1>

      {/* PATIENT NAME */}
      <p className="mt-3 text-lg font-medium text-purple-300">
        {appointment.patient_name}
      </p>

      {/* DATE & TIME */}
      <p className="text-sm text-gray-300 mt-1">
        {new Date(appointment.appointment_time).toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </p>

      {/* HELPER TEXT */}
      <p className="text-sm text-gray-400 mt-4">
        Please confirm your appointment to <br /> help us prepare better for you.
      </p>

      {/* STATUS FEEDBACK */}
      {appointment.status === "confirmed" && (
        <p className="mt-5 text-green-400 font-medium">
          Your appointment has been confirmed.
        </p>
      )}

      {appointment.status === "cancelled" && (
        <p className="mt-5 text-red-400 font-medium">
          Your appointment has been cancelled.
        </p>
      )}

      {appointment.status === "completed" && (
        <p className="mt-5 text-purple-400 font-medium">
          Your appointment was successfully completed.
        </p>
      )}

      {/* ACTION BUTTONS */}
      {(appointment.status === "scheduled" ||
        appointment.status === "at_risk") && (
        <div className="mt-8 flex gap-4 justify-center">
          <button
            onClick={() => updateStatus("confirmed")}
            className="
              px-5 py-2 rounded-full
              bg-gradient-to-r from-purple-600 to-purple-500
              hover:from-purple-500 hover:to-purple-400
              transition-all duration-300
              hover:shadow-[0_0_25px_rgba(168,85,247,0.7)]
              active:scale-95
            "
          >
            Confirm
          </button>

          <button
            onClick={() => updateStatus("cancelled")}
            className="
              px-5 py-2 rounded-full
              border border-red-500
              text-red-400
              hover:bg-red-600 hover:text-white
              transition-all duration-300
              active:scale-95
            "
          >
            Cancel
          </button>
        </div>
      )}

      {/* FOOTER */}
      <p className="text-xs text-gray-500 mt-8">
        Powered by SlotSure
      </p>
    </div>
  </div>
)
}