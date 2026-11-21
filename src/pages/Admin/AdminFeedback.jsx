import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/AdminFeedback.css";

function AdminFeedback() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState({
    totalFeedback: 0,
    positive: 0,
    negative: 0,
    neutral: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/feedback/summary"
      );

      setSummary(response.data);
    } catch (err) {
      setError("Unable to load feedback analysis.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="admin-dashboard">

      {/* SIDEBAR */}
      <aside className="admin-sidebar">

        <div className="sidebar-brand">
          <h2>Smart Rural Clinic</h2>
          <p>Administration</p>
        </div>

        <nav className="sidebar-navigation">

          <button
            className="sidebar-link"
            onClick={() => navigate("/admin-dashboard")}
          >
            <span className="sidebar-icon">⌂</span>
            Dashboard
          </button>

          <button
            className="sidebar-link"
            onClick={() => navigate("/manage-workers")}
          >
            <span className="sidebar-icon">♙</span>
            Healthcare Workers
          </button>

          <button
            className="sidebar-link"
            onClick={() => navigate("/clinics")}
          >
            <span className="sidebar-icon">⌂</span>
            Clinics
          </button>

          <button
            className="sidebar-link"
            onClick={() => navigate("/patients")}
          >
            <span className="sidebar-icon">♧</span>
            Patients
          </button>

          <button
            className="sidebar-link"
            onClick={() => navigate("/manage-medicine")}
          >
            <span className="sidebar-icon">✚</span>
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
            className="sidebar-link active"
            onClick={() => navigate("/admin-feedback")}
          >
            <span className="sidebar-icon">▣</span>
            Patient Feedback
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
          <button
            className="logout-button"
            onClick={() => setShowLogoutPopup(true)}
          >
            Logout
          </button>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">

        <header className="admin-header">
          <div>
            <h1>Patient Feedback</h1>
            <p>Feedback sentiment analysis and patient satisfaction</p>
          </div>
        </header>

        <section className="admin-content">

          <div className="feedback-intro">
            <h2>Feedback Analysis Overview</h2>
            <p>
              Review patient feedback and identify positive and negative
              experiences across clinics.
            </p>
          </div>

          {loading ? (
            <p>Loading feedback analysis...</p>
          ) : error ? (
            <p className="feedback-error">{error}</p>
          ) : (
            <div className="feedback-summary">

              <div className="feedback-card total">
                <span>Total Feedback</span>
                <h2>{summary.totalFeedback}</h2>
              </div>

              <div className="feedback-card positive">
                <span>Positive Feedback</span>
                <h2>{summary.positive}</h2>
              </div>

              <div className="feedback-card negative">
                <span>Negative Feedback</span>
                <h2>{summary.negative}</h2>
              </div>

              <div className="feedback-card neutral">
                <span>Neutral Feedback</span>
                <h2>{summary.neutral}</h2>
              </div>

            </div>
          )}

          <div className="feedback-analysis-section">

            <div>
              <h3>Patient Feedback Records</h3>
              <p>
                View submitted feedback, patient comments and their
                sentiment classifications.
              </p>
            </div>

            <button
              className="view-feedback-button"
              onClick={() => navigate("/admin-feedback-list")}
            >
              View Actual Feedback
            </button>

          </div>

        </section>

      </main>

      {/* LOGOUT CONFIRMATION */}
      {showLogoutPopup && (
        <div className="logout-popup-overlay">
          <div className="logout-popup">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>

            <div className="logout-popup-actions">
              <button onClick={handleLogout}>Yes</button>
              <button onClick={() => setShowLogoutPopup(false)}>
                No
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminFeedback;