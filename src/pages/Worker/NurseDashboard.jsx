
import { useEffect, useState } from "react";
import axios from "axios";
import WorkerNavbar from "../../components/WorkerNavbar";
import "../../styles/WorkerDashboard.css";

function NurseDashboard() {
  const [nurse] = useState(() => {
    const storedUser = localStorage.getItem("user");

    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [stats, setStats] = useState({
    totalAppointments: 0,
    availableAppointments: 0,
    completedAppointments: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!nurse?.id) {
        setError("Nurse information could not be found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/api/appointments/nurse/${nurse.id}/dashboard-stats`
        );

        setStats(response.data);
        setError("");
      } catch (err) {
        console.error("Error loading nurse dashboard statistics:", err);
        setError("Unable to load dashboard statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [nurse]);

  return (
    <div className="nurse-dashboard">
      <WorkerNavbar />

      <main className="nurse-dashboard-main">
        <div className="nurse-dashboard-container">

          <section className="nurse-dashboard-header">
            <div>
              <h1>
                Good morning, {nurse?.fullName || "Nurse"}
              </h1>

              <p>
                Manage appointments and patient assessments at your clinic.
              </p>
            </div>

            <div className="nurse-dashboard-date">
              <span>YOUR WORKSPACE</span>
              <strong>Nurse Dashboard</strong>
            </div>
          </section>

          {error && (
            <div className="dashboard-error">
              {error}
            </div>
          )}

          <section className="nurse-summary-grid">

            <div className="nurse-summary-card">
              <div className="nurse-summary-icon nurse-icon-blue">
                <span>▦</span>
              </div>

              <div className="nurse-summary-information">
                <p>Total Appointments</p>
                <h2>{loading ? "..." : stats.totalAppointments}</h2>
                <span>All appointments at your clinic</span>
              </div>
            </div>

            <div className="nurse-summary-card">
              <div className="nurse-summary-icon nurse-icon-green">
                <span>✓</span>
              </div>

              <div className="nurse-summary-information">
                <p>Available Appointments</p>
                <h2>{loading ? "..." : stats.availableAppointments}</h2>
                <span>Appointments waiting for a nurse</span>
              </div>
            </div>

            <div className="nurse-summary-card">
              <div className="nurse-summary-icon nurse-icon-purple">
                <span>✓</span>
              </div>

              <div className="nurse-summary-information">
                <p>Completed</p>
                <h2>{loading ? "..." : stats.completedAppointments}</h2>
                <span>Assessments completed by you</span>
              </div>
            </div>

          </section>

        </div>
      </main>
    </div>
  );
}

export default NurseDashboard;
