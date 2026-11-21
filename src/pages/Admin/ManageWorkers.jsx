
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/ManageWorkers.css";

function ManageWorkers() {
  const navigate = useNavigate();

  const [clinics, setClinics] = useState([]);
  const [clinicSearch, setClinicSearch] = useState("");
  const [showClinicDropdown, setShowClinicDropdown] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    idNumber: "",
    email: "",
    phone: "",
    password: "",
    role: "",
    speciality: "",
    clinic: {
      id: "",
    },
  });

  const [selectedClinicName, setSelectedClinicName] = useState("");

  const [error, setError] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // =========================
  // LOAD CLINICS
  // =========================

  useEffect(() => {
    fetchClinics();
  }, []);

  const fetchClinics = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/admin/clinics"
      );

      const activeClinics = response.data.filter(
        (clinic) => clinic.active
      );

      setClinics(activeClinics);

    } catch (error) {
      console.error("Unable to load clinics:", error);
      setError("Unable to load clinics.");
    }
  };


  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear speciality when role is changed
    if (name === "role" && value !== "DOCTOR") {

      setFormData((previousData) => ({
        ...previousData,
        role: value,
        speciality: "",
      }));
    }
  };


  // =========================
  // SELECT CLINIC
  // =========================

  const handleClinicSelect = (clinic) => {

    setFormData({
      ...formData,
      clinic: {
        id: clinic.id,
      },
    });

    setSelectedClinicName(clinic.clinicName);

    setClinicSearch("");

    setShowClinicDropdown(false);
  };


  // =========================
  // FILTER CLINICS
  // =========================

  const filteredClinics = clinics.filter((clinic) =>
    clinic.clinicName
      .toLowerCase()
      .includes(clinicSearch.toLowerCase())
  );


  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    if (!formData.clinic.id) {

      setError("Please select a clinic.");

      return;
    }

    if (
      formData.role === "DOCTOR" &&
      !formData.speciality.trim()
    ) {

      setError("Please select the doctor's speciality.");

      return;
    }

    try {

      await axios.post(
        "http://localhost:8080/api/admin/workers",
        formData
      );

      setShowSuccessPopup(true);

    } catch (err) {

      console.error(
        "Worker registration error:",
        err
      );

      if (err.response && err.response.data) {

        setError(err.response.data);

      } else {

        setError(
          "Unable to register healthcare worker."
        );

      }

    }
  };


  // =========================
  // SUCCESS POPUP
  // =========================

  const handlePopupOkay = () => {

    setShowSuccessPopup(false);

    navigate("/admin-dashboard");

  };


  return (

    <div className="manage-workers-page">

      <div className="manage-workers-container">

        {/* Back Button */}
        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/healthcare-workers")}
        >
          ← Back to Healthcare Workers
        </button>


        {/* Header */}
        <div className="manage-workers-header">

          <p>
            STAFF MANAGEMENT
          </p>

          <h1>
            Register Healthcare Worker
          </h1>

          <span>
            Add a new healthcare worker to the Smart Rural Clinic system.
          </span>

        </div>


        {/* Form */}
        <form
          className="manage-workers-form"
          onSubmit={handleSubmit}
        >

          {/* Full Name */}
          <div className="form-group">

            <label>
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              placeholder="Enter full name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />

          </div>


          {/* ID Number */}
          <div className="form-group">

            <label>
              ID Number
            </label>

            <input
              type="text"
              name="idNumber"
              placeholder="Enter ID number"
              value={formData.idNumber}
              onChange={handleChange}
              required
            />

          </div>


          {/* Email */}
          <div className="form-group">

            <label>
              Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
              required
            />

          </div>


          {/* Phone */}
          <div className="form-group">

            <label>
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />

          </div>


          {/* Password */}
          <div className="form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Create password"
              value={formData.password}
              onChange={handleChange}
              required
            />

          </div>


          {/* Role */}
          <div className="form-group">

            <label>
              Role
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >

              <option value="">
                Select role
              </option>

              <option value="NURSE">
                Nurse
              </option>

              <option value="DOCTOR">
                Doctor
              </option>

              <option value="PHARMACIST">
                Pharmacist
              </option>

            </select>

          </div>


          {/* Doctor Speciality */}
          {formData.role === "DOCTOR" && (

            <div className="form-group">

              <label>
                Speciality
              </label>

              <select
                name="speciality"
                value={formData.speciality}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select speciality
                </option>

                <option value="General Practitioner">
                  General Practitioner
                </option>

                <option value="Paediatrics">
                  Paediatrics
                </option>

                <option value="Dermatology">
                  Dermatology
                </option>

                <option value="Gynaecology">
                  Gynaecology
                </option>

                <option value="Cardiology">
                  Cardiology
                </option>

                <option value="Dentistry">
                  Dentistry
                </option>

                <option value="Psychiatry">
                  Psychiatry
                </option>

              </select>

            </div>

          )}


          {/* Searchable Clinic */}
          <div className="form-group clinic-dropdown-group">

            <label>
              Clinic
            </label>

            <div className="clinic-dropdown">

              <div className="clinic-search-wrapper">

                <input
                  type="text"
                  placeholder={
                    selectedClinicName ||
                    "Search and select clinic..."
                  }
                  value={clinicSearch}
                  onChange={(e) => {
                    setClinicSearch(e.target.value);
                    setShowClinicDropdown(true);
                  }}
                  onFocus={() => setShowClinicDropdown(true)}
                  autoComplete="off"
                />

                <span className="clinic-dropdown-arrow">
                  ▾
                </span>

              </div>


              {showClinicDropdown && (

                <div className="clinic-dropdown-list">

                  {filteredClinics.length > 0 ? (

                    filteredClinics.map((clinic) => (

                      <button
                        type="button"
                        key={clinic.id}
                        className="clinic-dropdown-option"
                        onClick={() =>
                          handleClinicSelect(clinic)
                        }
                      >
                        {clinic.clinicName}
                      </button>

                    ))

                  ) : (

                    <div className="no-clinic-results">
                      No clinics found.
                    </div>

                  )}

                </div>

              )}

            </div>

          </div>


          {/* Error */}
          {error && (

            <p className="error-message">
              {error}
            </p>

          )}


          {/* Buttons */}
          <div className="form-buttons">

            <button
              type="button"
              className="cancel-worker-button"
              onClick={() =>
                navigate("/healthcare-workers")
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-worker-button"
            >
              Register Healthcare Worker
            </button>

          </div>

        </form>

      </div>


      {/* Success Popup */}
      {showSuccessPopup && (

        <div className="worker-success-overlay">

          <div className="worker-success-popup">

            <div className="worker-success-icon">
              ✓
            </div>

            <h2>
              Healthcare Worker Registered
            </h2>

            <p>
              The healthcare worker has been successfully registered.
            </p>

            <button
              type="button"
              onClick={handlePopupOkay}
            >
              OK
            </button>

          </div>

        </div>

      )}

    </div>

  );
}

export default ManageWorkers;

