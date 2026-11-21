import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import PatientDashboard from "../pages/Patient/PatientDashboard";
import WorkerDashboard from "../pages/Worker/WorkerDashboard";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import ManageWorkers from "../pages/Admin/ManageWorkers";
import HealthcareWorkers from "../pages/Admin/HealthcareWorkers";
import Clinics from "../pages/Admin/Clinics";
import RegisterClinic from "../pages/Admin/RegisterClinic";
import Patients from "../pages/Admin/Patients";
import Announcements from "../pages/Admin/Announcements";
import CreateAnnouncement from "../pages/Admin/CreateAnnouncement";
import Settings from "../pages/Admin/Settings";
import WorkerPatients from "../pages/Worker/Patients";
import Appointments from "../pages/Patient/Appointments";
import WorkerAppointments from "../pages/Worker/Appointments";
import MedicalRecords from "../pages/Worker/MedicalRecords";
import PatientMedicalRecords from "../pages/Patient/MedicalRecords";
import MedicineInventory from "../pages/Worker/MedicineInventory";
import ManageMedicine from "../pages/Admin/ManageMedicine";
import NurseDashboard from "../pages/worker/NurseDashboard";
import Feedback from "../pages/patient/Feedback";
import AdminFeedback from "../pages/Admin/AdminFeedback";
import AdminFeedbackList from "../pages/Admin/AdminFeedbackList";
import PatientProfile from "../pages/patient/PatientProfile";
import NurseProfile from "../pages/worker/NurseProfile";
import WorkerPatientRecords from "../pages/Worker/WorkerPatientRecords";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Patient */}
        <Route
          path="/patient-dashboard"
          element={<PatientDashboard />}
        />

        <Route
            path="/appointments"
            element={<Appointments />}
        />
        <Route
          path="/patient-medical-records"
          element={<PatientMedicalRecords />}
        />
        <Route
          path="/patient-profile"
          element={<PatientProfile />}
        />

<Route path="/patient-feedback" element={<Feedback />} />




        {/* Healthcare Worker */}
        <Route
          path="/worker-dashboard"
          element={<WorkerDashboard />}
        />
        <Route
          path="/worker-patients"
          element={<WorkerPatients />}
        />
        <Route
          path="/worker-appointments"
          element={<WorkerAppointments />}
        />

        <Route path="/medical-records" element={<MedicalRecords />} />

        <Route
          path="/medicine-inventory"
          element={<MedicineInventory />}
        />

        <Route
          path="/worker/patients/:patientId"
          element={<WorkerPatientRecords />}
        />

{/* Nurse */}
<Route path="/nurse-dashboard" element={<NurseDashboard />} />
<Route path="/worker-profile" element={<NurseProfile />} />

        {/* System Admin */}
        <Route path="/admin-dashboard" element={<AdminDashboard />}/>
        <Route path="/manage-workers" element={<ManageWorkers />}/>
        <Route path="/healthcare-workers" element={<HealthcareWorkers />}/>
        <Route path="/clinics" element={<Clinics />} />
        <Route path="/register-clinic" element={<RegisterClinic />}/>
        <Route path="/patients" element={<Patients />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/create-announcement" element={<CreateAnnouncement />}/>
        <Route path="/settings" element={<Settings />} />
        <Route path="/manage-medicine" element={<ManageMedicine />}/>
<Route
  path="/admin-feedback"
  element={<AdminFeedback />}
/>
<Route path="/admin-feedback" element={<AdminFeedback />} />
<Route
  path="/admin-feedback-list"
  element={<AdminFeedbackList />}
/>
<Route
  path="/admin-feedback-list"
  element={<AdminFeedbackList />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;