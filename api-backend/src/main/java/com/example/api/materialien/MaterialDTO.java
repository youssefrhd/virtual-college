package com.example.api.materialien;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

import com.example.api.kurs.Kurs;
import com.example.api.modul.Modul;

public class MaterialDTO {
        public record PdfMaterialRequest(
                        String titel,
                        UUID kursId,
                        MultipartFile datei) {
        }

        public record LinkMaterialRequest(
                        String titel,
                        String url,
                        UUID kursId) {
        }

        public record PdfMaterialResponse(
                        Long materialId,
                        String titel,
                        String typ,
                        String pfad,
                        LocalDateTime hochgeladenAm,
                        UUID kursId,
                        String kursTitel,
                        Integer seitenAnzahl) {
        }

        public record LinkMaterialResponse(
                        Long materialId,
                        String titel,
                        String typ,
                        String url,
                        LocalDateTime hochgeladenAm) {
        }

        public record PdfCreateData(
                        String titel,
                        String pfad,
                        int seitenAnzahl,
                        Kurs kurs) {
        }

        public record LinkCreateData(
                        String titel,
                        String url,
                        Kurs kurs) {
        }

         public record MaterialListResponse(
            Long materialId,
            String titel,
            String typ,
            LocalDateTime hochgeladenAm
    ) {}

    public record DownloadedMaterial(
        Resource resource,
        String filename,
        MediaType contentType
) {}

public record MaterialResponse(
            Long materialId,
            String titel,
            String typ,
            String pfad,
            String url,
            LocalDateTime hochgeladenAm,
            UUID kursId,
            String kursTitel,
            Integer seitenAnzahl
    ) {}
}
