package com.example.api.materialien;

import com.example.api.modul.Modul;

public interface LernmaterialFactory<T, R extends BaseMaterial> {
    R create(T request);
}