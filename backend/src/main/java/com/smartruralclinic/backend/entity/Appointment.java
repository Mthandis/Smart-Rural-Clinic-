package com.smartruralclinic.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long patientId;

    private String patientName;

    private String clinic;

    private String appointmentDate;

    private String appointmentTime;

    @Column(length = 1000)
    private String symptoms;

    private String speciality;

    private Long assignedDoctorId;

    private String assignedDoctorName;
    private Long assignedNurseId;
    private String assignedNurseName;
    private String status = "PENDING";

    private String workerResponse;
    private String nurseAssessment;

    private String vitalSigns;

    private String referralReason;
    public Appointment() {
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }


    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }


    public String getClinic() {
        return clinic;
    }

    public void setClinic(String clinic) {
        this.clinic = clinic;
    }


    public String getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(String appointmentDate) {
        this.appointmentDate = appointmentDate;
    }


    public String getAppointmentTime() {
        return appointmentTime;
    }

    public void setAppointmentTime(String appointmentTime) {
        this.appointmentTime = appointmentTime;
    }


    public String getSymptoms() {
        return symptoms;
    }

    public void setSymptoms(String symptoms) {
        this.symptoms = symptoms;
    }


    public String getSpeciality() {
        return speciality;
    }

    public void setSpeciality(String speciality) {
        this.speciality = speciality;
    }


    public Long getAssignedDoctorId() {
        return assignedDoctorId;
    }

    public void setAssignedDoctorId(Long assignedDoctorId) {
        this.assignedDoctorId = assignedDoctorId;
    }


    public String getAssignedDoctorName() {
        return assignedDoctorName;
    }

    public void setAssignedDoctorName(String assignedDoctorName) {
        this.assignedDoctorName = assignedDoctorName;
    }

    public Long getAssignedNurseId() {
        return assignedNurseId;
    }

    public void setAssignedNurseId(Long assignedNurseId) {
        this.assignedNurseId = assignedNurseId;
    }

    public String getAssignedNurseName() {
        return assignedNurseName;
    }

    public void setAssignedNurseName(String assignedNurseName) {
        this.assignedNurseName = assignedNurseName;
    }
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }


    public String getWorkerResponse() {
        return workerResponse;
    }

    public void setWorkerResponse(String workerResponse) {
        this.workerResponse = workerResponse;
    }

    public String getNurseAssessment() {
        return nurseAssessment;
    }

    public void setNurseAssessment(String nurseAssessment) {
        this.nurseAssessment = nurseAssessment;
    }

    public String getVitalSigns() {
        return vitalSigns;
    }

    public void setVitalSigns(String vitalSigns) {
        this.vitalSigns = vitalSigns;
    }

    public String getReferralReason() {
        return referralReason;
    }

    public void setReferralReason(String referralReason) {
        this.referralReason = referralReason;
    }
}

