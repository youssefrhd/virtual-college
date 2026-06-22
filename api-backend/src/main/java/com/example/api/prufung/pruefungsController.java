package com.example.api.prufung;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/pruefungen")
@SecurityRequirement(name = "bearerAuth")
public class pruefungsController {
     private final pruefungService service;

    public pruefungsController(pruefungService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("hasRole('PROFESSOR')")
    @Operation(summary = "Prüfung erstellen (nur Professor)")
    public ResponseEntity<Pruefung> create(@RequestBody PruefungRequest req) {
        return ResponseEntity.ok(service.create(req));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('PROFESSOR','STUDENT')")
    @Operation(summary = "Alle Prüfungen abrufen")
    public List<Pruefung> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('PROFESSOR','STUDENT')")
    public Pruefung getById(@PathVariable UUID id) {
        return service.getById(id);
    }

    /* 
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PROFESSOR')")
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }*/
    public record PruefungRequest(
        String bezeichnung,
        LocalDate datum,
        LocalDate anmeldungStart,
        LocalDate anmeldungEnde,
        Integer versuchNr,
        String raum,
        Pruefung.Pruefungstyp pruefungstyp,
        Integer maxPunkte,
        UUID modulId
) {}
}

