package com.example.api.student;

import java.time.LocalDate;

import org.springframework.http.ResponseEntity;


import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/student")
@PreAuthorize("hasRole('STUDENT')")
public class StudentController {
     private final StudentService studentProfilService;
 
    public StudentController(StudentService studentProfilService) {
        this.studentProfilService = studentProfilService;
    }
 
    @GetMapping("/me")
    public ResponseEntity<StudentProfilResponse> eigenesProfil(
            @AuthenticationPrincipal Student student) {
 
        return ResponseEntity.ok(studentProfilService.eigenesProfil(student));
    }
 
    @PutMapping
    public ResponseEntity<StudentProfilResponse> profilAktualisieren(
            @AuthenticationPrincipal Student student,
            @RequestBody StudentProfilUpdateRequest req) {
 
        return ResponseEntity.ok(
            studentProfilService.profilAktualisieren(student, req));
    }

     public record StudentProfilResponse(
        String vorname,
        String nachname,
        String email,
        LocalDate geburtsdatum,
        String matrikelNr,
        String studiengang,
        Integer semester
    ) {}
 
    public record StudentProfilUpdateRequest(
        String vorname,
        String nachname,
        LocalDate geburtsdatum,
        String studiengang,
        Integer semester
    ) {}
}
