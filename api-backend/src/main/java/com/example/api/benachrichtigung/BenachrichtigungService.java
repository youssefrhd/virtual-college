package com.example.api.benachrichtigung;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.api.benachrichtigung.Dto.BenachrichtigungCreateRequest;
import com.example.api.benachrichtigung.Dto.BenachrichtigungResponse;
import com.example.api.user.User;
import com.example.api.user.UserRepository;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class BenachrichtigungService {
    private final UserRepository userRepository;
    private final BenachrichtigungRepository benachrichtigungRepository;
    private final JavaMailSender  mailSender; 

    public BenachrichtigungService(UserRepository userRepository, BenachrichtigungRepository repo, JavaMailSender  mailSender) {
        this.userRepository = userRepository;
        this.benachrichtigungRepository = repo;
        this.mailSender=mailSender;
    }

    public void sendeAnmeldestartAnAlleStudenten() {

        List<User> studenten = alleStudenten();

        for (User student : studenten) {

            Benachrichtigung b = new Benachrichtigung();

            b.setTyp(Benachrichtigung.Typ.INFO);

            b.setNachricht(
                    "Die Prüfungsanmeldung wurde freigeschaltet.");

            b.setGesendetAm(LocalDateTime.now());

            b.setGelesen(false);

            b.setEmpfaenger(student);

            benachrichtigungRepository.save(b);
        }
    }

    @Transactional(readOnly = true)
    public List<BenachrichtigungResponse> getBenachrichtigungenFuerUser(UUID userId) {
        return benachrichtigungRepository
                .findByEmpfaenger_UserIdOrderByGesendetAmDesc(userId)
                .stream()
                .map(saved -> new BenachrichtigungResponse(saved.getBenachrichtigungId(),saved.getTyp(),saved.getNachricht(),saved.getGesendetAm(),saved.isGelesen()))
                .toList();
    }

    
    @Transactional(readOnly = true)
    public long countUngelesen(UUID userId) {
        return benachrichtigungRepository.countByEmpfaenger_UserIdAndGelesenFalse(userId);
    }

    
    public void markiereAlsGelesen(UUID benachrichtigungId, UUID userId) {
        Benachrichtigung b = benachrichtigungRepository.findById(benachrichtigungId)
                .orElseThrow(() -> new RuntimeException("Benachrichtigung nicht gefunden."));

        if (b.getEmpfaenger() == null || !b.getEmpfaenger().getUserId().equals(userId)) {
            throw new RuntimeException("Keine Berechtigung für diese Benachrichtigung.");
        }

        b.setGelesen(true);
        benachrichtigungRepository.save(b);
    }

    
    public void markiereAlleAlsGelesen(UUID userId) {
        List<Benachrichtigung> list = benachrichtigungRepository.findByEmpfaenger_UserIdOrderByGesendetAmDesc(userId);

        for (Benachrichtigung b : list) {
            if (!b.isGelesen()) {
                b.setGelesen(true);
            }
        }

        benachrichtigungRepository.saveAll(list);
    }

    
    public BenachrichtigungResponse create(BenachrichtigungCreateRequest request) {
        User empfaenger = userRepository.findById(request.empfaengerId())
                .orElseThrow(() -> new RuntimeException("Empfänger nicht gefunden."));

        Benachrichtigung b = new Benachrichtigung();
        b.setEmpfaenger(empfaenger);
        b.setTyp(request.typ());
        b.setNachricht(request.nachricht());
        b.setGesendetAm(LocalDateTime.now());
        b.setGelesen(false);

        Benachrichtigung saved = benachrichtigungRepository.save(b);
        return new BenachrichtigungResponse(saved.getBenachrichtigungId(),saved.getTyp(),saved.getNachricht(),saved.getGesendetAm(),saved.isGelesen());
    }


     public void sendeAnmeldeendeErinnerungAnAlleStudenten() {
 
        List<User> studenten = alleStudenten();
 
        for (User student : studenten) {
 
            Benachrichtigung b = new Benachrichtigung();
            b.setTyp(Benachrichtigung.Typ.WARNUNG);
            b.setNachricht(
                "Erinnerung: Die Prüfungsanmeldung endet in 2 Tagen. " +
                "Bitte melde dich rechtzeitig an."
            );
            b.setGesendetAm(LocalDateTime.now());
            b.setGelesen(false);
            b.setEmpfaenger(student);
            benachrichtigungRepository.save(b);
 
            try {
                sendeErinnerungsMail(student);
            } catch (MessagingException e) {
                System.err.println(
                    "E-Mail-Versand fehlgeschlagen für: " + student.getEmail()
                    + " – " + e.getMessage()
                );
            }
        }
    }
 
    private List<User> alleStudenten() {
        return userRepository.findAll()
            .stream()
            .filter(u -> u.getRole() == User.Role.STUDENT)
            .toList();
    }
 
    private void sendeErinnerungsMail(User student) throws MessagingException {
 
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
 
        helper.setTo(student.getEmail());
        helper.setSubject("Virtual College – Prüfungsanmeldung endet in 2 Tagen");
 
        String html = """
            <html>
            <body style="font-family:Arial,sans-serif; background:#f5f7fa; padding:20px;">
              <div style="max-width:500px; margin:auto; background:white;
                          padding:25px; border-radius:10px; border:1px solid #e5e7eb;">
 
                <h2 style="margin-top:0; color:#b45309;">
                  ⏰ Prüfungsanmeldung endet bald
                </h2>
 
                <p>Hallo <strong>%s</strong>,</p>
 
                <p>
                  die Frist zur Prüfungsanmeldung endet in <strong>2 Tagen</strong>.
                  Bitte stelle sicher, dass du dich für alle gewünschten Prüfungen
                  angemeldet hast.
                </p>
 
                <div style="
                  background:#fffbeb;
                  border:1px solid #fcd34d;
                  border-radius:8px;
                  padding:14px 18px;
                  margin:20px 0;">
                  <strong style="color:#92400e;">Anmeldeschluss:</strong>
                  <span style="color:#78350f;"> in 2 Tagen um 23:59 Uhr</span>
                </div>
 
                <div style="text-align:center; margin:24px 0;">
                  <a href="http://localhost:3000"
                     style="background:#d97706; color:#fff; text-decoration:none;
                            padding:12px 22px; border-radius:6px;
                            display:inline-block; font-weight:bold;">
                    Jetzt zur Prüfungsanmeldung
                  </a>
                </div>
 
                <p style="font-size:13px; color:#666;">
                  Falls du dich bereits angemeldet hast, kannst du diese
                  E-Mail ignorieren.
                </p>
 
                <hr style="border:none; border-top:1px solid #eee;">
                <p style="font-size:12px; color:#999;">Virtual College Team</p>
              </div>
            </body>
            </html>
            """.formatted(student.getVorname());
 
        helper.setText(html, true);
        mailSender.send(message);
    }
}
