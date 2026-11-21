import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "../../styles/Home.css";
import Homepagepic from "../../assets/images/Homepagepic.jpg";

function Home() {
  return (
    <div className="home-page">
      <Navbar />

      <main className="hero-section">
        <div className="hero-content">
          <p className="hero-label">
            SMART HEALTHCARE FOR RURAL COMMUNITIES
          </p>

          <h1>
            Better Healthcare,
            <br />
            Connected Communities.
          </h1>

          <p className="hero-description">
            Smart Rural Clinic is a digital clinic management system designed
            to improve healthcare access, reduce waiting times, and support
            better communication between patients and healthcare providers.
          </p>

          <div className="hero-buttons">
            <Link to="/login" className="primary-button">
              Get Started
            </Link>

            <Link to="/about" className="secondary-button">
              Learn More
            </Link>
          </div>
        </div>

        <div className="hero-image">
          <img
            src={Homepagepic}
            alt="Healthcare professionals"
          />
        </div>
      </main>

      <section className="services-section">
        <div className="section-heading">
          <p>OUR SERVICES</p>

          <h2>
            Healthcare services designed for rural communities
          </h2>

          <span>
            Smart Rural Clinic brings important healthcare services together
            in one digital platform.
          </span>
        </div>

        <div className="services-grid">
          <div className="service-item">
            <h3>Patient Management</h3>
            <p>
              Manage patient information and make important records
              easier to access.
            </p>
          </div>

          <div className="service-item">
            <h3>Appointments</h3>
            <p>
              Help patients manage appointments and reduce unnecessary
              waiting times at clinics.
            </p>
          </div>

          <div className="service-item">
            <h3>Medical Records</h3>
            <p>
              Store and access patient medical information securely
              when it is needed.
            </p>
          </div>

          <div className="service-item">
            <h3>Medicine Inventory</h3>
            <p>
              Monitor medicine availability across participating
              clinics.
            </p>
          </div>

          <div className="service-item">
            <h3>Communication</h3>
            <p>
              Improve communication between patients and healthcare
              providers.
            </p>
          </div>

          <div className="service-item">
            <h3>AI & Machine Learning</h3>
            <p>
              Support healthcare services through intelligent data
              analysis and predictions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

