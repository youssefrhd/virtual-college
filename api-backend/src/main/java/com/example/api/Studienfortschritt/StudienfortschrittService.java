package com.example.api.Studienfortschritt;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.api.modul.ModulService;
import com.example.api.prufung.Pruefung.PruefungsUebersichtDTO;
import com.example.api.prufung.pruefungService;
import com.example.api.prufungsanmeldung.Pruefungsanmeldung;
import com.example.api.student.Student;
import com.example.api.student.StudentService;
import com.example.api.Studienfortschritt.StudienfortschrittController.StudienfortschrittDTO;

@Service
public class StudienfortschrittService {
        private final StudentService studentService;
        private final pruefungService pruefungService;
        private final ModulService modulService;

        public StudienfortschrittService(
                        StudentService studentService,
                        pruefungService pruefungService,
                        ModulService modulService) {

                this.studentService = studentService;
                this.pruefungService = pruefungService;
                this.modulService = modulService;
        }

        public StudienfortschrittDTO getStudienfortschritt(UUID studentId) {

                Student student = studentService.findById(studentId);

                List<Pruefungsanmeldung> anmeldungen = pruefungService.getAnmeldungen(student);

                List<PruefungsUebersichtDTO> bestandene = pruefungService.getBestandenePruefungen(anmeldungen);

                List<PruefungsUebersichtDTO> nichtBestandene = pruefungService.getNichtBestandenePruefungen(anmeldungen);

                List<PruefungsUebersichtDTO> offene = pruefungService.getOffenePruefungen(anmeldungen);

                int ects = modulService.berechneECTS(anmeldungen);

                double durchschnitt = pruefungService.berechneDurchschnitt(anmeldungen);

                return new StudienfortschrittDTO(
                                ects,
                                Math.round(durchschnitt * 100.0) / 100.0,

                                bestandene.size(),
                                nichtBestandene.size(),
                                offene.size(),

                                bestandene,
                                nichtBestandene,
                                offene);
        }

        

}
