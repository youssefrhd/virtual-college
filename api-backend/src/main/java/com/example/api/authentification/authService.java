package com.example.api.authentification;

import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import com.example.api.professor.Professor;
import com.example.api.student.Student;
import com.example.api.user.User;
import com.example.api.user.UserRepository;

import jakarta.mail.internet.MimeMessage;

@Service
public class authService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    public authService(UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JavaMailSender mailSender) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailSender = mailSender;
    }

    public void registriereStudent(StudentRegisterRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "E-Mail bereits registriert");
        }
        Student student = new Student(
                req.vorname(), req.nachname(), req.email(),
                passwordEncoder.encode(req.passwort()), req.geburtsdatum(),
                req.studiengang(),
                req.semester() != null ? req.semester() : 1);
        student.generiereAktivierungsToken();

        userRepository.save(student);
        try {
            sendeAktivierungsMail(student);
        } catch (MessagingException e) {
            throw new RuntimeException(
                    "Fehler beim Versand der Aktivierungs-E-Mail", e);
        }
    }

    public void registriereProfessor(ProfessorRegisterRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "E-Mail bereits registriert");
        }
        Professor professor = new Professor(
                req.vorname(), req.nachname(), req.email(),
                passwordEncoder.encode(req.passwort()), req.geburtsdatum(),
                req.titel(), req.fachbereich());
        professor.generiereAktivierungsToken();

        userRepository.save(professor);
        try {
            sendeAktivierungsMail(professor);
        } catch (MessagingException e) {
            throw new RuntimeException(
                    "Fehler beim Versand der Aktivierungs-E-Mail", e);
        }
    }

    public void aktiviere(String email, String code) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User nicht gefunden"));

        if (user.isIstAktiviert()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Account bereits aktiviert");
        }

        if (!code.equals(user.getAktivierungsToken())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Ungültiger Aktivierungscode");
        }

        user.aktiviere();
        userRepository.save(user);
    }

    private void sendeAktivierungsMail(User user) throws MessagingException {

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(user.getEmail());
        helper.setSubject("Virtual College – Aktivierungscode");

        String html = String.format("""
                <!DOCTYPE html>
                <html>
                <body style="margin:0;padding:0;background-color:#f4f6f9;font-family:Arial,sans-serif;">

                    <table width="100%%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td align="center" style="padding:40px 20px;">

                                <table width="600" cellpadding="0" cellspacing="0"
                                       style="background:#ffffff;border-radius:12px;
                                              box-shadow:0 2px 10px rgba(0,0,0,0.1);">

                                    <tr>
                                        <td align="center"
                                            style="background:#2563eb;color:white;
                                                   padding:25px;border-radius:12px 12px 0 0;">

                                            <h1 style="margin:0;">Virtual College</h1>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="padding:40px;text-align:center;">

                                            <h2 style="color:#333;">
                                                Willkommen, %s!
                                            </h2>

                                            <p style="color:#666;font-size:16px;">
                                                Vielen Dank für Ihre Registrierung.
                                            </p>

                                            <p style="color:#666;font-size:16px;">
                                                Ihr Aktivierungscode lautet:
                                            </p>

                                            <div style="
                                                display:inline-block;
                                                background:#eff6ff;
                                                border:2px dashed #2563eb;
                                                border-radius:10px;
                                                padding:15px 30px;
                                                margin:20px 0;
                                                font-size:32px;
                                                font-weight:bold;
                                                letter-spacing:8px;
                                                color:#2563eb;">

                                                %s
                                            </div>

                                            <p style="color:#666;font-size:14px;">
                                                Bitte geben Sie diesen Code in der Anwendung ein,
                                                um Ihr Konto zu aktivieren.
                                            </p>

                                        </td>
                                    </tr>

                                    <tr>
                                        <td align="center"
                                            style="padding:20px;
                                                   background:#f8fafc;
                                                   color:#888;
                                                   font-size:12px;
                                                   border-radius:0 0 12px 12px;">

                                            © 2026 Virtual College
                                        </td>
                                    </tr>

                                </table>

                            </td>
                        </tr>
                    </table>

                </body>
                </html>
                """,
                user.getVorname(),
                user.getAktivierungsToken());

        helper.setText(html, true);

        mailSender.send(message);

    }

    public void passwortVergessen(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            user.generierePasswortResetToken();
            userRepository.save(user);
            try {
                sendePasswortResetMail(user);
            } catch (MessagingException e) {
                throw new RuntimeException(
                        "Fehler beim Versand der Aktivierungs-E-Mail", e);
            }
        });
    }

    public void passwortZuruecksetzen(PasswortResetRequest req) {

        User user = userRepository.findByPasswortResetToken(req.token())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Ungültiger Token"));

        if (!user.isResetTokenGueltig()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Token abgelaufen. Bitte erneut anfordern.");
        }

        String neuesHashedPasswort = passwordEncoder.encode(req.neuesPasswort());
        user.setzePasswortZurueck(neuesHashedPasswort);
        userRepository.save(user);
    }

    private void sendePasswortResetMail(User user)
            throws MessagingException {

        String link = "http://localhost:3000/reset-password?token="
                + user.getPasswortResetToken();

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(user.getEmail());
        helper.setSubject("Virtual College – Passwort zurücksetzen");

        String html = """
                <html>
                <body style="
                    font-family:Arial,sans-serif;
                    background:#f5f7fa;
                    padding:20px;">

                    <div style="
                        max-width:500px;
                        margin:auto;
                        background:white;
                        padding:25px;
                        border-radius:10px;
                        border:1px solid #e5e7eb;">

                        <h2 style="
                            margin-top:0;
                            color:#1e3a8a;">
                            Passwort zurücksetzen
                        </h2>

                        <p>Hallo <strong>%s</strong>,</p>

                        <p>
                            Sie haben eine Passwort-Zurücksetzung angefordert.
                        </p>

                        <div style="text-align:center; margin:25px 0;">
                            <a href="%s"
                               style="
                                 background:#2563eb;
                                 color:#ffffff;
                                 text-decoration:none;
                                 padding:12px 22px;
                                 border-radius:6px;
                                 display:inline-block;
                                 font-weight:bold;">
                                Passwort zurücksetzen
                            </a>
                        </div>

                        <p style="font-size:14px;color:#666;">
                            Der Link ist 30 Minuten gültig.
                        </p>

                        <p style="font-size:14px;color:#666;">
                            Falls Sie diese Anfrage nicht gestellt haben,
                            können Sie diese E-Mail ignorieren.
                        </p>

                        <hr style="border:none;border-top:1px solid #eee;">

                        <p style="font-size:12px;color:#999;">
                            Virtual College Team
                        </p>

                    </div>

                </body>
                </html>
                """.formatted(user.getVorname(), link);

        helper.setText(html, true);

        mailSender.send(message);
    }
}
