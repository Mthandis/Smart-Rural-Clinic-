import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/RegisterClinic.css";

function RegisterClinic() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    clinicName: "",
    location: "",
    contactNumber: "",
  });

  const [error, setError] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      await axios.post(
        "http://localhost:8080/api/admin/clinics",
        formData
      );

      setShowSuccessPopup(true);

    } catch (err) {
      console.error("Clinic registration error:", err);

      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError("Unable to register clinic.");
      }
    }
  };

  const handlePopupOkay = () => {
    setShowSuccessPopup(false);
    navigate("/clinics");
  };

  return (
    <div className="register-clinic-page">

      <div className="register-clinic-container">

        {/* Back Button */}
        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/clinics")}
        >
          ← Back to Clinics
        </button>

        <div className="register-clinic-header">
          <p>CLINIC MANAGEMENT</p>

          <h1>Register Healthcare Clinic</h1>

          <span>
            Add a new clinic to the Smart Rural Clinic system.
          </span>
        </div>

        <form
          className="register-clinic-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">

            <label>Clinic Name</label>

            <input
              type="text"
              name="clinicName"
              placeholder="Enter clinic name"
              value={formData.clinicName}
              onChange={handleChange}
              required
            />

          </div>

          <div className="form-group">

            <label>Location</label>

            <input
              type="text"
              name="location"
              placeholder="Enter clinic location"
              value={formData.location}
              onChange={handleChange}
              required
            />

          </div>

          <div className="form-group">

            <label>Contact Number</label>

            <input
              type="tel"
              name="contactNumber"
              placeholder="Enter clinic contact number"
              value={formData.contactNumber}
              onChange={handleChange}
              required
            />

          </div>

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          <div className="form-buttons">

            <button
              type="button"
              className="cancel-clinic-button"
              onClick={() => navigate("/clinics")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-clinic-button"
            >
              Register Clinic
            </button>

          </div>

        </form>

      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="clinic-success-overlay">

          <div className="clinic-success-popup">

            <div className="clinic-success-icon">
              ✓
            </div>

            <h2>Clinic Registered</h2>

            <p>
              The clinic has been successfully registered.
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

export default RegisterClinic;