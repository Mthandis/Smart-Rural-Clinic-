import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/HealthcareWorkers.css";

function HealthcareWorkers() {
  const navigate = useNavigate();

  const [workers, setWorkers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [selectedWorker, setSelectedWorker] = useState(null);

  const [showDeactivatePopup, setShowDeactivatePopup] = useState(false);
  const [workerToDeactivate, setWorkerToDeactivate] = useState(null);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/admin/workers"
      );

      setWorkers(response.data);
    } catch (error) {
      console.error("Unable to load healthcare workers:", error);
      setError("Unable to load healthcare workers.");
    }
  };

  const filteredWorkers = workers.filter((worker) =>
    worker.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewWorker = (worker) => {
    setSelectedWorker(worker);
  };

  const handleCloseWorker = () => {
    setSelectedWorker(null);
  };

  const handleDeactivateWorker = (worker) => {
    setWorkerToDeactivate(worker);
    setShowDeactivatePopup(true);
  };

  const handleCancelDeactivate = () => {
    setWorkerToDeactivate(null);
    setShowDeactivatePopup(false);
  };

  const handleConfirmDeactivate = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/admin/workers/${workerToDeactivate.id}/deactivate`
      );

      setWorkerToDeactivate(null);
      setShowDeactivatePopup(false);

      fetchWorkers();

    } catch (error) {
      console.error("Unable to deactivate healthcare worker:", error);

      setError("Unable to deactivate healthcare worker.");
    }
  };

  const handleActivateWorker = async (worker) => {
    try {
      await axios.put(
        `http://localhost:8080/api/admin/workers/${worker.id}/activate`
      );

      fetchWorkers();

    } catch (error) {
      console.error("Unable to activate healthcare worker:", error);

      setError("Unable to activate healthcare worker.");
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
    <div className="healthcare-workers-page">

      {/* Sidebar */}
      <aside className="healthcare-workers-sidebar">

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

          <button className="sidebar-link active">
            <span className="sidebar-icon">◉</span>
            Healthcare Workers
          </button>

         <button
           className="sidebar-link"
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
      <main className="healthcare-workers-main">

        {/* Header */}
        <header className="healthcare-workers-header">

          <div>
            <p className="page-label">
              SYSTEM ADMINISTRATION
            </p>

            <h1>
              Healthcare Workers
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


        {/* Page Content */}
        <div className="healthcare-workers-content">

          <div className="page-heading">

            <div>

              <p className="overview-label">
                STAFF MANAGEMENT
              </p>

              <h2>
                Registered Healthcare Workers
              </h2>

              <p>
                View and manage healthcare workers registered in the system.
              </p>

            </div>

            <button
              type="button"
              className="register-worker-button"
              onClick={() => navigate("/manage-workers")}
            >
              + Register Healthcare Worker
            </button>

          </div>


          {/* Search */}
          <div className="worker-search">

            <input
              type="text"
              placeholder="Search healthcare workers..."
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


          {/* Workers Table */}
          <div className="workers-table-section">

            <table className="workers-table">

              <thead>

                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {filteredWorkers.length > 0 ? (

                  filteredWorkers.map((worker) => (

                    <tr key={worker.id}>

                      <td>
                        {worker.fullName}
                      </td>

                      <td>
                        {worker.email}
                      </td>

                      <td>
                        {worker.phone}
                      </td>

                      <td>
                        {worker.role}
                      </td>

                      <td>
                        <span
                          className={
                            worker.active
                              ? "worker-status"
                              : "worker-status-inactive"
                          }
                        >
                          {worker.active ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td>

                        <div className="worker-actions">

                          <button
                            type="button"
                            className="view-worker-button"
                            onClick={() => handleViewWorker(worker)}
                          >
                            View
                          </button>

                          {worker.active ? (

                            <button
                              type="button"
                              className="deactivate-worker-button"
                              onClick={() => handleDeactivateWorker(worker)}
                            >
                              Deactivate
                            </button>

                          ) : (

                            <button
                              type="button"
                              className="activate-worker-button"
                              onClick={() => handleActivateWorker(worker)}
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
                      colSpan="6"
                      className="empty-workers-message"
                    >
                      No healthcare workers found.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </main>


      {/* Worker Details Popup */}
      {selectedWorker && (

        <div className="worker-details-overlay">

          <div className="worker-details-popup">

            <div className="worker-details-header">

              <div>

                <p>
                  HEALTHCARE WORKER
                </p>

                <h2>
                  Worker Details
                </h2>

              </div>

              <button
                type="button"
                className="close-worker-button"
                onClick={handleCloseWorker}
              >
                ×
              </button>

            </div>


            <div className="worker-details-content">

              <div className="worker-detail-item">

                <span>
                  Full Name
                </span>

                <strong>
                  {selectedWorker.fullName}
                </strong>

              </div>


              <div className="worker-detail-item">

                <span>
                  ID Number
                </span>

                <strong>
                  {selectedWorker.idNumber}
                </strong>

              </div>


              <div className="worker-detail-item">

                <span>
                  Email Address
                </span>

                <strong>
                  {selectedWorker.email}
                </strong>

              </div>


              <div className="worker-detail-item">

                <span>
                  Phone Number
                </span>

                <strong>
                  {selectedWorker.phone}
                </strong>

              </div>


              <div className="worker-detail-item">

                <span>
                  Role
                </span>

                <strong>
                  {selectedWorker.role}
                </strong>

              </div>


              <div className="worker-detail-item">

                <span>
                  Status
                </span>

                <strong
                  className={
                    selectedWorker.active
                      ? "worker-detail-active"
                      : "worker-detail-inactive"
                  }
                >
                  {selectedWorker.active ? "Active" : "Inactive"}
                </strong>

              </div>

            </div>


            <div className="worker-details-footer">

              <button
                type="button"
                className="close-worker-footer-button"
                onClick={handleCloseWorker}
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}


      {/* Deactivate Confirmation Popup */}
      {showDeactivatePopup && workerToDeactivate && (

        <div className="deactivate-popup-overlay">

          <div className="deactivate-popup">

            <div className="deactivate-popup-icon">
              !
            </div>

            <h2>
              Deactivate Healthcare Worker
            </h2>

            <p>
              Are you sure you want to deactivate{" "}
              <strong>
                {workerToDeactivate.fullName}
              </strong>
              ?
            </p>

            <p className="deactivate-popup-warning">
              This worker will no longer be able to log in to the system.
            </p>

            <div className="deactivate-popup-buttons">

              <button
                type="button"
                className="deactivate-cancel-button"
                onClick={handleCancelDeactivate}
              >
                Cancel
              </button>

              <button
                type="button"
                className="deactivate-confirm-button"
                onClick={handleConfirmDeactivate}
              >
                Deactivate
              </button>

            </div>

          </div>

        </div>

      )}
{/* Logout Confirmation Popup */}
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

export default HealthcareWorkers;