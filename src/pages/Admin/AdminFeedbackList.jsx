import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/AdminFeedbackList.css";

function AdminFeedbackList() {
  const navigate = useNavigate();

  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/feedback"
      );

      setFeedbackList(response.data);
    } catch (err) {
      setError("Unable to load patient feedback.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleString("en-ZA", {
      dateStyle: "medium",
      timeStyle: "short"
    });
  };

  const getSentimentClass = (sentiment) => {
    switch (sentiment) {
      case "POSITIVE":
        return "sentiment-positive";
      case "NEGATIVE":
        return "sentiment-negative";
      default:
        return "sentiment-neutral";
    }
  };

  return (
    <div className="admin-feedback-list-page">

      <header className="feedback-list-header">
        <div>
          <h1>Patient Feedback Records</h1>
          <p>Review feedback submitted by patients across clinics.</p>
        </div>

        <button
          className="back-feedback-button"
          onClick={() => navigate("/admin-feedback")}
        >
          Back to Analysis
        </button>
      </header>

      <section className="feedback-records-container">

        {loading ? (
          <p className="feedback-loading">Loading feedback records...</p>
        ) : error ? (
          <p className="feedback-list-error">{error}</p>
        ) : feedbackList.length === 0 ? (
          <p className="feedback-empty">
            No patient feedback has been submitted yet.
          </p>
        ) : (
          <div className="feedback-table-wrapper">
            <table className="feedback-records-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Patient</th>
                  <th>Clinic</th>
                  <th>Feedback</th>
                  <th>Rating</th>
                  <th>Sentiment Analysis</th>
                </tr>
              </thead>

              <tbody>
                {feedbackList.map((feedback) => (
                  <tr key={feedback.id}>
                    <td>{formatDate(feedback.createdAt)}</td>

                    <td>
                      {feedback.anonymous
                        ? "Anonymous"
                        : feedback.patientName}
                    </td>

                    <td>{feedback.clinicName}</td>

                    <td className="feedback-comment">
                      {feedback.comments}
                    </td>

                    <td>{feedback.rating}</td>

                    <td>
                      <span
                        className={`sentiment-badge ${getSentimentClass(
                          feedback.sentiment
                        )}`}
                      >
                        {feedback.sentiment || "NOT ANALYSED"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </section>
    </div>
  );
}

export default AdminFeedbackList;