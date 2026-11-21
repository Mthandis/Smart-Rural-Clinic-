
package com.smartruralclinic.backend.controller;

import com.smartruralclinic.backend.entity.Appointment;
import com.smartruralclinic.backend.entity.MedicalRecord;
import com.smartruralclinic.backend.repository.AppointmentRepository;
import com.smartruralclinic.backend.repository.MedicalRecordRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.*;

@RestController
@RequestMapping("/api/medical-records")
@CrossOrigin(origins = "http://localhost:5173")
public class MedicalRecordController {

    private final MedicalRecordRepository medicalRecordRepository;
    private final AppointmentRepository appointmentRepository;

    // Connection to the Python AI service
    private final RestClient aiClient = RestClient.create();

    public MedicalRecordController(
            MedicalRecordRepository medicalRecordRepository,
            AppointmentRepository appointmentRepository) {

        this.medicalRecordRepository = medicalRecordRepository;
        this.appointmentRepository = appointmentRepository;
    }

    // CREATE MEDICAL RECORD
    @PostMapping
    public ResponseEntity<?> createMedicalRecord(
            @RequestBody MedicalRecord medicalRecord) {

        if (medicalRecord.getPatientId() == null ||
                medicalRecord.getDoctorId() == null ||
                medicalRecord.getAppointmentId() == null ||
                medicalRecord.getDiagnosis() == null ||
                medicalRecord.getTreatment() == null) {

            return ResponseEntity.badRequest()
                    .body("Required medical record information is missing.");
        }

        if (medicalRecord.getRecordDate() == null ||
                medicalRecord.getRecordDate().isBlank()) {

            medicalRecord.setRecordDate(java.time.LocalDate.now().toString());
        }

        MedicalRecord savedRecord =
                medicalRecordRepository.save(medicalRecord);

        return ResponseEntity.ok(savedRecord);
    }

    // GET ALL MEDICAL RECORDS
    @GetMapping
    public ResponseEntity<List<MedicalRecord>> getAllMedicalRecords() {

        return ResponseEntity.ok(
                medicalRecordRepository.findAll()
        );
    }

    // GET MEDICAL RECORDS BY PATIENT
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<MedicalRecord>> getPatientRecords(
            @PathVariable Long patientId) {

        return ResponseEntity.ok(
                medicalRecordRepository.findByPatientId(patientId)
        );
    }

    // GET MEDICAL RECORDS BY DOCTOR
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<MedicalRecord>> getDoctorRecords(
            @PathVariable Long doctorId) {

        return ResponseEntity.ok(
                medicalRecordRepository.findByDoctorId(doctorId)
        );
    }

    // GET MEDICAL RECORDS BY APPOINTMENT
    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<List<MedicalRecord>> getAppointmentRecords(
            @PathVariable Long appointmentId) {

        return ResponseEntity.ok(
                medicalRecordRepository.findByAppointmentId(appointmentId)
        );
    }

    // GET COMPLETE PATIENT HISTORY, GROUPED BY APPOINTMENT
    @GetMapping("/patient/{patientId}/history")
    public ResponseEntity<List<Map<String, Object>>> getPatientHistory(
            @PathVariable Long patientId) {

        List<Appointment> appointments =
                appointmentRepository.findByPatientId(patientId);

        appointments.sort(
                Comparator.comparing(
                        Appointment::getAppointmentDate,
                        Comparator.nullsLast(Comparator.reverseOrder())
                ).thenComparing(
                        Appointment::getAppointmentTime,
                        Comparator.nullsLast(Comparator.reverseOrder())
                )
        );

        List<Map<String, Object>> history = new ArrayList<>();

        for (Appointment appointment : appointments) {

            List<MedicalRecord> records =
                    medicalRecordRepository.findByAppointmentId(
                            appointment.getId()
                    );

            Map<String, Object> visit = new LinkedHashMap<>();

            visit.put("appointment", appointment);
            visit.put("medicalRecords", records);

            history.add(visit);
        }

        return ResponseEntity.ok(history);
    }

    // GENERATE AI PATIENT HISTORY SUMMARY
    @PostMapping("/patient/{patientId}/ai-summary")
    public ResponseEntity<?> generatePatientAISummary(
            @PathVariable Long patientId) {

        try {

            // Retrieve all appointments belonging to this patient
            List<Appointment> appointments =
                    appointmentRepository.findByPatientId(patientId);

            // Sort newest visits first
            appointments.sort(
                    Comparator.comparing(
                            Appointment::getAppointmentDate,
                            Comparator.nullsLast(Comparator.reverseOrder())
                    ).thenComparing(
                            Appointment::getAppointmentTime,
                            Comparator.nullsLast(Comparator.reverseOrder())
                    )
            );

            // Prepare visit information for Python
            List<Map<String, Object>> visits = new ArrayList<>();

            for (Appointment appointment : appointments) {

                Map<String, Object> visit = new LinkedHashMap<>();

                visit.put("date", appointment.getAppointmentDate());
                visit.put("time", appointment.getAppointmentTime());
                visit.put("clinic", appointment.getClinic());
                visit.put("status", appointment.getStatus());
                visit.put("reportedSymptoms", appointment.getSymptoms());
                visit.put("speciality", appointment.getSpeciality());
                visit.put("nurseAssessment", appointment.getNurseAssessment());
                visit.put("vitalSigns", appointment.getVitalSigns());
                visit.put("referralReason", appointment.getReferralReason());
                visit.put("workerResponse", appointment.getWorkerResponse());

                // Retrieve medical records for this appointment
                List<MedicalRecord> records =
                        medicalRecordRepository.findByAppointmentId(
                                appointment.getId()
                        );

                List<Map<String, Object>> medicalRecords =
                        new ArrayList<>();

                for (MedicalRecord record : records) {

                    Map<String, Object> recordData =
                            new LinkedHashMap<>();

                    recordData.put("recordDate", record.getRecordDate());
                    recordData.put("clinic", record.getClinic());
                    recordData.put("reportedSymptoms", record.getSymptoms());
                    recordData.put("diagnosis", record.getDiagnosis());
                    recordData.put("treatment", record.getTreatment());
                    recordData.put("notes", record.getNotes());
                    recordData.put("doctorName", record.getDoctorName());

                    medicalRecords.add(recordData);
                }

                visit.put("medicalRecords", medicalRecords);

                if (medicalRecords.isEmpty()) {
                    visit.put(
                            "medicalRecordStatus",
                            "No medical record saved"
                    );
                } else {
                    visit.put(
                            "medicalRecordStatus",
                            "Medical record available"
                    );
                }

                visits.add(visit);
            }

            // Prepare the request for Python
            Map<String, Object> aiRequest = new LinkedHashMap<>();

            // Do not send unnecessary patient personal information
            aiRequest.put("patient_name", "Clinic patient");
            aiRequest.put("visits", visits);

            // Send patient history to Python AI service
            Map<String, Object> aiResponse = aiClient.post()
                    .uri("http://127.0.0.1:8000/summarize")
                    .body(aiRequest)
                    .retrieve()
                    .body(Map.class);

            if (aiResponse == null ||
                    aiResponse.get("summary") == null) {

                return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                        .body("The AI service returned an empty response.");
            }

            return ResponseEntity.ok(aiResponse);

        } catch (RestClientException error) {

            return ResponseEntity
                    .status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body("Unable to connect to the Python AI service. "
                            + "Please make sure Python and Ollama are running.");
        }
    }

    // GENERATE OPTIONAL AI NURSE CLINICAL ASSISTANCE
    @PostMapping("/nurse-assistance/{patientId}")
    public ResponseEntity<?> generateNurseAssistance(
            @PathVariable Long patientId,
            @RequestBody Map<String, Object> nurseInput) {

        try {
            // Retrieve the patient's previous appointments
            List<Appointment> appointments =
                    appointmentRepository.findByPatientId(patientId);

            // Collect existing medical records
            List<Map<String, Object>> medicalHistory =
                    new ArrayList<>();

            for (Appointment appointment : appointments) {

                List<MedicalRecord> records =
                        medicalRecordRepository.findByAppointmentId(
                                appointment.getId()
                        );

                for (MedicalRecord record : records) {

                    Map<String, Object> recordData =
                            new LinkedHashMap<>();

                    recordData.put("diagnosis", record.getDiagnosis());
                    recordData.put("treatment", record.getTreatment());
                    recordData.put("symptoms", record.getSymptoms());
                    recordData.put("notes", record.getNotes());
                    recordData.put("recordDate", record.getRecordDate());

                    medicalHistory.add(recordData);
                }
            }

            // Prepare current assessment information
            Map<String, Object> currentAssessment =
                    new LinkedHashMap<>();

            currentAssessment.put(
                    "symptoms",
                    nurseInput.getOrDefault("symptoms", "")
            );

            currentAssessment.put(
                    "vitalSigns",
                    nurseInput.getOrDefault("vitalSigns", "")
            );

            currentAssessment.put(
                    "nurseObservations",
                    nurseInput.getOrDefault("nurseObservations", "")
            );

            // Prepare request for Python
            Map<String, Object> aiRequest =
                    new LinkedHashMap<>();

            aiRequest.put("currentAssessment", currentAssessment);
            aiRequest.put("medicalHistory", medicalHistory);

            // Send request to Python AI service
            Map<String, Object> aiResponse = aiClient.post()
                    .uri("http://127.0.0.1:8000/nurse-assistance")
                    .body(aiRequest)
                    .retrieve()
                    .body(Map.class);

            if (aiResponse == null ||
                    aiResponse.get("suggestions") == null) {

                return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                        .body("The AI service returned an empty response.");
            }

            return ResponseEntity.ok(aiResponse);

        } catch (RestClientException error) {

            return ResponseEntity
                    .status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body("Unable to connect to the Python AI service. "
                            + "Please make sure Python and Ollama are running.");

        } catch (Exception error) {

            error.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unable to generate nurse clinical assistance.");
        }
    }

}
