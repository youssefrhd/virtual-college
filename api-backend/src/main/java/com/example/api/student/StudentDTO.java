package com.example.api.student;

import java.time.LocalDate;

class StudentDTO {

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