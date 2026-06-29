package com.example.api.professor;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface profRepository extends JpaRepository<Professor,UUID>{
    
}
