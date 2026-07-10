package com.example.api.kurs;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.api.kurs.KursDto.KursRequest;
import com.example.api.kurs.KursDto.KursResponse;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/kurse")
public class KursController {

    private final KursService kursService;

    public KursController(KursService kursService) {
        this.kursService = kursService;
    }

    @PostMapping("/kurs-anlegen")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<KursResponse> createKurs(@RequestBody KursRequest request) {
        return ResponseEntity.ok(kursService.kursAnlegen(request));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('PROFESSOR','STUDENT')")
    public ResponseEntity<List<KursResponse>> getAllKurse() {
        return ResponseEntity.ok(kursService.findAll());
    }

    @GetMapping("/{kursId}")
    @PreAuthorize("hasAnyRole('PROFESSOR','STUDENT')")
    public ResponseEntity<KursResponse> getKurs(@PathVariable UUID kursId) {
        return ResponseEntity.ok(kursService.findById(kursId));
    }

    @DeleteMapping("/{kursId}")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<Void> deleteKurs(@PathVariable UUID kursId) {
        kursService.delete(kursId);
        return ResponseEntity.noContent().build();
    }
}