package com.example.api.materialien;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import com.example.api.modul.Modul;

@Entity
@Table(name = "base_material")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class BaseMaterial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "material_id", nullable = false, updatable = false)
    private Long materialId;

    @Column(name = "titel", nullable = false)
    private String titel;

    @Column(name = "pfad", nullable = false)
    private String pfad;

    @Column(name = "hochgeladen_am", nullable = false)
    private LocalDateTime hochgeladenAm;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "modul_id", nullable = false)
    private Modul modul;

    protected BaseMaterial() {
    }

    protected BaseMaterial(String titel, String pfad, Modul modul) {
        this.titel = titel;
        this.pfad = pfad;
        this.modul = modul;
        this.hochgeladenAm = LocalDateTime.now();
    }

    public Long getMaterialId() {
        return materialId;
    }

    public String getTitel() {
        return titel;
    }

    public String getPfad() {
        return pfad;
    }

    public LocalDateTime getHochgeladenAm() {
        return hochgeladenAm;
    }

    public Modul getModul() {
        return modul;
    }

    public void setTitel(String titel) {
        this.titel = titel;
    }

    public void setPfad(String pfad) {
        this.pfad = pfad;
    }

    public void setHochgeladenAm(LocalDateTime hochgeladenAm) {
        this.hochgeladenAm = hochgeladenAm;
    }

    public void setModul(Modul modul) {
        this.modul = modul;
    }

    public abstract String getInfo();

}
