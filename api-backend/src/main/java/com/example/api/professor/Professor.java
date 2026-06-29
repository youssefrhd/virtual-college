package com.example.api.professor;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.example.api.modul.Modul;
import com.example.api.user.User;


@Entity
@Table(name = "professor")
@DiscriminatorValue("PROFESSOR")
@PrimaryKeyJoinColumn(name = "user_id")

public class Professor extends User {
    @Column(name = "persoNr", length = 7)
    private String persoNr;

     @Column(name = "titel", length = 50)
    private String titel;

    @Column(name = "fachbereich", nullable = false, length = 150)
    private String fachbereich;

    @OneToMany(mappedBy = "professor", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<Modul> module = new ArrayList<>();

    public Professor() {}

    public Professor(String vorname, String nachname, String email,
                     String password,LocalDate gebDatum, String persoNr,String titel, String fachbereich) {
        super(vorname, nachname, email, password,gebDatum, Role.PROFESSOR);
        this.persoNr=persoNr; 
        this.titel       = titel;
        this.fachbereich = fachbereich;
    }

    public String      getTitel()                     { return titel; }
    public void        setTitel(String titel)         { this.titel = titel; }
    public String      getFachbereich()               { return fachbereich; }
    public void        setFachbereich(String fb)      { this.fachbereich = fb; }
    public List<Modul> getModule()                    { return module; }

    public String getPersoNr() {
        return persoNr;
    }
    
    
}
