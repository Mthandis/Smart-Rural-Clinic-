import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/Patients.css";

function Patients() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  const [selectedPatient, setSelectedPatient] = useState(null);

  const [showDeactivatePopup, setShowDeactivatePopup] = useState(false);
  const [patientToDeactivate, setPatientToDeactivate] = useState(null);

  const [showActivatePopup, setShowActivatePopup] = useState(false);
  const [patientToActivate, setPatientToActivate] = useState(null);

  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/admin/patients"
      );

      setPatients(response.data);
    } catch (error) {
      console.error("Unable to load patients:", error);
      setError("Unable to load patients.");
    }
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      patient.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      patient.idNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
  };

  const handleClosePatient = () => {
    setSelectedPatient(null);
  };

  const handleDeactivatePatient = (patient) => {
    setPatientToDeactivate(patient);
    setShowDeactivatePopup(true);
  };

  const handleCancelDeactivate = () => {
    setPatientToDeactivate(null);
    setShowDeactivatePopup(false);
  };

  const handleConfirmDeactivate = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/admin/patients/${patientToDeactivate.id}/deactivate`
      );

      setPatientToDeactivate(null);
      setShowDeactivatePopup(false);

      fetchPatients();
    } catch (error) {
      console.error("Unable to deactivate patient:", error);
      setError("Unable to deactivate patient.");
    }
  };

  const handleActivatePatient = (patient) => {
    setPatientToActivate(patient);
    setShowActivatePopup(true);
  };

  const handleCancelActivate = () => {
    setPatientToActivate(null);
    setShowActivatePopup(false);
  };

  const handleConfirmActivate = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/admin/patients/${patientToActivate.id}/activate`
      );

      setPatientToActivate(null);
      setShowActivatePopup(false);

      fetchPatients();
    } catch (error) {
      console.error("Unable to activate patient:", error);
      setError("Unable to activate patient.");
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutPopup(true);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleCancelLogout = () => {
    setShowLogoutPopup(false);
  };

  return (
    <div className="patients-page">

      <aside className="patients-sidebar">

        <div className="patients-brand">
          <h2>Smart Rural Clinic</h2>
          <span>Administration</span>
        </div>

        <div className="patients-menu">

          <p>MENU</p>

          <button onClick={() => navigate("/admin-dashboard")}>
            ▦ Dashboard
          </button>

          <button onClick={() => navigate("/healthcare-workers")}>
            ♙ Healthcare Workers
          </button>

          <button onClick={() => navigate("/clinics")}>
            🏥 Clinics
          </button>

          <button className="active">
            ♙ Patients
          </button>

              <button
                     className="sidebar-link"
                     onClick={() => navigate("/manage-medicine")}
                   >
                     <span className="sidebar-icon">▤</span>
                     Medicine Inventory
                   </button>
          <button
                    className="sidebar-link"
                    onClick={() => navigate("/announcements")}>
                      <span className="sidebar-icon">▤</span>
                      Announcements
                    </button>

                    <button
                      className="sidebar-link"
                      onClick={() => navigate("/admin-feedback")}
                    >
                      <span className="sidebar-icon">▤</span>
                      Patient Feedback
                    </button>

          <button>
            ⚙ Settings
          </button>

        </div>

        <div className="patients-sidebar-bottom">

          <div className="admin-profile">
            <div className="admin-avatar">
              SA
            </div>

            <div>
              <strong>System Administrator</strong>
              <span>Administrator</span>
            </div>
          </div>

          <button
            className="patients-logout-button"
            onClick={handleLogoutClick}
          >
            Logout
          </button>

        </div>

      </aside>

      <main className="patients-main">

        <header className="patients-header">

          <div>
            <p>USER MANAGEMENT</p>
            <h1>Patients</h1>
          </div>

          <div className="patients-header-profile">
            <div className="admin-avatar">
              SA
            </div>

            <div>
              <strong>System Administrator</strong>
              <span>Administrator</span>
            </div>
          </div>

        </header>

        <section className="patients-content">

          <div className="patients-title-row">

            <div>
              <h2>Patient Account Management</h2>

              <p>
                View and manage registered patient accounts.
              </p>
            </div>

            <div className="patients-count">
              {filteredPatients.length} Patients
            </div>

          </div>

          <div className="patients-search">

            <input
              type="text"
              placeholder="Search by name, email or ID number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

          </div>

          {error && (
            <p className="patients-error">
              {error}
            </p>
          )}

          <div className="patients-table-container">

            <table className="patients-table">

              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredPatients.length > 0 ? (

                  filteredPatients.map((patient) => (

                    <tr key={patient.id}>

                      <td>{patient.fullName}</td>

                      <td>{patient.email}</td>

                      <td>{patient.phone}</td>

                      <td>
                        {patient.active ? (
                          <span className="patient-status">
                            Active
                          </span>
                        ) : (
                          <span className="patient-status-inactive">
                            Inactive
                          </span>
                        )}
                      </td>

                      <td>

                        <div className="patient-actions">

                          <button
                            className="view-patient-button"
                            onClick={() =>
                              handleViewPatient(patient)
                            }
                          >
                            View
                          </button>

                          {patient.active ? (

                            <button
                              className="deactivate-patient-button"
                              onClick={() =>
                                handleDeactivatePatient(patient)
                              }
                            >
                              Deactivate
                            </button>

                          ) : (

                            <button
                              className="activate-patient-button"
                              onClick={() =>
                                handleActivatePatient(patient)
                              }
                            >
                              Activate
                            </button>

                          )}

                        </div>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>
                    <td
                      colSpan="5"
                      className="no-patients"
                    >
                      No patients found.
                    </td>
                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </section>

      </main>

      {/* VIEW PATIENT POPUP */}

      {selectedPatient && (

        <div className="patient-popup-overlay">

          <div className="patient-popup">

            <button
              className="patient-popup-close"
              onClick={handleClosePatient}
            >
              ×
            </button>

            <h2>Patient Details</h2>

            <div className="patient-details">

              <div>
                <span>Full Name</span>
                <strong>{selectedPatient.fullName}</strong>
              </div>

              <div>
                <span>ID Number</span>
                <strong>{selectedPatient.idNumber}</strong>
              </div>

              <div>
                <span>Email Address</span>
                <strong>{selectedPatient.email}</strong>
              </div>

              <div>
                <span>Phone Number</span>
                <strong>{selectedPatient.phone}</strong>
              </div>

             <div>
               <span>Clinic</span>

               <strong>
                 {selectedPatient.clinic
                   ? selectedPatient.clinic.clinicName
                   : "Not assigned"}
               </strong>
             </div>

             <div>
               <span>Account Status</span>

               <strong>
                 {selectedPatient.active
                   ? "Active"
                   : "Inactive"}
               </strong>
             </div>

            </div>

            <button
              className="patient-popup-ok"
              onClick={handleClosePatient}
            >
              Close
            </button>

          </div>

        </div>

      )}

      {/* DEACTIVATE POPUP */}

      {showDeactivatePopup && patientToDeactivate && (

        <div className="patient-popup-overlay">

          <div className="patient-confirm-popup">

            <div className="patient-confirm-icon">
              !
            </div>

            <h2>Deactivate Patient?</h2>

            <p>
              Are you sure you want to deactivate{" "}
              <strong>
                {patientToDeactivate.fullName}
              </strong>
              ?
            </p>

            <p className="patient-warning">
              This patient will no longer be able to log in.
            </p>

            <div className="patient-popup-buttons">

              <button
                className="patient-cancel-button"
                onClick={handleCancelDeactivate}
              >
                Cancel
              </button>

              <button
                className="patient-deactivate-confirm"
                onClick={handleConfirmDeactivate}
              >
                Deactivate
              </button>

            </div>

          </div>

        </div>

      )}

      {/* ACTIVATE POPUP */}

      {showActivatePopup && patientToActivate && (

        <div className="patient-popup-overlay">

          <div className="patient-confirm-popup patient-activate-popup">

            <div className="patient-confirm-icon patient-activate-icon">
              ✓
            </div>

            <h2>Activate Patient?</h2>

            <p>
              Are you sure you want to activate{" "}
              <strong>
                {patientToActivate.fullName}
              </strong>
              ?
            </p>

            <p className="patient-warning patient-activate-warning">
              This patient will be able to log in again.
            </p>

            <div className="patient-popup-buttons">

              <button
                className="patient-cancel-button"
                onClick={handleCancelActivate}
              >
                Cancel
              </button>

              <button
                className="patient-activate-confirm"
                onClick={handleConfirmActivate}
              >
                Activate
              </button>

            </div>

          </div>

        </div>

      )}

      {/* LOGOUT POPUP */}

      {showLogoutPopup && (

        <div className="patient-popup-overlay">

          <div className="patient-confirm-popup">

            <h2>Logout?</h2>

            <p>
              Are you sure you want to logout?
            </p>

            <div className="patient-popup-buttons">

              <button
                className="patient-cancel-button"
                onClick={handleCancelLogout}
              >
                Cancel
              </button>

              <button
                className="patient-logout-confirm"
                onClick={handleConfirmLogout}
              >
                Logout
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Patients;