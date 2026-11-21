package com.smartruralclinic.backend.repository;

import com.smartruralclinic.backend.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    List<Medicine> findByClinic(String clinic);

    List<Medicine> findByMedicineNameContainingIgnoreCase(String medicineName);

    List<Medicine> findByClinicAndMedicineNameContainingIgnoreCase(
            String clinic,
            String medicineName
    );

    boolean existsByMedicineNameIgnoreCaseAndClinic(
            String medicineName,
            String clinic
    );


}
