package com.example.api.materialien;

import java.io.IOException;
import java.util.UUID;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.api.materialien.MaterialDTO.LinkMaterialRequest;
import com.example.api.materialien.MaterialDTO.LinkMaterialResponse;
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
    @Operation(summary = "PDF-Material hochladen")
    public ResponseEntity<PdfMaterialResponse> createPdf(
            @RequestParam("titel") String titel,
            @RequestParam("modulId") UUID modulId,
            @RequestParam("datei") MultipartFile datei
    ) throws IOException {

        PdfMaterialRequest request = new PdfMaterialRequest(titel, modulId, datei);
        return ResponseEntity.ok(service.pdfMaterialAnlegen(request));
    }

    @PostMapping(value = "/link", consumes = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Link-Material anlegen")
    public ResponseEntity<LinkMaterialResponse> createLink(
            @RequestBody LinkMaterialRequest request
    ) {
        return ResponseEntity.ok(service.linkMaterialAnlegen(request));
    }
}