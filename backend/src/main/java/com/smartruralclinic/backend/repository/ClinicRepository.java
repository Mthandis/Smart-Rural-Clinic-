package com.smartruralclinic.backend.repository;

import com.smartruralclinic.backend.entity.Clinic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.smartruralclinic.backend.entity.Clinic;
import java.util.Optional;

public interface ClinicRepository extends JpaRepository<Clinic, Long> {

    @Query("""
        SELECT COUNT(c) > 0
        FROM Clinic c
        WHERE LOWER(c.clinicName) = LOWER(:clinicName)
    """)
    boolean clinicNameExists(@Param("clinicName") String clinicName);

    Optional<Clinic> findByClinicNameIgnoreCase(String clinicName);
}