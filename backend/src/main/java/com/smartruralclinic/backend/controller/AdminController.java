package com.smartruralclinic.backend.controller;

import com.smartruralclinic.backend.entity.Clinic;
import com.smartruralclinic.backend.entity.User;
import com.smartruralclinic.backend.repository.ClinicRepository;
import com.smartruralclinic.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final UserRepository userRepository;
    private final ClinicRepository clinicRepository;

    public AdminController(
            UserRepository userRepository,
            ClinicRepository clinicRepository) {

        this.userRepository = userRepository;
        this.clinicRepository = clinicRepository;
    }


    // =========================
    // REGISTER HEALTHCARE WORKER
    // =========================

    @PostMapping("/workers")
    public ResponseEntity<?> registerWorker(
            @RequestBody User worker) {

        // Check duplicate email
        if (userRepository.findByEmail(worker.getEmail()).isPresent()) {

            return ResponseEntity
                    .badRequest()
                    .body("Email is already registered.");
        }


        // Check duplicate ID number
        if (userRepository.findByIdNumber(worker.getIdNumber()).isPresent()) {

            return ResponseEntity
                    .badRequest()
                    .body("ID number is already registered.");
        }


        // Check healthcare worker role
        String role = worker.getRole();

        if (!"NURSE".equals(role)
                && !"DOCTOR".equals(role)
                && !"PHARMACIST".equals(role)) {

            return ResponseEntity
                    .badRequest()
                    .body("Invalid healthcare worker role.");
        }


        // Doctors must have a speciality
        if ("DOCTOR".equals(role)
                && (worker.getSpeciality() == null
                || worker.getSpeciality().isBlank())) {

            return ResponseEntity
                    .badRequest()
                    .body("Please provide the doctor's speciality.");
        }


        // Check that a clinic was selected
        if (worker.getClinic() == null
                || worker.getClinic().getId() == null) {

            return ResponseEntity
                    .badRequest()
                    .body("Please select a clinic.");
        }


        // Find the selected clinic
        Long clinicId = worker.getClinic().getId();

        Clinic clinic = clinicRepository
                .findById(clinicId)
                .orElse(null);


        // Check that the clinic exists
        if (clinic == null) {

            return ResponseEntity
                    .badRequest()
                    .body("Selected clinic does not exist.");
        }


        // Check that the clinic is active
        if (!clinic.isActive()) {

            return ResponseEntity
                    .badRequest()
                    .body("The selected clinic is inactive.");
        }


        // Assign the clinic to the worker
        worker.setClinic(clinic);


        // Every newly registered worker is active
        worker.setActive(true);


        // Save worker
        User savedWorker = userRepository.save(worker);

        return ResponseEntity.ok(savedWorker);
    }


    // =========================
    // GET WORKER COUNT
    // =========================

    @GetMapping("/workers/count")
    public ResponseEntity<Long> getWorkerCount() {

        long count = userRepository.countByRoleIn(
                List.of(
                        "NURSE",
                        "DOCTOR",
                        "PHARMACIST"
                )
        );

        return ResponseEntity.ok(count);
    }


    // =========================
    // GET ALL HEALTHCARE WORKERS
    // =========================

    @GetMapping("/workers")
    public ResponseEntity<List<User>> getWorkers() {

        List<User> workers = userRepository.findAll()
                .stream()
                .filter(user ->
                        "NURSE".equals(user.getRole())
                                || "DOCTOR".equals(user.getRole())
                                || "PHARMACIST".equals(user.getRole())
                )
                .toList();

        return ResponseEntity.ok(workers);
    }


    // =========================
    // DEACTIVATE WORKER
    // =========================

    @PutMapping("/workers/{id}/deactivate")
    public ResponseEntity<?> deactivateWorker(
            @PathVariable Long id) {

        User worker = userRepository
                .findById(id)
                .orElse(null);

        if (worker == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }


        if (!"NURSE".equals(worker.getRole())
                && !"DOCTOR".equals(worker.getRole())
                && !"PHARMACIST".equals(worker.getRole())) {

            return ResponseEntity
                    .badRequest()
                    .body("The selected user is not a healthcare worker.");
        }


        worker.setActive(false);

        userRepository.save(worker);

        return ResponseEntity.ok(
                "Healthcare worker deactivated successfully."
        );
    }


    // =========================
    // ACTIVATE WORKER
    // =========================

    @PutMapping("/workers/{id}/activate")
    public ResponseEntity<?> activateWorker(
            @PathVariable Long id) {

        User worker = userRepository
                .findById(id)
                .orElse(null);

        if (worker == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }


        if (!"NURSE".equals(worker.getRole())
                && !"DOCTOR".equals(worker.getRole())
                && !"PHARMACIST".equals(worker.getRole())) {

            return ResponseEntity
                    .badRequest()
                    .body("The selected user is not a healthcare worker.");
        }


        worker.setActive(true);

        userRepository.save(worker);

        return ResponseEntity.ok(
                "Healthcare worker activated successfully."
        );
    }


    // =========================
    // GET ALL PATIENTS
    // =========================

    @GetMapping("/patients")
    public ResponseEntity<List<User>> getPatients() {

        List<User> patients = userRepository.findAll()
                .stream()
                .filter(user -> "PATIENT".equals(user.getRole()))
                .toList();

        return ResponseEntity.ok(patients);
    }


    // =========================
    // DEACTIVATE PATIENT
    // =========================

    @PutMapping("/patients/{id}/deactivate")
    public ResponseEntity<?> deactivatePatient(
            @PathVariable Long id) {

        User patient = userRepository
                .findById(id)
                .orElse(null);

        if (patient == null) {
            return ResponseEntity.notFound().build();
        }

        if (!"PATIENT".equals(patient.getRole())) {
            return ResponseEntity
                    .badRequest()
                    .body("The selected user is not a patient.");
        }

        patient.setActive(false);

        userRepository.save(patient);

        return ResponseEntity.ok(
                "Patient deactivated successfully."
        );
    }


    // =========================
    // ACTIVATE PATIENT
    // =========================

    @PutMapping("/patients/{id}/activate")
    public ResponseEntity<?> activatePatient(
            @PathVariable Long id) {

        User patient = userRepository
                .findById(id)
                .orElse(null);

        if (patient == null) {
            return ResponseEntity.notFound().build();
        }

        if (!"PATIENT".equals(patient.getRole())) {
            return ResponseEntity
                    .badRequest()
                    .body("The selected user is not a patient.");
        }

        patient.setActive(true);

        userRepository.save(patient);

        return ResponseEntity.ok(
                "Patient activated successfully."
        );
    }


    // =========================
    // CHANGE PASSWORD
    // =========================

    @PutMapping("/change-password/{id}")
    public ResponseEntity<?> changePassword(
            @PathVariable Long id,
            @RequestBody Map<String, String> passwordRequest) {

        User admin = userRepository
                .findById(id)
                .orElse(null);

        if (admin == null) {
            return ResponseEntity.notFound().build();
        }

        String currentPassword =
                passwordRequest.get("currentPassword");

        String newPassword =
                passwordRequest.get("newPassword");

        if (currentPassword == null
                || newPassword == null) {

            return ResponseEntity
                    .badRequest()
                    .body("Current password and new password are required.");
        }

        if (!admin.getPassword().equals(currentPassword)) {

            return ResponseEntity
                    .badRequest()
                    .body("Current password is incorrect.");
        }

        admin.setPassword(newPassword);

        userRepository.save(admin);

        return ResponseEntity.ok(
                "Password changed successfully."
        );
    }
}

