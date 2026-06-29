package com.example.api.student;

import org.springframework.http.ResponseEntity;

import com.example.api.student.StudentDTO.StudentProfilResponse;
import com.example.api.student.StudentDTO.StudentProfilUpdateRequest;

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
}
