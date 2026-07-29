package com.example.api.student;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.example.api.prufungsanmeldung.Pruefungsanmeldung;
import com.example.api.user.User;


@Entity
@Table(name = "student")
@DiscriminatorValue("STUDENT")
@PrimaryKeyJoinColumn(name = "user_id")
public class Student extends User {

    @Column(name = "matrikel_nr", nullable = false, length = 20)
    private String matrikelNr;

    @Column(name = "studiengang", nullable = false, length = 150)
    private String studiengang;

    @Column(name = "semester", nullable = false)
    private Integer semester;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<Pruefungsanmeldung> pruefungsanmeldungen = new ArrayList<>();

    public Student() {
    }
    
    public Student(String vorname, String nachname,String email,
            String password,LocalDate gebDatum ,String telefon,String matrikelNr,String studiengang, Integer semester) {
        super(vorname, nachname,email, password,gebDatum,telefon, Role.STUDENT); 
        this.matrikelNr = matrikelNr;
        this.studiengang = studiengang;
        this.semester = semester;
    }

    public String getMatrikelNr() {
        return matrikelNr;
    }


    public String getStudiengang() {
        return studiengang;
    }

    public void setStudiengang(String s) {
        this.studiengang = s;
    }

    public Integer getSemester() {
        return semester;
    }

    public void setSemester(Integer semester) {
        this.semester = semester;
    }

    private String generateMatrikelNr() {
        return String.valueOf(
                8_000_000 + (int) (Math.random() * 2_000_000));
    } 

    public List<Pruefungsanmeldung> getPruefungsanmeldungen() {
        return pruefungsanmeldungen;
    }
}
