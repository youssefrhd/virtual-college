package com.example.api.materialien;

import org.springframework.stereotype.Component;

import com.example.api.materialien.MaterialDTO.LinkCreateData;
import com.example.api.materialien.MaterialDTO.LinkMaterialRequest;
import com.example.api.materialien.MaterialDTO.LinkMaterialResponse;
import com.example.api.modul.Modul;

@Component
public class LinkFactory implements LernmaterialFactory<LinkCreateData, LinkMaterial> {

    @Override
    public LinkMaterial create(LinkCreateData request) {
        return new LinkMaterial(
                request.titel(),
                request.url(),
                request.modul()
        );
    }
}