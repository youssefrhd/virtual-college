package com.example.api.prufung;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.api.modul.Modul;
import com.example.api.modul.ModulRepository;
import com.example.api.prufung.Pruefung.PruefungsUebersichtDTO;
import com.example.api.prufung.pruefungsController.PruefungRequest;
import com.example.api.prufungsanmeldung.Pruefungsanmeldung;
import com.example.api.student.Student;

@Service
public class pruefungService {
    private final prufungRepository pruefungRepository;
    private final ModulRepository modulRepository;

    public pruefungService(prufungRepository pruefungRepository,
            ModulRepository modulRepository) {
        this.pruefungRepository = pruefungRepository;
        this.modulRepository = modulRepository;
    }

    public Pruefung create(PruefungRequest req) {

        Modul modul = modulRepository.findById(req.modulId())
                .orElseThrow(() -> new RuntimeException("Modul nicht gefunden"));

        Pruefung p = new Pruefung(
                req.bezeichnung(),
                req.datum(),
                req.raum(),
                req.pruefungstyp(),
                req.maxPunkte(),
                req.anmeldungStart(),
                req.anmeldungEnde(),
                modul);

        return pruefungRepository.save(p);
    }

    public List<Pruefungsanmeldung> getAnmeldungen(Student student) {
        return student.getPruefungsanmeldungen();
    }

    public List<PruefungsUebersichtDTO> getOffenePruefungen(
            List<Pruefungsanmeldung> anmeldungen) {

        return anmeldungen.stream()
                .filter(a -> a.getStatus() == Pruefungsanmeldung.Status.ANGEMELDET)
                .filter(a -> a.getNote() == null)
                .map(this::toDTO)
                .toList();
    }

    public List<PruefungsUebersichtDTO> getBestandenePruefungen(
            List<Pruefungsanmeldung> anmeldungen) {

        return anmeldungen.stream()
                .filter(a -> Boolean.TRUE.equals(a.getBestanden()))
                .map(this::toDTO)
                .toList();
    }

    public List<PruefungsUebersichtDTO> getNichtBestandenePruefungen(
            List<Pruefungsanmeldung> anmeldungen) {

        return anmeldungen.stream()
                .filter(a -> Boolean.FALSE.equals(a.getBestanden()))
                .map(this::toDTO)
                .toList();
    }

    public double berechneDurchschnitt(
            List<Pruefungsanmeldung> anmeldungen) {

        return anmeldungen.stream()
                .filter(a -> a.getNote() != null && a.getNote() <= 4)
                .mapToDouble(Pruefungsanmeldung::getNote)
                .average()
                .orElse(0.0);
    }

    public List<Pruefung> getAll() {
        return pruefungRepository.findAll();
    }

    public Pruefung getById(UUID id) {
        return pruefungRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prüfung nicht gefunden"));
    }

    public void delete(UUID id) {
        pruefungRepository.deleteById(id);
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

                                anmeldung.getStatus().name());
        }

}
