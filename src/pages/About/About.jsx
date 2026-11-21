
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "../../styles/About.css";

function About() {
  return (
    <div className="about-page">
      <Navbar />

      <main>
        <section className="about-hero">
          <div className="about-hero-content">
            <p className="about-label">ABOUT SMART RURAL CLINIC</p>

            <h1>
              Making healthcare
              <br />
              smarter and more accessible.
            </h1>

            <p>
              Smart Rural Clinic is a digital clinic management system
              designed to support healthcare delivery in rural communities.
            </p>
          </div>
        </section>

        <section className="about-section">
          <div className="about-content">
            <p className="section-label">OUR PURPOSE</p>

            <h2>Connecting patients, healthcare providers and clinics.</h2>

            <p>
              Rural healthcare facilities can face challenges such as long
              waiting times, limited access to information, communication
              difficulties and challenges in managing patient records and
              medicine availability.
            </p>

            <p>
              Smart Rural Clinic aims to bring important healthcare services
              together in one digital platform. The system will allow
              patients and healthcare providers to access relevant information
              more efficiently while supporting better clinic management.
            </p>
          </div>
        </section>

        <section className="goals-section">
          <div className="section-heading">
            <p className="section-label">OUR GOALS</p>

            <h2>What Smart Rural Clinic aims to achieve</h2>
          </div>

          <div className="goals-grid">
            <div className="goal-item">
              <h3>Reduce Waiting Times</h3>
              <p>
                Support appointment management and digital processes that can
                help reduce unnecessary queues at clinics.
              </p>
            </div>

            <div className="goal-item">
              <h3>Improve Access to Information</h3>
              <p>
                Make relevant patient and clinic information easier for
                authorised users to access when needed.
              </p>
            </div>

            <div className="goal-item">
              <h3>Support Better Communication</h3>
              <p>
                Provide a platform that improves communication between
                patients and healthcare providers.
              </p>
            </div>

            <div className="goal-item">
              <h3>Improve Medicine Management</h3>
              <p>
                Help clinics monitor medicine availability and use data to
                support medicine demand planning.
              </p>
            </div>
          </div>
        </section>

        <section className="technology-section">
          <div className="technology-content">
            <p className="section-label">SMART TECHNOLOGY</p>

            <h2>Using technology to support better healthcare decisions.</h2>

            <p>
              The system will use modern technologies, including Artificial
              Intelligence and Machine Learning, to support selected
              healthcare processes.
            </p>

            <p>
              These technologies can be used to analyse patient feedback,
              support medicine demand forecasting and identify patterns that
              may require further attention from healthcare professionals.
            </p>
          </div>
        </section>

        <section className="about-cta">
          <h2>Ready to get started?</h2>

          <p>
            Access the Smart Rural Clinic platform and explore the available
            healthcare services.
          </p>

          <Link to="/login" className="primary-button">
            Login
          </Link>
        </section>
      </main>
    </div>
  );
}

export default About;

