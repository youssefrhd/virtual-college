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
import com.lowagie.text.Rectangle;
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

        Document document = new Document(PageSize.A4, 45, 45, 45, 45);
        PdfWriter.getInstance(document, out);
        document.open();

        /*
         * =========================
         * SCHWARZ-WEISS DESIGN
         * =========================
         */

        java.awt.Color black = java.awt.Color.BLACK;
        java.awt.Color darkGray = new java.awt.Color(55, 55, 55);
        java.awt.Color gray = new java.awt.Color(110, 110, 110);
        java.awt.Color lightGray = new java.awt.Color(225, 225, 225);
        java.awt.Color veryLightGray = new java.awt.Color(245, 245, 245);

        Font titleFont = FontFactory.getFont(
                FontFactory.HELVETICA_BOLD,
                24,
                black
        );

        Font studentFont = FontFactory.getFont(
                FontFactory.HELVETICA,
                10,
                gray
        );

        Font sectionFont = FontFactory.getFont(
                FontFactory.HELVETICA_BOLD,
                13,
                black
        );

        Font kpiLabelFont = FontFactory.getFont(
                FontFactory.HELVETICA,
                8,
                gray
        );

        Font kpiValueFont = FontFactory.getFont(
                FontFactory.HELVETICA_BOLD,
                18,
                black
        );

        Font tableHeaderFont = FontFactory.getFont(
                FontFactory.HELVETICA_BOLD,
                8,
                black
        );

        Font tableCellFont = FontFactory.getFont(
                FontFactory.HELVETICA,
                8,
                darkGray
        );

        Font footerFont = FontFactory.getFont(
                FontFactory.HELVETICA,
                8,
                gray
        );

        /*
         * =========================
         * HEADER
         * =========================
         */

        Paragraph title = new Paragraph("STUDIENFORTSCHRITT", titleFont);
        title.setSpacingAfter(4);
        document.add(title);

        String datum = java.time.LocalDate.now()
                .format(DateTimeFormatter.ofPattern("dd.MM.yyyy"));

        String subtitle = (studentName != null && !studentName.isBlank()
                ? studentName + "  ·  "
                : "") + "Erstellt am " + datum;

        Paragraph sub = new Paragraph(subtitle, studentFont);
        sub.setSpacingAfter(18);
        document.add(sub);

        /*
         * Trennlinie unter dem Header
         */

        PdfPTable headerLine = new PdfPTable(1);
        headerLine.setWidthPercentage(100);

        PdfPCell lineCell = new PdfPCell();
        lineCell.setFixedHeight(1.5f);
        lineCell.setBackgroundColor(black);
        lineCell.setBorder(Rectangle.NO_BORDER);

        headerLine.addCell(lineCell);
        document.add(headerLine);

        /*
         * =========================
         * KPI BEREICH
         * =========================
         */

        PdfPTable kpiTable = new PdfPTable(4);
        kpiTable.setWidthPercentage(100);
        kpiTable.setSpacingBefore(18);
        kpiTable.setSpacingAfter(25);
        kpiTable.setWidths(new float[]{1, 1, 1, 1});

        addKpiCell(
                kpiTable,
                "ECTS",
                String.valueOf(data.earnedEcts()),
                kpiLabelFont,
                kpiValueFont,
                veryLightGray,
                lightGray
        );

        addKpiCell(
                kpiTable,
                "DURCHSCHNITT",
                String.format("%.2f", data.averageGrade()),
                kpiLabelFont,
                kpiValueFont,
                veryLightGray,
                lightGray
        );

        addKpiCell(
                kpiTable,
                "BESTANDEN",
                String.valueOf(data.passedExams()),
                kpiLabelFont,
                kpiValueFont,
                veryLightGray,
                lightGray
        );

        addKpiCell(
                kpiTable,
                "OFFEN",
                String.valueOf(data.openExams()),
                kpiLabelFont,
                kpiValueFont,
                veryLightGray,
                lightGray
        );

        document.add(kpiTable);

        /*
         * =========================
         * PRÜFUNGEN
         * =========================
         */

        addExamSection(
                document,
                "Bestandene Prüfungen",
                data.bestandenePruefungen(),
                sectionFont,
                tableHeaderFont,
                tableCellFont,
                black,
                lightGray
        );

        addExamSection(
                document,
                "Offene Prüfungen",
                data.offenePruefungen(),
                sectionFont,
                tableHeaderFont,
                tableCellFont,
                black,
                lightGray
        );

        addExamSection(
                document,
                "Nicht bestandene Prüfungen",
                data.nichtBestandenePruefungen(),
                sectionFont,
                tableHeaderFont,
                tableCellFont,
                black,
                lightGray
        );

        /*
         * =========================
         * FOOTER
         * =========================
         */

        Paragraph footer = new Paragraph(
                "Studienfortschritt · Automatisch generierter Bericht",
                footerFont
        );

        footer.setAlignment(Element.ALIGN_CENTER);
        footer.setSpacingBefore(25);

        document.add(footer);

        document.close();

        return out.toByteArray();

    } catch (DocumentException | java.io.IOException e) {
        throw new RuntimeException(
                "PDF konnte nicht erstellt werden.",
                e
        );
    }
}


private void addKpiCell(
        PdfPTable table,
        String label,
        String value,
        Font labelFont,
        Font valueFont,
        java.awt.Color background,
        java.awt.Color border
) {
    PdfPCell cell = new PdfPCell();
    cell.setPaddingTop(12);
    cell.setPaddingBottom(12);
    cell.setPaddingLeft(8);
    cell.setPaddingRight(8);

    cell.setBackgroundColor(background);
    cell.setBorderColor(border);
    cell.setBorderWidth(0.8f);

    Paragraph valuePara = new Paragraph(value, valueFont);
    valuePara.setAlignment(Element.ALIGN_CENTER);
    valuePara.setSpacingAfter(3);

    Paragraph labelPara = new Paragraph(label, labelFont);
    labelPara.setAlignment(Element.ALIGN_CENTER);

    cell.addElement(valuePara);
    cell.addElement(labelPara);

    table.addCell(cell);
}


private void addExamSection(
        Document document,
        String title,
        List<PruefungsUebersichtDTO> exams,
        Font sectionFont,
        Font headerFont,
        Font cellFont,
        java.awt.Color headerColor,
        java.awt.Color borderColor
) throws DocumentException {

    Paragraph sectionTitle = new Paragraph(
            title.toUpperCase() + "  (" + exams.size() + ")",
            sectionFont
    );

    sectionTitle.setSpacingBefore(16);
    sectionTitle.setSpacingAfter(8);

    document.add(sectionTitle);

    if (exams.isEmpty()) {
        Paragraph empty = new Paragraph(
                "Keine Einträge vorhanden.",
                FontFactory.getFont(
                        FontFactory.HELVETICA_OBLIQUE,
                        9,
                        new java.awt.Color(130, 130, 130)
                )
        );

        empty.setSpacingAfter(10);
        document.add(empty);
        return;
    }

    PdfPTable table = new PdfPTable(4);
    table.setWidthPercentage(100);
    table.setWidths(new float[]{3.2f, 3.2f, 1.2f, 1.2f});
    table.setSpacingAfter(8);

    String[] headers = {
            "MODUL",
            "PRÜFUNG",
            "ECTS",
            "NOTE"
    };

    for (String header : headers) {

        PdfPCell cell = new PdfPCell(
                new Paragraph(header, headerFont)
        );

        cell.setPaddingTop(7);
        cell.setPaddingBottom(7);
        cell.setPaddingLeft(6);
        cell.setPaddingRight(6);

        cell.setBackgroundColor(new java.awt.Color(235, 235, 235));
        cell.setBorderColor(headerColor);
        cell.setBorderWidth(0.8f);

        table.addCell(cell);
    }

    boolean alternate = false;

    for (PruefungsUebersichtDTO p : exams) {

        java.awt.Color rowColor = alternate
                ? new java.awt.Color(248, 248, 248)
                : java.awt.Color.WHITE;

        table.addCell(
                cellText(
                        p.modulBezeichnung(),
                        cellFont,
                        rowColor,
                        borderColor,
                        Element.ALIGN_LEFT
                )
        );

        table.addCell(
                cellText(
                        p.pruefungsBezeichnung(),
                        cellFont,
                        rowColor,
                        borderColor,
                        Element.ALIGN_LEFT
                )
        );

        table.addCell(
                cellText(
                        p.ects() != null
                                ? p.ects() + " ECTS"
                                : "-",
                        cellFont,
                        rowColor,
                        borderColor,
                        Element.ALIGN_CENTER
                )
        );

        table.addCell(
                cellText(
                        p.note() != null
                                ? String.valueOf(p.note())
                                : "offen",
                        cellFont,
                        rowColor,
                        borderColor,
                        Element.ALIGN_CENTER
                )
        );

        alternate = !alternate;
    }

    document.add(table);
}


private PdfPCell cellText(
        String text,
        Font font,
        java.awt.Color background,
        java.awt.Color borderColor,
        int alignment
) {
    PdfPCell cell = new PdfPCell(
            new Paragraph(
                    text != null ? text : "-",
                    font
            )
    );

    cell.setPaddingTop(6);
    cell.setPaddingBottom(6);
    cell.setPaddingLeft(6);
    cell.setPaddingRight(6);

    cell.setBackgroundColor(background);
    cell.setBorderColor(borderColor);
    cell.setBorderWidth(0.5f);
    cell.setHorizontalAlignment(alignment);

    return cell;
}
        

        

}
