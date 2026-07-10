package com.example.api.kurs;

import java.util.UUID;

public class KursDto {

     public record KursRequest(
            String titel,
            String beschreibung,
            UUID modulId
    ) {
    }

    public record KursResponse(
            UUID kursId,
            String titel,
            String beschreibung
    ) {
    }

  
}