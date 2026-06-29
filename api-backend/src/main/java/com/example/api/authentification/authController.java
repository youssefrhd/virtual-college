package com.example.api.authentification;

import java.time.LocalDate;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.api.config.JwtService;
import com.example.api.professor.Professor;
import com.example.api.student.Student;
import com.example.api.user.User;
import com.example.api.user.UserRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import com.example.api.authentification.authService;

@RestController
@RequestMapping("/api/auth")
public class authController {

    private final authService authService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public authController(authService authService,
            AuthenticationManager authenticationManager,
            JwtService jwtService) {
        this.authService = authService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    
    @PostMapping("/register/student")
    @Operation(summary = "Student registrieren", description = "Legt einen neuen Studenten an und versendet einen Aktivierungscode per E-Mail.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Student erfolgreich registriert"),
            @ApiResponse(responseCode = "409", description = "E-Mail bereits registriert")
    })
    public ResponseEntity<?> registerStudent(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(required = true, content = @Content(examples = @ExampleObject(value = """
                    {
                      "vorname": "Max",
                      "nachname": "Mustermann",
                      "email": "max.mustermann@vc.de",
                      "passwort": "Passwort123!",
                      "geburtsdatum": "1998-05-21",
                      "studiengang": "Informatik",
                      "semester": 3
                    }
                    """))) @RequestBody StudentRegisterRequest req) {
        authService.registriereStudent(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "nachricht", "Registrierung erfolgreich. Bitte E-Mail bestätigen.",
                "email", req.email()));
    }

    @PostMapping("/register/professor")
       @Operation(summary = "Professor registrieren", description = "Legt einen neuen Professor an und versendet einen Aktivierungscode per E-Mail.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Professor erfolgreich registriert"),
            @ApiResponse(responseCode = "409", description = "E-Mail bereits registriert")
    })
    public ResponseEntity<?> registerProfessor(@io.swagger.v3.oas.annotations.parameters.RequestBody(required = true, content = @Content(examples = @ExampleObject(value = """
                    {
                      "vorname": "Max",
                      "nachname": "Mustermann",
                      "email": "max.mustermann@vc.de",
                      "passwort": "Passwort123!",
                      "geburtsdatum": "1998-05-21",
                      "titel": "prof Dr.",
                      "fachbereich": "Mathematik"
                    }
                    """))) @RequestBody ProfessorRegisterRequest req) {
        authService.registriereProfessor(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "nachricht", "Registrierung erfolgreich. Bitte E-Mail bestätigen.",
                "email", req.email()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.email(), req.passwort()));

            User user = (User) auth.getPrincipal();
            String jwt = jwtService.generateToken(user);

            return ResponseEntity.ok(Map.of(
                    "token", jwt,
                    "role", user.getRole().name(),
                    "email", user.getEmail()));

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("fehler", "E-Mail oder Passwort falsch"));
        }
    }

    @PostMapping("/activate")
    public ResponseEntity<?> activate(@RequestBody AktivierungsRequest req) {

        authService.aktiviere(req.email(), req.code());

        return ResponseEntity.ok(Map.of(
                "nachricht", "Account erfolgreich aktiviert"));
    }

     @PostMapping("/passwort-vergessen")
    public ResponseEntity<?> passwortVergessen(@RequestBody PasswortVergessenRequest req) {
        authService.passwortVergessen(req.email()); 
        return ResponseEntity.ok(Map.of(
            "nachricht",
            "Falls diese E-Mail registriert ist, erhalten Sie einen Reset-Link."
        ));
    }
 
    
    @PostMapping("/passwort-zuruecksetzen")
    public ResponseEntity<?> passwortZuruecksetzen(@RequestBody PasswortResetRequest req) {
        authService.passwortZuruecksetzen(req);
        return ResponseEntity.ok(Map.of(
            "nachricht", "Passwort erfolgreich zurückgesetzt. Sie können sich jetzt anmelden."
        ));
    }



    record AktivierungsRequest(
            String email,
            String code) {
    }
}

record StudentRegisterRequest(
        String vorname,
        String nachname,
        String matrikelNr,
        LocalDate geburtsdatum,
        String email,
        String passwort,
        String studiengang,
        Integer semester) {
}

record ProfessorRegisterRequest(
        String vorname,
        String nachname,
        String persoNr,
        String email,
        String passwort,
        LocalDate geburtsdatum,
        String titel,
        String fachbereich) {
}

record LoginRequest(String email, String passwort) {
}

record PasswortVergessenRequest(String email) {}
 
record PasswortResetRequest(
    String token,        
    String neuesPasswort
) {}
