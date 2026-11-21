import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/Announcements.css";

function Announcements() {
  const navigate = useNavigate();

  const [announcements, setAnnouncements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);

  const [showDeactivatePopup, setShowDeactivatePopup] = useState(false);
  const [announcementToDeactivate, setAnnouncementToDeactivate] =
    useState(null);

  const [showActivatePopup, setShowActivatePopup] = useState(false);
  const [announcementToActivate, setAnnouncementToActivate] =
    useState(null);

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setError("");

      const response = await axios.get(
        "http://localhost:8080/api/admin/announcements"
      );

      setAnnouncements(response.data);
    } catch (error) {
      console.error("Unable to load announcements:", error);
      setError("Unable to load announcements.");
    }
  };

  // DEACTIVATE ANNOUNCEMENT

  const handleDeactivateClick = (announcement) => {
    setAnnouncementToDeactivate(announcement);
    setShowDeactivatePopup(true);
  };

  const handleCancelDeactivate = () => {
    setAnnouncementToDeactivate(null);
    setShowDeactivatePopup(false);
  };

  const handleConfirmDeactivate = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/admin/announcements/${announcementToDeactivate.id}/deactivate`
      );

      setAnnouncementToDeactivate(null);
      setShowDeactivatePopup(false);

      await fetchAnnouncements();

      setSuccessMessage("Announcement deactivated successfully.");
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Unable to deactivate announcement:", error);
      setError("Unable to deactivate announcement.");
    }
  };

  // ACTIVATE ANNOUNCEMENT

  const handleActivateClick = (announcement) => {
    setAnnouncementToActivate(announcement);
    setShowActivatePopup(true);
  };

  const handleCancelActivate = () => {
    setAnnouncementToActivate(null);
    setShowActivatePopup(false);
  };

  const handleConfirmActivate = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/admin/announcements/${announcementToActivate.id}/activate`
      );

      setAnnouncementToActivate(null);
      setShowActivatePopup(false);

      await fetchAnnouncements();

      setSuccessMessage("Announcement activated successfully.");
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Unable to activate announcement:", error);
      setError("Unable to activate announcement.");
    }
  };

  // DELETE ANNOUNCEMENT

  const handleDeleteClick = (announcement) => {
    setAnnouncementToDelete(announcement);
    setShowDeletePopup(true);
  };

  const handleCancelDelete = () => {
    setAnnouncementToDelete(null);
    setShowDeletePopup(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/api/admin/announcements/${announcementToDelete.id}`
      );

      setAnnouncementToDelete(null);
      setShowDeletePopup(false);

      await fetchAnnouncements();

      setSuccessMessage("Announcement deleted successfully.");
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Unable to delete announcement:", error);
      setError("Unable to delete announcement.");
    }
  };

  // SEARCH

  const filteredAnnouncements = announcements.filter(
    (announcement) =>
      announcement.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      announcement.message
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // LOGOUT

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
    <div className="announcements-page">

      {/* Sidebar */}
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
            className="sidebar-link active"
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
            onClick={handleLogoutClick}
          >
            Logout
          </button>

        </div>

      </aside>

      {/* Main content */}
      <main className="announcements-main">

        <header className="announcements-header">

          <div>
            <span>SYSTEM ADMINISTRATION</span>
            <h1>Announcements</h1>
          </div>

          <div className="header-profile">

            <strong>SA</strong>

            <div>
              <b>System Administrator</b>
              <span>Administrator</span>
            </div>

          </div>

        </header>

        <section className="announcements-content">

          <div className="announcement-top">

            <div>
              <h2>Announcements Management</h2>

              <p>
                Create and manage announcements for clinic users.
              </p>
            </div>

            <button
              className="create-announcement-button"
              onClick={() => navigate("/create-announcement")}
            >
              + Create Announcement
            </button>

          </div>

          {error && (
            <div className="announcement-error">
              {error}
            </div>
          )}

          <div className="announcement-toolbar">

            <input
              type="text"
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

          </div>

          {/* ANNOUNCEMENT TABLE */}

          <div className="announcement-table-container">

            <table className="announcement-table">

              <thead>
                <tr>
                  <th>Title</th>
                  <th>Message</th>
                  <th>Date Created</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredAnnouncements.length === 0 ? (

                  <tr>
                    <td
                      colSpan="5"
                      className="no-announcements"
                    >
                      No announcements found.
                    </td>
                  </tr>

                ) : (

                  filteredAnnouncements.map((announcement) => (

                    <tr key={announcement.id}>

                      <td>
                        {announcement.title}
                      </td>

                      <td className="announcement-message">
                        {announcement.message}
                      </td>

                      <td>
                        {announcement.createdAt
                          ? new Date(
                              announcement.createdAt
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      <td>

                        <span
                          className={
                            announcement.active
                              ? "status-active"
                              : "status-inactive"
                          }
                        >
                          {announcement.active
                            ? "Active"
                            : "Inactive"}
                        </span>

                      </td>

                      <td className="announcement-actions">

                        {announcement.active ? (

                          <button
                            className="deactivate-announcement"
                            onClick={() =>
                              handleDeactivateClick(
                                announcement
                              )
                            }
                          >
                            Deactivate
                          </button>

                        ) : (

                          <button
                            className="activate-announcement"
                            onClick={() =>
                              handleActivateClick(
                                announcement
                              )
                            }
                          >
                            Activate
                          </button>

                        )}

                        <button
                          className="delete-announcement"
                          onClick={() =>
                            handleDeleteClick(announcement)
                          }
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </section>

      </main>

      {/* DEACTIVATE CONFIRMATION */}

      {showDeactivatePopup && announcementToDeactivate && (

        <div className="popup-overlay">

          <div className="popup-box">

            <h3>Deactivate Announcement</h3>

            <p>
              Are you sure you want to deactivate{" "}
              <strong>
                "{announcementToDeactivate.title}"
              </strong>
              ?
            </p>

            <div className="popup-actions">

              <button
                className="popup-cancel"
                onClick={handleCancelDeactivate}
              >
                Cancel
              </button>

              <button
                className="popup-confirm"
                onClick={handleConfirmDeactivate}
              >
                Deactivate
              </button>

            </div>

          </div>

        </div>

      )}

      {/* ACTIVATE CONFIRMATION */}

      {showActivatePopup && announcementToActivate && (

        <div className="popup-overlay">

          <div className="popup-box">

            <h3>Activate Announcement</h3>

            <p>
              Are you sure you want to activate{" "}
              <strong>
                "{announcementToActivate.title}"
              </strong>
              ?
            </p>

            <div className="popup-actions">

              <button
                className="popup-cancel"
                onClick={handleCancelActivate}
              >
                Cancel
              </button>

              <button
                className="popup-confirm activate-confirm"
                onClick={handleConfirmActivate}
              >
                Activate
              </button>

            </div>

          </div>

        </div>

      )}

      {/* DELETE CONFIRMATION */}

      {showDeletePopup && announcementToDelete && (

        <div className="popup-overlay">

          <div className="popup-box">

            <h3>Delete Announcement</h3>

            <p>
              Are you sure you want to permanently delete{" "}
              <strong>
                "{announcementToDelete.title}"
              </strong>
              ?
            </p>

            <div className="popup-actions">

              <button
                className="popup-cancel"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>

              <button
                className="popup-confirm"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>

            </div>

          </div>

        </div>

      )}

      {/* SUCCESS POPUP */}

      {showSuccessPopup && (

        <div className="popup-overlay">

          <div className="popup-box success-popup">

            <div className="success-icon">
              ✓
            </div>

            <h3>Success</h3>

            <p>
              {successMessage}
            </p>

            <div className="popup-actions">

              <button
                className="success-ok-button"
                onClick={() => setShowSuccessPopup(false)}
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

export default Announcements;