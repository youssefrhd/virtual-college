package com.example.api.materialien;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.api.modul.Modul;

@Repository
 public interface BaseMaterialRepository extends JpaRepository<BaseMaterial, Long>  {

    List<BaseMaterial> findByKurs_KursId(UUID kursId);

}
