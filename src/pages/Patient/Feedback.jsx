
import { useState, useEffect } from "react";
import axios from "axios";
import PatientNavbar from "../../components/PatientNavbar";
import "../../styles/Feedback.css";

function Feedback() {
  const [user] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Automatically close the success popup after 3 seconds
  useEffect(() => {
    if (!popupMessage) return;

    const timer = setTimeout(() => {
      setPopupMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [popupMessage]);

  const clinicName =
    typeof user?.clinic === "string"
      ? user.clinic
      : user?.clinic?.name ||
        user?.clinic?.clinicName ||
        "Not selected";

  const submitFeedback = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      setFeedbackMessage("Please log in again.");
      return;
    }

    if (!feedback.trim() || !rating) {
      setFeedbackMessage(
        "Please provide feedback and select your experience."
      );
      return;
    }

    try {
      setSubmitting(true);
      setFeedbackMessage("");
      setPopupMessage("");
      setAnalysisResult(null);

      const response = await axios.post(
        "http://localhost:8080/api/feedback",
        {
          patientId: anonymous ? null : user.id,
          patientName: anonymous ? null : user.fullName,
          clinic: clinicName,
          comments: feedback.trim(),
          rating,
          anonymous
        }
      );

      console.log("Feedback response:", response.data);

      // Save sentiment analysis response
      setAnalysisResult(response.data);

      // Show success popup
      setPopupMessage(
        response.data.message ||
          "Your feedback has been submitted successfully!"
      );

      // Clear form after successful submission
      setFeedback("");
      setRating("");
      setAnonymous(false);

    } catch (err) {
      console.error("Feedback submission error:", err);

      setFeedbackMessage(
        err.response?.data?.message ||
          "Unable to submit feedback. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getSentimentClass = (sentiment) => {
    switch (sentiment) {
      case "POSITIVE":
        return "positive";
      case "NEGATIVE":
        return "negative";
      default:
        return "neutral";
    }
  };

  return (
    <div className="patient-dashboard">

      <PatientNavbar />

      {/* SUCCESS POPUP */}
      {popupMessage && (
        <div className="feedback-popup-overlay">
          <div
            className="feedback-success-popup"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="feedback-popup-title"
          >
            <div className="success-tick">✓</div>

            <h2 id="feedback-popup-title">
              Feedback Submitted!
            </h2>

            <p>
              Thank you! Your feedback has been submitted successfully.
            </p>
          </div>
        </div>
      )}

      <main className="dashboard-main">
        <div className="dashboard-container">

          <section className="dashboard-top">
            <div>
              <p className="dashboard-label">PATIENT SERVICES</p>
              <h1>Submit Feedback</h1>
              <p>
                Share your experience with our clinic.
                Your feedback helps us improve our services.
              </p>
            </div>
          </section>

          <section className="dashboard-section feedback-section">

            <div className="section-title">
              <h2>How was your clinic experience?</h2>
              <p>
                Please tell us about your experience.
              </p>
            </div>

            <form
              className="feedback-form"
              onSubmit={submitFeedback}
            >

              <label>Rate your experience</label>

              <div className="feedback-ratings">

                <button
                  type="button"
                  className={
                    rating === "HAPPY"
                      ? "rating-option selected"
                      : "rating-option"
                  }
                  onClick={() => setRating("HAPPY")}
                >
                  😊 Happy
                </button>

                <button
                  type="button"
                  className={
                    rating === "MIXED"
                      ? "rating-option selected"
                      : "rating-option"
                  }
                  onClick={() => setRating("MIXED")}
                >
                  😐 Mixed
                </button>

                <button
                  type="button"
                  className={
                    rating === "SAD"
                      ? "rating-option selected"
                      : "rating-option"
                  }
                  onClick={() => setRating("SAD")}
                >
                  😔 Sad
                </button>

              </div>

              <label htmlFor="patientFeedback">
                Tell us more about your experience
              </label>

              <textarea
                id="patientFeedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Write your feedback here..."
                rows="6"
                maxLength="1000"
                required
              />

              <small>{feedback.length}/1000 characters</small>

              <label className="anonymous-option">
                <input
                  type="checkbox"
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                />
                Submit feedback anonymously
              </label>

              <p className="feedback-privacy">
                Your feedback will be used to help improve clinic services.
              </p>

              {/* ERROR MESSAGE */}
              {feedbackMessage && (
                <div className="feedback-message" role="alert">
                  {feedbackMessage}
                </div>
              )}

              <button
                type="submit"
                className="feedback-submit"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Feedback"}
              </button>

            </form>

            {/* SENTIMENT ANALYSIS RESULT */}
            {analysisResult && (
              <div className="sentiment-result">

                <h2>Feedback Sentiment Analysis</h2>

                <p>
                  Your feedback has been analysed successfully.
                </p>

                <div
                  className={`sentiment-status ${getSentimentClass(
                    analysisResult.sentiment
                  )}`}
                >
                  {analysisResult.sentiment}
                </div>

                <div className="sentiment-score">
                  <span>Sentiment Score</span>

                  <strong>
                    {Number(
                      analysisResult.sentimentScore
                    ).toFixed(2)}
                  </strong>
                </div>

                <small>
                  Automated analysis of your submitted feedback.
                </small>

              </div>
            )}

          </section>

        </div>
      </main>
    </div>
  );
}

export default Feedback;
