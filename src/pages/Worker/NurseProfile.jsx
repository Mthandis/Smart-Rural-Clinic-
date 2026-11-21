
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import WorkerNavbar from "../../components/WorkerNavbar";
import "../../styles/NurseProfile.css";

function NurseProfile() {
  const navigate = useNavigate();

  const [user] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // Modal feedback state
  const [feedback, setFeedback] = useState({
    show: false,
    type: "",
    message: ""
  });

  const showFeedback = (type, message) => {
    setFeedback({
      show: true,
      type,
      message
    });
  };

  const closeFeedback = () => {
    setFeedback({
      show: false,
      type: "",
      message: ""
    });
  };

  useEffect(() => {
    if (!user || !user.id) {
      navigate("/login");
      return;
    }

    if (user.role?.toUpperCase() !== "NURSE") {
      navigate("/login");
      return;
    }

    fetchProfile();
  }, []);

  // Fetch nurse profile
  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/users/${user.id}/nurse-profile`
      );

      setProfile(response.data);
      setEmail(response.data.email || "");
      setPhone(response.data.phone || "");
    } catch (err) {
      showFeedback(
        "error",
        typeof err.response?.data === "string"
          ? err.response.data
          : "Unable to load your profile."
      );
    } finally {
      setLoading(false);
    }
  };

  // Update nurse profile
  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    closeFeedback();
    setSaving(true);

    try {
      await axios.put(
        `http://localhost:8080/api/users/${user.id}/nurse-profile`,
        {
          email,
          phone
        }
      );

      await fetchProfile();

      showFeedback(
        "success",
        "Your profile has been updated successfully."
      );
    } catch (err) {
      showFeedback(
        "error",
        typeof err.response?.data === "string"
          ? err.response.data
          : "Unable to update your profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // Change nurse password
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    closeFeedback();

    if (newPassword.length < 8) {
      showFeedback(
        "error",
        "Your new password must contain at least 8 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      showFeedback(
        "error",
        "Your new passwords do not match."
      );
      return;
    }

    if (newPassword === currentPassword) {
      showFeedback(
        "error",
        "Your new password must be different from your current password."
      );
      return;
    }

    setChangingPassword(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/change-nurse-password",
        {
          userId: String(user.id),
          currentPassword,
          newPassword
        }
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      showFeedback(
        "success",
        typeof response.data === "string"
          ? response.data
          : "Your password has been changed successfully."
      );

    } catch (err) {
      showFeedback(
        "error",
        typeof err.response?.data === "string"
          ? err.response.data
          : "Unable to change your password. Please try again."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <>
        <WorkerNavbar />

        <div className="nurse-profile-loading">
          Loading your profile...
        </div>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <WorkerNavbar />

        <div className="nurse-profile-container">
          <p>Profile information could not be found.</p>
        </div>

        {feedback.show && (
          <div className="nurse-feedback-overlay">
            <div className="nurse-feedback-modal">

              <div className={`nurse-feedback-icon ${feedback.type}`}>
                {feedback.type === "success" ? "✓" : "!"}
              </div>

              <h2>
                {feedback.type === "success"
                  ? "Success!"
                  : "Something went wrong"}
              </h2>

              <p>{feedback.message}</p>

              <button
                type="button"
                onClick={closeFeedback}
                className="nurse-feedback-button"
              >
                OK
              </button>

            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <WorkerNavbar />

      <main className="nurse-profile-container">

        <div className="nurse-profile-heading">
          <div>
            <h1>My Profile</h1>
            <p>View and manage your personal account information.</p>
          </div>
        </div>

        {/* Personal Information */}
        <section className="nurse-profile-card">

          <div className="nurse-profile-card-heading">
            <div>
              <h2>Personal Information</h2>
              <p>
                View your registered details and update your contact information.
              </p>
            </div>
          </div>

          <form onSubmit={handleProfileUpdate}>

            <div className="nurse-profile-grid">

              <div className="nurse-profile-field">
                <label>Full Name</label>
                <input
                  type="text"
                  value={profile.fullName || ""}
                  readOnly
                />
              </div>

              <div className="nurse-profile-field">
                <label>ID Number</label>
                <input
                  type="text"
                  value={profile.idNumber || ""}
                  readOnly
                />
              </div>

              <div className="nurse-profile-field">
                <label>Speciality</label>
                <input
                  type="text"
                  value={profile.speciality || "Not specified"}
                  readOnly
                />
              </div>

              <div className="nurse-profile-field">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="nurse-profile-field">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

            </div>

            <div className="nurse-profile-actions">
              <button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </form>
        </section>

        {/* Clinic Information */}
        <section className="nurse-profile-card">

          <div className="nurse-profile-card-heading">
            <div>
              <h2>Clinic Information</h2>
              <p>Your currently registered healthcare facility.</p>
            </div>
          </div>

          {profile.clinic ? (
            <div className="nurse-profile-grid">

              <div className="nurse-profile-field">
                <label>Clinic Name</label>
                <input
                  type="text"
                  value={profile.clinic.clinicName || ""}
                  readOnly
                />
              </div>

              <div className="nurse-profile-field">
                <label>Location</label>
                <input
                  type="text"
                  value={profile.clinic.location || ""}
                  readOnly
                />
              </div>

              <div className="nurse-profile-field">
                <label>Clinic Contact Number</label>
                <input
                  type="text"
                  value={profile.clinic.contactNumber || ""}
                  readOnly
                />
              </div>

            </div>
          ) : (
            <p className="nurse-profile-empty">
              No clinic has been assigned to your account.
            </p>
          )}

        </section>

        {/* Change Password */}
        <section className="nurse-profile-card">

          <div className="nurse-profile-card-heading">
            <div>
              <h2>Change Password</h2>
              <p>
                Update your account password to keep your account secure.
              </p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange}>

            <div className="nurse-profile-grid">

              <div className="nurse-profile-field">
                <label>Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div className="nurse-profile-field">
                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  minLength="8"
                  required
                />
              </div>

              <div className="nurse-profile-field">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  minLength="8"
                  required
                />
              </div>

            </div>

            <div className="nurse-profile-actions">
              <button type="submit" disabled={changingPassword}>
                {changingPassword
                  ? "Updating..."
                  : "Change Password"}
              </button>
            </div>

          </form>
        </section>

      </main>

      {/* Feedback Modal */}
      {feedback.show && (
        <div className="nurse-feedback-overlay">
          <div className="nurse-feedback-modal">

            <div className={`nurse-feedback-icon ${feedback.type}`}>
              {feedback.type === "success" ? "✓" : "!"}
            </div>

            <h2>
              {feedback.type === "success"
                ? "Success!"
                : "Something went wrong"}
            </h2>

            <p>{feedback.message}</p>

            <button
              type="button"
              onClick={closeFeedback}
              className="nurse-feedback-button"
            >
              OK
            </button>

          </div>
        </div>
      )}

    </>
  );
}

export default NurseProfile;
