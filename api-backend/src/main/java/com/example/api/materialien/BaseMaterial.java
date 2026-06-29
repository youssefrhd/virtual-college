package com.example.api.materialien;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

import com.example.api.modul.Modul;


@Entity
@Table(name = "base_material")
public abstract class BaseMaterial  {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "material_id", nullable = false, updatable = false)
    private UUID materialId;

    @Column(name = "titel", nullable = false, length = 255)
    private String titel;

    @Column(name = "dateityp", nullable = false, length = 20)
    private String dateityp;

    @Column(name = "datei_pfad", nullable = false, length = 500)
    private String dateiPfad;

    @Column(name = "hochgeladen_am", nullable = false)
    private LocalDate hochgeladenAm;

    @Column(name = "sichtbar")
    private Boolean sichtbar = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "modul_id", nullable = false)
    private Modul modul;

    public BaseMaterial() {
    }

    public BaseMaterial(String titel, String dateityp, String dateiPfad,
            Integer dateiGroesse, Modul modul) {
        this.titel = titel;
        this.dateityp = dateityp;
        this.dateiPfad = dateiPfad;
        this.hochgeladenAm = LocalDate.now();
        this.modul = modul;
    }

    
    

    @Override
    public String toString() {
        return "BaseMaterial [titel=" + titel + ", dateityp=" + dateityp + ", dateiPfad=" + dateiPfad
                + ", hochgeladenAm=" + hochgeladenAm + ", modul=" + modul.getBezeichnung() + "]";
    }

    public UUID getMaterialId() {
        return materialId;
    }

    public String getTitel() {
        return titel;
    }

    public void setTitel(String titel) {
        this.titel = titel;
    }

    public String getDateityp() {
        return dateityp;
    }

    public void setDateityp(String dateityp) {
        this.dateityp = dateityp;
    }

    public String getDateiPfad() {
        return dateiPfad;
    }

    public void setDateiPfad(String dateiPfad) {
        this.dateiPfad = dateiPfad;
    }

    public LocalDate getHochgeladenAm() {
        return hochgeladenAm;
    }

    public Modul getModul() {
        return modul;
    }

    public void setModul(Modul modul) {
        this.modul = modul;
    }

    public Boolean getSichtbar() {
        return sichtbar;
    }

    public void setSichtbar(Boolean sichtbar) {
        this.sichtbar = sichtbar;
    }
}
