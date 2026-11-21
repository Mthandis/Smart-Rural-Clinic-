
import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import "../styles/PatientNavbar.css";

function PatientNavbar() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      <nav className="patient-navbar">
        <Link
          to="/patient-dashboard"
          className="patient-navbar-brand"
        >
          Smart Rural Clinic
        </Link>

        <div className="patient-navbar-links">
          <NavLink
            to="/patient-dashboard"
            end
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/appointments"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Appointments
          </NavLink>

          <NavLink
            to="/patient-medical-records"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Medical Records
          </NavLink>

          <NavLink
            to="/patient-profile"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Profile
          </NavLink>

          <NavLink
            to="/patient-feedback"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Submit Feedback
          </NavLink>

          <button
            type="button"
            className="patient-logout"
            onClick={() => setShowLogoutModal(true)}
          >
            Logout
          </button>
        </div>
      </nav>

      {showLogoutModal && (
        <div
          className="patient-logout-overlay"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="patient-logout-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="patient-logout-icon">?</div>

            <h2>Confirm Logout</h2>

            <p>
              Are you sure you want to logout of your account?
            </p>

            <div className="patient-logout-actions">
              <button
                type="button"
                className="patient-logout-cancel"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="patient-logout-confirm"
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

export default PatientNavbar;
