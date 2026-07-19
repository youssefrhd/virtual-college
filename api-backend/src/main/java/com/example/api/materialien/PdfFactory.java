package com.example.api.materialien;

import org.springframework.stereotype.Component;
import com.example.api.materialien.MaterialDTO.PdfCreateData;

@Component
public class PdfFactory
        extends LernmaterialFactory<PdfCreateData, PdfMaterial> {

    @Override
    public PdfMaterial create(PdfCreateData request) {
        return new PdfMaterial(
                request.titel(),
                request.pfad(),
                request.kurs(),
                request.seitenAnzahl()
        );
    }
}