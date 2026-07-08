package com.example.api.materialien;

import com.example.api.modul.Modul;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "link_material")
public class LinkMaterial extends BaseMaterial{


    @Column(name = "url", nullable = false, length = 1000)
    private String url;

    protected LinkMaterial() {
    }

    public LinkMaterial(String titel, String url, Modul modul) {
        super(titel, url, modul); 
        this.url = url;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
        setPfad(url);
    }

    @Override
    public String getInfo() {
        return "Link: " + getTitel() + " -> " + url;
    }
}
    

