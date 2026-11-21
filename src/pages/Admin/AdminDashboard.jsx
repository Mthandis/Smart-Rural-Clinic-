import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [workerCount, setWorkerCount] = useState(0);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  useEffect(() => {
    fetchWorkerCount();
  }, []);

  const fetchWorkerCount = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/admin/workers/count"
      );

      setWorkerCount(response.data);
    } catch (error) {
      console.error("Unable to load worker count:", error);
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
    <div className="admin-dashboard">

      {/* Sidebar */}
      <aside className="admin-sidebar">

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
            className="sidebar-link active"
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
           className="sidebar-link"
           onClick={() => navigate("/clinics")}
         >
           <span className="sidebar-icon">▣</span>
           Clinics
         </button>


       <button
         className="sidebar-link"
         onClick={() => navigate("/patients")}
       >
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
         onClick={() => navigate("/announcements")}
       >
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
      <main className="admin-main">

        {/* Header */}
        <header className="admin-header">

          <div>
            <p className="admin-label">
              SYSTEM ADMINISTRATION
            </p>

            <h1>
              Dashboard
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


        {/* Dashboard Content */}
        <div className="admin-content">

          <section className="dashboard-overview">

            <p className="overview-label">
              OVERVIEW
            </p>

            <h2>
              System Overview
            </h2>

            <p className="overview-description">
              View the current status of the Smart Rural Clinic system.
            </p>


            {/* Statistics */}
            <div className="admin-summary">

              {/* Healthcare Workers */}
              <div className="summary-item">

                <div className="summary-icon">
                  ◉
                </div>

                <div>
                  <span>
                    Healthcare Workers
                  </span>

                  <strong>
                    {workerCount}
                  </strong>

                  <small>
                    Registered workers
                  </small>
                </div>

              </div>


              {/* Clinics */}
              <div className="summary-item">

                <div className="summary-icon">
                  ▣
                </div>

                <div>
                  <span>
                    Clinics
                  </span>

                  <strong>
                    0
                  </strong>

                  <small>
                    Registered clinics
                  </small>
                </div>

              </div>


              {/* Patients */}
              <div className="summary-item">

                <div className="summary-icon">
                  ♙
                </div>

                <div>
                  <span>
                    Patients
                  </span>

                  <strong>
                    1
                  </strong>

                  <small>
                    Registered patients
                  </small>
                </div>

              </div>


              {/* System Status */}
              <div className="summary-item">

                <div className="summary-icon">
                  ●
                </div>

                <div>
                  <span>
                    System Status
                  </span>

                  <strong className="status-text">
                    Active
                  </strong>

                  <small>
                    Operating normally
                  </small>
                </div>

              </div>

            </div>

          </section>

        </div>

      </main>


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

export default AdminDashboard;