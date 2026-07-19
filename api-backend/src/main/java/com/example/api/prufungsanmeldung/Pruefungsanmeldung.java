package com.example.api.prufungsanmeldung;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.example.api.benachrichtigung.Benachrichtigung;
import com.example.api.prufung.Pruefung;
import com.example.api.student.Student;

@Entity
@Table(name = "pruefungsanmeldung", uniqueConstraints = @UniqueConstraint(columnNames = { "student_id",
        "pruefung_id" }))
public class Pruefungsanmeldung {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "anmeldung_id", nullable = false, updatable = false)
    private UUID anmeldungId;

    @Column(name = "anmelde_datum", nullable = false)
    private LocalDate anmeldeDatum;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private Status status = Status.ANGEMELDET;

    @Column(name = "note")
    private Float note;

    @Column(name = "gewichtung")
    private Float gewichtung = 1.0f;

    @Column(name = "bestanden")
    private Boolean bestanden;

    @Column(name = "note_eingetragen_am")
    private LocalDate eingetragenAm;

    @Column(name = "versuch_nr", nullable = false)
    private Integer versuchNr = 1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pruefung_id", nullable = false)
    private Pruefung pruefung;

    public enum Status {
        ANGEMELDET, ABGEMELDET
    }

    public Pruefungsanmeldung() {
    }

    public Pruefungsanmeldung(Student student, Pruefung pruefung) {
        this.student = student;
        this.pruefung = pruefung;
        this.anmeldeDatum = LocalDate.now();
    }

    public UUID getAnmeldungId() {
        return anmeldungId;
    }

    public void setStatusInternal(Status status) {
        this.status = status;
    }

    public LocalDate getAnmeldeDatum() {
        return anmeldeDatum;
    }

    public void setAnmeldeDatum(LocalDate d) {
        this.anmeldeDatum = d;
    }

    public Status getStatus() {
        return status;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Pruefung getPruefung() {
        return pruefung;
    }

    public void setPruefung(Pruefung pruefung) {
        this.pruefung = pruefung;
    }

    public void setNote(Float note) {
        this.note = note;
        this.bestanden = note != null && note <= 4.0f;
        this.eingetragenAm = LocalDate.now();
    }

    public Float getNote() {
        return note;
    }

    public Float getGewichtung() {
        return gewichtung;
    }

    public void setGewichtung(Float gewichtung) {
        this.gewichtung = gewichtung;
    }

    public Boolean getBestanden() {
        return bestanden;
    }

    public LocalDate getEingetragenAm() {
        return eingetragenAm;
    }

    public Integer getVersuchNr() {
        return versuchNr;
    }

    public void setVersuchNr(Integer versuchNr) {
        this.versuchNr = versuchNr;
    }

    public record PruefungMitAnmeldungResponse(
            UUID pruefungId,
            String bezeichnung,
            LocalDate datum,
            LocalDate anmeldungStart,
            LocalDate anmeldungEnde,
            String raum,
            String pruefungstyp,
            String modulBezeichnung,
            UUID anmeldungId,
            String anmeldungStatus,
            boolean anmeldungMoeglich) {
    }

    public record AnmeldungResponse(
            UUID anmeldungId,
            UUID pruefungId,
            String pruefungsBezeichnung,
            LocalDate anmeldeDatum,
            String status) {
    }

}
