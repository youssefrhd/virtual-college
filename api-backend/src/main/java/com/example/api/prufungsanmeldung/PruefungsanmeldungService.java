package com.example.api.prufungsanmeldung;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.api.prufung.Pruefung;
import com.example.api.prufung.prufungRepository;
import com.example.api.prufungsanmeldung.Pruefungsanmeldung.AnmeldungResponse;
import com.example.api.prufungsanmeldung.Pruefungsanmeldung.PruefungMitAnmeldungResponse;
import com.example.api.student.Student;
import com.example.api.student.StudentRepository;

@Service
public class PruefungsanmeldungService {

     private final PruefungsanmeldungRepository anmeldungRepository;
    private final prufungRepository pruefungRepository;
    private final StudentRepository studentRepository;

    public PruefungsanmeldungService(
            PruefungsanmeldungRepository anmeldungRepository,
            prufungRepository pruefungRepository,
            StudentRepository studentRepository) {
        this.anmeldungRepository = anmeldungRepository;
        this.pruefungRepository = pruefungRepository;
        this.studentRepository = studentRepository;
    }

    public List<PruefungMitAnmeldungResponse> getPruefungenFuerStudent(UUID studentId) {
        List<Pruefung> alleAktivenPruefungen = pruefungRepository.findAll(); // ggf. nach Studiengang/Modul filtern
        List<Pruefungsanmeldung> anmeldungen = anmeldungRepository.findByStudentId(studentId);

        return alleAktivenPruefungen.stream()
                .map(p -> {
                    Pruefungsanmeldung anmeldung = anmeldungen.stream()
                            .filter(a -> a.getPruefung().getPruefungId().equals(p.getPruefungId()))
                            .findFirst()
                            .orElse(null);

                    boolean moeglich = LocalDate.now().isAfter(p.getAnmeldungStart().minusDays(1))
                            && LocalDate.now().isBefore(p.getAnmeldungEnde().plusDays(1))
                            && (anmeldung == null || anmeldung.getStatus() == Pruefungsanmeldung.Status.ABGEMELDET);

                    return new PruefungMitAnmeldungResponse(
                            p.getPruefungId(),
                            p.getBezeichnung(),
                            p.getDatum(),
                            p.getAnmeldungStart(),
                            p.getAnmeldungEnde(),
                            p.getRaum(),
                            p.getPruefungstyp().name(),
                            p.getModul() != null ? p.getModul().getBezeichnung() : null,
                            anmeldung != null ? anmeldung.getAnmeldungId() : null,
                            anmeldung != null ? anmeldung.getStatus().name() : null,
                            moeglich
                    );
                })
                .collect(Collectors.toList());
    }

    public AnmeldungResponse anmelden(UUID studentId, UUID pruefungId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student nicht gefunden."));
        Pruefung pruefung = pruefungRepository.findById(pruefungId)
                .orElseThrow(() -> new IllegalArgumentException("Prüfung nicht gefunden."));

        LocalDate today = LocalDate.now();
        if (today.isBefore(pruefung.getAnmeldungStart()) || today.isAfter(pruefung.getAnmeldungEnde())) {
            throw new IllegalStateException("Anmeldezeitraum für diese Prüfung ist nicht aktiv.");
        }

        Pruefungsanmeldung anmeldung = anmeldungRepository
                .findByStudentIdAndPruefungId(studentId, pruefungId)
                .orElse(null);

        if (anmeldung != null && anmeldung.getStatus() == Pruefungsanmeldung.Status.ANGEMELDET) {
            throw new IllegalStateException("Du bist bereits für diese Prüfung angemeldet.");
        }

        if (anmeldung == null) {
            anmeldung = new Pruefungsanmeldung(student, pruefung);
        } else {
            anmeldung.setAnmeldeDatum(today);
        }
        // Status wird über den Enum-Default gesetzt bzw. muss hier explizit re-aktiviert werden:
        setStatus(anmeldung, Pruefungsanmeldung.Status.ANGEMELDET);

        Pruefungsanmeldung saved = anmeldungRepository.save(anmeldung);

        return new AnmeldungResponse(
                saved.getAnmeldungId(),
                pruefung.getPruefungId(),
                pruefung.getBezeichnung(),
                saved.getAnmeldeDatum(),
                saved.getStatus().name()
        );
    }

    public void abmelden(UUID studentId, UUID pruefungId) {
        Pruefungsanmeldung anmeldung = anmeldungRepository
                .findByStudentIdAndPruefungId(studentId, pruefungId)
                .orElseThrow(() -> new IllegalArgumentException("Keine Anmeldung gefunden."));

        setStatus(anmeldung, Pruefungsanmeldung.Status.ABGEMELDET);
        anmeldungRepository.save(anmeldung);
    }

    public List<AnmeldungResponse> getMeineAnmeldungen(UUID studentId) {
        return anmeldungRepository.findByStudentId(studentId).stream()
                .filter(a -> a.getStatus() == Pruefungsanmeldung.Status.ANGEMELDET)
                .map(a -> new AnmeldungResponse(
                        a.getAnmeldungId(),
                        a.getPruefung().getPruefungId(),
                        a.getPruefung().getBezeichnung(),
                        a.getAnmeldeDatum(),
                        a.getStatus().name()
                ))
                .collect(Collectors.toList());
    }

    private void setStatus(Pruefungsanmeldung anmeldung, Pruefungsanmeldung.Status status) {
        anmeldung.setStatusInternal(status);
    }
    
}
