package com.example.api.benachrichtigung;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.api.benachrichtigung.Dto.BenachrichtigungCreateRequest;
import com.example.api.benachrichtigung.Dto.BenachrichtigungResponse;
import com.example.api.user.User;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;

@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/benachrichtigungen")
public class BenachrichtigungController {

     private final BenachrichtigungService benachrichtigungService;

    public BenachrichtigungController(BenachrichtigungService benachrichtigungService) {
        this.benachrichtigungService = benachrichtigungService;
    }

   
    @GetMapping
    public ResponseEntity<List<BenachrichtigungResponse>> getMeineBenachrichtigungen(
            @AuthenticationPrincipal User currentUser
    ) {
        List<BenachrichtigungResponse> result =
                benachrichtigungService.getBenachrichtigungenFuerUser(currentUser.getUserId());

        return ResponseEntity.ok(result);
    }

    
    @GetMapping("/ungelesen/count")
    public ResponseEntity<Map<String, Long>> countUngelesen(
            @AuthenticationPrincipal User currentUser
    ) {
        long count = benachrichtigungService.countUngelesen(currentUser.getUserId());
        return ResponseEntity.ok(Map.of("count", count));
    }

    
    @PatchMapping("/{id}/gelesen")
    public ResponseEntity<Void> markiereAlsGelesen(
            @PathVariable UUID id,
            @AuthenticationPrincipal User currentUser
    ) {
        benachrichtigungService.markiereAlsGelesen(id, currentUser.getUserId());
        return ResponseEntity.noContent().build();
    }

    
    @PatchMapping("/alle-gelesen")
    public ResponseEntity<Void> markiereAlleAlsGelesen(
            @AuthenticationPrincipal User currentUser
    ) {
        benachrichtigungService.markiereAlleAlsGelesen(currentUser.getUserId());
        return ResponseEntity.noContent().build();
    }

    
    @PostMapping
    public ResponseEntity<BenachrichtigungResponse> create(
            @Valid @RequestBody BenachrichtigungCreateRequest request
    ) {
        BenachrichtigungResponse created = benachrichtigungService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
}
