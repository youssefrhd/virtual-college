package com.example.api.modul;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.api.prufungsanmeldung.Pruefungsanmeldung;

@Service
public class ModulService {

    public int berechneECTS(List<Pruefungsanmeldung> anmeldungen) {

        return anmeldungen.stream()
                .filter(a -> Boolean.TRUE.equals(a.getBestanden()))
                .map(a -> a.getPruefung().getModul())
                .distinct()
                .mapToInt(Modul::getEcts)
                .sum();
    }
}
