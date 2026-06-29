package com.example.api.student;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.api.student.StudentDTO.StudentProfilResponse;
import com.example.api.student.StudentDTO.StudentProfilUpdateRequest;

@Service
public class StudentService {
     private final StudentRepository studentRepository;
 
    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }
 

    public StudentProfilResponse eigenesProfil(Student student) {
        return new StudentProfilResponse(
            student.getVorname(),
            student.getNachname(),
            student.getEmail(),
            student.getGeburtsdatum(),
            student.getMatrikelNr(),
            student.getStudiengang(),
            student.getSemester()
        );
    }
  
    
    public StudentProfilResponse profilAktualisieren(Student student,
                                                     StudentProfilUpdateRequest req) {
        if (req.vorname()     != null) student.setVorname(req.vorname());
        if (req.nachname()    != null) student.setNachname(req.nachname());
        if (req.geburtsdatum()!= null) student.setGeburtsdatum(req.geburtsdatum());
        if (req.studiengang() != null) student.setStudiengang(req.studiengang());
        if (req.semester()    != null) student.setSemester(req.semester());
 
        studentRepository.save(student);
        return eigenesProfil(student);
    }


    public Student findById(UUID studentId) {
        return studentRepository.findById(studentId).orElseThrow(()->new RuntimeException("kein Student gefunden"));
    }
    
}
