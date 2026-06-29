package com.example.api.Studienfortschritt;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.api.Studienfortschritt.dto.PruefungsUebersichtDTO;
import com.example.api.Studienfortschritt.dto.StudienfortschrittDTO;
import com.example.api.prufungsanmeldung.Pruefungsanmeldung;
import com.example.api.student.Student;
import com.example.api.student.StudentService;


@Service
public class StudienfortschrittService {
    private final StudentService studentService;
    private final ModulService modulService ;

    public StudienfortschrittService(StudentService studentService) {
        this.studentService = studentService;
    }

    public StudienfortschrittDTO getStudienfortschritt(UUID studentId) {

        Student student = studentService.findById(studentId);

        List<Pruefungsanmeldung> anmeldungen =
                student.getPruefungsanmeldungen();

        List<PruefungsUebersichtDTO> bestandene =
                anmeldungen.stream()
                        .filter(a -> Boolean.TRUE.equals(a.getBestanden()))
                        .map(this::toDTO)
                        .toList();

        List<PruefungsUebersichtDTO> nichtBestandene =
                anmeldungen.stream()
                        .filter(a -> Boolean.FALSE.equals(a.getBestanden()))
                        .map(this::toDTO)
                        .toList();

        List<PruefungsUebersichtDTO> offene =
                anmeldungen.stream()
                        .filter(a -> a.getStatus() ==
                                Pruefungsanmeldung.Status.ANGEMELDET)
                        .filter(a -> a.getNote() == null)
                        .map(this::toDTO)
                        .toList();

        int earnedEcts = anmeldungen.stream()
                .filter(a -> Boolean.TRUE.equals(a.getBestanden()))
                .map(a -> a.getPruefung().getModul())
                .distinct()
                .mapToInt(modul -> modul.getEcts())
                .sum();

        long passedExams = bestandene.size();

        long failedExams = nichtBestandene.size();

        long openExams = offene.size();

        double averageGrade = anmeldungen.stream()
                .filter(a -> a.getNote() != null && a.getNote()<=4)
                .mapToDouble(Pruefungsanmeldung::getNote)
                .average()
                .orElse(0.0);

        return new StudienfortschrittDTO(
                earnedEcts,
                Math.round(averageGrade * 100.0) / 100.0,

                passedExams,
                failedExams,
                openExams,

                bestandene,
                nichtBestandene,
                offene
        );
    }

    private PruefungsUebersichtDTO toDTO(
            Pruefungsanmeldung anmeldung) {

        var pruefung = anmeldung.getPruefung();
        var modul = pruefung.getModul();

        return new PruefungsUebersichtDTO(
                pruefung.getPruefungId(),
                pruefung.getBezeichnung(),

                modul.getModulId(),
                modul.getBezeichnung(),
                modul.getEcts(),

                pruefung.getDatum(),
                pruefung.getRaum(),

                anmeldung.getNote(),
                anmeldung.getVersuchNr(),

                anmeldung.getStatus().name()
        );
    }
    
}
