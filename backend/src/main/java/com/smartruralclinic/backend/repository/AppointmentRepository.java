package com.smartruralclinic.backend.repository;

import com.smartruralclinic.backend.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByPatientId(Long patientId);

    List<Appointment> findByStatus(String status);

    List<Appointment> findByAssignedDoctorId(Long assignedDoctorId);
    List<Appointment> findByAssignedNurseId(Long assignedNurseId);
    List<Appointment> findByAssignedNurseIdAndStatusIn(
            Long assignedNurseId,
            List<String> statuses
    );
    long countByClinicIgnoreCase(String clinic);

    long countByClinicIgnoreCaseAndStatusIgnoreCaseAndAssignedNurseIdIsNull(
            String clinic,
            String status
    );

    long countByClinicIgnoreCaseAndAssignedNurseIdAndStatusIgnoreCase(
            String clinic,
            Long assignedNurseId,
            String status
    );
}