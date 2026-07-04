package com.example.api.professor;

import java.time.LocalDate;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/professor")
@PreAuthorize("hasRole('PROFESSOR')")
public class ProfController {

    private final ProfService profService;
 
    public ProfController(ProfService professorProfilService) {
        this.profService = professorProfilService;
    }
 
    @GetMapping("/profil")
    public ResponseEntity<ProfessorProfilResponse> eigenesProfil(
            @AuthenticationPrincipal Professor professor) {
 
        return ResponseEntity.ok(profService.eigenesProfil(professor));
    }
 
    @PutMapping("/profil-update")
    public ResponseEntity<ProfessorProfilResponse> profilAktualisieren(
            @AuthenticationPrincipal Professor professor,
            @RequestBody ProfessorProfilUpdateRequest req) {
 
        return ResponseEntity.ok(
            profService.profilAktualisieren(professor, req));
    }
 
    @GetMapping("/students/{id}")
    public ResponseEntity<StudentKurzProfilResponse> studentKurzprofil(
            @PathVariable UUID id) {
 
        return ResponseEntity.ok(profService.studentKurzprofil(id));
    }


     public record ProfessorProfilResponse(
        String vorname,
        String nachname,
        String email,
        LocalDate geburtsdatum,
        String telefon,
        String titel,
        String fachbereich
    ) {}
 
    public record ProfessorProfilUpdateRequest(
        String vorname,
        String nachname,
        LocalDate geburtsdatum,
        String telefon,
        String titel,
        String fachbereich
    ) {}
 
    public record StudentKurzProfilResponse(
        String vorname,
        String nachname,
        String email,
        String studiengang,
        Integer semester
    ) {}
    
}
