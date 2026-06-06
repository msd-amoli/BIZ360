package com.biz360.repository;

import com.biz360.entity.UOM;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UomRepository extends JpaRepository<UOM,Long> {

    Optional<UOM> findByName(String name);

    List<UOM> findByNameContainingIgnoreCase(String name);

    boolean existsByName(String name);


}
