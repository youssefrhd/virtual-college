package com.example.api.prufungsanmeldung;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PruefungsanmeldungRepository extends JpaRepository<Pruefungsanmeldung, UUID> {

    @Query("SELECT a FROM Pruefungsanmeldung a WHERE a.student.userId = :studentId")
    List<Pruefungsanmeldung> findByStudentId(@Param("studentId") UUID studentId);

    @Query("SELECT a FROM Pruefungsanmeldung a WHERE a.student.userId = :studentId AND a.pruefung.pruefungId = :pruefungId")
    Optional<Pruefungsanmeldung> findByStudentIdAndPruefungId(
            @Param("studentId") UUID studentId,
            @Param("pruefungId") UUID pruefungId);
}