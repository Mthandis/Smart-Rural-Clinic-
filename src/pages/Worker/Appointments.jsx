
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/WorkerAppointments.css";
import WorkerNavbar from "../../components/WorkerNavbar";
import ReactMarkdown from "react-markdown";

const API_URL = "http://localhost:8080";

const Appointments = () => {
  const [worker, setWorker] = useState(null);

  const [appointments, setAppointments] = useState([]);
  const [myAppointments, setMyAppointments] = useState([]);
  const [attendedAppointments, setAttendedAppointments] = useState([]);

  const [activeTab, setActiveTab] = useState("available");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [attendedStatusFilter, setAttendedStatusFilter] =
    useState("ALL");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);

  const [vitalSigns, setVitalSigns] = useState("");
  const [nurseAssessment, setNurseAssessment] = useState("");
  const [nurseObservations, setNurseObservations] = useState("");
  const [referralReason, setReferralReason] = useState("");
  const [nurseOutcome, setNurseOutcome] = useState("");

  // AI ASSISTANCE STATE
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState("");

  const isNurse =
    worker?.role?.toUpperCase() === "NURSE";

  const isDoctor =
    worker?.role?.toUpperCase() === "DOCTOR";

  /* =========================
     LOAD WORKER
  ========================= */

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setWorker(JSON.parse(storedUser));
      } catch (error) {
        console.error("Unable to read logged-in user.", error);
      }
    }
  }, []);

  /* =========================
     LOAD DATA
  ========================= */

  useEffect(() => {
    if (!worker?.id) {
      return;
    }

    loadAppointments();
  }, [worker, activeTab]);

  const loadAppointments = async () => {
    setLoading(true);
    setError("");

    try {
      if (activeTab === "available") {
        await loadAvailableAppointments();
      }

      if (activeTab === "my") {
        await loadMyAppointments();
      }

      if (activeTab === "attended" && isNurse) {
        await loadAttendedAppointments();
      }
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          error.response?.data ||
          "Unable to load appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     AVAILABLE APPOINTMENTS
  ========================= */

  const loadAvailableAppointments = async () => {
    const response = await axios.get(
      `${API_URL}/api/appointments/status/PENDING`
    );

    setAppointments(response.data || []);
  };

  /* =========================
     MY APPOINTMENTS
  ========================= */

  const loadMyAppointments = async () => {
    const endpoint = isNurse
      ? `${API_URL}/api/appointments/nurse/${worker.id}/assigned`
      : `${API_URL}/api/appointments/doctor/${worker.id}/assigned`;

    const response = await axios.get(endpoint);

    setMyAppointments(response.data || []);
  };

  /* =========================
     ATTENDED APPOINTMENTS
  ========================= */

  const loadAttendedAppointments = async () => {
    try {
      const [
        completedResponse,
        doctorReferralResponse,
        clinicReferralResponse
      ] = await Promise.all([
        axios.get(
          `${API_URL}/api/appointments/status/COMPLETED`
        ),

        axios.get(
          `${API_URL}/api/appointments/status/REFERRED_DOCTOR`
        ),

        axios.get(
          `${API_URL}/api/appointments/status/REFERRED_CLINIC`
        )
      ]);

      const completedAppointments =
        (completedResponse.data || []).filter(
          (appointment) =>
            appointment.assignedNurseId === worker.id
        );

      const doctorReferralAppointments =
        (doctorReferralResponse.data || []).filter(
          (appointment) =>
            appointment.assignedNurseId === worker.id
        );

      const clinicReferralAppointments =
        (clinicReferralResponse.data || []).filter(
          (appointment) =>
            appointment.assignedNurseId === worker.id
        );

      const allAttendedAppointments = [
        ...completedAppointments,
        ...doctorReferralAppointments,
        ...clinicReferralAppointments
      ];

      setAttendedAppointments(allAttendedAppointments);

    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  /* =========================
     FILTERS
  ========================= */

  const filterAppointments = (appointmentList) => {
    return appointmentList.filter((appointment) => {
      const patientName =
        appointment.patientName?.toLowerCase() || "";

      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        patientName.includes(search);

      const matchesDate =
        selectedDate === "" ||
        appointment.appointmentDate === selectedDate;

      return matchesSearch && matchesDate;
    });
  };

  const filteredAppointments =
    filterAppointments(appointments);

  const filteredMyAppointments =
    filterAppointments(myAppointments);

  const filteredAttendedAppointments =
    attendedAppointments
      .filter((appointment) => {
        if (attendedStatusFilter === "ALL") {
          return true;
        }

        return appointment.status === attendedStatusFilter;
      })
      .filter((appointment) => {
        const patientName =
          appointment.patientName?.toLowerCase() || "";

        const search = searchTerm.toLowerCase().trim();

        const matchesSearch =
          patientName.includes(search);

        const matchesDate =
          selectedDate === "" ||
          appointment.appointmentDate === selectedDate;

        return matchesSearch && matchesDate;
      })
      .sort(
        (a, b) =>
          new Date(
            `${b.appointmentDate}T${b.appointmentTime}`
          ) -
          new Date(
            `${a.appointmentDate}T${a.appointmentTime}`
          )
      );

  /* =========================
     CLEAR FILTERS
  ========================= */

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDate("");
    setAttendedStatusFilter("ALL");
  };

  /* =========================
     TAB CHANGE
  ========================= */

  const handleTabChange = (tab) => {
    setActiveTab(tab);

    setSearchTerm("");
    setSelectedDate("");
    setAttendedStatusFilter("ALL");

    setError("");
  };

  /* =========================
     ASSIGN APPOINTMENT
  ========================= */

  const handleAssignAppointment = async () => {
    if (!selectedAppointment || !worker?.id) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (isNurse) {
        await axios.put(
          `${API_URL}/api/appointments/${selectedAppointment.id}/assign-nurse`,
          null,
          {
            params: {
              nurseId: worker.id
            }
          }
        );
      } else {
        await axios.put(
          `${API_URL}/api/appointments/${selectedAppointment.id}/assign`,
          null,
          {
            params: {
              doctorId: worker.id
            }
          }
        );
      }

      setShowDetailsModal(false);
      setSelectedAppointment(null);

      await loadAvailableAppointments();
      await loadMyAppointments();

      setActiveTab("my");

    } catch (error) {
      console.error(error);

      setShowDetailsModal(false);
      setSelectedAppointment(null);

      setError(
        error.response?.data?.message ||
          error.response?.data ||
          "Unable to assign appointment."
      );

    } finally {
      setLoading(false);
    }
  };

  /* =========================
     OPEN APPOINTMENT DETAILS
  ========================= */

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  /* =========================
     START NURSE ASSESSMENT
  ========================= */

  const handleStartAssessment = (appointment) => {
    setSelectedAppointment(appointment);

    setVitalSigns("");
    setNurseAssessment("");
    setNurseObservations("");
    setReferralReason("");
    setNurseOutcome("");

    setAiSuggestions("");
    setAiError("");
    setAiLoading(false);

    setShowAssessmentModal(true);
  };

  /* =========================
     GENERATE OPTIONAL AI
     NURSE ASSISTANCE
  ========================= */

  const handleGetAIAssistance = async () => {
    if (!selectedAppointment) {
      setAiError("No appointment has been selected.");
      return;
    }

    if (!selectedAppointment.patientId) {
      setAiError(
        "The patient ID is missing from this appointment."
      );
      return;
    }

    if (
      !selectedAppointment.symptoms?.trim() &&
      !vitalSigns.trim() &&
      !nurseObservations.trim()
    ) {
      setAiError(
        "Please provide symptoms, vital signs or additional observations before requesting AI assistance."
      );
      return;
    }

    try {
      setAiLoading(true);
      setAiError("");
      setAiSuggestions("");

      const response = await axios.post(
        `${API_URL}/api/medical-records/nurse-assistance/${selectedAppointment.patientId}`,
        {
          symptoms: selectedAppointment.symptoms || "",
          vitalSigns: vitalSigns,
          nurseObservations: nurseObservations
        }
      );

      const suggestions = response.data?.suggestions;

      if (!suggestions) {
        throw new Error(
          "The AI service returned an empty response."
        );
      }

      setAiSuggestions(suggestions);

    } catch (error) {
      console.error("AI nurse assistance error:", error);

      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        (typeof error.response?.data === "string"
          ? error.response.data
          : null) ||
        error.message ||
        "Unable to generate AI suggestions.";

      setAiError(errorMessage);

    } finally {
      setAiLoading(false);
    }
  };

  /* =========================
     SUBMIT NURSE ASSESSMENT
  ========================= */

  const handleSubmitNurseAssessment = async () => {
    if (!selectedAppointment) {
      return;
    }

    if (!nurseAssessment.trim()) {
      alert("Please enter the nurse assessment.");
      return;
    }

    if (!nurseOutcome) {
      alert("Please select an outcome.");
      return;
    }

    if (
      (nurseOutcome === "REFERRED_DOCTOR" ||
        nurseOutcome === "REFERRED_CLINIC") &&
      !referralReason.trim()
    ) {
      alert("Please enter the referral reason.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await axios.put(
        `${API_URL}/api/appointments/${selectedAppointment.id}/nurse-assessment`,
        null,
        {
          params: {
            nurseId: worker.id,
            outcome: nurseOutcome,
            vitalSigns: vitalSigns,
            nurseAssessment: nurseAssessment,
            referralReason: referralReason
          }
        }
      );

      setShowAssessmentModal(false);
      setSelectedAppointment(null);

      setVitalSigns("");
      setNurseAssessment("");
      setNurseObservations("");
      setReferralReason("");
      setNurseOutcome("");

      setAiSuggestions("");
      setAiError("");

      await loadMyAppointments();
      await loadAttendedAppointments();

      setActiveTab("attended");

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          error.response?.data ||
          "Unable to submit nurse assessment."
      );

    } finally {
      setLoading(false);
    }
  };

  /* =========================
     DOCTOR START CONSULTATION
  ========================= */

  const handleStartConsultation = async (appointment) => {
    try {
      setLoading(true);
      setError("");

      await axios.put(
        `${API_URL}/api/appointments/${appointment.id}/status`,
        null,
        {
          params: {
            status: "IN_PROGRESS"
          }
        }
      );

      await loadMyAppointments();

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          error.response?.data ||
          "Unable to start consultation."
      );

    } finally {
      setLoading(false);
    }
  };

  /* =========================
     CLOSE MODALS
  ========================= */

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedAppointment(null);
  };

  const closeAssessmentModal = () => {
    setShowAssessmentModal(false);
    setSelectedAppointment(null);

    setVitalSigns("");
    setNurseAssessment("");
    setNurseObservations("");
    setReferralReason("");
    setNurseOutcome("");

    setAiSuggestions("");
    setAiError("");
    setAiLoading(false);
  };

  /* =========================
     STATUS LABEL
  ========================= */

  const getStatusLabel = (status) => {
    switch (status) {
      case "PENDING":
        return "Pending";

      case "CONFIRMED":
        return "Assigned";

      case "IN_PROGRESS":
        return "In Progress";

      case "COMPLETED":
        return "Completed";

      case "REFERRED_DOCTOR":
        return "Referred to Doctor";

      case "REFERRED_CLINIC":
        return "Referred to Another Clinic";

      default:
        return status || "Unknown";
    }
  };

  /* =========================
     RENDER TABLE
  ========================= */

  const renderAppointmentTable = (
    appointmentList,
    type
  ) => {
    if (appointmentList.length === 0) {
      return (
        <div className="worker-appointments-empty">
          <p>No appointments found.</p>
        </div>
      );
    }

    return (
      <div className="worker-appointments-table-container">
        <table className="worker-appointments-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date</th>
              <th>Time</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {appointmentList.map((appointment) => (
              <tr key={appointment.id}>
                <td>
                  <strong>
                    {appointment.patientName ||
                      "Unknown Patient"}
                  </strong>
                </td>

                <td>
                  {appointment.appointmentDate || "-"}
                </td>

                <td>
                  {appointment.appointmentTime || "-"}
                </td>

                <td>
                  {appointment.symptoms || "-"}
                </td>

                <td>
                  <span
                    className={`worker-appointment-status status-${appointment.status?.toLowerCase()}`}
                  >
                    {getStatusLabel(appointment.status)}
                  </span>
                </td>

                <td>
                  {type === "available" && (
                    <button
                      type="button"
                      className="worker-appointment-action-button"
                      onClick={() =>
                        handleViewAppointment(appointment)
                      }
                    >
                      View
                    </button>
                  )}

                  {type === "my" && isNurse && (
                    <button
                      type="button"
                      className="worker-appointment-action-button"
                      onClick={() =>
                        handleStartAssessment(appointment)
                      }
                    >
                      Start Assessment
                    </button>
                  )}

                  {type === "my" &&
                    isDoctor &&
                    appointment.status === "CONFIRMED" && (
                      <button
                        type="button"
                        className="worker-appointment-action-button"
                        onClick={() =>
                          handleStartConsultation(appointment)
                        }
                      >
                        Start Consultation
                      </button>
                    )}

                  {type === "my" &&
                    appointment.status === "IN_PROGRESS" &&
                    isNurse && (
                      <button
                        type="button"
                        className="worker-appointment-action-button"
                        onClick={() =>
                          handleStartAssessment(appointment)
                        }
                      >
                        Continue Assessment
                      </button>
                    )}

                  {type === "attended" && (
                    <button
                      type="button"
                      className="worker-appointment-action-button"
                      onClick={() =>
                        handleViewAppointment(appointment)
                      }
                    >
                      View
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  /* =========================
     APPOINTMENT COUNTS
  ========================= */

  const availableCount = appointments.length;

  const myAppointmentsCount = myAppointments.length;

  const attendedCount = attendedAppointments.length;

  const completedCount =
    attendedAppointments.filter(
      (appointment) =>
        appointment.status === "COMPLETED"
    ).length;

  const referredDoctorCount =
    attendedAppointments.filter(
      (appointment) =>
        appointment.status === "REFERRED_DOCTOR"
    ).length;

  const referredClinicCount =
    attendedAppointments.filter(
      (appointment) =>
        appointment.status === "REFERRED_CLINIC"
    ).length;

  /* =========================
     PAGE
  ========================= */

  return (
    <div className="worker-appointments-page">

      <WorkerNavbar />

      {/* PAGE HEADER */}

      <div className="worker-appointments-header">
        <div>
          <h1>Appointments</h1>

          <p>
            Manage patient appointments and consultations.
          </p>
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="worker-appointments-error">
          {typeof error === "string"
            ? error
            : "Something went wrong. Please try again."}
        </div>
      )}

      {/* TABS */}

      <div className="worker-appointments-tabs">

        <button
          type="button"
          className={activeTab === "available" ? "active" : ""}
          onClick={() => handleTabChange("available")}
        >
          Available Appointments ({availableCount})
        </button>

        <button
          type="button"
          className={activeTab === "my" ? "active" : ""}
          onClick={() => handleTabChange("my")}
        >
          My Appointments ({myAppointmentsCount})
        </button>

        {isNurse && (
          <button
            type="button"
            className={activeTab === "attended" ? "active" : ""}
            onClick={() => handleTabChange("attended")}
          >
            Attended Appointments ({attendedCount})
          </button>
        )}

      </div>

      {/* FILTERS */}

      <section className="worker-appointments-filters">

        <div className="worker-appointments-search">
          <label htmlFor="appointmentSearch">
            Search Patient
          </label>

          <input
            id="appointmentSearch"
            type="text"
            placeholder="Search by patient name"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>

        <div className="worker-appointments-date-filter">
          <label htmlFor="appointmentDateFilter">
            Filter by Date
          </label>

          <input
            id="appointmentDateFilter"
            type="date"
            value={selectedDate}
            onChange={(event) =>
              setSelectedDate(event.target.value)
            }
          />
        </div>

        {/* STATUS FILTER */}

        {activeTab === "attended" && isNurse && (
          <div className="worker-appointments-date-filter">
            <label htmlFor="appointmentStatusFilter">
              Filter by Status
            </label>

            <select
              id="appointmentStatusFilter"
              value={attendedStatusFilter}
              onChange={(event) =>
                setAttendedStatusFilter(event.target.value)
              }
            >
              <option value="ALL">
                All ({attendedCount})
              </option>

              <option value="COMPLETED">
                Completed ({completedCount})
              </option>

              <option value="REFERRED_DOCTOR">
                Referred to Doctor ({referredDoctorCount})
              </option>

              <option value="REFERRED_CLINIC">
                Referred to Another Clinic ({referredClinicCount})
              </option>
            </select>
          </div>
        )}

        {(searchTerm ||
          selectedDate ||
          attendedStatusFilter !== "ALL") && (
          <button
            type="button"
            className="worker-appointments-clear-button"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        )}

      </section>

      {/* CONTENT */}

      <section className="worker-appointments-content">

        {loading ? (
          <div className="worker-appointments-loading">
            Loading appointments...
          </div>
        ) : (
          <>
            {activeTab === "available" && (
              <>
                <div className="worker-appointments-section-header">
                  <div>
                    <h2>Available Appointments</h2>
                    <p>
                      Appointments waiting to be assigned.
                    </p>
                  </div>
                </div>

                {renderAppointmentTable(
                  filteredAppointments,
                  "available"
                )}
              </>
            )}

            {activeTab === "my" && (
              <>
                <div className="worker-appointments-section-header">
                  <div>
                    <h2>My Appointments</h2>
                    <p>
                      Appointments currently assigned to you.
                    </p>
                  </div>
                </div>

                {renderAppointmentTable(
                  filteredMyAppointments,
                  "my"
                )}
              </>
            )}

            {activeTab === "attended" && isNurse && (
              <>
                <div className="worker-appointments-section-header">
                  <div>
                    <h2>Attended Appointments</h2>
                    <p>
                      Appointments you have already attended.
                    </p>
                  </div>
                </div>

                {renderAppointmentTable(
                  filteredAttendedAppointments,
                  "attended"
                )}
              </>
            )}
          </>
        )}

      </section>

      {/* =========================
          APPOINTMENT DETAILS MODAL
      ========================= */}

      {showDetailsModal && selectedAppointment && (
        <div className="worker-appointments-modal-overlay">

          <div className="worker-appointments-modal">

            <div className="worker-appointments-modal-header">
              <h2>Appointment Details</h2>

              <button
                type="button"
                onClick={closeDetailsModal}
              >
                ×
              </button>
            </div>

            <div className="worker-appointments-modal-body">

              <div className="appointment-detail-row">
                <strong>Patient</strong>
                <span>
                  {selectedAppointment.patientName || "-"}
                </span>
              </div>

              <div className="appointment-detail-row">
                <strong>Clinic</strong>
                <span>
                  {selectedAppointment.clinic || "-"}
                </span>
              </div>

              <div className="appointment-detail-row">
                <strong>Date</strong>
                <span>
                  {selectedAppointment.appointmentDate || "-"}
                </span>
              </div>

              <div className="appointment-detail-row">
                <strong>Time</strong>
                <span>
                  {selectedAppointment.appointmentTime || "-"}
                </span>
              </div>

              <div className="appointment-detail-row">
                <strong>Symptoms / Reason</strong>
                <span>
                  {selectedAppointment.symptoms || "-"}
                </span>
              </div>

              <div className="appointment-detail-row">
                <strong>Status</strong>
                <span>
                  {getStatusLabel(selectedAppointment.status)}
                </span>
              </div>

              {selectedAppointment.nurseAssessment && (
                <div className="appointment-detail-section">
                  <h3>Nurse Assessment</h3>
                  <p>{selectedAppointment.nurseAssessment}</p>
                </div>
              )}

              {selectedAppointment.vitalSigns && (
                <div className="appointment-detail-section">
                  <h3>Vital Signs</h3>
                  <p>{selectedAppointment.vitalSigns}</p>
                </div>
              )}

              {selectedAppointment.referralReason && (
                <div className="appointment-detail-section">
                  <h3>Referral Reason</h3>
                  <p>{selectedAppointment.referralReason}</p>
                </div>
              )}

            </div>

            <div className="worker-appointments-modal-footer">

              {activeTab === "available" && (
                <button
                  type="button"
                  className="worker-appointment-primary-button"
                  onClick={handleAssignAppointment}
                  disabled={loading}
                >
                  {isNurse ? "Assign to Me" : "Take Appointment"}
                </button>
              )}

              <button
                type="button"
                className="worker-appointment-secondary-button"
                onClick={closeDetailsModal}
              >
                Close
              </button>

            </div>

          </div>
        </div>
      )}

      {/* =========================
          NURSE ASSESSMENT MODAL
      ========================= */}

      {showAssessmentModal && selectedAppointment && (
        <div className="worker-appointments-modal-overlay">

          <div className="worker-appointments-modal worker-appointments-assessment-modal">

            <div className="worker-appointments-modal-header">

              <div>
                <h2>Nurse Assessment</h2>

                <p>
                  Patient:{" "}
                  <strong>
                    {selectedAppointment.patientName}
                  </strong>
                </p>
              </div>

              <button
                type="button"
                onClick={closeAssessmentModal}
              >
                ×
              </button>

            </div>

            <div className="worker-appointments-modal-body">

              {/* PATIENT REASON */}

              <div className="appointment-detail-section">
                <h3>Patient's Reason</h3>

                <p>
                  {selectedAppointment.symptoms ||
                    "No symptoms/reason provided."}
                </p>
              </div>

              {/* VITAL SIGNS */}

              <div className="worker-appointments-form-group">
                <label>Vital Signs</label>

                <textarea
                  value={vitalSigns}
                  onChange={(event) =>
                    setVitalSigns(event.target.value)
                  }
                  placeholder="Enter patient's vital signs"
                  rows="3"
                />
              </div>

              {/* ADDITIONAL OBSERVATIONS FOR AI */}

              <div className="worker-appointments-form-group">
                <label>
                  Additional Observations (Optional)
                </label>

                <textarea
                  value={nurseObservations}
                  onChange={(event) =>
                    setNurseObservations(event.target.value)
                  }
                  placeholder="Enter any additional patient observations to provide context for the optional AI assistance."
                  rows="3"
                />
              </div>

              {/* OPTIONAL AI CLINICAL ASSISTANCE */}

              <div className="nurse-ai-assistance">

                <div className="nurse-ai-assistance-header">
                  <div>
                    <h3>AI Clinical Assistant</h3>

                    <p>
                      Optional assistance based on the patient's
                      information and available medical history.
                    </p>
                  </div>

                  <span className="nurse-ai-label">
                    Optional
                  </span>
                </div>

                <button
                  type="button"
                  className="nurse-ai-button"
                  onClick={handleGetAIAssistance}
                  disabled={aiLoading}
                >
                  {aiLoading
                    ? "Generating Suggestions..."
                    : "Get AI Assistance"}
                </button>

                {aiLoading && (
                  <div className="nurse-ai-loading">
                    <p>
                      The AI assistant is reviewing the available
                      patient information. This may take a moment.
                    </p>
                  </div>
                )}

                {aiError && (
                  <div className="nurse-ai-error">
                    {aiError}
                  </div>
                )}

                {aiSuggestions && (
                  <div className="nurse-ai-result">

                    <h4>AI-Generated Suggestions</h4>

                    <div className="nurse-ai-suggestions">
                      <ReactMarkdown>
                        {aiSuggestions}
                      </ReactMarkdown>
                    </div>

                    <p className="nurse-ai-disclaimer">
                      These suggestions are for clinical review
                      only. They are not confirmed diagnoses or
                      prescriptions. Independently assess the
                      patient and follow approved clinical
                      guidelines. Do not rely on AI suggestions
                      alone for treatment decisions.
                    </p>

                  </div>
                )}

              </div>

              {/* NURSE'S OWN ASSESSMENT */}

              <div className="worker-appointments-form-group">
                <label>
                  Nurse Assessment
                </label>

                <textarea
                  value={nurseAssessment}
                  onChange={(event) =>
                    setNurseAssessment(event.target.value)
                  }
                  placeholder="Write your own assessment and clinical observations after reviewing the patient."
                  rows="5"
                />
              </div>

              {/* OUTCOME */}

              <div className="worker-appointments-form-group">
                <label>Outcome</label>

                <select
                  value={nurseOutcome}
                  onChange={(event) => {
                    setNurseOutcome(event.target.value);

                    if (
                      event.target.value === "COMPLETED"
                    ) {
                      setReferralReason("");
                    }
                  }}
                >
                  <option value="">Select outcome</option>

                  <option value="COMPLETED">
                    Complete Appointment
                  </option>

                  <option value="REFERRED_DOCTOR">
                    Refer to Doctor
                  </option>

                  <option value="REFERRED_CLINIC">
                    Refer to Another Clinic
                  </option>
                </select>
              </div>

              {/* REFERRAL REASON */}

              {(nurseOutcome === "REFERRED_DOCTOR" ||
                nurseOutcome === "REFERRED_CLINIC") && (
                <div className="worker-appointments-form-group">
                  <label>Referral Reason</label>

                  <textarea
                    value={referralReason}
                    onChange={(event) =>
                      setReferralReason(event.target.value)
                    }
                    placeholder="Explain why the patient is being referred"
                    rows="4"
                  />
                </div>
              )}

            </div>

            <div className="worker-appointments-modal-footer">

              <button
                type="button"
                className="worker-appointment-primary-button"
                onClick={handleSubmitNurseAssessment}
                disabled={loading || aiLoading}
              >
                {loading ? "Saving..." : "Submit Assessment"}
              </button>

              <button
                type="button"
                className="worker-appointment-secondary-button"
                onClick={closeAssessmentModal}
                disabled={loading}
              >
                Cancel
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Appointments;
