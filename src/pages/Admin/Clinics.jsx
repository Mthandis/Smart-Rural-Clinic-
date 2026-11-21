import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/Clinics.css";

function Clinics() {
  const navigate = useNavigate();

  const [clinics, setClinics] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  const [selectedClinic, setSelectedClinic] = useState(null);

  const [showDeactivatePopup, setShowDeactivatePopup] = useState(false);
  const [clinicToDeactivate, setClinicToDeactivate] = useState(null);

  const [showActivatePopup, setShowActivatePopup] = useState(false);
  const [clinicToActivate, setClinicToActivate] = useState(null);

  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  useEffect(() => {
    fetchClinics();
  }, []);

  const fetchClinics = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/admin/clinics"
      );

      setClinics(response.data);
    } catch (error) {
      console.error("Unable to load clinics:", error);
      setError("Unable to load clinics.");
    }
  };

  const filteredClinics = clinics.filter(
    (clinic) =>
      clinic.clinicName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      clinic.location
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // =========================
  // VIEW CLINIC
  // =========================

  const handleViewClinic = (clinic) => {
    setSelectedClinic(clinic);
  };

  const handleCloseClinic = () => {
    setSelectedClinic(null);
  };

  // =========================
  // DEACTIVATE CLINIC
  // =========================

  const handleDeactivateClinic = (clinic) => {
    setClinicToDeactivate(clinic);
    setShowDeactivatePopup(true);
  };

  const handleCancelDeactivate = () => {
    setClinicToDeactivate(null);
    setShowDeactivatePopup(false);
  };

  const handleConfirmDeactivate = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/admin/clinics/${clinicToDeactivate.id}/deactivate`
      );

      setClinicToDeactivate(null);
      setShowDeactivatePopup(false);

      fetchClinics();
    } catch (error) {
      console.error("Unable to deactivate clinic:", error);

      setError("Unable to deactivate clinic.");
    }
  };

  // =========================
  // ACTIVATE CLINIC
  // =========================

  const handleActivateClinic = (clinic) => {
    setClinicToActivate(clinic);
    setShowActivatePopup(true);
  };

  const handleCancelActivate = () => {
    setClinicToActivate(null);
    setShowActivatePopup(false);
  };

  const handleConfirmActivate = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/admin/clinics/${clinicToActivate.id}/activate`
      );

      setClinicToActivate(null);
      setShowActivatePopup(false);

      fetchClinics();
    } catch (error) {
      console.error("Unable to activate clinic:", error);

      setError("Unable to activate clinic.");
    }
  };

  // =========================
  // LOGOUT
  // =========================

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
    <div className="clinics-page">

      {/* Sidebar */}
      <aside className="clinics-sidebar">

        <div className="sidebar-brand">

          <div className="brand-icon">
            +
          </div>

          <div>
            <h2>Smart Rural Clinic</h2>
            <span>Administration</span>
          </div>

        </div>

        <nav className="sidebar-navigation">

          <p className="sidebar-heading">
            MENU
          </p>

          <button
            className="sidebar-link"
            onClick={() => navigate("/admin-dashboard")}
          >
            <span className="sidebar-icon">⌂</span>
            Dashboard
          </button>

          <button
            className="sidebar-link"
            onClick={() => navigate("/healthcare-workers")}
          >
            <span className="sidebar-icon">◉</span>
            Healthcare Workers
          </button>

          <button
            className="sidebar-link active"
            onClick={() => navigate("/clinics")}
          >
            <span className="sidebar-icon">▣</span>
            Clinics
          </button>

           <button
           className="sidebar-link"
           onClick={() => navigate("/patients")}>
           <span className="sidebar-icon">♙</span>
           Patients
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
          <button className="sidebar-link">
            <span className="sidebar-icon">⚙</span>
            Settings
          </button>

        </nav>

        <div className="sidebar-bottom">

          <div className="admin-profile">

            <div className="profile-icon">
              SA
            </div>

            <div>
              <strong>System Administrator</strong>
              <span>Administrator</span>
            </div>

          </div>

          <button
            className="logout-button"
            onClick={handleLogoutClick}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>


      {/* Main Content */}
      <main className="clinics-main">

        {/* Header */}
        <header className="clinics-header">

          <div>

            <p className="page-label">
              SYSTEM ADMINISTRATION
            </p>

            <h1>
              Clinics
            </h1>

          </div>

          <div className="header-user">

            <div className="header-user-icon">
              SA
            </div>

            <div>
              <strong>System Administrator</strong>
              <span>Administrator</span>
            </div>

          </div>

        </header>


        {/* Clinics Content */}
        <div className="clinics-content">

          <div className="page-heading">

            <div>

              <p className="overview-label">
                CLINIC MANAGEMENT
              </p>

              <h2>
                Registered Clinics
              </h2>

              <p>
                View and manage clinics registered in the system.
              </p>

            </div>

            <button
              type="button"
              className="register-clinic-button"
              onClick={() => navigate("/register-clinic")}
            >
              + Register Clinic
            </button>

          </div>


          {/* Search */}
          <div className="clinic-search">

            <input
              type="text"
              placeholder="Search clinics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

          </div>


          {/* Error */}
          {error && (
            <p className="error-message">
              {error}
            </p>
          )}


          {/* Clinics Table */}
          <div className="clinics-table-section">

            <table className="clinics-table">

              <thead>

                <tr>
                  <th>Clinic Name</th>
                  <th>Location</th>
                  <th>Contact Number</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {filteredClinics.length > 0 ? (

                  filteredClinics.map((clinic) => (

                    <tr key={clinic.id}>

                      <td>
                        {clinic.clinicName}
                      </td>

                      <td>
                        {clinic.location}
                      </td>

                      <td>
                        {clinic.contactNumber}
                      </td>

                      <td>

                        <span
                          className={
                            clinic.active
                              ? "clinic-status"
                              : "clinic-status-inactive"
                          }
                        >
                          {clinic.active
                            ? "Active"
                            : "Inactive"}
                        </span>

                      </td>

                      <td>

                        <div className="clinic-actions">

                          {/* View */}
                          <button
                            type="button"
                            className="view-clinic-button"
                            onClick={() =>
                              handleViewClinic(clinic)
                            }
                          >
                            View
                          </button>


                          {/* Deactivate / Activate */}
                          {clinic.active ? (

                            <button
                              type="button"
                              className="deactivate-clinic-button"
                              onClick={() =>
                                handleDeactivateClinic(clinic)
                              }
                            >
                              Deactivate
                            </button>

                          ) : (

                            <button
                              type="button"
                              className="activate-clinic-button"
                              onClick={() =>
                                handleActivateClinic(clinic)
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
                      className="empty-clinics-message"
                    >
                      No clinics found.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </main>


      {/* =========================
          CLINIC DETAILS POPUP
          ========================= */}

      {selectedClinic && (

        <div className="clinic-details-overlay">

          <div className="clinic-details-popup">

            <div className="clinic-details-header">

              <div>

                <p>
                  CLINIC
                </p>

                <h2>
                  Clinic Details
                </h2>

              </div>

              <button
                type="button"
                className="close-clinic-button"
                onClick={handleCloseClinic}
              >
                ×
              </button>

            </div>


            <div className="clinic-details-content">

              <div className="clinic-detail-item">

                <span>
                  Clinic Name
                </span>

                <strong>
                  {selectedClinic.clinicName}
                </strong>

              </div>


              <div className="clinic-detail-item">

                <span>
                  Location
                </span>

                <strong>
                  {selectedClinic.location}
                </strong>

              </div>


              <div className="clinic-detail-item">

                <span>
                  Contact Number
                </span>

                <strong>
                  {selectedClinic.contactNumber}
                </strong>

              </div>


              <div className="clinic-detail-item">

                <span>
                  Status
                </span>

                <strong
                  className={
                    selectedClinic.active
                      ? "clinic-detail-active"
                      : "clinic-detail-inactive"
                  }
                >
                  {selectedClinic.active
                    ? "Active"
                    : "Inactive"}
                </strong>

              </div>

            </div>


            <div className="clinic-details-footer">

              <button
                type="button"
                className="close-clinic-footer-button"
                onClick={handleCloseClinic}
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}


      {/* =========================
          DEACTIVATE CONFIRMATION
          ========================= */}

      {showDeactivatePopup && clinicToDeactivate && (

        <div className="deactivate-clinic-popup-overlay">

          <div className="deactivate-clinic-popup">

            <div className="deactivate-clinic-popup-icon">
              !
            </div>

            <h2>
              Deactivate Clinic
            </h2>

            <p>
              Are you sure you want to deactivate{" "}
              <strong>
                {clinicToDeactivate.clinicName}
              </strong>
              ?
            </p>

            <p className="deactivate-clinic-popup-warning">
              This clinic will be marked as inactive.
            </p>

            <div className="deactivate-clinic-popup-buttons">

              <button
                type="button"
                className="deactivate-clinic-cancel-button"
                onClick={handleCancelDeactivate}
              >
                Cancel
              </button>

              <button
                type="button"
                className="deactivate-clinic-confirm-button"
                onClick={handleConfirmDeactivate}
              >
                Deactivate
              </button>

            </div>

          </div>

        </div>

      )}


      {/* =========================
          ACTIVATE CONFIRMATION
          ========================= */}

      {showActivatePopup && clinicToActivate && (

        <div className="activate-clinic-popup-overlay">

          <div className="activate-clinic-popup">

            <div className="activate-clinic-popup-icon">
              ✓
            </div>

            <h2>
              Activate Clinic
            </h2>

            <p>
              Are you sure you want to activate{" "}
              <strong>
                {clinicToActivate.clinicName}
              </strong>
              ?
            </p>

            <p className="activate-clinic-popup-warning">
              This clinic will be marked as active.
            </p>

            <div className="activate-clinic-popup-buttons">

              <button
                type="button"
                className="activate-clinic-cancel-button"
                onClick={handleCancelActivate}
              >
                Cancel
              </button>

              <button
                type="button"
                className="activate-clinic-confirm-button"
                onClick={handleConfirmActivate}
              >
                Activate
              </button>

            </div>

          </div>

        </div>

      )}


      {/* =========================
          LOGOUT CONFIRMATION
          ========================= */}

      {showLogoutPopup && (

        <div className="logout-popup-overlay">

          <div className="logout-popup">

            <div className="logout-popup-icon">
              ?
            </div>

            <h2>
              Confirm Logout
            </h2>

            <p>
              Are you sure you want to logout?
            </p>

            <div className="logout-popup-buttons">

              <button
                type="button"
                className="logout-no-button"
                onClick={handleCancelLogout}
              >
                No
              </button>

              <button
                type="button"
                className="logout-yes-button"
                onClick={handleConfirmLogout}
              >
                Yes
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Clinics;