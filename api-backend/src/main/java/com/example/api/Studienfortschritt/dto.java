package com.example.api.Studienfortschritt;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public class dto {
    public record PruefungsUebersichtDTO(
        UUID pruefungId,
        String pruefungsBezeichnung,

        UUID modulId,
        String modulBezeichnung,
        Integer ects,

        LocalDate pruefungsDatum,
        String raum,

        Float note,
        Integer versuchNr,

        String status
) {
}

public record StudienfortschrittDTO(
        int earnedEcts,
        double averageGrade,

        long passedExams,
        long failedExams,
        long openExams,

        List<PruefungsUebersichtDTO> bestandenePruefungen,
        List<PruefungsUebersichtDTO> nichtBestandenePruefungen,
        List<PruefungsUebersichtDTO> offenePruefungen
) {
}
    
}
