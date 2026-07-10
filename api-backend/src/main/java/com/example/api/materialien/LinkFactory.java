package com.example.api.materialien;

import org.springframework.stereotype.Component;

import com.example.api.materialien.MaterialDTO.LinkCreateData;


@Component
public class LinkFactory implements LernmaterialFactory<LinkCreateData, LinkMaterial> {

    @Override
    public LinkMaterial create(LinkCreateData request) {
        return new LinkMaterial(
                request.titel(),
                request.url(),
                request.kurs()
        );
    }
}