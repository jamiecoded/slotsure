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
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="bg-white p-6 rounded max-w-sm w-full text-center">

      {/* TITLE */}
      <h1 className="text-lg font-semibold">
        Appointment Confirmation
      </h1>

      {/* PATIENT NAME */}
      <p className="mt-2 font-medium">
        {appointment.patient_name}
      </p>

      {/* 👉 DATE & TIME (THIS IS THE DATE/TIME YOU ASKED ABOUT) */}
      <p className="text-sm text-gray-600 mt-1">
        {new Date(appointment.appointment_time).toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </p>

      {/* HELPER TEXT */}
      <p className="text-sm text-gray-600 mt-2">
        Please confirm your appointment to help us prepare better for you.
      </p>

      {/* STATUS FEEDBACK (AFTER ACTION) */}
      {appointment.status === "confirmed" && (
        <p className="mt-4 text-green-600">
          Your appointment has been confirmed.
        </p>
      )}

      {appointment.status === "cancelled" && (
        <p className="mt-4 text-red-600">
          Your appointment has been cancelled.
        </p>
      )}

      {appointment.status === "completed" && (
        <p className="mt-4 text-blue-600">
          Your appointment was sucessfully completed.
        </p>
      )}

      {/* 👉 ACTION BUTTONS (ONLY WHEN ALLOWED) */}
      {appointment.status === "scheduled" ||
      appointment.status === "at_risk" ? (
        <div className="mt-6 flex gap-3 justify-center">
          <button
            onClick={() => updateStatus("confirmed")}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Confirm
          </button>

          <button
            onClick={() => updateStatus("cancelled")}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Cancel
          </button>
        </div>
      ) : null}

    </div>
  </div>
)
}