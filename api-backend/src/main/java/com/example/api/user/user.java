package com.example.api.user;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.api.benachrichtigung.Benachrichtigung;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "app_user")
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "user_typ", discriminatorType = DiscriminatorType.STRING)
public abstract class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "user_id", nullable = false, updatable = false)
    private UUID userId;

    @Column(name = "vorname", nullable = false, length = 100)
    private String vorname;

    @Column(name = "nachname", nullable = false, length = 100)
    private String nachname;

    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Column(name = "geburtsdatum")
    private LocalDate geburtsdatum;
     @Column(name = "telefon", length = 15)
    private String telefon;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    private Role role;

    @Column(name = "ist_aktiviert", nullable = false)
    private boolean istAktiviert = false;

    @Column(name = "aktivierungs_token", unique = true)
    private String aktivierungsToken;

    @Column(name = "enabled", nullable = false)
    private boolean enabled = true;

    @Column(name = "account_non_expired", nullable = false)
    private boolean accountNonExpired = true;

    @Column(name = "account_non_locked", nullable = false)
    private boolean accountNonLocked = true;

    @Column(name = "credentials_non_expired", nullable = false)
    private boolean credentialsNonExpired = true;

    @OneToMany(mappedBy = "empfaenger", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Benachrichtigung> benachrichtigungen = new ArrayList<>();

    @Column(name = "reset_token")
    private String passwortResetToken;

    @Column(name = "reset_token_expiry")
    private LocalDateTime passwortResetTokenAblauf;

    public enum Role {
        STUDENT,
        PROFESSOR
    }

    protected User() {
    }

    protected User(String vorname, String nachname, String email,
            String password, LocalDate geburtsdatum,String telefon, Role role) {
        this.vorname = vorname;
        this.nachname = nachname;
        this.email = email;
        this.password = password;
        this.role = role;
        this.geburtsdatum = geburtsdatum;
        this.telefon=telefon;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }



    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    @Override
    public boolean isAccountNonExpired() {
        return accountNonExpired;
    }

    @Override
    public boolean isAccountNonLocked() {
        return accountNonLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return credentialsNonExpired;
    }

    

    public String getPasswortResetToken() {
        return passwortResetToken;
    }

    public LocalDateTime getPasswortResetTokenAblauf() {
        return passwortResetTokenAblauf;
    }

    public void aktiviere() {
        this.istAktiviert = true;
        this.enabled = true;
        this.aktivierungsToken = null;
    }

    public void generiereAktivierungsToken() {
        SecureRandom RANDOM = new SecureRandom();
        int code = 100000 + RANDOM.nextInt(900000);
        this.aktivierungsToken = String.valueOf(code);
    }

    public void generierePasswortResetToken() {
         SecureRandom RANDOM = new SecureRandom();
        int code = 100000 + RANDOM.nextInt(900000);
        this.passwortResetToken = String.valueOf(code);
        this.passwortResetTokenAblauf = LocalDateTime.now().plusMinutes(30);
    }

    public boolean isResetTokenGueltig() {
        return passwortResetToken != null
                && passwortResetTokenAblauf != null
                && passwortResetTokenAblauf.isAfter(LocalDateTime.now());
    }

    public void setzePasswortZurueck(String neuesPasswort) {
        this.password = neuesPasswort;

        this.passwortResetToken = null;
        this.passwortResetTokenAblauf = null;
    }

    public UUID getUserId() {
        return userId;
    }

    public String getVorname() {
        return vorname;
    }

    public void setVorname(String vorname) {
        this.vorname = vorname;
    }

    public String getNachname() {
        return nachname;
    }

    public void setNachname(String nachname) {
        this.nachname = nachname;
    }

    public String getEmail() {
        return email;
    }

    public String getTelefon() {
        return telefon;
    }

    public void setTelefon(String telefon) {
        this.telefon = telefon;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public LocalDate getGeburtsdatum() {
        return geburtsdatum;
    }

    public void setGeburtsdatum(LocalDate d) {
        this.geburtsdatum = d;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public void setAccountNonLocked(boolean v) {
        this.accountNonLocked = v;
    }

    public boolean isIstAktiviert() {
        return istAktiviert;
    }

    public String getAktivierungsToken() {
        return aktivierungsToken;
    }

    public List<Benachrichtigung> getBenachrichtigungen() {
        return benachrichtigungen;
    }
}
