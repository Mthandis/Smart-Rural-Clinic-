
package com.smartruralclinic.backend.controller;

import com.smartruralclinic.backend.entity.User;
import com.smartruralclinic.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest()
                    .body("Email is already registered.");
        }

        if (userRepository.findByIdNumber(user.getIdNumber()).isPresent()) {
            return ResponseEntity.badRequest()
                    .body("ID number is already registered.");
        }

        user.setRole("PATIENT");

        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElse(null);

        if (user == null ||
                !user.getPassword().equals(loginRequest.getPassword())) {
            return ResponseEntity.badRequest()
                    .body("Email or password is incorrect.");
        }

        if (!user.isActive()) {
            return ResponseEntity.badRequest()
                    .body("Your account has been deactivated. Please contact the administrator.");
        }

        return ResponseEntity.ok(user);
    }

    // Change patient password
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody Map<String, String> request) {

        String userId = request.get("userId");
        String currentPassword = request.get("currentPassword");
        String newPassword = request.get("newPassword");

        if (userId == null || currentPassword == null ||
                newPassword == null ||
                currentPassword.isBlank() || newPassword.isBlank()) {

            return ResponseEntity.badRequest()
                    .body("All password fields are required.");
        }

        User user;

        try {
            user = userRepository.findById(Long.parseLong(userId))
                    .orElse(null);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest()
                    .body("Invalid user information.");
        }

        if (user == null ||
                !"PATIENT".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.badRequest()
                    .body("Patient account could not be found.");
        }

        if (!user.getPassword().equals(currentPassword)) {
            return ResponseEntity.badRequest()
                    .body("Your current password is incorrect.");
        }

        if (newPassword.length() < 8) {
            return ResponseEntity.badRequest()
                    .body("Your new password must contain at least 8 characters.");
        }

        if (newPassword.equals(currentPassword)) {
            return ResponseEntity.badRequest()
                    .body("Your new password must be different from your current password.");
        }

        user.setPassword(newPassword);
        userRepository.save(user);

        return ResponseEntity.ok(
                "Your password has been changed successfully."
        );
    }

    // Change nurse password
    @PostMapping("/change-nurse-password")
    public ResponseEntity<?> changeNursePassword(
            @RequestBody Map<String, String> request) {

        String userId = request.get("userId");
        String currentPassword = request.get("currentPassword");
        String newPassword = request.get("newPassword");

        if (userId == null || currentPassword == null
                || newPassword == null
                || currentPassword.isBlank()
                || newPassword.isBlank()) {

            return ResponseEntity.badRequest()
                    .body("All password fields are required.");
        }

        User nurse;

        try {
            nurse = userRepository.findById(Long.parseLong(userId))
                    .orElse(null);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest()
                    .body("Invalid user information.");
        }

        if (nurse == null || !"NURSE".equalsIgnoreCase(nurse.getRole())) {
            return ResponseEntity.badRequest()
                    .body("Nurse account could not be found.");
        }

        if (!nurse.getPassword().equals(currentPassword)) {
            return ResponseEntity.badRequest()
                    .body("Your current password is incorrect.");
        }

        if (newPassword.length() < 8) {
            return ResponseEntity.badRequest()
                    .body("Your new password must contain at least 8 characters.");
        }

        if (newPassword.equals(currentPassword)) {
            return ResponseEntity.badRequest()
                    .body("Your new password must be different from your current password.");
        }

        nurse.setPassword(newPassword);
        userRepository.save(nurse);

        return ResponseEntity.ok(
                "Your password has been changed successfully."
        );
    }

}
