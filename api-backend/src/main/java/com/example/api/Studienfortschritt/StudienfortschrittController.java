package com.example.api.Studienfortschritt;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.api.prufung.Pruefung.PruefungsUebersichtDTO;
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

     @GetMapping("/export/pdf")
    public ResponseEntity<byte[]> exportPdf(@AuthenticationPrincipal Student student) {
        String studentName = student.getVorname() + " " + student.getNachname();
        byte[] pdfBytes = service.generatePdf(student.getUserId(), studentName);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "studienfortschritt.pdf");
        headers.setContentLength(pdfBytes.length);

        return new ResponseEntity<>(pdfBytes, headers, org.springframework.http.HttpStatus.OK);
    }
    
    public record StudienfortschrittDTO(
        int earnedEcts,
        double averageGrade,

        int passedExams,
        int failedExams,
        int openExams,

        List<PruefungsUebersichtDTO> bestandenePruefungen,
        List<PruefungsUebersichtDTO> nichtBestandenePruefungen,
        List<PruefungsUebersichtDTO> offenePruefungen
) {
}


    
}
