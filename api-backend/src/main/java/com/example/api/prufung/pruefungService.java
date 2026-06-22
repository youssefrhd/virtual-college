package com.example.api.prufung;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.api.modul.Modul;
import com.example.api.modul.ModulRepository;
import com.example.api.prufung.pruefungsController.PruefungRequest;

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
                modul
        );

        return pruefungRepository.save(p);
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
    
}
