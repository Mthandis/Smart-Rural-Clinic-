import { useNavigate, useLocation } from "react-router-dom";
import "../styles/AdminSidebar.css";

function AdminSidebar() {

const navigate = useNavigate();
const location = useLocation();

const isActive = (path) => {
return location.pathname === path;
};

const handleLogout = () => {
localStorage.removeItem("user");
navigate("/login");
};

return ( <aside className="admin-sidebar">

  <div className="admin-sidebar-brand">
    <h2>Smart Rural Clinic</h2>
    <span>Administration</span>
  </div>


  <div className="admin-sidebar-menu">

    <p className="admin-sidebar-title">
      MENU
    </p>


    <button
      type="button"
      className={`admin-sidebar-link ${
        isActive("/admin-dashboard") ? "active" : ""
      }`}
      onClick={() => navigate("/admin-dashboard")}
    >
      <span className="admin-sidebar-icon">⌂</span>
      Dashboard
    </button>


    <button
      type="button"
      className={`admin-sidebar-link ${
        isActive("/healthcare-workers") ? "active" : ""
      }`}
      onClick={() => navigate("/healthcare-workers")}
    >
      <span className="admin-sidebar-icon">◉</span>
      Healthcare Workers
    </button>


    <button
      type="button"
      className={`admin-sidebar-link ${
        isActive("/clinics") ? "active" : ""
      }`}
      onClick={() => navigate("/clinics")}
    >
      <span className="admin-sidebar-icon">▣</span>
      Clinics
    </button>


    <button
      type="button"
      className={`admin-sidebar-link ${
        isActive("/patients") ? "active" : ""
      }`}
      onClick={() => navigate("/patients")}
    >
      <span className="admin-sidebar-icon">♙</span>
      Patients
    </button>


    <button
      type="button"
      className={`admin-sidebar-link ${
        isActive("/manage-medicine") ? "active" : ""
      }`}
      onClick={() => navigate("/manage-medicine")}
    >
      <span className="admin-sidebar-icon">▤</span>
      Medicine Inventory
    </button>


    <button
      type="button"
      className={`admin-sidebar-link ${
        isActive("/announcements") ? "active" : ""
      }`}
      onClick={() => navigate("/announcements")}
    >
      <span className="admin-sidebar-icon">▤</span>
      Announcements
    </button>


    <button
      type="button"
      className={`admin-sidebar-link ${
        isActive("/admin-settings") ? "active" : ""
      }`}
      onClick={() => navigate("/admin-settings")}
    >
      <span className="admin-sidebar-icon">⚙</span>
      Settings
    </button>

  </div>


  <div className="admin-sidebar-bottom">

    <div className="admin-sidebar-profile">

      <div className="admin-profile-icon">
        SA
      </div>

      <div>
        <strong>
          SA System Administrator
        </strong>

        <span>
          Administrator
        </span>
      </div>

    </div>


    <button
      type="button"
      className="admin-sidebar-logout"
      onClick={handleLogout}
    >
      Logout
    </button>

  </div>

</aside>


);
}

export default AdminSidebar;
