package com.example.api.materialien;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.api.materialien.MaterialDTO.DownloadedMaterial;
import com.example.api.materialien.MaterialDTO.LinkMaterialRequest;
import com.example.api.materialien.MaterialDTO.LinkMaterialResponse;
import com.example.api.materialien.MaterialDTO.MaterialListResponse;
import com.example.api.materialien.MaterialDTO.MaterialResponse;
import com.example.api.materialien.MaterialDTO.PdfMaterialRequest;
import com.example.api.materialien.MaterialDTO.PdfMaterialResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/materialien")
@Tag(name = "Lernmaterial", description = "PDF oder Link Material anlegen")
public class BaseMaterialController {

    private final LernmaterialService service;

    public BaseMaterialController(LernmaterialService service) {
        this.service = service;
    }

    @PostMapping(value = "/pdf", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('PROFESSOR')")
    @Operation(summary = "PDF-Material hochladen")
    public ResponseEntity<PdfMaterialResponse> createPdf(
            @RequestParam("titel") String titel,
            @RequestParam("kursId") UUID kursId,
            @RequestParam("datei") MultipartFile datei) throws IOException {

        PdfMaterialRequest request = new PdfMaterialRequest(titel, kursId, datei);
        return ResponseEntity.ok(service.pdfMaterialAnlegen(request));
    }

    @PostMapping(value = "/link")
    @PreAuthorize("hasRole('PROFESSOR')")

    @Operation(summary = "Link-Material anlegen")
    public ResponseEntity<LinkMaterialResponse> createLink(
            @RequestParam("titel") String titel,
            @RequestParam("url") String url,
            @RequestParam("kursId") UUID kursId) {
        LinkMaterialRequest request = new LinkMaterialRequest(titel, url, kursId);

        return ResponseEntity.ok(service.linkMaterialAnlegen(request));
    }

    @GetMapping("/kurs/{kursId}")
    @PreAuthorize("hasAnyRole('PROFESSOR','STUDENT')")
    @Operation(summary = "Alle Materialien eines Kurses laden")
    public ResponseEntity<List<MaterialListResponse>> getMaterialienByKurs(@PathVariable UUID kursId) {
        return ResponseEntity.ok(service.getMaterialienVonKurs(kursId));
    }

    @GetMapping("/{materialId}")
    @PreAuthorize("hasAnyRole('PROFESSOR','STUDENT')")
    @Operation(summary = "Ein Material per ID laden")
    public ResponseEntity<LinkMaterialResponse> getLinkMaterialById(@PathVariable Long materialId) {
        return ResponseEntity.ok(service.getLinkMaterialById(materialId));
    }

    @DeleteMapping("/{materialId}")
    @PreAuthorize("hasRole('PROFESSOR')")
    @Operation(summary = "Material löschen")
    public ResponseEntity<Void> deleteMaterial(@PathVariable Long materialId) {
        service.materialLoeschen(materialId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{materialId}/download")
    @PreAuthorize("hasAnyRole('PROFESSOR','STUDENT')")
    @Operation(summary = "PDF-Material herunterladen")
    public ResponseEntity<Resource> downloadMaterial(@PathVariable Long materialId) throws IOException {
        DownloadedMaterial file = service.downloadMaterial(materialId);

        return ResponseEntity.ok()
                .contentType(file.contentType())
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + file.filename() + "\"")
                .body(file.resource());
    }
}