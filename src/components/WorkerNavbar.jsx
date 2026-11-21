
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/WorkerNavbar.css";

function WorkerNavbar() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setShowLogoutModal(false);
    navigate("/login");
  };

  return (
    <>
      <nav className="worker-navbar">
        <Link to="/nurse-dashboard" className="worker-navbar-brand">
          Smart Rural Clinic
        </Link>

        <div className="worker-navbar-links">
          <NavLink
            to="/nurse-dashboard"
            className={({ isActive }) => isActive ? "active" : ""}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/worker-appointments"
            className={({ isActive }) => isActive ? "active" : ""}
          >
            Appointments
          </NavLink>

          <NavLink
            to="/worker-patients"
            className={({ isActive }) => isActive ? "active" : ""}
          >
            Patients & Records
          </NavLink>

          <NavLink
            to="/medicine-inventory"
            className={({ isActive }) => isActive ? "active" : ""}
          >
            Medicine Inventory
          </NavLink>

          <NavLink
            to="/worker-profile"
            className={({ isActive }) => isActive ? "active" : ""}
          >
            My Profile
          </NavLink>

          <button
            type="button"
            className="worker-logout"
            onClick={() => setShowLogoutModal(true)}
          >
            Logout
          </button>
        </div>
      </nav>

      {showLogoutModal && (
        <div className="worker-logout-overlay">
          <div
            className="worker-logout-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="worker-logout-title"
          >
            <div className="worker-logout-icon">!</div>

            <h3 id="worker-logout-title">Confirm Logout</h3>

            <p>
              Are you sure you want to logout of your account?
            </p>

            <div className="worker-logout-actions">
              <button
                type="button"
                className="worker-cancel-logout"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="worker-confirm-logout"
                onClick={handleLogout}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default WorkerNavbar;
