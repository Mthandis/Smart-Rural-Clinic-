package com.smartruralclinic.backend.controller;

import com.smartruralclinic.backend.entity.Medicine;
import com.smartruralclinic.backend.repository.MedicineRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicines")
@CrossOrigin(origins = "http://localhost:5173")
public class MedicineController {

    private final MedicineRepository medicineRepository;

    public MedicineController(MedicineRepository medicineRepository) {
        this.medicineRepository = medicineRepository;
    }

    @GetMapping
    public ResponseEntity<List<Medicine>> getAllMedicines() {

        return ResponseEntity.ok(
                medicineRepository.findAll()
        );
    }

    @GetMapping("/clinic/{clinic}")
    public ResponseEntity<List<Medicine>> getClinicMedicines(
            @PathVariable String clinic) {

        return ResponseEntity.ok(
                medicineRepository.findByClinic(clinic)
        );
    }

    @GetMapping("/search")
    public ResponseEntity<List<Medicine>> searchMedicine(
            @RequestParam String name) {

        return ResponseEntity.ok(
                medicineRepository
                        .findByMedicineNameContainingIgnoreCase(name)
        );
    }

    @GetMapping("/clinic/{clinic}/search")
    public ResponseEntity<List<Medicine>> searchClinicMedicine(
            @PathVariable String clinic,
            @RequestParam String name) {

        return ResponseEntity.ok(
                medicineRepository
                        .findByClinicAndMedicineNameContainingIgnoreCase(
                                clinic,
                                name
                        )
        );
    }

    @PostMapping
    public ResponseEntity<?> addMedicine(
            @RequestBody Medicine medicine) {

        if (medicine.getMedicineName() == null
                || medicine.getMedicineName().isBlank()) {

            return ResponseEntity
                    .badRequest()
                    .body("Medicine name is required.");
        }

        if (medicine.getQuantity() == null
                || medicine.getQuantity() < 0) {

            return ResponseEntity
                    .badRequest()
                    .body("Quantity must be 0 or greater.");
        }

        if (medicine.getClinic() == null
                || medicine.getClinic().isBlank()) {

            return ResponseEntity
                    .badRequest()
                    .body("Clinic is required.");
        }

        // Prevent duplicate medicine in the same clinic
        if (medicineRepository
                .existsByMedicineNameIgnoreCaseAndClinic(
                        medicine.getMedicineName().trim(),
                        medicine.getClinic().trim()
                )) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "This medicine already exists in this clinic."
                    );
        }

        medicine.setMedicineName(
                medicine.getMedicineName().trim()
        );

        medicine.setClinic(
                medicine.getClinic().trim()
        );

        updateStockStatus(medicine);

        return ResponseEntity.ok(
                medicineRepository.save(medicine)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMedicine(
            @PathVariable Long id,
            @RequestBody Medicine updatedMedicine) {

        Medicine medicine =
                medicineRepository.findById(id).orElse(null);

        if (medicine == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        if (updatedMedicine.getQuantity() == null
                || updatedMedicine.getQuantity() < 0) {

            return ResponseEntity
                    .badRequest()
                    .body("Quantity must be 0 or greater.");
        }

        if (updatedMedicine.getClinic() == null
                || updatedMedicine.getClinic().isBlank()) {

            return ResponseEntity
                    .badRequest()
                    .body("Clinic is required.");
        }

        medicine.setQuantity(
                updatedMedicine.getQuantity()
        );

        medicine.setClinic(
                updatedMedicine.getClinic().trim()
        );

        updateStockStatus(medicine);

        return ResponseEntity.ok(
                medicineRepository.save(medicine)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMedicine(
            @PathVariable Long id) {

        if (!medicineRepository.existsById(id)) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        medicineRepository.deleteById(id);

        return ResponseEntity.ok(
                "Medicine removed successfully."
        );
    }

    private void updateStockStatus(Medicine medicine) {

        if (medicine.getQuantity() == 0) {

            medicine.setStatus("OUT_OF_STOCK");

        } else if (medicine.getQuantity() <= 10) {

            medicine.setStatus("LOW_STOCK");

        }  else {

            medicine.setStatus("HIGH_STOCK");
        }
    }


}
