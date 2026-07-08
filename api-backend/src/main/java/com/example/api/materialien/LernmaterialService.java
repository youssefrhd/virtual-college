package com.example.api.materialien;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.api.materialien.MaterialDTO.LinkCreateData;
import com.example.api.materialien.MaterialDTO.LinkMaterialRequest;
import com.example.api.materialien.MaterialDTO.LinkMaterialResponse;
import com.example.api.materialien.MaterialDTO.PdfCreateData;
import com.example.api.materialien.MaterialDTO.PdfMaterialRequest;
import com.example.api.materialien.MaterialDTO.PdfMaterialResponse;
import com.example.api.modul.Modul;
import com.example.api.modul.ModulRepository;

@Service
public class LernmaterialService {

    private final BaseMaterialRepository materialRepository;
    private final ModulRepository modulRepository;
    private final PdfFactory pdfFactory;
    private final LinkFactory linkFactory;

    @Value("${material.upload-dir}") 
    private String uploadDir;

    public LernmaterialService(BaseMaterialRepository materialRepository,
            ModulRepository modulRepository,
            PdfFactory pdfFactory,
            LinkFactory linkFactory) {
        this.materialRepository = materialRepository;
        this.modulRepository = modulRepository;
        this.pdfFactory = pdfFactory;
        this.linkFactory = linkFactory;
    }

    public PdfMaterialResponse pdfMaterialAnlegen(PdfMaterialRequest request) throws IOException {
        if (request.titel() == null || request.titel().isBlank()) {
            throw new IllegalArgumentException("Titel darf nicht leer sein.");
        }

        if (request.modulId() == null) {
            throw new IllegalArgumentException("Modul-ID darf nicht leer sein.");
        }

        if (request.datei() == null || request.datei().isEmpty()) {
            throw new IllegalArgumentException("Keine PDF-Datei hochgeladen.");
        }

        String originalFilename = request.datei().getOriginalFilename();
        if (originalFilename == null || !originalFilename.toLowerCase().endsWith(".pdf")) {
            throw new IllegalArgumentException("Es sind nur PDF-Dateien erlaubt.");
        }

        Modul modul = modulRepository.findById(request.modulId())
                .orElseThrow(() -> new IllegalArgumentException("Modul nicht gefunden: " + request.modulId()));

        Path uploadPath = Paths.get(uploadDir,modul.getModulId()+"");
        Files.createDirectories(uploadPath);


        String dateiname = System.currentTimeMillis() + "_" + originalFilename;
        Path zielpfad = uploadPath.resolve(dateiname);

        Files.copy(request.datei().getInputStream(), zielpfad, StandardCopyOption.REPLACE_EXISTING);

        int seitenAnzahl;
        try (PDDocument document = Loader.loadPDF(zielpfad.toFile())) {
            seitenAnzahl = document.getNumberOfPages();
        }

        PdfCreateData createData = new PdfCreateData(
                request.titel(),
                zielpfad.toString(),
                seitenAnzahl,modul);

        PdfMaterial material = pdfFactory.create(createData);
        PdfMaterial gespeichert = (PdfMaterial) materialRepository.save(material);

        return toPdfResponse(gespeichert);
    }

    public LinkMaterialResponse linkMaterialAnlegen(LinkMaterialRequest request) {
        if (request.titel() == null || request.titel().isBlank()) {
            throw new IllegalArgumentException("Titel darf nicht leer sein.");
        }

        if (request.url() == null || request.url().isBlank()) {
            throw new IllegalArgumentException("URL darf nicht leer sein.");
        }

        if (request.modulId() == null) {
            throw new IllegalArgumentException("Modul-ID darf nicht leer sein.");
        }

        Modul modul = modulRepository.findById(request.modulId())
                .orElseThrow(() -> new IllegalArgumentException("Modul nicht gefunden: " + request.modulId()));
        
        LinkCreateData createData = new LinkCreateData(
                request.titel(),
                request.url(),
                modul);

        LinkMaterial material = linkFactory.create(createData);
        LinkMaterial gespeichert = (LinkMaterial) materialRepository.save(material);

        return toLinkResponse(gespeichert);
    }

    private PdfMaterialResponse toPdfResponse(PdfMaterial material) {
        return new PdfMaterialResponse(
                material.getMaterialId(),
                material.getTitel(),
                "PDF",
                material.getPfad(),
                material.getHochgeladenAm(),
                material.getModul().getModulId(),
                material.getModul().getBezeichnung(),
                material.getSeitenAnzahl());
    }

    private LinkMaterialResponse toLinkResponse(LinkMaterial material) {
        return new LinkMaterialResponse(
                material.getMaterialId(),
                material.getTitel(),
                "LINK",
                material.getUrl(),
                material.getHochgeladenAm(),
                material.getModul().getModulId(),
                material.getModul().getBezeichnung());
    }
}
