
package com.smartruralclinic.backend.controller;

import com.smartruralclinic.backend.entity.Clinic;
import com.smartruralclinic.backend.entity.Feedback;
import com.smartruralclinic.backend.entity.User;
import com.smartruralclinic.backend.repository.ClinicRepository;
import com.smartruralclinic.backend.repository.FeedbackRepository;
import com.smartruralclinic.backend.repository.UserRepository;
import com.smartruralclinic.backend.service.SentimentAnalysisService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "http://localhost:5173")
public class FeedbackController {

    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;
    private final ClinicRepository clinicRepository;
    private final SentimentAnalysisService sentimentService;

    public FeedbackController(
            FeedbackRepository feedbackRepository,
            UserRepository userRepository,
            ClinicRepository clinicRepository,
            SentimentAnalysisService sentimentService) {

        this.feedbackRepository = feedbackRepository;
        this.userRepository = userRepository;
        this.clinicRepository = clinicRepository;
        this.sentimentService = sentimentService;
    }

    // SUBMIT PATIENT FEEDBACK
    @PostMapping
    public ResponseEntity<?> submitFeedback(
            @RequestBody FeedbackRequest request) {

        if (request.comments() == null ||
                request.comments().isBlank()) {

            return ResponseEntity.badRequest()
                    .body("Feedback comments are required.");
        }

        if (request.comments().length() > 1000) {
            return ResponseEntity.badRequest()
                    .body("Feedback cannot exceed 1000 characters.");
        }

        if (request.rating() == null ||
                !(request.rating().equals("HAPPY")
                        || request.rating().equals("MIXED")
                        || request.rating().equals("SAD"))) {

            return ResponseEntity.badRequest()
                    .body("Please select a valid rating.");
        }

        if (request.clinic() == null ||
                request.clinic().isBlank() ||
                request.clinic().equalsIgnoreCase("Not selected")) {

            return ResponseEntity.badRequest()
                    .body("A clinic is required.");
        }

        Clinic clinic = clinicRepository
                .findByClinicNameIgnoreCase(request.clinic())
                .orElse(null);

        if (clinic == null) {
            return ResponseEntity.badRequest()
                    .body("Clinic not found.");
        }

        User patient = null;

        if (!request.anonymous()) {

            if (request.patientId() == null) {
                return ResponseEntity.badRequest()
                        .body("Patient information is required.");
            }

            patient = userRepository
                    .findById(request.patientId())
                    .orElse(null);

            if (patient == null ||
                    !"PATIENT".equalsIgnoreCase(patient.getRole())) {

                return ResponseEntity.badRequest()
                        .body("Valid patient account not found.");
            }
        }

        // Existing sentiment analysis
        String sentiment = sentimentService
                .analyseSentiment(request.comments());

        double sentimentScore = sentimentService
                .calculateSentimentScore(request.comments());

        // Save feedback
        Feedback feedback = new Feedback();

        feedback.setPatient(request.anonymous() ? null : patient);
        feedback.setClinic(clinic);
        feedback.setComments(request.comments().trim());
        feedback.setRating(request.rating());
        feedback.setAnonymous(request.anonymous());
        feedback.setSentiment(sentiment);
        feedback.setSentimentScore(sentimentScore);

        Feedback savedFeedback =
                feedbackRepository.save(feedback);

        return ResponseEntity.ok(
                new FeedbackResponse(
                        savedFeedback.getId(),
                        savedFeedback.getSentiment(),
                        savedFeedback.getSentimentScore(),
                        "Feedback submitted successfully."
                )
        );
    }

    // GET ALL FEEDBACK FOR ADMIN
    @GetMapping
    public ResponseEntity<List<FeedbackAdminResponse>> getAllFeedback() {

        List<Feedback> feedbackList =
                feedbackRepository.findAllByOrderByCreatedAtDesc();

        List<FeedbackAdminResponse> response = feedbackList.stream()
                .map(feedback -> new FeedbackAdminResponse(
                        feedback.getId(),

                        feedback.isAnonymous()
                                ? "Anonymous"
                                : feedback.getPatient() != null
                                ? feedback.getPatient().getFullName()
                                : "Unknown",

                        feedback.getClinic() != null
                                ? feedback.getClinic().getClinicName()
                                : "Unknown",

                        feedback.getComments(),
                        feedback.getRating(),
                        feedback.getSentiment(),
                        feedback.getSentimentScore(),
                        feedback.getCreatedAt(),
                        feedback.isAnonymous()
                ))
                .toList();

        return ResponseEntity.ok(response);
    }

    // GET SENTIMENT SUMMARY FOR ADMIN DASHBOARD
    @GetMapping("/summary")
    public ResponseEntity<FeedbackSummaryResponse> getFeedbackSummary() {

        List<Feedback> feedbackList =
                feedbackRepository.findAll();

        long total = feedbackList.size();

        long positive = countSentiment(feedbackList, "POSITIVE");
        long negative = countSentiment(feedbackList, "NEGATIVE");
        long neutral = countSentiment(feedbackList, "NEUTRAL");

        return ResponseEntity.ok(
                new FeedbackSummaryResponse(
                        total,
                        positive,
                        negative,
                        neutral
                )
        );
    }

    // COUNT SENTIMENT RESULTS
    private long countSentiment(
            List<Feedback> feedbackList,
            String sentiment) {

        return feedbackList.stream()
                .filter(feedback ->
                        sentiment.equalsIgnoreCase(
                                feedback.getSentiment() == null
                                        ? ""
                                        : feedback.getSentiment()
                        ))
                .count();
    }

    // REQUEST DATA
    public record FeedbackRequest(
            Long patientId,
            String patientName,
            String clinic,
            String comments,
            String rating,
            boolean anonymous
    ) {}

    // SUBMISSION RESPONSE
    public record FeedbackResponse(
            Long id,
            String sentiment,
            Double sentimentScore,
            String message
    ) {}

    // ACTUAL FEEDBACK RESPONSE FOR ADMIN
    public record FeedbackAdminResponse(
            Long id,
            String patientName,
            String clinicName,
            String comments,
            String rating,
            String sentiment,
            Double sentimentScore,
            LocalDateTime createdAt,
            boolean anonymous
    ) {}

    // DASHBOARD SUMMARY RESPONSE
    public record FeedbackSummaryResponse(
            long totalFeedback,
            long positive,
            long negative,
            long neutral
    ) {}
}
