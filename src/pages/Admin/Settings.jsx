import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/Settings.css";

function Settings() {
  const navigate = useNavigate();

  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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

  const handleChangePassword = () => {
    setPasswordError("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswordPopup(true);
  };

  const handleClosePasswordPopup = () => {
    if (isSaving) return;

    setShowPasswordPopup(false);
    setPasswordError("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();

    setPasswordError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please complete all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        "New password and confirmation password do not match."
      );
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.id) {
      setPasswordError(
        "Administrator account could not be found. Please log in again."
      );
      return;
    }

    setIsSaving(true);

    try {
      await axios.put(
        `http://localhost:8080/api/admin/change-password/${user.id}`,
        {
          currentPassword: currentPassword,
          newPassword: newPassword,
        }
      );

      setShowPasswordPopup(false);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError("");

      setShowSuccessPopup(true);
    } catch (error) {
      if (error.response && error.response.data) {
        setPasswordError(error.response.data);
      } else {
        setPasswordError(
          "Unable to change password. Please try again."
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
  };

  return (
    <div className="settings-page">

      {/* SIDEBAR */}

      <aside className="admin-sidebar">

        <div className="sidebar-brand">
          <h2>Smart Rural Clinic</h2>
          <span>Administration</span>
        </div>

        <nav className="sidebar-menu">

          <p className="menu-title">MENU</p>

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

          <button className="sidebar-link active">
            <span className="sidebar-icon">⚙</span>
            Settings
          </button>

        </nav>

        <div className="sidebar-bottom">

          <div className="admin-profile">
            <strong>System Administrator</strong>
            <span>Administrator</span>
          </div>

          <button
            className="logout-button"
            onClick={handleLogoutClick}
          >
            Logout
          </button>

        </div>

      </aside>

      {/* MAIN CONTENT */}

      <main className="settings-main">

        <header className="settings-header">

          <div>
            <span>SYSTEM ADMINISTRATION</span>
            <h1>Settings</h1>
          </div>

          <div className="header-profile">

            <strong>SA</strong>

            <div>
              <b>System Administrator</b>
              <span>Administrator</span>
            </div>

          </div>

        </header>

        <section className="settings-content">

          <div className="settings-title">

            <h2>System Settings</h2>

            <p>
              Manage your administrator account and system settings.
            </p>

          </div>

          {/* ADMINISTRATOR PROFILE */}

          <div className="settings-section">

            <div className="settings-section-header">

              <div>

                <h3>Administrator Profile</h3>

                <p>
                  Information about the current system administrator.
                </p>

              </div>

            </div>

            <div className="profile-details">

              <div className="profile-detail">

                <span>Name</span>

                <strong>
                  System Administrator
                </strong>

              </div>

              <div className="profile-detail">

                <span>Role</span>

                <strong>
                  Administrator
                </strong>

              </div>

              <div className="profile-detail">

                <span>Account Status</span>

                <strong className="account-active">
                  Active
                </strong>

              </div>

            </div>

          </div>

          {/* ACCOUNT SETTINGS */}

          <div className="settings-section">

            <div className="settings-section-header">

              <div>

                <h3>Account Settings</h3>

                <p>
                  Manage your administrator account security.
                </p>

              </div>

            </div>

            <div className="setting-row">

              <div>

                <strong>Change Password</strong>

                <p>
                  Update the password used to access the system.
                </p>

              </div>

              <button
                className="settings-button"
                onClick={handleChangePassword}
              >
                Change Password
              </button>

            </div>

          </div>

          {/* SYSTEM INFORMATION */}

          <div className="settings-section">

            <div className="settings-section-header">

              <div>

                <h3>System Information</h3>

                <p>
                  General information about the Smart Rural Clinic system.
                </p>

              </div>

            </div>

            <div className="profile-details">

              <div className="profile-detail">

                <span>System Name</span>

                <strong>
                  Smart Rural Clinic
                </strong>

              </div>

              <div className="profile-detail">

                <span>System Status</span>

                <strong className="account-active">
                  Active
                </strong>

              </div>

            </div>

          </div>

        </section>

      </main>

      {/* CHANGE PASSWORD POPUP */}

      {showPasswordPopup && (

        <div className="popup-overlay">

          <div className="popup-box password-popup">

            <h3>Change Password</h3>

            <p>
              Enter your current password and choose a new password.
            </p>

            {passwordError && (

              <div className="password-error">
                {passwordError}
              </div>

            )}

            <form onSubmit={handleSavePassword}>

              <div className="password-form-group">

                <label>
                  Current Password
                </label>

                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) =>
                    setCurrentPassword(e.target.value)
                  }
                  disabled={isSaving}
                />

              </div>

              <div className="password-form-group">

                <label>
                  New Password
                </label>

                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                  disabled={isSaving}
                />

              </div>

              <div className="password-form-group">

                <label>
                  Confirm New Password
                </label>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  disabled={isSaving}
                />

              </div>

              <div className="popup-actions">

                <button
                  type="button"
                  className="popup-cancel"
                  onClick={handleClosePasswordPopup}
                  disabled={isSaving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="popup-confirm"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Password"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* PASSWORD SUCCESS POPUP */}

      {showSuccessPopup && (

        <div className="popup-overlay">

          <div className="popup-box">

            <div className="success-icon">
              ✓
            </div>

            <h3>Password Updated</h3>

            <p>
              Your administrator password has been successfully updated.
            </p>

            <div className="popup-actions">

              <button
                className="popup-confirm"
                onClick={handleCloseSuccessPopup}
              >
                OK
              </button>

            </div>

          </div>

        </div>

      )}

      {/* LOGOUT CONFIRMATION */}

      {showLogoutPopup && (

        <div className="popup-overlay">

          <div className="popup-box">

            <h3>Logout</h3>

            <p>
              Are you sure you want to logout?
            </p>

            <div className="popup-actions">

              <button
                className="popup-cancel"
                onClick={handleCancelLogout}
              >
                Cancel
              </button>

              <button
                className="popup-confirm"
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

export default Settings;