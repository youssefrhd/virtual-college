package com.example.api.professor;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.api.professor.ProfController.ProfessorProfilResponse;
import com.example.api.professor.ProfController.ProfessorProfilUpdateRequest;
import com.example.api.professor.ProfController.StudentKurzProfilResponse;
import com.example.api.student.Student;
import com.example.api.student.StudentRepository;

@Service
public class ProfService {

    private final profRepository professorRepository;
    private final StudentRepository   studentRepository;
 
    public ProfService(profRepository professorRepository,
                                  StudentRepository studentRepository) {
        this.professorRepository = professorRepository;
        this.studentRepository   = studentRepository;
    }
 
    public ProfessorProfilResponse eigenesProfil(Professor professor) {
        return new ProfessorProfilResponse(
            professor.getVorname(),
            professor.getNachname(),
            professor.getEmail(),
            professor.getGeburtsdatum(),
            professor.getTelefon(),
            professor.getTitel(),
            professor.getFachbereich()
        );
    }
 
    
    public ProfessorProfilResponse profilAktualisieren(Professor professor,
                                                       ProfessorProfilUpdateRequest req) {
        if (req.vorname()     != null) professor.setVorname(req.vorname());
        if (req.nachname()    != null) professor.setNachname(req.nachname());
        if (req.geburtsdatum()!= null) professor.setGeburtsdatum(req.geburtsdatum());
        if (req.titel()       != null) professor.setTitel(req.titel());
        if (req.fachbereich() != null) professor.setFachbereich(req.fachbereich());
 
        professorRepository.save(professor);
        return eigenesProfil(professor);
    }
 
    public StudentKurzProfilResponse studentKurzprofil(UUID studentId) {
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Student nicht gefunden"));
 
        return new StudentKurzProfilResponse(
            student.getVorname(),
            student.getNachname(),
            student.getEmail(),
            student.getStudiengang(),
            student.getSemester()
        );
    }

    
}
