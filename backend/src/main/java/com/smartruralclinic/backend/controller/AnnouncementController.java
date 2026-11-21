package com.smartruralclinic.backend.controller;

import com.smartruralclinic.backend.entity.Announcement;
import com.smartruralclinic.backend.repository.AnnouncementRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/announcements")
@CrossOrigin(origins = "http://localhost:5173")
public class AnnouncementController {

    private final AnnouncementRepository announcementRepository;

    public AnnouncementController(AnnouncementRepository announcementRepository) {
        this.announcementRepository = announcementRepository;
    }

    // Create announcement
    @PostMapping
    public ResponseEntity<Announcement> createAnnouncement(
            @RequestBody Announcement announcement) {

        announcement.setActive(true);

        Announcement savedAnnouncement =
                announcementRepository.save(announcement);

        return ResponseEntity.ok(savedAnnouncement);
    }

    // Get all announcements
    @GetMapping
    public ResponseEntity<List<Announcement>> getAnnouncements() {

        return ResponseEntity.ok(
                announcementRepository.findAll()
        );
    }

    // Update announcement
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAnnouncement(
            @PathVariable Long id,
            @RequestBody Announcement updatedAnnouncement) {

        Announcement announcement =
                announcementRepository.findById(id).orElse(null);

        if (announcement == null) {
            return ResponseEntity.notFound().build();
        }

        announcement.setTitle(updatedAnnouncement.getTitle());
        announcement.setMessage(updatedAnnouncement.getMessage());

        Announcement savedAnnouncement =
                announcementRepository.save(announcement);

        return ResponseEntity.ok(savedAnnouncement);
    }

    // Deactivate announcement
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<?> deactivateAnnouncement(
            @PathVariable Long id) {

        Announcement announcement =
                announcementRepository.findById(id).orElse(null);

        if (announcement == null) {
            return ResponseEntity.notFound().build();
        }

        announcement.setActive(false);
        announcementRepository.save(announcement);

        return ResponseEntity.ok(
                "Announcement deactivated successfully."
        );
    }

    // Activate announcement
    @PutMapping("/{id}/activate")
    public ResponseEntity<?> activateAnnouncement(
            @PathVariable Long id) {

        Announcement announcement =
                announcementRepository.findById(id).orElse(null);

        if (announcement == null) {
            return ResponseEntity.notFound().build();
        }

        announcement.setActive(true);
        announcementRepository.save(announcement);

        return ResponseEntity.ok(
                "Announcement activated successfully."
        );
    }

    // Delete announcement
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAnnouncement(
            @PathVariable Long id) {

        Announcement announcement =
                announcementRepository.findById(id).orElse(null);

        if (announcement == null) {
            return ResponseEntity.notFound().build();
        }

        announcementRepository.delete(announcement);

        return ResponseEntity.ok(
                "Announcement deleted successfully."
        );
    }
}