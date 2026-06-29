package com.example.api.Studienfortschritt;

import java.util.UUID;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.api.Studienfortschritt.dto.StudienfortschrittDTO;
import com.example.api.student.Student;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/studienfortschritt")
@PreAuthorize("hasRole('STUDENT')")
public class StudienfortschrittController {

    private final StudienfortschrittService service;

    public StudienfortschrittController(
            StudienfortschrittService service) {
        this.service = service;
    }

    @GetMapping
    public StudienfortschrittDTO getStudienfortschritt(
             @AuthenticationPrincipal Student student) {

                
        return service.getStudienfortschritt(student.getUserId());
    }
    
    
    
}
