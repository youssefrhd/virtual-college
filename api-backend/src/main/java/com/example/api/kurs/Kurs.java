package com.example.api.kurs;


import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.example.api.materialien.BaseMaterial;
import com.example.api.modul.Modul;

import jakarta.persistence.*;

@Entity
@Table(name = "kurs")
public class Kurs {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "kurs_id", nullable = false, updatable = false)
    private UUID kursId;

    @Column(name = "titel", nullable = false, length = 200)
    private String titel;

    @Column(name = "beschreibung", length = 1000)
    private String beschreibung;

    

    @OneToMany(mappedBy = "kurs", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BaseMaterial> materialien = new ArrayList<>();

    protected Kurs() {
    }

    public Kurs(String titel, String beschreibung) {
        this.titel = titel;
        this.beschreibung = beschreibung;
    }

    public UUID getKursId() {
        return kursId;
    }

    public String getTitel() {
        return titel;
    }

    public void setTitel(String titel) {
        this.titel = titel;
    }

    public String getBeschreibung() {
        return beschreibung;
    }

    public void setBeschreibung(String beschreibung) {
        this.beschreibung = beschreibung;
    }


    public List<BaseMaterial> getMaterialien() {
        return materialien;
    }
}