package com.smartruralclinic.backend.repository;

import com.smartruralclinic.backend.entity.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
}