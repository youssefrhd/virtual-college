package com.example.api.kurs;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.api.kurs.KursDto.KursRequest;
import com.example.api.kurs.KursDto.KursResponse;
import com.example.api.modul.Modul;
import com.example.api.modul.ModulRepository;

@Service
public class KursService {

    private final KursRepository kursRepository;
    private final ModulRepository modulRepository;

    public KursService(KursRepository kursRepository, ModulRepository modulRepository) {
        this.kursRepository = kursRepository;
        this.modulRepository = modulRepository;
    }

    public KursResponse kursAnlegen(KursRequest request) {
    Modul modul = modulRepository.findById(request.modulId())
            .orElseThrow(() -> new IllegalArgumentException("Modul nicht gefunden."));

    Kurs kurs = new Kurs(
            request.titel(),
            request.beschreibung()
    );

    modul.setKurs(kurs);
    modulRepository.save(modul);


    return new KursResponse(
            kurs.getKursId(),
            kurs.getTitel(),
            kurs.getBeschreibung()
    );
}

     public List<KursResponse> findAll() {
        return kursRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public KursResponse findById(UUID kursId) {
        Kurs kurs = kursRepository.findById(kursId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Kurs nicht gefunden: " + kursId));

        return toResponse(kurs);
    }

    public void delete(UUID kursId) {
        Kurs kurs = kursRepository.findById(kursId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Kurs nicht gefunden: " + kursId));

        kursRepository.delete(kurs);
    }

    private KursResponse toResponse(Kurs kurs) {
    return new KursResponse(
            kurs.getKursId(),
            kurs.getTitel(),
            kurs.getBeschreibung()
    );
}

     

    
}