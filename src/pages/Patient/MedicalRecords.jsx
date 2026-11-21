
import { useEffect, useState } from "react";
import axios from "axios";
import PatientNavbar from "../../components/PatientNavbar";
import "../../styles/PatientMedicalRecords.css";

function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user?.id) {
      fetchMedicalRecords();
    } else {
      setError("Patient information could not be found.");
      setLoading(false);
    }
  }, []);

  const fetchMedicalRecords = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `http://localhost:8080/api/medical-records/patient/${user.id}`
      );

      setRecords(response.data);

    } catch (error) {
      console.error("Error loading medical records:", error);
      setError("Unable to load your medical records.");
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter((record) => {
    const search = searchTerm.toLowerCase();

    return (
      record.diagnosis?.toLowerCase().includes(search) ||
      record.treatment?.toLowerCase().includes(search) ||
      record.clinic?.toLowerCase().includes(search) ||
      record.doctorName?.toLowerCase().includes(search) ||
      record.recordDate?.toLowerCase().includes(search)
    );
  });

  const handleViewRecord = (record) => {
    setSelectedRecord(record);
  };

  const closeRecordDetails = () => {
    setSelectedRecord(null);
  };

  return (
    <div className="patient-medical-records-page">

      <PatientNavbar />

      <main className="patient-medical-records-content">

        <div className="patient-medical-records-header">
          <div>
            <h1>Medical Records</h1>
            <p>
              View your medical history and consultation records.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="patient-medical-records-search">
          <label htmlFor="medicalRecordSearch">
            Search Medical Records
          </label>

          <input
            id="medicalRecordSearch"
            type="text"
            placeholder="Search by diagnosis, treatment, clinic or doctor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="patient-medical-records-message">
            Loading your medical records...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="patient-medical-records-error">
            {error}
          </div>
        )}

        {/* No records */}
        {!loading &&
          !error &&
          filteredRecords.length === 0 && (
            <div className="patient-medical-records-empty">
              {searchTerm
                ? "No medical records match your search."
                : "You do not have any medical records yet."}
            </div>
          )}

        {/* Records */}
        {!loading &&
          !error &&
          filteredRecords.length > 0 && (
            <div className="patient-medical-records-table-container">

              <table className="patient-medical-records-table">

                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Clinic</th>
                    <th>Doctor</th>
                    <th>Diagnosis</th>
                    <th>Treatment</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRecords.map((record) => (
                    <tr key={record.id}>

                      <td>
                        {record.recordDate || "-"}
                      </td>

                      <td>
                        {record.clinic || "-"}
                      </td>

                      <td>
                        {record.doctorName || "-"}
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
                          className="patient-medical-record-view-button"
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
        <div className="patient-medical-record-modal-overlay">

          <div className="patient-medical-record-modal">

            <div className="patient-medical-record-modal-header">

              <div>
                <h2>Medical Record</h2>
                <p>Consultation details</p>
              </div>

              <button
                type="button"
                className="patient-medical-record-modal-close"
                onClick={closeRecordDetails}
              >
                ×
              </button>

            </div>

            <div className="patient-medical-record-modal-content">

              <div className="patient-medical-record-section">
                <h3>Consultation Information</h3>

                <div className="patient-medical-record-details-grid">

                  <div>
                    <span>Date</span>
                    <strong>
                      {selectedRecord.recordDate || "-"}
                    </strong>
                  </div>

                  <div>
                    <span>Clinic</span>
                    <strong>
                      {selectedRecord.clinic || "-"}
                    </strong>
                  </div>

                  <div>
                    <span>Doctor</span>
                    <strong>
                      {selectedRecord.doctorName || "-"}
                    </strong>
                  </div>



                </div>
              </div>

              <div className="patient-medical-record-section">

                <h3>Symptoms</h3>

                <div className="patient-medical-record-text">
                  {selectedRecord.symptoms ||
                    "No symptoms recorded."}
                </div>

              </div>

              <div className="patient-medical-record-section">

                <h3>Diagnosis</h3>

                <div className="patient-medical-record-text">
                  {selectedRecord.diagnosis || "-"}
                </div>

              </div>

              <div className="patient-medical-record-section">

                <h3>Treatment</h3>

                <div className="patient-medical-record-text">
                  {selectedRecord.treatment || "-"}
                </div>

              </div>

              <div className="patient-medical-record-section">

                <h3>Notes</h3>

                <div className="patient-medical-record-text">
                  {selectedRecord.notes ||
                    "No additional notes."}
                </div>

              </div>

            </div>

            <div className="patient-medical-record-modal-footer">

              <button
                type="button"
                className="patient-medical-record-close-button"
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

