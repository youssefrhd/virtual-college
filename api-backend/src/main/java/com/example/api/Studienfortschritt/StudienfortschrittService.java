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


import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

import com.example.api.Studienfortschritt.StudienfortschrittController.StudienfortschrittDTO;
import com.example.api.prufung.Pruefung.PruefungsUebersichtDTO;
import com.lowagie.text.Chunk;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

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


        public byte[] generatePdf(UUID studentId, String studentName) {
        StudienfortschrittDTO data = getStudienfortschritt(studentId);

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 40, 40, 50, 50);
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, new java.awt.Color(15, 23, 42));
            Font subFont = FontFactory.getFont(FontFactory.HELVETICA, 10, new java.awt.Color(100, 100, 100));
            Font sectionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 13, new java.awt.Color(6, 182, 212));
            Font kpiLabelFont = FontFactory.getFont(FontFactory.HELVETICA, 9, new java.awt.Color(90, 90, 90));
            Font kpiValueFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, new java.awt.Color(15, 23, 42));
            Font tableHeaderFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, java.awt.Color.WHITE);
            Font tableCellFont = FontFactory.getFont(FontFactory.HELVETICA, 9, new java.awt.Color(40, 40, 40));

            // Titel
            Paragraph title = new Paragraph("Studienfortschritt", titleFont);
            title.setSpacingAfter(2);
            document.add(title);

            String datum = java.time.LocalDate.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy"));
            Paragraph sub = new Paragraph((studentName != null ? studentName + " · " : "") + "Erstellt am " + datum, subFont);
            sub.setSpacingAfter(18);
            document.add(sub);

            // KPI-Übersicht als 4-Spalten-Tabelle
            PdfPTable kpiTable = new PdfPTable(4);
            kpiTable.setWidthPercentage(100);
            kpiTable.setSpacingAfter(20);

            addKpiCell(kpiTable, "ECTS", String.valueOf(data.earnedEcts()), kpiLabelFont, kpiValueFont);
            addKpiCell(kpiTable, "Ø Note", String.format("%.2f", data.averageGrade()), kpiLabelFont, kpiValueFont);
            addKpiCell(kpiTable, "Bestanden", String.valueOf(data.passedExams()), kpiLabelFont, kpiValueFont);
            addKpiCell(kpiTable, "Offen", String.valueOf(data.openExams()), kpiLabelFont, kpiValueFont);

            document.add(kpiTable);

            // Sektionen
            addExamSection(document, "Bestandene Prüfungen", data.bestandenePruefungen(), sectionFont, tableHeaderFont, tableCellFont, new java.awt.Color(34, 197, 94));
            addExamSection(document, "Offene Prüfungen", data.offenePruefungen(), sectionFont, tableHeaderFont, tableCellFont, new java.awt.Color(167, 139, 250));
            addExamSection(document, "Nicht bestandene Prüfungen", data.nichtBestandenePruefungen(), sectionFont, tableHeaderFont, tableCellFont, new java.awt.Color(239, 68, 68));

            document.close();
            return out.toByteArray();

        } catch (DocumentException | java.io.IOException e) {
            throw new RuntimeException("PDF konnte nicht erstellt werden.", e);
        }
    }

    private void addKpiCell(PdfPTable table, String label, String value, Font labelFont, Font valueFont) {
        PdfPCell cell = new PdfPCell();
        cell.setBorderColor(new java.awt.Color(230, 230, 230));
        cell.setPadding(10);

        Paragraph valuePara = new Paragraph(value, valueFont);
        valuePara.setAlignment(Element.ALIGN_CENTER);
        Paragraph labelPara = new Paragraph(label, labelFont);
        labelPara.setAlignment(Element.ALIGN_CENTER);

        cell.addElement(valuePara);
        cell.addElement(labelPara);
        table.addCell(cell);
    }

    private void addExamSection(Document document, String title, List<PruefungsUebersichtDTO> exams,
                                 Font sectionFont, Font headerFont, Font cellFont, java.awt.Color accent) throws DocumentException {

        Paragraph sectionTitle = new Paragraph(title + "  (" + exams.size() + ")", sectionFont);
        sectionTitle.setSpacingBefore(14);
        sectionTitle.setSpacingAfter(8);
        document.add(sectionTitle);

        if (exams.isEmpty()) {
            Paragraph empty = new Paragraph("Keine Einträge vorhanden.", FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 9, java.awt.Color.GRAY));
            document.add(empty);
            return;
        }

        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{3f, 3f, 1.2f, 1.2f});

        String[] headers = {"Modul", "Prüfung", "ECTS", "Note"};
        for (String h : headers) {
            PdfPCell cell = new PdfPCell(new Paragraph(h, headerFont));
            cell.setBackgroundColor(accent);
            cell.setPadding(6);
            cell.setBorderColor(accent);
            table.addCell(cell);
        }

        for (PruefungsUebersichtDTO p : exams) {
            table.addCell(cellText(p.modulBezeichnung(), cellFont));
            table.addCell(cellText(p.pruefungsBezeichnung(), cellFont));
            table.addCell(cellText(p.ects() != null ? p.ects() + " ECTS" : "-", cellFont));
            table.addCell(cellText(p.note() != null ? String.valueOf(p.note()) : "offen", cellFont));
        }

        document.add(table);
    }

    private PdfPCell cellText(String text, Font font) {
        PdfPCell cell = new PdfPCell(new Paragraph(text != null ? text : "-", font));
        cell.setPadding(6);
        cell.setBorderColor(new java.awt.Color(230, 230, 230));
        return cell;
    }
        

        

}
