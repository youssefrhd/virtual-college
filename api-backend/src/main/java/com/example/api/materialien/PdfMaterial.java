package com.example.api.materialien;

import com.example.api.kurs.Kurs;
import com.example.api.modul.Modul;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "pdf_material")
public class PdfMaterial extends BaseMaterial {
    @Column(name = "seiten_anzahl", nullable = false)
    private int seitenAnzahl;

    protected PdfMaterial() {
    }

    public PdfMaterial(String titel, String pfad, Kurs kurs, int seitenAnzahl) {
        super(titel, pfad, kurs);
        this.seitenAnzahl = seitenAnzahl;
    }

    public int getSeitenAnzahl() {
        return seitenAnzahl;
    }

    public void setSeitenAnzahl(int seitenAnzahl) {
        this.seitenAnzahl = seitenAnzahl;
    }

    @Override
    public String getInfo() {
        return "PDF: " + getTitel() + " (" + seitenAnzahl + " Seiten)";
    }

     @Override
    public String getTyp() {
        return "PDF";
    }
}
