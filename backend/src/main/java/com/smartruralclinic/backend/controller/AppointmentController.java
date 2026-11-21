package com.smartruralclinic.backend.controller;

import com.smartruralclinic.backend.entity.Appointment;
import com.smartruralclinic.backend.entity.User;
import com.smartruralclinic.backend.repository.AppointmentRepository;
import com.smartruralclinic.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "http://localhost:5173")
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    public AppointmentController(
            AppointmentRepository appointmentRepository,
            UserRepository userRepository) {

        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
    }


    // =========================
    // CREATE APPOINTMENT
    // =========================

    @PostMapping
    public ResponseEntity<?> createAppointment(
            @RequestBody Appointment appointment) {

        if (appointment.getAppointmentDate() == null
                || appointment.getAppointmentDate().isBlank()) {

            return ResponseEntity
                    .badRequest()
                    .body("Appointment date is required.");
        }

        try {

            LocalDate requestedDate =
                    LocalDate.parse(appointment.getAppointmentDate());

            if (requestedDate.isBefore(LocalDate.now())) {

                return ResponseEntity
                        .badRequest()
                        .body("Appointment date cannot be in the past.");
            }

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body("Invalid appointment date.");
        }

        appointment.setStatus("PENDING");

        Appointment savedAppointment =
                appointmentRepository.save(appointment);

        return ResponseEntity.ok(savedAppointment);
    }


    // =========================
    // GET ALL APPOINTMENTS
    // =========================

    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments() {

        return ResponseEntity.ok(
                appointmentRepository.findAll()
        );
    }


    // =========================
    // GET PATIENT APPOINTMENTS
    // =========================

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Appointment>> getPatientAppointments(
            @PathVariable Long patientId) {

        return ResponseEntity.ok(
                appointmentRepository.findByPatientId(patientId)
        );
    }


    // =========================
    // GET APPOINTMENTS ASSIGNED TO DOCTOR
    // =========================

    @GetMapping("/doctor/{doctorId}/assigned")
    public ResponseEntity<?> getAssignedAppointmentsForDoctor(
            @PathVariable Long doctorId) {

        User doctor =
                userRepository
                        .findById(doctorId)
                        .orElse(null);

        if (doctor == null) {
            return ResponseEntity
                    .notFound()
                    .build();
        }

        if (!"DOCTOR".equalsIgnoreCase(doctor.getRole())) {
            return ResponseEntity
                    .badRequest()
                    .body("Only doctors can view their assigned appointments.");
        }

        if (!doctor.isActive()) {
            return ResponseEntity
                    .badRequest()
                    .body("This doctor's account is inactive.");
        }

        List<Appointment> appointments =
                appointmentRepository
                        .findByAssignedDoctorId(doctorId);

        return ResponseEntity.ok(appointments);
    }


    // =========================
    // GET APPOINTMENTS BY STATUS
    // =========================

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Appointment>> getAppointmentsByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                appointmentRepository.findByStatus(status)
        );
    }


    // =========================
    // GET APPOINTMENTS BY SPECIALITY
    // =========================

    @GetMapping("/speciality/{speciality}")
    public ResponseEntity<List<Appointment>> getAppointmentsBySpeciality(
            @PathVariable String speciality) {

        List<Appointment> appointments =
                appointmentRepository.findAll()
                        .stream()
                        .filter(appointment ->
                                appointment.getSpeciality() != null
                                        && appointment.getSpeciality()
                                        .equalsIgnoreCase(speciality)
                        )
                        .filter(appointment ->
                                appointment.getAssignedDoctorId() == null
                        )
                        .filter(appointment ->
                                "PENDING".equalsIgnoreCase(
                                        appointment.getStatus()
                                )
                        )
                        .toList();

        return ResponseEntity.ok(appointments);
    }


    // =========================
    // GET AVAILABLE APPOINTMENTS FOR DOCTOR
    // =========================

    @GetMapping("/doctor/{doctorId}/available")
    public ResponseEntity<?> getAvailableAppointmentsForDoctor(
            @PathVariable Long doctorId) {

        User doctor =
                userRepository
                        .findById(doctorId)
                        .orElse(null);

        if (doctor == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }


        // Make sure the user is a doctor

        if (!"DOCTOR".equalsIgnoreCase(doctor.getRole())) {

            return ResponseEntity
                    .badRequest()
                    .body("Only doctors can view available doctor appointments.");
        }


        // Make sure the account is active

        if (!doctor.isActive()) {

            return ResponseEntity
                    .badRequest()
                    .body("This doctor's account is inactive.");
        }


        // Make sure doctor has a clinic

        if (doctor.getClinic() == null) {

            return ResponseEntity
                    .badRequest()
                    .body("The doctor is not assigned to a clinic.");
        }


        // Make sure doctor has a speciality

        if (doctor.getSpeciality() == null
                || doctor.getSpeciality().isBlank()) {

            return ResponseEntity
                    .badRequest()
                    .body("The doctor does not have a speciality.");
        }


        String doctorClinic =
                doctor.getClinic().getClinicName();

        String doctorSpeciality =
                doctor.getSpeciality();


        // Find appointments matching:
        // 1. Doctor's clinic
        // 2. Doctor's speciality
        // 3. Pending status
        // 4. Not already assigned

        List<Appointment> appointments =
                appointmentRepository.findAll()
                        .stream()
                        .filter(appointment ->
                                "PENDING".equalsIgnoreCase(
                                        appointment.getStatus()
                                )
                        )
                        .filter(appointment ->
                                appointment.getAssignedDoctorId() == null
                        )
                        .filter(appointment ->
                                appointment.getClinic() != null
                                        && appointment.getClinic()
                                        .equalsIgnoreCase(doctorClinic)
                        )
                        .filter(appointment ->
                                appointment.getSpeciality() != null
                                        && appointment.getSpeciality()
                                        .equalsIgnoreCase(doctorSpeciality)
                        )
                        .toList();

        return ResponseEntity.ok(appointments);
    }

    // =========================
    // ASSIGN APPOINTMENT TO NURSE
    // =========================
    @PutMapping("/{appointmentId}/assign-nurse")
    public ResponseEntity<?> assignAppointmentToNurse(
            @PathVariable Long appointmentId,
            @RequestParam Long nurseId) {

        Appointment appointment =
                appointmentRepository
                        .findById(appointmentId)
                        .orElse(null);

        if (appointment == null) {
            return ResponseEntity
                    .notFound()
                    .build();
        }

        if (!"PENDING".equalsIgnoreCase(appointment.getStatus())) {
            return ResponseEntity
                    .badRequest()
                    .body("This appointment is no longer available.");
        }

        if (appointment.getAssignedNurseId() != null) {
            return ResponseEntity
                    .badRequest()
                    .body("This appointment has already been assigned to a nurse.");
        }

        User nurse =
                userRepository
                        .findById(nurseId)
                        .orElse(null);
        if (nurse != null) {

            List<Appointment> activeAppointments =
                    appointmentRepository
                            .findByAssignedNurseId(nurseId)
                            .stream()
                            .filter(existingAppointment ->
                                    "CONFIRMED".equalsIgnoreCase(existingAppointment.getStatus())
                                            || "IN_PROGRESS".equalsIgnoreCase(existingAppointment.getStatus())
                            )
                            .toList();

            if (!activeAppointments.isEmpty()) {
                return ResponseEntity
                        .badRequest()
                        .body(
                                "You already have an active appointment. Please complete or refer the current appointment before taking another one."
                        );
            }
        }

        if (nurse == null) {
            return ResponseEntity
                    .badRequest()
                    .body("Nurse not found.");
        }

        if (!"NURSE".equalsIgnoreCase(nurse.getRole())) {
            return ResponseEntity
                    .badRequest()
                    .body("Only nurses can be assigned to appointments.");
        }

        if (!nurse.isActive()) {
            return ResponseEntity
                    .badRequest()
                    .body("This nurse's account is inactive.");
        }

        if (nurse.getClinic() == null) {
            return ResponseEntity
                    .badRequest()
                    .body("The nurse is not assigned to a clinic.");
        }

        if (appointment.getClinic() == null) {
            return ResponseEntity
                    .badRequest()
                    .body("The appointment does not have a clinic.");
        }

        if (!nurse.getClinic().getClinicName()
                .equalsIgnoreCase(appointment.getClinic())) {

            return ResponseEntity
                    .badRequest()
                    .body("The nurse does not belong to the appointment's clinic.");
        }

        appointment.setAssignedNurseId(nurse.getId());
        appointment.setAssignedNurseName(nurse.getFullName());

        appointment.setStatus("CONFIRMED");

        Appointment updatedAppointment =
                appointmentRepository.save(appointment);

        return ResponseEntity.ok(updatedAppointment);
    }

    @PutMapping("/{appointmentId}/nurse-assessment")
    public ResponseEntity<?> submitNurseAssessment(
            @PathVariable Long appointmentId,
            @RequestParam Long nurseId,
            @RequestParam String outcome,
            @RequestParam(required = false) String vitalSigns,
            @RequestParam(required = false) String nurseAssessment,
            @RequestParam(required = false) String referralReason) {

        Appointment appointment =
                appointmentRepository
                        .findById(appointmentId)
                        .orElse(null);

        if (appointment == null) {
            return ResponseEntity
                    .notFound()
                    .build();
        }

        User nurse =
                userRepository
                        .findById(nurseId)
                        .orElse(null);

        if (nurse == null) {
            return ResponseEntity
                    .badRequest()
                    .body("Nurse not found.");
        }

        if (!"NURSE".equalsIgnoreCase(nurse.getRole())) {
            return ResponseEntity
                    .badRequest()
                    .body("Only nurses can submit nurse assessments.");
        }

        if (!nurse.isActive()) {
            return ResponseEntity
                    .badRequest()
                    .body("This nurse's account is inactive.");
        }

        if (appointment.getAssignedNurseId() == null
                || !appointment.getAssignedNurseId().equals(nurseId)) {
            return ResponseEntity
                    .badRequest()
                    .body("This appointment is not assigned to you.");
        }

        if (!"CONFIRMED".equalsIgnoreCase(appointment.getStatus())
                && !"IN_PROGRESS".equalsIgnoreCase(appointment.getStatus())) {
            return ResponseEntity
                    .badRequest()
                    .body("This appointment cannot be assessed.");
        }

        if (nurseAssessment == null || nurseAssessment.trim().isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("Nurse assessment is required.");
        }

        if (outcome == null || outcome.trim().isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("Please select an outcome.");
        }

        appointment.setVitalSigns(vitalSigns);
        appointment.setNurseAssessment(nurseAssessment);
        appointment.setReferralReason(referralReason);

        if ("COMPLETED".equalsIgnoreCase(outcome)) {

            appointment.setStatus("COMPLETED");
            appointment.setWorkerResponse("Appointment completed by nurse.");

        } else if ("REFERRED_DOCTOR".equalsIgnoreCase(outcome)) {

            if (referralReason == null || referralReason.trim().isEmpty()) {
                return ResponseEntity
                        .badRequest()
                        .body("Referral reason is required.");
            }

            appointment.setStatus("REFERRED_DOCTOR");
            appointment.setWorkerResponse("Referred to doctor.");

        } else if ("REFERRED_CLINIC".equalsIgnoreCase(outcome)) {

            if (referralReason == null || referralReason.trim().isEmpty()) {
                return ResponseEntity
                        .badRequest()
                        .body("Referral reason is required.");
            }

            appointment.setStatus("REFERRED_CLINIC");
            appointment.setWorkerResponse("Referred to another clinic.");

        } else {
            return ResponseEntity
                    .badRequest()
                    .body("Invalid appointment outcome.");
        }

        Appointment updatedAppointment =
                appointmentRepository.save(appointment);

        return ResponseEntity.ok(updatedAppointment);
    }
    // =========================
    // ASSIGN APPOINTMENT TO DOCTOR
    // =========================

    @PutMapping("/{appointmentId}/assign")
    public ResponseEntity<?> assignAppointment(
            @PathVariable Long appointmentId,
            @RequestParam Long doctorId) {

        // Find appointment

        Appointment appointment =
                appointmentRepository
                        .findById(appointmentId)
                        .orElse(null);

        if (appointment == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }


        // Appointment must still be pending

        if (!"PENDING".equalsIgnoreCase(
                appointment.getStatus())) {

            return ResponseEntity
                    .badRequest()
                    .body("This appointment is no longer available.");
        }


        // Check if appointment is already assigned

        if (appointment.getAssignedDoctorId() != null) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "This appointment has already been assigned to a doctor."
                    );
        }


        // Find doctor

        User doctor =
                userRepository
                        .findById(doctorId)
                        .orElse(null);

        if (doctor == null) {

            return ResponseEntity
                    .badRequest()
                    .body("Doctor not found.");
        }


        // Check doctor role

        if (!"DOCTOR".equalsIgnoreCase(
                doctor.getRole())) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Only doctors can be assigned to appointments."
                    );
        }


        // Check doctor account

        if (!doctor.isActive()) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "This doctor's account is inactive."
                    );
        }


        // Check doctor clinic

        if (doctor.getClinic() == null) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "The doctor is not assigned to a clinic."
                    );
        }


        // Check appointment clinic

        if (appointment.getClinic() == null) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "The appointment does not have a clinic."
                    );
        }


        // Make sure doctor belongs to same clinic

        if (!doctor.getClinic().getClinicName()
                .equalsIgnoreCase(
                        appointment.getClinic())) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "The doctor does not belong to the appointment's clinic."
                    );
        }


        // Appointment must have a speciality

        if (appointment.getSpeciality() == null
                || appointment.getSpeciality().isBlank()) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "This appointment does not have a speciality yet."
                    );
        }


        // Doctor must have a speciality

        if (doctor.getSpeciality() == null
                || doctor.getSpeciality().isBlank()) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "The doctor does not have a speciality."
                    );
        }


        // Make sure speciality matches

        if (!doctor.getSpeciality()
                .equalsIgnoreCase(
                        appointment.getSpeciality())) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "This appointment does not match the doctor's speciality."
                    );
        }


        // Assign doctor

        appointment.setAssignedDoctorId(
                doctor.getId()
        );

        appointment.setAssignedDoctorName(
                doctor.getFullName()
        );


        // Appointment is now confirmed

        appointment.setStatus(
                "CONFIRMED"
        );


        Appointment updatedAppointment =
                appointmentRepository.save(
                        appointment
                );

        return ResponseEntity.ok(
                updatedAppointment
        );
    }


    // =========================
    // UPDATE APPOINTMENT STATUS
    // =========================

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateAppointmentStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String response) {

        Appointment appointment =
                appointmentRepository
                        .findById(id)
                        .orElse(null);

        if (appointment == null) {
            return ResponseEntity
                    .notFound()
                    .build();
        }

        String newStatus =
                status.toUpperCase();

        // Allowed appointment statuses

        if (!newStatus.equals("CONFIRMED")
                && !newStatus.equals("IN_PROGRESS")
                && !newStatus.equals("COMPLETED")
                && !newStatus.equals("REFERRED")
                && !newStatus.equals("NO_SHOW")
                && !newStatus.equals("CANCELLED")
                && !newStatus.equals("DECLINED")) {

            return ResponseEntity
                    .badRequest()
                    .body("Invalid appointment status.");
        }

        appointment.setStatus(newStatus);

        appointment.setWorkerResponse(
                response
        );

        Appointment updatedAppointment =
                appointmentRepository.save(
                        appointment
                );

        return ResponseEntity.ok(
                updatedAppointment
        );
    }
    @GetMapping("/nurse/{nurseId}/assigned")
    public ResponseEntity<?> getAssignedAppointmentsForNurse(
            @PathVariable Long nurseId) {

        User nurse =
                userRepository
                        .findById(nurseId)
                        .orElse(null);

        if (nurse == null) {
            return ResponseEntity
                    .notFound()
                    .build();
        }

        if (!"NURSE".equalsIgnoreCase(nurse.getRole())) {
            return ResponseEntity
                    .badRequest()
                    .body("Only nurses can view their assigned appointments.");
        }

        if (!nurse.isActive()) {
            return ResponseEntity
                    .badRequest()
                    .body("This nurse's account is inactive.");
        }

        List<Appointment> appointments =
                appointmentRepository
                        .findByAssignedNurseIdAndStatusIn(
                                nurseId,
                                List.of("CONFIRMED", "IN_PROGRESS")
                        );

        return ResponseEntity.ok(appointments);
    }
    @GetMapping("/nurse/{nurseId}/dashboard-stats")
    public ResponseEntity<?> getNurseDashboardStats(
            @PathVariable Long nurseId) {

        User nurse = userRepository.findById(nurseId).orElse(null);

        if (nurse == null) {
            return ResponseEntity.notFound().build();
        }

        if (!"NURSE".equalsIgnoreCase(nurse.getRole())) {
            return ResponseEntity.badRequest()
                    .body("Only nurses can access nurse dashboard statistics.");
        }

        if (!nurse.isActive()) {
            return ResponseEntity.badRequest()
                    .body("This nurse's account is inactive.");
        }

        if (nurse.getClinic() == null) {
            return ResponseEntity.badRequest()
                    .body("The nurse is not assigned to a clinic.");
        }

        String clinicName = nurse.getClinic().getClinicName();

        long totalAppointments =
                appointmentRepository.countByClinicIgnoreCase(clinicName);

        long availableAppointments =
                appointmentRepository
                        .countByClinicIgnoreCaseAndStatusIgnoreCaseAndAssignedNurseIdIsNull(
                                clinicName, "PENDING"
                        );

        long completedAppointments =
                appointmentRepository
                        .countByClinicIgnoreCaseAndAssignedNurseIdAndStatusIgnoreCase(
                                clinicName, nurseId, "COMPLETED"
                        );

        return ResponseEntity.ok(Map.of(
                "totalAppointments", totalAppointments,
                "availableAppointments", availableAppointments,
                "completedAppointments", completedAppointments
        ));
    }
}
