package com.example.api.benachrichtigung;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.api.benachrichtigung.Dto.BenachrichtigungCreateRequest;
import com.example.api.benachrichtigung.Dto.BenachrichtigungResponse;
import com.example.api.user.User;
import com.example.api.user.UserRepository;

@Service
public class BenachrichtigungService {
    private final UserRepository userRepository;
    private final BenachrichtigungRepository benachrichtigungRepository;

    public BenachrichtigungService(UserRepository userRepository, BenachrichtigungRepository repo) {
        this.userRepository = userRepository;
        this.benachrichtigungRepository = repo;
    }

    public void sendeAnmeldestartAnAlleStudenten() {

        List<User> studenten = userRepository.findAll()
                .stream()
                .filter(u -> u.getRole() == User.Role.STUDENT)
                .toList();

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
}
