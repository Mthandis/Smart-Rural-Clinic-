
import { useEffect, useState } from "react";
import axios from "axios";
import WorkerNavbar from "../../components/WorkerNavbar";
import "../../styles/WorkerPatients.css";

function WorkerPatients() {

  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      patient.phone?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="worker-patients-page">

      <WorkerNavbar />

      <main className="worker-patients-content">

        <div className="worker-patients-header">

          <div>
            <h1>Patients</h1>

            <p>
              View and search registered patients.
            </p>
          </div>

        </div>


        <div className="worker-patients-search">

          <label htmlFor="patientSearch">
            Search Patients
          </label>

          <input
            id="patientSearch"
            type="text"
            placeholder="Search by name, ID number, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

        </div>


        {loading && (
          <div className="worker-patients-message">
            Loading patients...
          </div>
        )}


        {error && (
          <div className="worker-patients-error">
            {error}
          </div>
        )}


        {!loading &&
          !error &&
          filteredPatients.length === 0 && (

            <div className="worker-patients-empty">
              {searchTerm
                ? "No patients match your search."
                : "No patients have been registered yet."}
            </div>
          )}


        {!loading &&
          !error &&
          filteredPatients.length > 0 && (

            <div className="worker-patients-table-container">

              <table className="worker-patients-table">

                <thead>

                  <tr>
                    <th>Patient</th>
                    <th>ID Number</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                  </tr>

                </thead>

                <tbody>

                  {filteredPatients.map((patient) => (

                    <tr key={patient.id}>

                      <td>
                        {patient.fullName}
                      </td>

                      <td>
                        {patient.idNumber}
                      </td>

                      <td>
                        {patient.email}
                      </td>

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
                          {patient.active
                            ? "Active"
                            : "Inactive"}
                        </span>

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

