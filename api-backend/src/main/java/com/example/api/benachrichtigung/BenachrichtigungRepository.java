package com.example.api.benachrichtigung;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BenachrichtigungRepository extends JpaRepository<Benachrichtigung, UUID> {

    List<Benachrichtigung> findByEmpfaenger_UserIdOrderByGesendetAmDesc(UUID userId);

    long countByEmpfaenger_UserIdAndGelesenFalse(UUID userId);
}