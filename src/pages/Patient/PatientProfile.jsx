
import { useEffect, useState } from "react";
import axios from "axios";
import PatientNavbar from "../../components/PatientNavbar";
import "../../styles/PatientProfile.css";

function PatientProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Profile success modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Password states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordSuccessModal, setPasswordSuccessModal] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Editable profile information
  const [formData, setFormData] = useState({
    email: "",
    phone: ""
  });

  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Fetch patient profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) {
        setError("Patient information could not be found.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/api/users/${user.id}/profile`
        );

        setProfile(response.data);

        setFormData({
          email: response.data.email || "",
          phone: response.data.phone || ""
        });

      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Unable to load your profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle profile input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Cancel profile editing
  const handleCancel = () => {
    setFormData({
      email: profile.email || "",
      phone: profile.phone || ""
    });

    setEditing(false);
    setError("");
  };

  // Save profile changes
  const handleSave = async () => {
    setError("");

    if (!formData.email.trim() || !formData.phone.trim()) {
      setError("Email address and phone number are required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!/^[0-9+\s()-]{10,15}$/.test(formData.phone)) {
      setError("Please enter a valid phone number.");
      return;
    }

    try {
      setSaving(true);

      const response = await axios.put(
        `http://localhost:8080/api/users/${user.id}/profile`,
        {
          email: formData.email.trim(),
          phone: formData.phone.trim()
        }
      );

      setProfile({
        ...profile,
        email: response.data.email,
        phone: response.data.phone
      });

      setFormData({
        email: response.data.email,
        phone: response.data.phone
      });

      setEditing(false);
      setShowSuccessModal(true);

    } catch (err) {
      console.error("Error updating profile:", err);

      setError(
        typeof err.response?.data === "string"
          ? err.response.data
          : "Unable to update your profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // Handle password input changes
  const handlePasswordInputChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  // Reset password form
  const resetPasswordForm = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });

    setPasswordError("");
  };

  // Cancel password change
  const handlePasswordCancel = () => {
    setShowPasswordModal(false);
    resetPasswordForm();
  };

  // Change patient password
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");

    const {
      currentPassword,
      newPassword,
      confirmPassword
    } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please complete all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError(
        "Your new password must contain at least 8 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Your new passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError(
        "Your new password must be different from your current password."
      );
      return;
    }

    try {
      setPasswordSaving(true);

      await axios.post(
        "http://localhost:8080/api/auth/change-password",
        {
          userId: String(user.id),
          currentPassword,
          newPassword
        }
      );

      setShowPasswordModal(false);
      resetPasswordForm();
      setPasswordSuccessModal(true);

    } catch (err) {
      console.error("Error changing password:", err);

      setPasswordError(
        typeof err.response?.data === "string"
          ? err.response.data
          : "Unable to change your password. Please try again."
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="patient-profile-page">

      <PatientNavbar />

      <main className="patient-profile-content">

        {/* PAGE HEADER */}
        <div className="patient-profile-header">
          <div>
            <h1>My Profile</h1>
            <p>View and manage your personal information.</p>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="patient-profile-message">
            Loading your profile...
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="patient-profile-error">
            {error}
          </div>
        )}

        {!loading && !error && profile && (
          <div className="patient-profile-card">

            {/* PROFILE HEADER */}
            <div className="patient-profile-card-header">

              <div className="patient-profile-avatar">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                </svg>
              </div>

              <div>
                <h2>{profile.fullName}</h2>
                <span>Patient Account</span>
              </div>

            </div>

            {/* PERSONAL INFORMATION */}
            <div className="patient-profile-section">

              <div className="patient-profile-section-heading">

                <div>
                  <h3>Personal Information</h3>
                  <p>Your registered personal details</p>
                </div>

                {!editing && (
                  <button
                    type="button"
                    className="patient-profile-edit-btn"
                    onClick={() => setEditing(true)}
                  >
                    Edit Profile
                  </button>
                )}

              </div>

              <div className="patient-profile-details-grid">

                <div className="patient-profile-field">
                  <label>Full Name</label>
                  <div>{profile.fullName || "-"}</div>
                </div>

                <div className="patient-profile-field">
                  <label>ID Number</label>
                  <div>{profile.idNumber || "-"}</div>
                </div>

                <div className="patient-profile-field">
                  <label>Email Address</label>

                  {editing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                    />
                  ) : (
                    <div>{profile.email || "-"}</div>
                  )}

                </div>

                <div className="patient-profile-field">
                  <label>Phone Number</label>

                  {editing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <div>{profile.phone || "-"}</div>
                  )}

                </div>

              </div>

              {/* PROFILE EDIT ACTIONS */}
              {editing && (
                <div className="patient-profile-edit-actions">

                  <button
                    type="button"
                    className="patient-profile-cancel-btn"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="patient-profile-save-btn"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>

                </div>
              )}

            </div>

            {/* CLINIC INFORMATION */}
            <div className="patient-profile-section">

              <div className="patient-profile-section-heading">

                <div>
                  <h3>Clinic Information</h3>
                  <p>Your registered healthcare facility</p>
                </div>

                <span className="patient-profile-readonly">
                  Read only
                </span>

              </div>

              {profile.clinic ? (
                <div className="patient-profile-details-grid">

                  <div className="patient-profile-field">
                    <label>Registered Clinic</label>
                    <div>
                      {profile.clinic.clinicName || "-"}
                    </div>
                  </div>

                  <div className="patient-profile-field">
                    <label>Location</label>
                    <div>
                      {profile.clinic.location || "-"}
                    </div>
                  </div>

                  <div className="patient-profile-field">
                    <label>Clinic Contact Number</label>
                    <div>
                      {profile.clinic.contactNumber || "-"}
                    </div>
                  </div>

                </div>
              ) : (
                <p className="patient-profile-no-clinic">
                  No clinic information is available.
                </p>
              )}

            </div>

            {/* ACCOUNT SETTINGS */}
            <div className="patient-profile-section">

              <div className="patient-profile-section-heading">

                <div>
                  <h3>Account Settings</h3>
                  <p>Manage your account security</p>
                </div>

              </div>

              <div className="patient-profile-password-row">

                <div>
                  <strong>Password</strong>
                  <p>
                    Keep your account secure by updating your password.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    resetPasswordForm();
                    setShowPasswordModal(true);
                  }}
                >
                  Change Password
                </button>

              </div>

            </div>

          </div>
        )}

        {/* PROFILE SUCCESS MODAL */}
        {showSuccessModal && (
          <div className="profile-success-overlay">

            <div className="profile-success-modal">

              <div className="profile-success-icon">
                ✓
              </div>

              <h2>Success!</h2>

              <p>
                Your profile has been updated successfully.
              </p>

              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
              >
                Okay
              </button>

            </div>

          </div>
        )}

        {/* CHANGE PASSWORD MODAL */}
        {showPasswordModal && (
          <div className="profile-success-overlay">

            <div className="profile-password-modal">

              <h2>Change Password</h2>

              <p>
                Enter your current password and choose a new password.
              </p>

              {passwordError && (
                <div className="patient-profile-error">
                  {passwordError}
                </div>
              )}

              <form onSubmit={handlePasswordChange}>

                <div className="password-modal-field">
                  <label>Current Password</label>

                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordInputChange}
                    placeholder="Enter current password"
                    autoComplete="current-password"
                  />
                </div>

                <div className="password-modal-field">
                  <label>New Password</label>

                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordInputChange}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                  />
                </div>

                <div className="password-modal-field">
                  <label>Confirm New Password</label>

                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordInputChange}
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                  />
                </div>

                <div className="password-modal-actions">

                  <button
                    type="button"
                    className="patient-profile-cancel-btn"
                    onClick={handlePasswordCancel}
                    disabled={passwordSaving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="patient-profile-save-btn"
                    disabled={passwordSaving}
                  >
                    {passwordSaving
                      ? "Updating..."
                      : "Update Password"}
                  </button>

                </div>

              </form>

            </div>

          </div>
        )}

        {/* PASSWORD SUCCESS MODAL */}
        {passwordSuccessModal && (
          <div className="profile-success-overlay">

            <div className="profile-success-modal">

              <div className="profile-success-icon">
                ✓
              </div>

              <h2>Success!</h2>

              <p>
                Your password has been changed successfully.
              </p>

              <button
                type="button"
                onClick={() => setPasswordSuccessModal(false)}
              >
                Okay
              </button>

            </div>

          </div>
        )}

      </main>
    </div>
  );
}

export default PatientProfile;
