package com.smartruralclinic.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "clinics")
public class Clinic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String clinicName;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private String contactNumber;

    private boolean active = true;

    public Clinic() {
    }

    public Clinic(String clinicName, String location, String contactNumber) {
        this.clinicName = clinicName;
        this.location = location;
        this.contactNumber = contactNumber;
        this.active = true;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getClinicName() {
        return clinicName;
    }

    public void setClinicName(String clinicName) {
        this.clinicName = clinicName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}