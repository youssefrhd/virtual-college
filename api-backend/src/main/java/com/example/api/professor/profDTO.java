package com.example.api.professor;

import java.time.LocalDate;

public class profDTO {
    
    public record ProfessorProfilResponse(
        String vorname,
        String nachname,
        String email,
        LocalDate geburtsdatum,
        String titel,
        String fachbereich
    ) {}
 
    public record ProfessorProfilUpdateRequest(
        String vorname,
        String nachname,
        LocalDate geburtsdatum,
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
 

