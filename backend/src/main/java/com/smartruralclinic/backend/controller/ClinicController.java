package com.smartruralclinic.backend.controller;

import com.smartruralclinic.backend.entity.Clinic;
import com.smartruralclinic.backend.repository.ClinicRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/clinics")
@CrossOrigin(origins = "http://localhost:5173")
public class ClinicController {

    private final ClinicRepository clinicRepository;

    public ClinicController(ClinicRepository clinicRepository) {
        this.clinicRepository = clinicRepository;
    }

    // =========================
    // REGISTER CLINIC
    // =========================

    @PostMapping
    public ResponseEntity<?> addClinic(@RequestBody Clinic clinic) {

        // Check if a clinic with the same name already exists
        if (clinicRepository.clinicNameExists(
                clinic.getClinicName())) {

            return ResponseEntity
                    .badRequest()
                    .body("A clinic with this name already exists.");
        }

        // New clinics are active by default
        clinic.setActive(true);

        Clinic savedClinic = clinicRepository.save(clinic);

        return ResponseEntity.ok(savedClinic);
    }


    // =========================
    // GET ALL CLINICS
    // =========================

    @GetMapping
    public ResponseEntity<List<Clinic>> getClinics() {

        return ResponseEntity.ok(
                clinicRepository.findAll()
        );
    }


    // =========================
    // COUNT CLINICS
    // =========================

    @GetMapping("/count")
    public ResponseEntity<Long> getClinicCount() {

        return ResponseEntity.ok(
                clinicRepository.count()
        );
    }


    // =========================
    // DEACTIVATE CLINIC
    // =========================

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<?> deactivateClinic(
            @PathVariable Long id) {

        Clinic clinic = clinicRepository
                .findById(id)
                .orElse(null);

        if (clinic == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        clinic.setActive(false);

        clinicRepository.save(clinic);

        return ResponseEntity.ok(
                "Clinic deactivated successfully."
        );
    }


    // =========================
    // ACTIVATE CLINIC
    // =========================

    @PutMapping("/{id}/activate")
    public ResponseEntity<?> activateClinic(
            @PathVariable Long id) {

        Clinic clinic = clinicRepository
                .findById(id)
                .orElse(null);

        if (clinic == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        clinic.setActive(true);

        clinicRepository.save(clinic);

        return ResponseEntity.ok(
                "Clinic activated successfully."
        );
    }
}