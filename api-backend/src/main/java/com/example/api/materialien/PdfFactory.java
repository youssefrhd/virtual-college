package com.example.api.materialien;

import org.springframework.stereotype.Component;

import com.example.api.materialien.MaterialDTO.PdfCreateData;
import com.example.api.modul.Modul;

@Component
public class PdfFactory implements LernmaterialFactory<PdfCreateData, PdfMaterial> {

    @Override
    public PdfMaterial create(PdfCreateData request) {
        return new PdfMaterial(
                request.titel(),
                request.pfad(),
                request.modul(),
                request.seitenAnzahl()
        );
    }
}