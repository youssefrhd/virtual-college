package com.example.api.materialien;

public abstract class LernmaterialFactory<T, R extends BaseMaterial> {

    public abstract R create(T request);
}
