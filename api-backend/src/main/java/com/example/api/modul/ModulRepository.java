package com.example.api.modul;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ModulRepository extends JpaRepository<Modul,UUID>{
    
}
