
package com.smartruralclinic.backend.controller;

import com.smartruralclinic.backend.entity.User;
import com.smartruralclinic.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Get all registered patients across all clinics
    @GetMapping("/patients")
    public ResponseEntity<List<Map<String, Object>>> getPatients() {

        List<User> users = userRepository.findAll();
        List<Map<String, Object>> patients = new ArrayList<>();

        for (User user : users) {

            if ("PATIENT".equalsIgnoreCase(user.getRole())) {

                Map<String, Object> patient = new HashMap<>();

                patient.put("id", user.getId());
                patient.put("fullName", user.getFullName());
                patient.put("idNumber", user.getIdNumber());
                patient.put("email", user.getEmail());
                patient.put("phone", user.getPhone());
                patient.put("active", user.isActive());

                if (user.getClinic() != null) {
                    patient.put("clinicId", user.getClinic().getId());
                    patient.put("clinicName", user.getClinic().getClinicName());
                    patient.put("clinicLocation", user.getClinic().getLocation());
                } else {
                    patient.put("clinicId", null);
                    patient.put("clinicName", "Not assigned");
                    patient.put("clinicLocation", null);
                }

                patients.add(patient);
            }
        }

        return ResponseEntity.ok(patients);
    }


    // Get registered clinic for a patient
    @GetMapping("/{patientId}/clinic")
    public ResponseEntity<?> getPatientClinic(
            @PathVariable Long patientId) {

        User patient = userRepository.findById(patientId)
                .orElse(null);

        if (patient == null) {
            return ResponseEntity.notFound().build();
        }

        if (patient.getClinic() == null) {
            return ResponseEntity.badRequest()
                    .body("No clinic is registered for this patient.");
        }

        Map<String, Object> clinic = new HashMap<>();

        clinic.put("id", patient.getClinic().getId());
        clinic.put("clinicName", patient.getClinic().getClinicName());
        clinic.put("location", patient.getClinic().getLocation());
        clinic.put("contactNumber", patient.getClinic().getContactNumber());
        clinic.put("active", patient.getClinic().isActive());

        return ResponseEntity.ok(clinic);
    }

    // Get patient profile
    @GetMapping("/{patientId}/profile")
    public ResponseEntity<?> getPatientProfile(
            @PathVariable Long patientId) {

        User patient = userRepository.findById(patientId)
                .orElse(null);

        if (patient == null ||
                !"PATIENT".equalsIgnoreCase(patient.getRole())) {
            return ResponseEntity.notFound().build();
        }

        Map<String, Object> profile = new HashMap<>();

        profile.put("id", patient.getId());
        profile.put("fullName", patient.getFullName());
        profile.put("idNumber", patient.getIdNumber());
        profile.put("email", patient.getEmail());
        profile.put("phone", patient.getPhone());

        if (patient.getClinic() != null) {

            Map<String, Object> clinic = new HashMap<>();

            clinic.put("id", patient.getClinic().getId());
            clinic.put("clinicName", patient.getClinic().getClinicName());
            clinic.put("location", patient.getClinic().getLocation());
            clinic.put("contactNumber", patient.getClinic().getContactNumber());

            profile.put("clinic", clinic);

        } else {
            profile.put("clinic", null);
        }

        return ResponseEntity.ok(profile);
    }

    // Update patient email address and phone number
    @PutMapping("/{patientId}/profile")
    public ResponseEntity<?> updatePatientProfile(
            @PathVariable Long patientId,
            @RequestBody Map<String, String> request) {

        User patient = userRepository.findById(patientId)
                .orElse(null);

        if (patient == null ||
                !"PATIENT".equalsIgnoreCase(patient.getRole())) {
            return ResponseEntity.notFound().build();
        }

        String email = request.get("email");
        String phone = request.get("phone");

        // Validate required fields
        if (email == null || email.trim().isEmpty() ||
                phone == null || phone.trim().isEmpty()) {

            return ResponseEntity.badRequest()
                    .body("Email address and phone number are required.");
        }

        email = email.trim();
        phone = phone.trim();

        // Validate email format
        if (!email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            return ResponseEntity.badRequest()
                    .body("Please enter a valid email address.");
        }

        // Validate phone number
        if (!phone.matches("^[0-9+()\\s-]{10,15}$")) {
            return ResponseEntity.badRequest()
                    .body("Please enter a valid phone number.");
        }

        // Check whether another user already uses this email
        User existingUser = userRepository.findByEmail(email)
                .orElse(null);

        if (existingUser != null &&
                !existingUser.getId().equals(patient.getId())) {

            return ResponseEntity.badRequest()
                    .body("This email address is already registered.");
        }

        // Update only email and phone
        patient.setEmail(email);
        patient.setPhone(phone);

        User updatedPatient = userRepository.save(patient);

        Map<String, Object> response = new HashMap<>();
        response.put("email", updatedPatient.getEmail());
        response.put("phone", updatedPatient.getPhone());

        return ResponseEntity.ok(response);
    }

    // Get nurse profile
    @GetMapping("/{nurseId}/nurse-profile")
    public ResponseEntity<?> getNurseProfile(@PathVariable Long nurseId) {

        User nurse = userRepository.findById(nurseId).orElse(null);

        if (nurse == null || !"NURSE".equalsIgnoreCase(nurse.getRole())) {
            return ResponseEntity.notFound().build();
        }

        Map<String, Object> profile = new HashMap<>();

        profile.put("id", nurse.getId());
        profile.put("fullName", nurse.getFullName());
        profile.put("idNumber", nurse.getIdNumber());
        profile.put("email", nurse.getEmail());
        profile.put("phone", nurse.getPhone());
        profile.put("speciality", nurse.getSpeciality());

        if (nurse.getClinic() != null) {
            Map<String, Object> clinic = new HashMap<>();

            clinic.put("id", nurse.getClinic().getId());
            clinic.put("clinicName", nurse.getClinic().getClinicName());
            clinic.put("location", nurse.getClinic().getLocation());
            clinic.put("contactNumber", nurse.getClinic().getContactNumber());

            profile.put("clinic", clinic);
        } else {
            profile.put("clinic", null);
        }

        return ResponseEntity.ok(profile);
    }


    // Update nurse email and phone number
    @PutMapping("/{nurseId}/nurse-profile")
    public ResponseEntity<?> updateNurseProfile(
            @PathVariable Long nurseId,
            @RequestBody Map<String, String> request) {

        User nurse = userRepository.findById(nurseId).orElse(null);

        if (nurse == null || !"NURSE".equalsIgnoreCase(nurse.getRole())) {
            return ResponseEntity.notFound().build();
        }

        String email = request.get("email");
        String phone = request.get("phone");

        if (email == null || email.trim().isEmpty()
                || phone == null || phone.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("Email address and phone number are required.");
        }

        email = email.trim();
        phone = phone.trim();

        if (!email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            return ResponseEntity.badRequest()
                    .body("Please enter a valid email address.");
        }

        if (!phone.matches("^[0-9+()\\s-]{10,15}$")) {
            return ResponseEntity.badRequest()
                    .body("Please enter a valid phone number.");
        }

        User existingUser = userRepository.findByEmail(email).orElse(null);

        if (existingUser != null && !existingUser.getId().equals(nurse.getId())) {
            return ResponseEntity.badRequest()
                    .body("This email address is already registered.");
        }

        nurse.setEmail(email);
        nurse.setPhone(phone);

        User updatedNurse = userRepository.save(nurse);

        Map<String, Object> response = new HashMap<>();
        response.put("email", updatedNurse.getEmail());
        response.put("phone", updatedNurse.getPhone());

        return ResponseEntity.ok(response);
    }

}
