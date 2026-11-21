
import { useEffect, useState } from "react";
import axios from "axios";
import PatientNavbar from "../../components/PatientNavbar";
import "../../styles/PatientDashboard.css";

function PatientDashboard() {
  const [user] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const patientName = user?.fullName || "Patient";

  const clinicName =
    typeof user?.clinic === "string"
      ? user.clinic
      : user?.clinic?.name ||
        user?.clinic?.clinicName ||
        "Not selected";

  // Fetch patient appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user?.id) {
        setError("Patient information could not be found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/api/appointments/patient/${user.id}`
        );

        setAppointments(
          Array.isArray(response.data) ? response.data : []
        );
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError(
          err.response?.data?.message ||
            "Unable to load appointments. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user?.id]);

  // Get today's date in local time
  const now = new Date();

  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0")
  ].join("-");

  // Normalise appointment status
  const getStatus = (appointment) =>
    (appointment.status || "PENDING")
      .toUpperCase()
      .replace(/[\s-]+/g, "_");

  // Upcoming appointments
  const upcomingAppointments = appointments.filter((appointment) => {
    const status = getStatus(appointment);

    return (
      appointment.appointmentDate >= today &&
      ![
        "COMPLETED",
        "ATTENDED",
        "CANCELLED",
        "SKIPPED",
        "MISSED",
        "NO_SHOW"
      ].includes(status)
    );
  });

  // Previously attended appointments
  const attendedAppointments = appointments.filter((appointment) =>
    ["COMPLETED", "ATTENDED"].includes(getStatus(appointment))
  );

  // Skipped appointments
  const skippedAppointments = appointments.filter((appointment) =>
    ["SKIPPED", "MISSED", "NO_SHOW"].includes(getStatus(appointment))
  );

  // Sort appointments by date and time
  const sortAppointments = (list) =>
    [...list].sort((a, b) => {
      const dateA = new Date(
        `${a.appointmentDate || "2000-01-01"}T${a.appointmentTime || "00:00"}`
      );

      const dateB = new Date(
        `${b.appointmentDate || "2000-01-01"}T${b.appointmentTime || "00:00"}`
      );

      return dateA - dateB;
    });

  // Format appointment date
  const formatDate = (date) => {
    if (!date) return "Not provided";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-ZA", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  // Format appointment status
  const formatStatus = (status) =>
    (status || "PENDING")
      .replace(/[_-]+/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());

  // Get appointments for selected category
  const getSelectedAppointments = () => {
    if (selectedCategory === "upcoming") {
      return sortAppointments(upcomingAppointments);
    }

    if (selectedCategory === "attended") {
      return sortAppointments(attendedAppointments);
    }

    if (selectedCategory === "skipped") {
      return sortAppointments(skippedAppointments);
    }

    if (selectedCategory === "total") {
      return sortAppointments(appointments);
    }

    return [];
  };

  // Modal headings and descriptions
  const categoryDetails = {
    upcoming: {
      title: "Upcoming Appointments",
      description: "Your scheduled and pending clinic visits."
    },
    attended: {
      title: "Previously Attended",
      description: "Appointments you have already attended."
    },
    skipped: {
      title: "Skipped Appointments",
      description: "Appointments marked as missed or skipped."
    },
    total: {
      title: "All Appointments",
      description: "Your complete appointment history."
    }
  };

  const selectedAppointments = getSelectedAppointments();

  return (
    <div className="patient-dashboard">
      <PatientNavbar />

      <main className="dashboard-main">
        <div className="dashboard-container">

          {/* Dashboard heading */}
          <section className="dashboard-top">
            <div>
              <p className="dashboard-label">PATIENT DASHBOARD</p>

              <h1>Good day, {patientName}</h1>

              <p>
                Manage your healthcare information and clinic services.
              </p>
            </div>

            <div className="clinic-information">
              <span className="clinic-indicator"></span>

              <div>
                <small>MY CLINIC</small>
                <strong>{clinicName}</strong>
              </div>
            </div>
          </section>

          {/* Appointment Overview */}
          <section className="statistics-section">
            <div className="statistics-heading">
              <div>
                <h2>Appointment Overview</h2>
                <p>Select a category to view your appointments.</p>
              </div>
            </div>

            <div className="summary-section">

              {/* Upcoming */}
              <button
                type="button"
                className="summary-item summary-upcoming"
                onClick={() => setSelectedCategory("upcoming")}
              >
                <div className="summary-card-top">
                  <span>Upcoming</span>
                  <span className="summary-icon">◷</span>
                </div>

                <strong>
                  {loading ? "..." : upcomingAppointments.length}
                </strong>

                <small>View upcoming appointments →</small>
              </button>

              {/* Previously Attended */}
              <button
                type="button"
                className="summary-item summary-attended"
                onClick={() => setSelectedCategory("attended")}
              >
                <div className="summary-card-top">
                  <span>Previously Attended</span>
                  <span className="summary-icon">✓</span>
                </div>

                <strong>
                  {loading ? "..." : attendedAppointments.length}
                </strong>

                <small>View attended appointments →</small>
              </button>

              {/* Skipped */}
              <button
                type="button"
                className="summary-item summary-skipped"
                onClick={() => setSelectedCategory("skipped")}
              >
                <div className="summary-card-top">
                  <span>Skipped</span>
                  <span className="summary-icon">×</span>
                </div>

                <strong>
                  {loading ? "..." : skippedAppointments.length}
                </strong>

                <small>View skipped appointments →</small>
              </button>

              {/* Total Appointments */}
              <button
                type="button"
                className="summary-item summary-total"
                onClick={() => setSelectedCategory("total")}
              >
                <div className="summary-card-top">
                  <span>Total Appointments</span>
                  <span className="summary-icon">▦</span>
                </div>

                <strong>
                  {loading ? "..." : appointments.length}
                </strong>

                <small>View all appointments →</small>
              </button>

            </div>
          </section>

          {/* Appointment Details Modal */}
          {selectedCategory && (
            <div
              className="appointment-modal-overlay"
              onClick={() => setSelectedCategory(null)}
            >
              <div
                className="appointment-modal"
                onClick={(event) => event.stopPropagation()}
              >

                {/* Modal Header */}
                <div className="appointment-modal-header">
                  <div>
                    <h2>
                      {categoryDetails[selectedCategory].title}
                    </h2>

                    <p>
                      {categoryDetails[selectedCategory].description}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="appointment-modal-close"
                    onClick={() => setSelectedCategory(null)}
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>

                {/* Modal Body */}
                <div className="appointment-modal-body">

                  {loading ? (
                    <div className="activity-empty">
                      Loading appointments...
                    </div>
                  ) : error ? (
                    <div className="dashboard-error">
                      {error}
                    </div>
                  ) : selectedAppointments.length === 0 ? (
                    <div className="activity-empty">
                      <div className="empty-icon">▣</div>

                      <h3>No appointments found</h3>

                      <p>
                        There are currently no appointments in this category.
                      </p>
                    </div>
                  ) : (
                    <div className="appointments-list">

                      {selectedAppointments.map((appointment) => (
                        <div
                          className="appointment-card"
                          key={appointment.id}
                        >

                          <div className="appointment-card-header">
                            <h3>
                              Appointment #{appointment.id}
                            </h3>

                            <span
                              className={`appointment-status status-${getStatus(
                                appointment
                              ).toLowerCase()}`}
                            >
                              {formatStatus(appointment.status)}
                            </span>
                          </div>

                          <div className="appointment-details-grid">

                            <p>
                              <strong>Date</strong>
                              <span>
                                {formatDate(appointment.appointmentDate)}
                              </span>
                            </p>

                            <p>
                              <strong>Time</strong>
                              <span>
                                {appointment.appointmentTime || "Not specified"}
                              </span>
                            </p>

                            <p>
                              <strong>Clinic</strong>
                              <span>
                                {appointment.clinic || clinicName}
                              </span>
                            </p>

                            <p>
                              <strong>Speciality</strong>
                              <span>
                                {appointment.speciality || "Not specified"}
                              </span>
                            </p>

                          </div>

                          <div className="appointment-description">
                            <p>
                              <strong>Symptoms:</strong>{" "}
                              {appointment.symptoms || "Not provided"}
                            </p>
                          </div>

                          <div className="appointment-staff">
                            <p>
                              <strong>Assigned Nurse:</strong>{" "}
                              {appointment.assignedNurseName || "Not yet assigned"}
                            </p>

                            <p>
                              <strong>Assigned Doctor:</strong>{" "}
                              {appointment.assignedDoctorName || "Not yet assigned"}
                            </p>
                          </div>

                          {appointment.nurseAssessment && (
                            <p>
                              <strong>Nurse Assessment:</strong>{" "}
                              {appointment.nurseAssessment}
                            </p>
                          )}

                          {appointment.vitalSigns && (
                            <p>
                              <strong>Vital Signs:</strong>{" "}
                              {appointment.vitalSigns}
                            </p>
                          )}

                          {appointment.referralReason && (
                            <p>
                              <strong>Referral Information:</strong>{" "}
                              {appointment.referralReason}
                            </p>
                          )}

                          {appointment.workerResponse && (
                            <p>
                              <strong>Clinic Response:</strong>{" "}
                              {appointment.workerResponse}
                            </p>
                          )}

                        </div>
                      ))}

                    </div>
                  )}

                </div>

                {/* Modal Footer */}
                <div className="appointment-modal-footer">
                  <span>
                    {loading
                      ? " "
                      : `${selectedAppointments.length} appointment(s)`}
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelectedCategory(null)}
                  >
                    Close
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default PatientDashboard;
