
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import WorkerNavbar from "../../components/WorkerNavbar";
import "../../styles/WorkerPatients.css";

function WorkerPatients() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:8080/api/users/patients"
      );

      setPatients(response.data);
    } catch (error) {
      console.error("Error loading patients:", error);
      setError("Unable to load patients.");
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const search = searchTerm.toLowerCase();

    return (
      patient.fullName?.toLowerCase().includes(search) ||
      patient.idNumber?.toLowerCase().includes(search) ||
      patient.email?.toLowerCase().includes(search) ||
      patient.phone?.toLowerCase().includes(search) ||
      patient.clinicName?.toLowerCase().includes(search)
    );
  });

  const viewPatientRecords = (patient) => {
    navigate(`/worker/patients/${patient.id}`, {
      state: { patient }
    });
  };

  return (
    <div className="worker-patients-page">
      <WorkerNavbar />

      <main className="worker-patients-content">

        {/* HEADER AND PATIENT COUNT */}
        <div className="worker-patients-header">
          <div className="worker-patients-header-left">
            <h1>Patients & Records</h1>
            <p>
              Search registered patients and access their medical history
              across clinics.
            </p>
          </div>

          <div className="worker-patients-summary">
            <div>
              <span>Number of Patients</span>
              <h2>{patients.length}</h2>
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="worker-patients-search">
          <label htmlFor="patientSearch">
            Search Patients
          </label>

          <input
            id="patientSearch"
            type="text"
            placeholder="Search by name, ID number, email, phone or clinic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* LOADING */}
        {loading && (
          <div className="worker-patients-message">
            Loading patients...
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="worker-patients-error">
            {error}
            <button onClick={fetchPatients}>
              Try Again
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading &&
          !error &&
          filteredPatients.length === 0 && (
            <div className="worker-patients-empty">
              {searchTerm
                ? "No patients match your search."
                : "No patients have been registered yet."}
            </div>
          )}

        {/* PATIENT TABLE */}
        {!loading &&
          !error &&
          filteredPatients.length > 0 && (
            <div className="worker-patients-table-container">
              <table className="worker-patients-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>ID Number</th>
                    <th>Clinic</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id}>
                      <td>{patient.fullName}</td>
                      <td>{patient.idNumber}</td>
                      <td>
                        {patient.clinicName || "Not assigned"}
                      </td>
                      <td>{patient.email}</td>
                      <td>
                        {patient.phone || "Not provided"}
                      </td>

                      <td>
                        <span
                          className={
                            patient.active
                              ? "worker-patient-status active"
                              : "worker-patient-status inactive"
                          }
                        >
                          {patient.active ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td>
                        <button
                          className="worker-patient-view-button"
                          onClick={() => viewPatientRecords(patient)}
                        >
                          View Records
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

      </main>
    </div>
  );
}

export default WorkerPatients;
