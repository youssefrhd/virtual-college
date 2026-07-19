package com.example.api.benachrichtigung;

import java.time.LocalDateTime;
import java.util.UUID;

public class Dto {
        public record BenachrichtigungCreateRequest(

    UUID empfaengerId,

    Benachrichtigung.Typ typ,

    String nachricht

) {}

public record BenachrichtigungResponse(
    UUID benachrichtigungId,
    Benachrichtigung.Typ typ,
    String nachricht,
    LocalDateTime gesendetAm,
    boolean gelesen
) {}
    
}
