package com.example.api.materialien;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import com.example.api.modul.Modul;

public class MaterialDTO {
    public record PdfMaterialRequest(
            String titel,
            UUID modulId,
            MultipartFile datei
    ) {}

    public record LinkMaterialRequest(
            String titel,
            String url,
            UUID modulId
    ) {}

    public record PdfMaterialResponse(
            Long materialId,
            String titel,
            String typ,
            String pfad,
            LocalDateTime hochgeladenAm,
            UUID modulId,
            String modulBezeichnung,
            Integer seitenAnzahl
    ) {}

    public record LinkMaterialResponse(
            Long materialId,
            String titel,
            String typ,
            String url,
            LocalDateTime hochgeladenAm,
            UUID modulId,
            String modulBezeichnung
    ) {}

    public record PdfCreateData(
        String titel,
        String pfad,
        int seitenAnzahl,
        Modul modul
) {}
  public record LinkCreateData(
        String titel,
        String url,
        Modul modul
) {}
    
}
