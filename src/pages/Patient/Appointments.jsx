
import { useEffect, useState } from "react";
import axios from "axios";
import PatientNavbar from "../../components/PatientNavbar";
import "../../styles/PatientAppointments.css";

function Appointments() {
  const [user] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [clinic, setClinic] = useState(null);
  const [clinicLoading, setClinicLoading] = useState(true);

  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [symptoms, setSymptoms] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchPatientClinic();
    } else {
      setClinicLoading(false);
    }
  }, [user]);

  const fetchPatientClinic = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/users/${user.id}/clinic`
      );

      setClinic(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching patient's clinic:", err);

      setClinic(null);
      setError("Unable to retrieve your registered clinic.");
    } finally {
      setClinicLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!user) {
      setError("Please log in before booking an appointment.");
      return;
    }

    if (!clinic) {
      setError("Your registered clinic could not be found.");
      return;
    }

    if (!appointmentDate || !appointmentTime || !symptoms.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        "http://localhost:8080/api/appointments",
        {
          patientId: user.id,
          patientName: user.fullName,
          clinic: clinic.clinicName,
          appointmentDate: appointmentDate,
          appointmentTime: appointmentTime,
          symptoms: symptoms.trim()
        }
      );

      // Clear the form after successful submission
      setAppointmentDate("");
      setAppointmentTime("");
      setSymptoms("");

      // Display success modal
      setShowSuccessModal(true);

    } catch (err) {
      console.error("Error creating appointment:", err);

      setError(
        "Unable to submit appointment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-appointments-page">

      <PatientNavbar />

      <main className="patient-appointments-main">

        <div className="patient-appointments-container">

          <section className="patient-appointments-header">

            <div>
              <p className="patient-appointments-label">
                APPOINTMENTS
              </p>

              <h1>Book an Appointment</h1>

              <p>
                Request an appointment with a healthcare worker
                at your registered clinic.
              </p>
            </div>

          </section>

          {error && (
            <div className="patient-appointments-error">
              {error}
            </div>
          )}

          <section className="patient-appointment-form-section">

            <form onSubmit={handleSubmit}>

              {/* REGISTERED CLINIC */}

              <div className="patient-appointment-field">

                <label>
                  Registered Clinic
                </label>

                <div className="patient-appointment-clinic-display">
                  {clinicLoading
                    ? "Loading registered clinic..."
                    : clinic
                      ? clinic.clinicName
                      : "Clinic not found"}
                </div>

              </div>

              {/* DATE AND TIME */}

              <div className="patient-appointment-row">

                <div className="patient-appointment-field">

                  <label htmlFor="appointmentDate">
                    Preferred Date
                  </label>

                  <input
                    id="appointmentDate"
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={appointmentDate}
                    onChange={(event) =>
                      setAppointmentDate(event.target.value)
                    }
                    required
                  />

                </div>

                <div className="patient-appointment-field">

                  <label htmlFor="appointmentTime">
                    Preferred Time
                  </label>

                  <input
                    id="appointmentTime"
                    type="time"
                    value={appointmentTime}
                    onChange={(event) =>
                      setAppointmentTime(event.target.value)
                    }
                    required
                  />

                </div>

              </div>

              {/* SYMPTOMS */}

              <div className="patient-appointment-field">

                <label htmlFor="symptoms">
                  Symptoms / Reason for Visit
                </label>

                <textarea
                  id="symptoms"
                  value={symptoms}
                  onChange={(event) =>
                    setSymptoms(event.target.value)
                  }
                  placeholder="Describe your symptoms or reason for the visit"
                  rows="6"
                  required
                />

              </div>

              <button
                type="submit"
                className="patient-appointment-submit"
                disabled={loading || clinicLoading || !clinic}
              >
                {loading
                  ? "Submitting..."
                  : "Request Appointment"}
              </button>

            </form>

          </section>

        </div>

      </main>

      {/* SUCCESS MODAL */}

      {showSuccessModal && (
        <div className="appointment-success-overlay">

          <div
            className="appointment-success-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-modal-title"
          >

            <div className="appointment-success-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>

            <h2 id="success-modal-title">
              Appointment request submitted successfully.
            </h2>

            <p>
              Please wait for the healthcare worker to respond.
            </p>

            <button
              type="button"
              className="appointment-success-button"
              onClick={() => setShowSuccessModal(false)}
            >
              Thank You
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default Appointments;
