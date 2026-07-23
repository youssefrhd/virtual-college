package com.example.api.prufung;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.example.api.modul.Modul;
import com.example.api.prufungsanmeldung.Pruefungsanmeldung;


@Entity
@Table(name = "pruefung")
public class Pruefung {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "pruefung_id", nullable = false, updatable = false)
    private UUID pruefungId;

    @Column(name = "bezeichnung", nullable = false, length = 200)
    private String bezeichnung;

    @Column(name = "datum", nullable = false)
    private LocalDate datum;
    @Column(name = "anmeldung_start", nullable = false)
    private LocalDate anmeldungStart;

    @Column(name = "anmeldung_ende", nullable = false)
    private LocalDate anmeldungEnde;

    @Column(name = "raum", length = 50)
    private String raum;

    @Enumerated(EnumType.STRING)
    @Column(name = "pruefungstyp", nullable = false, length = 30)
    private Pruefungstyp pruefungstyp;

    @Column(name = "max_punkte")
    private Integer maxPunkte;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "modul_id", nullable = false)
    private Modul modul;

    @OneToMany(mappedBy = "pruefung", cascade = CascadeType.ALL)
    private List<Pruefungsanmeldung> anmeldungen = new ArrayList<>();

    public enum Pruefungstyp {
        KLAUSUR, MUENDLICH, HAUSARBEIT, PROJEKT
    }

    public Pruefung() {
    }

    public Pruefung(String bezeichnung,
            LocalDate datum,
            String raum,
            Pruefungstyp pruefungstyp,
            Integer maxPunkte,
            LocalDate anmeldungStart,
            LocalDate anmeldungEnde,
            Modul modul) {

        this.bezeichnung = bezeichnung;
        this.datum = datum;
        this.raum = raum;
        this.pruefungstyp = pruefungstyp;
        this.maxPunkte = maxPunkte;
        this.anmeldungStart = anmeldungStart;
        this.anmeldungEnde = anmeldungEnde;
        this.modul = modul;
    }

    public UUID getPruefungId() {
        return pruefungId;
    }

    public String getBezeichnung() {
        return bezeichnung;
    }

    public void setBezeichnung(String bezeichnung) {
        this.bezeichnung = bezeichnung;
    }

    public LocalDate getDatum() {
        return datum;
    }

    public void setDatum(LocalDate datum) {
        this.datum = datum;
    }

    public String getRaum() {
        return raum;
    }

    public void setRaum(String raum) {
        this.raum = raum;
    }

    public Pruefungstyp getPruefungstyp() {
        return pruefungstyp;
    }

    public void setPruefungstyp(Pruefungstyp t) {
        this.pruefungstyp = t;
    }

    public Integer getMaxPunkte() {
        return maxPunkte;
    }

    public void setMaxPunkte(Integer maxPunkte) {
        this.maxPunkte = maxPunkte;
    }

    public Modul getModul() {
        return modul;
    }

    public void setModul(Modul modul) {
        this.modul = modul;
    }

    public List<Pruefungsanmeldung> getAnmeldungen() {
        return anmeldungen;
    }

   

    public LocalDate getAnmeldungStart() {
        return anmeldungStart;
    }

    public void setAnmeldungStart(LocalDate anmeldungStart) {
        this.anmeldungStart = anmeldungStart;
    }

    public LocalDate getAnmeldungEnde() {
        return anmeldungEnde;
    }

    public void setAnmeldungEnde(LocalDate anmeldungEnde) {
        this.anmeldungEnde = anmeldungEnde;
    }

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
}
