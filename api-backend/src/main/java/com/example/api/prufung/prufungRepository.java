package com.example.api.prufung;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface prufungRepository extends JpaRepository<Pruefung,UUID> {

    
} 
