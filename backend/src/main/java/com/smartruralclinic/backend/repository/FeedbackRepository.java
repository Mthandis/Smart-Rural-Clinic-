
package com.smartruralclinic.backend.repository;

import com.smartruralclinic.backend.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    List<Feedback> findByClinicId(Long clinicId);

    List<Feedback> findAllByOrderByCreatedAtDesc();
}
