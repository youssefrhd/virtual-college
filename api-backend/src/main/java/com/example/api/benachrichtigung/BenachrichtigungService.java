package com.example.api.benachrichtigung;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.api.user.User;
import com.example.api.user.UserRepository;

@Service
public class BenachrichtigungService {
    private final UserRepository userRepository;
    private final BenachrichtigungRepository repo;
    

    public BenachrichtigungService(UserRepository userRepository, BenachrichtigungRepository repo) {
        this.userRepository = userRepository;
        this.repo = repo;
    }

    public void sendeAnmeldestartAnAlleStudenten() {

        List<User> studenten =
            userRepository.findAll()
                .stream()
                .filter(u -> u.getRole() == User.Role.STUDENT)
                .toList();

        for(User student : studenten) {

            Benachrichtigung b =
                new Benachrichtigung();

            b.setTyp(Benachrichtigung.Typ.INFO);

            b.setNachricht(
                "Die Prüfungsanmeldung wurde freigeschaltet."
            );

            b.setGesendetAm(LocalDateTime.now());

            b.setGelesen(false);

            b.setEmpfaenger(student);

            repo.save(b);
        }
    }
}
