
import { useEffect, useState } from "react";
import axios from "axios";
import WorkerNavbar from "../../components/WorkerNavbar";
import "../../styles/MedicalRecords.css";

function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  const fetchMedicalRecords = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `http://localhost:8080/api/medical-records/doctor/${user.id}`
      );

      setRecords(response.data);

    } catch (error) {
      console.error("Error loading medical records:", error);
      setError("Unable to load medical records.");
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter((record) =>
    record.patientName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleViewRecord = (record) => {
    setSelectedRecord(record);
  };

  const closeRecordDetails = () => {
    setSelectedRecord(null);
  };

  return (
    <div className="medical-records-page">

      <WorkerNavbar />

      <main className="medical-records-content">

        <div className="medical-records-header">
          <div>
            <h1>Medical Records</h1>
            <p>
              View medical records created during your consultations.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="medical-records-search">
          <label htmlFor="patientSearch">
            Search Patient
          </label>

          <input
            id="patientSearch"
            type="text"
            placeholder="Search by patient name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading && (
          <div className="medical-records-message">
            Loading medical records...
          </div>
        )}

        {error && (
          <div className="medical-records-error">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          filteredRecords.length === 0 && (
            <div className="medical-records-empty">
              {searchTerm
                ? "No medical records found for this patient."
                : "No medical records found."}
            </div>
          )}

        {!loading &&
          !error &&
          filteredRecords.length > 0 && (
            <div className="medical-records-table-container">

              <table className="medical-records-table">

                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Date</th>
                    <th>Clinic</th>
                    <th>Diagnosis</th>
                    <th>Treatment</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRecords.map((record) => (
                    <tr key={record.id}>

                      <td>
                        {record.patientName}
                      </td>

                      <td>
                        {record.recordDate || "-"}
                      </td>

                      <td>
                        {record.clinic || "-"}
                      </td>

                      <td>
                        {record.diagnosis || "-"}
                      </td>

                      <td>
                        {record.treatment || "-"}
                      </td>

                      <td>
                        <button
                          type="button"
                          className="medical-record-view-button"
                          onClick={() => handleViewRecord(record)}
                        >
                          View
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>

            </div>
          )}

      </main>

      {/* Medical Record Details Modal */}
      {selectedRecord && (
        <div className="medical-record-modal-overlay">

          <div className="medical-record-modal">

            <div className="medical-record-modal-header">
              <div>
                <h2>Medical Record</h2>
                <p>Patient consultation record</p>
              </div>

              <button
                type="button"
                className="medical-record-modal-close"
                onClick={closeRecordDetails}
              >
                ×
              </button>
            </div>

            <div className="medical-record-modal-content">

              <div className="medical-record-section">
                <h3>Patient Information</h3>

                <div className="medical-record-details-grid">

                  <div>
                    <span>Patient</span>
                    <strong>
                      {selectedRecord.patientName || "-"}
                    </strong>
                  </div>

                  <div>
                    <span>Patient ID</span>
                    <strong>
                      {selectedRecord.patientId || "-"}
                    </strong>
                  </div>

                  <div>
                    <span>Clinic</span>
                    <strong>
                      {selectedRecord.clinic || "-"}
                    </strong>
                  </div>

                  <div>
                    <span>Record Date</span>
                    <strong>
                      {selectedRecord.recordDate || "-"}
                    </strong>
                  </div>

                </div>
              </div>

              <div className="medical-record-section">
                <h3>Consultation Information</h3>

                <div className="medical-record-details-grid">

                  <div>
                    <span>Doctor</span>
                    <strong>
                      {selectedRecord.doctorName || "-"}
                    </strong>
                  </div>

                  <div>
                    <span>Appointment ID</span>
                    <strong>
                      {selectedRecord.appointmentId || "-"}
                    </strong>
                  </div>

                </div>
              </div>

              <div className="medical-record-section">

                <h3>Symptoms</h3>

                <div className="medical-record-text">
                  {selectedRecord.symptoms || "No symptoms recorded."}
                </div>

              </div>

              <div className="medical-record-section">

                <h3>Diagnosis</h3>

                <div className="medical-record-text">
                  {selectedRecord.diagnosis || "-"}
                </div>

              </div>

              <div className="medical-record-section">

                <h3>Treatment</h3>

                <div className="medical-record-text">
                  {selectedRecord.treatment || "-"}
                </div>

              </div>

              <div className="medical-record-section">

                <h3>Notes</h3>

                <div className="medical-record-text">
                  {selectedRecord.notes || "No additional notes."}
                </div>

              </div>

            </div>

            <div className="medical-record-modal-footer">

              <button
                type="button"
                className="medical-record-close-button"
                onClick={closeRecordDetails}
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default MedicalRecords;

