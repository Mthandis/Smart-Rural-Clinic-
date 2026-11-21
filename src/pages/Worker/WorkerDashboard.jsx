
import WorkerNavbar from "../../components/WorkerNavbar";
import "../../styles/WorkerDashboard.css";

function WorkerDashboard() {

  // Get the logged-in worker from localStorage
  const storedUser = localStorage.getItem("user");
  const worker = storedUser ? JSON.parse(storedUser) : null;

  // Format the role for display
  const formattedRole =
    worker?.role
      ? worker.role.charAt(0) + worker.role.slice(1).toLowerCase()
      : "Healthcare Worker";

  return (
    <div className="worker-dashboard">
      <WorkerNavbar />

      <main className="worker-dashboard-main">
        <div className="worker-dashboard-container">

          {/* Page Header */}
          <section className="worker-dashboard-header">
            <div>
              <h1>
                Good morning, {worker?.fullName || "Healthcare Worker"}
              </h1>

              <p>{formattedRole}</p>
            </div>
          </section>

          {/* Summary */}
          <section className="worker-summary">

            <div className="worker-summary-item">
              <span>Today's Appointments</span>
              <strong>8</strong>
            </div>

            <div className="worker-summary-item">
              <span>Patients</span>
              <strong>24</strong>
            </div>

            <div className="worker-summary-item">
              <span>Pending Tasks</span>
              <strong>3</strong>
            </div>

          </section>

          {/* Today's Appointments */}
          <section className="worker-content-section">

            <div className="worker-section-heading">
              <h2>Today's Appointments</h2>
              <p>Your scheduled appointments for today.</p>
            </div>

            <div className="worker-table">

              <div className="worker-table-row worker-table-header">
                <span>Patient</span>
                <span>Time</span>
                <span>Type</span>
                <span>Status</span>
              </div>

              <div className="worker-table-row">
                <span>Patient 1</span>
                <span>09:00</span>
                <span>Consultation</span>
                <span className="status-upcoming">
                  Upcoming
                </span>
              </div>

              <div className="worker-table-row">
                <span>Patient 2</span>
                <span>10:30</span>
                <span>Follow-up</span>
                <span className="status-upcoming">
                  Upcoming
                </span>
              </div>

              <div className="worker-table-row">
                <span>Patient 3</span>
                <span>12:00</span>
                <span>Consultation</span>
                <span className="status-completed">
                  Completed
                </span>
              </div>

            </div>

          </section>

          {/* Recent Patients */}
          <section className="worker-content-section">

            <div className="worker-section-heading">
              <h2>Recent Patients</h2>
              <p>Patients you recently attended to.</p>
            </div>

            <div className="worker-table">

              <div className="worker-table-row worker-table-header">
                <span>Patient</span>
                <span>Patient ID</span>
                <span>Last Visit</span>
                <span>Action</span>
              </div>

              <div className="worker-table-row">
                <span>Patient 1</span>
                <span>PT-001</span>
                <span>25 Sep 2026</span>
                <button className="worker-view-button">
                  View
                </button>
              </div>

              <div className="worker-table-row">
                <span>Patient 2</span>
                <span>PT-002</span>
                <span>24 Sep 2026</span>
                <button className="worker-view-button">
                  View
                </button>
              </div>

              <div className="worker-table-row">
                <span>Patient 3</span>
                <span>PT-003</span>
                <span>23 Sep 2026</span>
                <button className="worker-view-button">
                  View
                </button>
              </div>

            </div>

          </section>

        </div>
      </main>
    </div>
  );
}

export default WorkerDashboard;
