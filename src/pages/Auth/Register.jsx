
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import "../../styles/Register.css";

function Register() {
  const navigate = useNavigate();

  const [clinics, setClinics] = useState([]);
  const [clinicSearch, setClinicSearch] = useState("");
  const [showClinicDropdown, setShowClinicDropdown] = useState(false);
  const [selectedClinicName, setSelectedClinicName] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    idNumber: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    clinic: {
      id: "",
    },
  });

  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Fetch active clinics
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
    } catch (err) {
      console.error("Unable to load clinics:", err);
      setError("Unable to load clinics. Please try again.");
    }
  };

  // Handle form inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle ID Number input
  const handleIdNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");

    if (value.length <= 13) {
      setFormData((prev) => ({
        ...prev,
        idNumber: value,
      }));
    }
  };

  // Handle clinic selection
  const handleClinicSelect = (clinic) => {
    setFormData((prev) => ({
      ...prev,
      clinic: {
        id: clinic.id,
      },
    }));

    setSelectedClinicName(clinic.clinicName);
    setClinicSearch("");
    setShowClinicDropdown(false);
  };

  // Filter clinics
  const filteredClinics = clinics.filter((clinic) =>
    clinic.clinicName
      .toLowerCase()
      .includes(clinicSearch.toLowerCase())
  );

  // Handle registration
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Validate ID Number
    if (!/^\d{13}$/.test(formData.idNumber)) {
      setError("ID Number must contain exactly 13 digits.");
      return;
    }

    // Validate special character
    const specialCharacterRegex = /[^A-Za-z0-9]/;

    if (!specialCharacterRegex.test(formData.password)) {
      setError(
        "Password must contain at least one special character."
      );
      return;
    }

    // Validate at least two numbers
    const numberCount = (
      formData.password.match(/[0-9]/g) || []
    ).length;

    if (numberCount < 2) {
      setError(
        "Password must contain at least two numbers."
      );
      return;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Check clinic selection
    if (!formData.clinic.id) {
      setError("Please select a clinic.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        {
          fullName: formData.fullName,
          idNumber: formData.idNumber,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          clinic: {
            id: formData.clinic.id,
          },
        }
      );

      console.log("Registration successful:", response.data);

      // Show success popup
      setShowSuccessModal(true);

    } catch (err) {
      console.error("Registration error:", err);

      if (err.response && err.response.data) {
        const responseData = err.response.data;

        setError(
          typeof responseData === "string"
            ? responseData
            : responseData.message ||
              "Registration failed. Please try again."
        );
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="register-page">

      <Navbar />

      <main className="register-section">

        <div className="register-content">

          <p className="register-label">
            PATIENT REGISTRATION
          </p>

          <h1>Create your account</h1>

          <p className="register-description">
            Register as a patient to access Smart Rural Clinic services.
          </p>

          <form
            className="register-form"
            onSubmit={handleSubmit}
          >

            {/* FULL NAME */}
            <div className="form-group">
              <label htmlFor="fullName">
                Full Name
              </label>

              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            {/* ID NUMBER */}
            <div className="form-group">
              <label htmlFor="idNumber">
                ID Number
              </label>

              <input
                type="text"
                id="idNumber"
                name="idNumber"
                placeholder="Enter your 13-digit ID number"
                value={formData.idNumber}
                onChange={handleIdNumberChange}
                maxLength={13}
                inputMode="numeric"
                pattern="[0-9]{13}"
                title="ID Number must contain exactly 13 digits."
                required
              />

              <small className="password-requirements">
                ID Number must contain exactly 13 digits.
                ({formData.idNumber.length}/13)
              </small>
            </div>

            {/* EMAIL */}
            <div className="form-group">
              <label htmlFor="email">
                Email Address
              </label>

              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* PHONE */}
            <div className="form-group">
              <label htmlFor="phone">
                Phone Number
              </label>

              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="form-group">
              <label htmlFor="password">
                Password
              </label>

              <input
                type="password"
                id="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <small className="password-requirements">
                Password must contain at least one special character
                and at least two numbers.
              </small>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="form-group">
              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            {/* CLINIC SELECTION */}
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
                      setSelectedClinicName("");

                      setFormData((prev) => ({
                        ...prev,
                        clinic: {
                          id: "",
                        },
                      }));
                    }}
                    onFocus={() =>
                      setShowClinicDropdown(true)
                    }
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

            {/* ERROR MESSAGE */}
            {error && (
              <p className="error-message">
                {error}
              </p>
            )}

            {/* REGISTER BUTTON */}
            <button
              type="submit"
              className="register-button"
            >
              Create Account
            </button>

          </form>

          <p className="login-text">
            Already have an account?{" "}
            <Link to="/login">Login</Link>
          </p>

        </div>

      </main>

     {/* REGISTRATION SUCCESS POPUP */}
     {showSuccessModal && (
       <div className="registration-modal-overlay">
         <div className="registration-success-modal">

           <div className="success-icon">
             ✓
           </div>

           <h2>
             Registration Successful!
           </h2>

           <p>
             You have successfully registered your account.
             Thank you for joining Smart Rural Clinic.
           </p>

           <p className="modal-login-text">
             <Link to="/login">
               Click here to login
             </Link>
             {" "}to your account.
           </p>

         </div>
       </div>
     )}

    </div>
  );
}

export default Register;
