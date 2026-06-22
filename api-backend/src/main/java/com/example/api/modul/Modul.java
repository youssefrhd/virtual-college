package com.example.api.modul;


import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.example.api.materialien.BaseMaterial;
import com.example.api.professor.Professor;
import com.example.api.prufung.Pruefung;

@Entity
@Table(name = "modul")
public class Modul {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "modul_id", nullable = false, updatable = false)
    private UUID modulId;

    @Column(name = "bezeichnung", nullable = false, length = 200)
    private String bezeichnung;

    @Column(name = "ects", nullable = false)
    private Integer ects;

    @Column(name = "semester", nullable = false)
    private Integer semester;

    @Column(name = "ist_pflicht", nullable = false)
    private Boolean istPflicht = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "professor_id", nullable = false)
    private Professor professor;

    @OneToMany(mappedBy = "modul", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Pruefung> pruefungen = new ArrayList<>();

    @OneToMany(mappedBy = "modul", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BaseMaterial> materialien = new ArrayList<>();

    public Modul() {}

    public Modul(String bezeichnung, Integer ects, Integer semester,
                 Boolean istPflicht, Professor professor) {
        this.bezeichnung = bezeichnung;
        this.ects        = ects;
        this.semester    = semester;
        this.istPflicht  = istPflicht;
        this.professor   = professor;
    }

    public UUID             getModulId()                         { return modulId; }
    public String           getBezeichnung()                     { return bezeichnung; }
    public void             setBezeichnung(String bezeichnung)   { this.bezeichnung = bezeichnung; }
    public Integer          getEcts()                            { return ects; }
    public void             setEcts(Integer ects)                { this.ects = ects; }
    public Integer          getSemester()                        { return semester; }
    public void             setSemester(Integer semester)        { this.semester = semester; }
    public Boolean          getIstPflicht()                      { return istPflicht; }
    public void             setIstPflicht(Boolean istPflicht)    { this.istPflicht = istPflicht; }
    public Professor        getProfessor()                       { return professor; }
    public void             setProfessor(Professor professor)    { this.professor = professor; }
    public List<Pruefung>   getPruefungen()                      { return pruefungen; }
    public List<BaseMaterial> getMaterialien()                   { return materialien; }
}
