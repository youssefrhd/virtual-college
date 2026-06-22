package com.example.api.benachrichtigung;


import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

import com.example.api.user.User;


@Entity
@Table(name = "benachrichtigung")
public class Benachrichtigung  {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "benachrichtigung_id", nullable = false, updatable = false)
    private UUID benachrichtigungId;

    @Enumerated(EnumType.STRING)
    @Column(name = "typ", nullable = false, length = 30)
    private Typ typ;

    @Column(name = "nachricht", nullable = false, length = 500)
    private String nachricht;

    @Column(name = "gesendet_am")
    private LocalDateTime gesendetAm;

    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User empfaenger;


    public enum Typ { ECHTZEIT, ERINNERUNG, INFO, WARNUNG }

    public Benachrichtigung() {}

    
    public UUID getId() { return benachrichtigungId; }


    public UUID          getBenachrichtigungId()               { return benachrichtigungId; }
    public Typ           getTyp()                              { return typ; }
    public void          setTyp(Typ typ)                       { this.typ = typ; }
    public String        getNachricht()                        { return nachricht; }
    public void          setNachricht(String nachricht)        { this.nachricht = nachricht; }
    public LocalDateTime getGesendetAm()                       { return gesendetAm; }
    public void          setGesendetAm(LocalDateTime t)        { this.gesendetAm = t; }
    public User          getEmpfaenger()                       { return empfaenger; }
    public void          setEmpfaenger(User empfaenger)      { this.empfaenger = empfaenger; }
    
}
