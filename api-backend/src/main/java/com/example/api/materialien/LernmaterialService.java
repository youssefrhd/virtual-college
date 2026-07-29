package com.example.api.materialien;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

import com.example.api.kurs.Kurs;
import com.example.api.kurs.KursRepository;
import com.example.api.materialien.MaterialDTO.DownloadedMaterial;
import com.example.api.materialien.MaterialDTO.LinkCreateData;
import com.example.api.materialien.MaterialDTO.LinkMaterialRequest;
import com.example.api.materialien.MaterialDTO.LinkMaterialResponse;
import com.example.api.materialien.MaterialDTO.MaterialListResponse;
import com.example.api.materialien.MaterialDTO.PdfCreateData;
import com.example.api.materialien.MaterialDTO.PdfMaterialRequest;
import com.example.api.materialien.MaterialDTO.PdfMaterialResponse;

@Service
public class LernmaterialService {

    private final BaseMaterialRepository materialRepository;
    private final KursRepository kursRepository;

 
    private final Map<String, LernmaterialFactory> factories;

    @Value("${material.upload-dir}")
    private String uploadDir;

  
    public LernmaterialService(BaseMaterialRepository materialRepository,
            KursRepository kursRepository,
            Map<String, LernmaterialFactory> factories) {
        this.materialRepository = materialRepository;
        this.kursRepository = kursRepository;
        this.factories = factories;
    }

    public PdfMaterialResponse pdfMaterialAnlegen(PdfMaterialRequest request) throws IOException {
        if (request.titel() == null || request.titel().isBlank()) {
            throw new IllegalArgumentException("Titel darf nicht leer sein.");
        }
        if (request.kursId() == null) {
            throw new IllegalArgumentException("Modul-ID darf nicht leer sein.");
        }
        if (request.datei() == null || request.datei().isEmpty()) {
            throw new IllegalArgumentException("Keine PDF-Datei hochgeladen.");
        }

        String originalFilename = request.datei().getOriginalFilename();
        if (originalFilename == null || !originalFilename.toLowerCase().endsWith(".pdf")) {
            throw new IllegalArgumentException("Es sind nur PDF-Dateien erlaubt.");
        }

        Kurs kurs = kursRepository.findById(request.kursId())
                .orElseThrow(() -> new IllegalArgumentException("Kurs nicht gefunden: " + request.kursId()));

        Path uploadPath = Paths.get(uploadDir, kurs.getKursId() + "");
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
                seitenAnzahl, kurs);

    
        LernmaterialFactory factory = factories.get("pdfFactory");
        PdfMaterial material = (PdfMaterial) factory.create(createData);
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
        if (request.kursId() == null) {
            throw new IllegalArgumentException("Modul-ID darf nicht leer sein.");
        }

        Kurs kurs = kursRepository.findById(request.kursId())
                .orElseThrow(() -> new IllegalArgumentException("Kurs nicht gefunden: " + request.kursId()));

        LinkCreateData createData = new LinkCreateData(
                request.titel(),
                request.url(),
                kurs);

        LernmaterialFactory factory = factories.get("linkFactory");
        LinkMaterial material = (LinkMaterial) factory.create(createData);
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
                material.getKurs().getKursId(),
                material.getKurs().getTitel(),
                material.getSeitenAnzahl());
    }

    private LinkMaterialResponse toLinkResponse(LinkMaterial material) {
        return new LinkMaterialResponse(
                material.getMaterialId(),
                material.getTitel(),
                "LINK",
                material.getUrl(),
                material.getHochgeladenAm());
    }

    public MaterialDTO.LinkMaterialResponse getLinkMaterialById(Long materialId) {
        BaseMaterial material = materialRepository.findById(materialId)
                .orElseThrow(() -> new IllegalArgumentException("Material nicht gefunden: " + materialId));

        return toLinkResponse((LinkMaterial) material);
    }

    public List<MaterialListResponse> getMaterialienVonKurs(UUID kursId) {
        return materialRepository.findByKurs_KursId(kursId)
                .stream()
                .map(m -> new MaterialListResponse(
                        m.getMaterialId(),
                        m.getTitel(),
                        m.getTyp(),
                        m.getHochgeladenAm()))
                .toList();
    }

    public void materialLoeschen(Long materialId) {
        BaseMaterial material = materialRepository.findById(materialId)
                .orElseThrow(() -> new IllegalArgumentException("Material nicht gefunden: " + materialId));

        if (material instanceof PdfMaterial) {
            try {
                Files.deleteIfExists(Paths.get(material.getPfad()));
            } catch (IOException ignored) {
            }
        }

        materialRepository.delete(material);
    }

    public DownloadedMaterial downloadMaterial(Long materialId) throws IOException {
        BaseMaterial material = materialRepository.findById(materialId)
                .orElseThrow(() -> new IllegalArgumentException("Material nicht gefunden: " + materialId));

        if (!(material instanceof PdfMaterial pdfMaterial)) {
            throw new IllegalArgumentException("Download ist nur für PDF-Material erlaubt.");
        }

        Path path = Paths.get(pdfMaterial.getPfad());
        if (!Files.exists(path)) {
            throw new IllegalArgumentException("Datei nicht gefunden: " + pdfMaterial.getPfad());
        }

        Resource resource = new org.springframework.core.io.UrlResource(path.toUri());

        return new DownloadedMaterial(
                resource,
                path.getFileName().toString(),
                MediaType.APPLICATION_PDF);
    }
}