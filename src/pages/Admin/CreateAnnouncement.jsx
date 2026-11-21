import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/CreateAnnouncement.css";

function CreateAnnouncement() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !message.trim()) {
      setError("Please enter both a title and message.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8080/api/admin/announcements",
        {
          title: title.trim(),
          message: message.trim(),
        }
      );

      setTitle("");
      setMessage("");

      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Unable to create announcement:", error);

      if (error.response && error.response.data) {
        setError(error.response.data);
      } else {
        setError("Unable to create announcement.");
      }
    }
  };

  const handleSuccessOkay = () => {
    setShowSuccessPopup(false);
    navigate("/announcements");
  };

  const handleCancel = () => {
    navigate("/announcements");
  };

  return (
    <div className="create-announcement-page">

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
            className="sidebar-link active"
            onClick={() => navigate("/announcements")}
          >
            <span className="sidebar-icon">▤</span>
            Announcements
          </button>

          <button
            className="sidebar-link"
            onClick={() => navigate("/settings")}
          >
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
            onClick={() => navigate("/login")}
          >
            Logout
          </button>

        </div>

      </aside>

      {/* MAIN CONTENT */}

      <main className="create-announcement-main">

        <header className="create-announcement-header">

          <div>
            <span>SYSTEM ADMINISTRATION</span>
            <h1>Create Announcement</h1>
          </div>

          <div className="header-profile">

            <strong>SA</strong>

            <div>
              <b>System Administrator</b>
              <span>Administrator</span>
            </div>

          </div>

        </header>

        <section className="create-announcement-content">

          <div className="create-announcement-top">

            <div>
              <h2>Create Announcement</h2>

              <p>
                Create an announcement for clinic users.
              </p>
            </div>

          </div>

          {error && (
            <div className="announcement-error">
              {error}
            </div>
          )}

          <form
            className="create-announcement-form"
            onSubmit={handleSubmit}
          >

            <div className="form-group">

              <label>
                Announcement Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter announcement title"
              />

            </div>

            <div className="form-group">

              <label>
                Message
              </label>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter announcement message"
                rows="7"
              />

            </div>

            <div className="form-actions">

              <button
                type="button"
                className="cancel-announcement-button"
                onClick={handleCancel}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-announcement-button"
              >
                Publish Announcement
              </button>

            </div>

          </form>

        </section>

      </main>

      {/* SUCCESS POPUP */}

      {showSuccessPopup && (

        <div className="popup-overlay">

          <div className="popup-box success-popup">

            <div className="success-icon">
              ✓
            </div>

            <h3>Success</h3>

            <p>
              Announcement published successfully.
            </p>

            <div className="popup-actions">

              <button
                className="success-ok-button"
                onClick={handleSuccessOkay}
              >
                OK
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default CreateAnnouncement;