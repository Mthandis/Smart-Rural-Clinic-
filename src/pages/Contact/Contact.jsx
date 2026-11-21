
import Navbar from "../../components/Navbar";
import "../../styles/Contact.css";

function Contact() {
  return (
    <div className="contact-page">
      <Navbar />

      <main>
        <section className="contact-hero">
          <div>
            <p className="contact-label">CONTACT US</p>

            <h1>We're here to help.</h1>

            <p>
              Have a question about Smart Rural Clinic? Get in touch with
              us and we will be happy to assist you.
            </p>
          </div>
        </section>

        <section className="contact-section">
          <div className="contact-info">
            <p className="section-label">GET IN TOUCH</p>

            <h2>Contact Smart Rural Clinic</h2>

            <p>
              Whether you have a question, need assistance, or would like
              to learn more about the system, you can contact us using
              the information below.
            </p>

            <div className="contact-detail">
              <h3>Email</h3>
              <p>info@smartruralclinic.com</p>
            </div>

            <div className="contact-detail">
              <h3>Phone</h3>
              <p>+27 00 000 0000</p>
            </div>

            <div className="contact-detail">
              <h3>Location</h3>
              <p>South Africa</p>
            </div>
          </div>

          <div className="contact-form-container">
            <h2>Send us a message</h2>

            <form className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email address"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows="6"
                  placeholder="Enter your message"
                ></textarea>
              </div>

              <button type="submit" className="contact-button">
                Send Message
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Contact;

