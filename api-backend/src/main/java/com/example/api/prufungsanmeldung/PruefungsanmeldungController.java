package com.example.api.prufungsanmeldung;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.example.api.prufungsanmeldung.Pruefungsanmeldung.AnmeldungResponse;
import com.example.api.prufungsanmeldung.Pruefungsanmeldung.PruefungMitAnmeldungResponse;
import com.example.api.student.Student;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/pruefungsanmeldungen")
@PreAuthorize("hasRole('STUDENT')")
public class PruefungsanmeldungController {

    private final PruefungsanmeldungService service;

    public PruefungsanmeldungController(PruefungsanmeldungService service) {
        this.service = service;
    }

    @GetMapping("/verfuegbar")
    @Operation(summary = "Alle Prüfungen mit Anmeldestatus für den eingeloggten Studenten")
    public ResponseEntity<List<PruefungMitAnmeldungResponse>> getVerfuegbarePruefungen(
            @AuthenticationPrincipal Student student) {
        return ResponseEntity.ok(service.getPruefungenFuerStudent(student.getUserId()));
    }

    @GetMapping("/meine")
    @Operation(summary = "Eigene aktive Anmeldungen")
    public ResponseEntity<List<AnmeldungResponse>> getMeineAnmeldungen(
            @AuthenticationPrincipal Student student) {
        return ResponseEntity.ok(service.getMeineAnmeldungen(student.getUserId()));
    }

    @PostMapping("/{pruefungId}")
    @Operation(summary = "Für eine Prüfung anmelden")
    public ResponseEntity<AnmeldungResponse> anmelden(
            @PathVariable UUID pruefungId,
            @AuthenticationPrincipal Student student) {
        return ResponseEntity.ok(service.anmelden(student.getUserId(), pruefungId));
    }

    @DeleteMapping("/{pruefungId}")
    @Operation(summary = "Von einer Prüfung abmelden")
    public ResponseEntity<Void> abmelden(
            @PathVariable UUID pruefungId,
            @AuthenticationPrincipal Student student) {
        service.abmelden(student.getUserId(), pruefungId);
        return ResponseEntity.noContent().build();
    }
}