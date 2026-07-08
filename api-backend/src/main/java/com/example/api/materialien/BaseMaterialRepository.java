package com.example.api.materialien;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.api.modul.Modul;

@Repository
 public interface BaseMaterialRepository extends JpaRepository<BaseMaterial, Long>  {

    Optional<Modul> findByModul_ModulId(Long modulId);

}
