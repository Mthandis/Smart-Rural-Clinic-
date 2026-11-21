
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import WorkerNavbar from "../../components/WorkerNavbar";
import "../../styles/WorkerPatientRecords.css";

function WorkerPatientRecords() {
  const { patientId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(location.state?.patient || null);
  const [visits, setVisits] = useState([]);
  const [allRecords, setAllRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [aiMessage, setAiMessage] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [expandedVisits, setExpandedVisits] = useState([]);

  useEffect(() => {
    fetchPatientHistory();
  }, [patientId]);

  const fetchPatientHistory = async () => {
    try {
      setLoading(true);
      setError("");

      // Retrieve appointment history
      const historyResponse = await axios.get(
        `http://localhost:8080/api/medical-records/patient/${patientId}/history`
      );

      const history = historyResponse.data || [];

      // Retrieve ALL medical records belonging to this patient
      const recordsResponse = await axios.get(
        `http://localhost:8080/api/medical-records/patient/${patientId}`
      );

      const records = recordsResponse.data || [];

      setAllRecords(records);

      // Attach records to appointments using appointment ID
      const updatedHistory = history.map((visit) => {
        const appointment = visit.appointment;

        const linkedRecords = appointment
          ? records.filter(
              (record) =>
                String(record.appointmentId) === String(appointment.id)
            )
          : [];

        return {
          ...visit,
          medicalRecords: linkedRecords,
        };
      });

      setVisits(updatedHistory);

      // Recover patient details if the page is refreshed
      if (!patient && updatedHistory.length > 0) {
        const appointment = updatedHistory[0]?.appointment;

        setPatient({
          fullName: appointment?.patientName || "Patient",
          clinicName: appointment?.clinic || "Not available",
        });
      }
    } catch (err) {
      console.error("Error fetching patient history:", err);
      setError("Unable to load patient history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const patientName = patient?.fullName || "Patient";

  // Include completed appointments and appointments with saved records
  const historyVisits = visits.filter((visit) => {
    const status = String(visit.appointment?.status || "")
      .trim()
      .toUpperCase();

    return status === "COMPLETED" || visit.medicalRecords.length > 0;
  });

  const completedVisits = visits.filter(
    (visit) =>
      String(visit.appointment?.status || "")
        .trim()
        .toUpperCase() === "COMPLETED"
  );

  // Count every saved medical record, independently of appointment status
  const totalRecords = allRecords.length;

  const pendingVisits = visits.filter(
    (visit) =>
      String(visit.appointment?.status || "")
        .trim()
        .toUpperCase() === "PENDING"
  ).length;

  const formatDate = (date) => {
    if (!date) return "Date not available";

    const parsedDate = new Date(`${date}T00:00:00`);

    if (isNaN(parsedDate.getTime())) return date;

    return parsedDate.toLocaleDateString("en-ZA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatStatus = (status) => {
    if (!status) return "Unknown";
    return status.replace(/_/g, " ");
  };

  const toggleVisit = (appointmentId) => {
    setExpandedVisits((previous) =>
      previous.includes(appointmentId)
        ? previous.filter((id) => id !== appointmentId)
        : [...previous, appointmentId]
    );
  };

  // GENERATE AI PATIENT HISTORY SUMMARY
  const handleGenerateSummary = async () => {
    if (completedVisits.length === 0 && totalRecords === 0) {
      setAiError("There is no completed consultation or saved medical record available for summarisation.");
      return;
    }

    try {
      setAiLoading(true);
      setAiError("");
      setAiMessage("");

      const response = await axios.post(
        `http://localhost:8080/api/medical-records/patient/${patientId}/ai-summary`
      );

      const summary = response.data?.summary;

      if (!summary) {
        throw new Error("The AI service returned an empty summary.");
      }

      setAiMessage(summary);
    } catch (err) {
      console.error("Error generating AI summary:", err);

      if (err.response?.data) {
        const serverMessage =
          typeof err.response.data === "string"
            ? err.response.data
            : err.response.data.message || err.response.data.detail;

        setAiError(
          serverMessage ||
            "Unable to generate the AI summary. Please try again."
        );
      } else {
        setAiError(
          err.message ||
            "Unable to connect to the AI service. Please check that Python and Ollama are running."
        );
      }
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="worker-patient-records-page">
      <WorkerNavbar />

      <main className="worker-patient-records-content">

        {/* PAGE HEADER */}
        <div className="worker-records-page-header">
          <div>
            <h1>Patient Medical History</h1>
            <p>
              Review consultations, recorded diagnoses and treatment history.
            </p>
          </div>

          <button
            className="worker-records-back-button"
            onClick={() => navigate("/worker-patients")}
          >
            <span>←</span> Back to Patients
          </button>
        </div>

        {/* PATIENT PROFILE */}
        <section className="worker-records-patient-card">
          <div className="worker-records-avatar">
            {patientName.charAt(0).toUpperCase()}
          </div>

          <div className="worker-records-patient-info">
            <h2>{patientName}</h2>

            <span className="worker-records-patient-label">
              Registered Patient
            </span>

            <div className="worker-records-patient-details">
              <div>
                <span>Registered Clinic</span>
                <strong>
                  {patient?.clinicName || patient?.clinic || "Not available"}
                </strong>
              </div>

              <div>
                <span>Email Address</span>
                <strong>{patient?.email || "Not available"}</strong>
              </div>

              <div>
                <span>Phone Number</span>
                <strong>{patient?.phone || "Not available"}</strong>
              </div>
            </div>
          </div>
        </section>

        {/* STATISTICS */}
        {!loading && !error && (
          <section className="worker-records-statistics">

            <div className="worker-records-stat-card">
              <div className="worker-records-stat-icon visits-icon">
                <span>▣</span>
              </div>
              <div>
                <span>Completed Visits</span>
                <h2>{completedVisits.length}</h2>
              </div>
            </div>

            <div className="worker-records-stat-card">
              <div className="worker-records-stat-icon records-icon">
                <span>▤</span>
              </div>
              <div>
                <span>Medical Records</span>
                <h2>{totalRecords}</h2>
              </div>
            </div>

            <div className="worker-records-stat-card">
              <div className="worker-records-stat-icon pending-icon">
                <span>◷</span>
              </div>
              <div>
                <span>Pending Visits</span>
                <h2>{pendingVisits}</h2>
              </div>
            </div>

          </section>
        )}

        {/* AI SUMMARY */}
        <section className="worker-ai-summary-card">
          <div className="worker-ai-summary-content">
            <div className="worker-ai-icon">✨</div>

            <div>
              <h2>AI Patient History Summary</h2>
              <p>
                Generate a short overview of the patient's completed
                consultations, recorded diagnoses and treatments using
                Artificial Intelligence.
              </p>
            </div>
          </div>

          <button
            className="worker-ai-summary-button"
            onClick={handleGenerateSummary}
            disabled={
              loading ||
              !!error ||
              aiLoading ||
              (completedVisits.length === 0 && totalRecords === 0)
            }
          >
            <span>✦</span>
            {aiLoading
              ? "Generating Summary..."
              : aiMessage
              ? "Regenerate AI Summary"
              : "Generate AI Summary"}
          </button>

          {aiLoading && (
            <div className="worker-ai-message">
              <p>
                ✨ AI is reviewing the patient's medical history.
                This may take a little time...
              </p>
            </div>
          )}

          {aiError && (
            <div className="worker-records-error">
              <p>{aiError}</p>
              <button onClick={handleGenerateSummary}>Try Again</button>
            </div>
          )}

          {aiMessage && !aiLoading && (
            <div className="worker-ai-message">
              <h3>Generated Patient History Summary</h3>

              <div className="worker-ai-markdown">
                <ReactMarkdown>{aiMessage}</ReactMarkdown>
              </div>

              <p className="worker-ai-disclaimer">
                AI-generated summary. Healthcare workers must verify
                the information against the original medical records.
                This summary does not replace professional clinical judgement.
              </p>
            </div>
          )}
        </section>

        {/* LOADING */}
        {loading && (
          <div className="worker-records-message">
            Loading patient history...
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="worker-records-error">
            <p>{error}</p>
            <button onClick={fetchPatientHistory}>Try Again</button>
          </div>
        )}

        {/* VISIT HISTORY */}
        {!loading && !error && (
          <section className="worker-records-history-section">

            <div className="worker-records-history-header">
              <div>
                <h2>Visit History</h2>
                <p>
                  Consultations and medical records linked to each appointment.
                </p>
              </div>

              <span>{historyVisits.length} Visits</span>
            </div>

            {historyVisits.length === 0 ? (
              <div className="worker-records-empty">
                <div>📋</div>
                <h3>No Medical History Available</h3>
                <p>
                  No consultations or saved medical records are available
                  for this patient yet.
                </p>
              </div>
            ) : (
              <div className="worker-records-visits-list">

                {historyVisits.map((visit, index) => {
                  const appointment = visit.appointment;
                  const records = visit.medicalRecords || [];
                  const status = appointment?.status || "Unknown";
                  const appointmentId = appointment?.id;
                  const isExpanded = expandedVisits.includes(appointmentId);

                  return (
                    <article
                      className="worker-records-visit-card"
                      key={appointmentId || index}
                    >

                      {/* VISIT TOP SECTION */}
                      <div className="worker-records-visit-top">
                        <div className="worker-records-visit-number">
                          {/*}<span>Appointment ID: {appointmentId}</span> */}
                          <h3>
                            {formatDate(appointment?.appointmentDate)}
                          </h3>
                        </div>

                        <span
                          className={`worker-records-status ${String(status).toLowerCase()}`}
                        >
                          {formatStatus(status)}
                        </span>
                      </div>

                      {/* VISIT INFORMATION */}
                      <div className="worker-records-visit-info">

                        <div>
                          <span>Clinic</span>
                          <strong>
                            {appointment?.clinic || "Not provided"}
                          </strong>
                        </div>

                        <div>
                          <span>Appointment Time</span>
                          <strong>
                            {appointment?.appointmentTime || "Not provided"}
                          </strong>
                        </div>

                        <div>
                          <span>Assigned Nurse</span>
                          <strong>
                            {appointment?.assignedNurseName || "Not assigned"}
                          </strong>
                        </div>

                        <div>
                          <span>Assigned Doctor</span>
                          <strong>
                            {appointment?.assignedDoctorName || "Not assigned"}
                          </strong>
                        </div>

                      </div>

                      {/* MEDICAL RECORD PREVIEW */}
                      <div className="worker-records-visit-preview">
                        <div>
                          <strong>Medical Records</strong>
                          <span>
                            {records.length} record(s) linked to this visit
                          </span>
                        </div>

                        <button
                          className="worker-records-expand-button"
                          onClick={() => toggleVisit(appointmentId)}
                        >
                          {isExpanded ? "Hide Details ↑" : "View Details ↓"}
                        </button>
                      </div>

                      {/* EXPANDED DETAILS */}
                      {isExpanded && (
                        <div className="worker-records-expanded-content">

                          <div className="worker-records-detail-field">
                            <span>Reported Symptoms</span>
                            <p>
                              {appointment?.symptoms || "No symptoms recorded."}
                            </p>
                          </div>

                          {appointment?.nurseAssessment && (
                            <div className="worker-records-detail-field">
                              <span>Nurse Assessment</span>
                              <p>{appointment.nurseAssessment}</p>
                            </div>
                          )}

                          {appointment?.vitalSigns && (
                            <div className="worker-records-detail-field">
                              <span>Vital Signs</span>
                              <p>{appointment.vitalSigns}</p>
                            </div>
                          )}

                          {appointment?.referralReason && (
                            <div className="worker-records-detail-field">
                              <span>Referral Reason</span>
                              <p>{appointment.referralReason}</p>
                            </div>
                          )}

                          <div className="worker-records-detail-divider" />

                          {records.length === 0 ? (
                            <div className="worker-records-no-medical-record">
                              No medical record is linked to this appointment
                              {/*}(ID: {appointmentId}). */}
                            </div>
                          ) : (
                            records.map((record, recordIndex) => (
                              <div
                                className="worker-records-medical-details"
                                key={record.id || recordIndex}
                              >
                                <h4>Medical Record</h4>

                               {/*} <div className="worker-records-detail-field">
                                  <span>Medical Record ID</span>
                                  <p>{record.id || "Not available"}</p>
                                </div>

                                <div className="worker-records-detail-field">
                                  <span>Linked Appointment ID</span>
                                  <p>{record.appointmentId}</p>
                                </div> */}

                                <div className="worker-records-detail-field">
                                  <span>Doctor</span>
                                  <p>{record.doctorName || "Not provided"}</p>
                                </div>

                                <div className="worker-records-detail-field">
                                  <span>Record Date</span>
                                  <p>{formatDate(record.recordDate)}</p>
                                </div>

                                <div className="worker-records-detail-field">
                                  <span>Diagnosis</span>
                                  <p>
                                    {record.diagnosis || "No diagnosis recorded."}
                                  </p>
                                </div>

                                <div className="worker-records-detail-field">
                                  <span>Treatment / Medication</span>
                                  <p>
                                    {record.treatment || "No treatment recorded."}
                                  </p>
                                </div>

                                {record.notes && (
                                  <div className="worker-records-detail-field">
                                    <span>Additional Notes</span>
                                    <p>{record.notes}</p>
                                  </div>
                                )}
                              </div>
                            ))
                          )}

                        </div>
                      )}

                    </article>
                  );
                })}

              </div>
            )}
          </section>
        )}

      </main>
    </div>
  );
}

export default WorkerPatientRecords;
