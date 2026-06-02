package com.biz360.repository;

import com.biz360.entity.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {

    //  Find by name
    Optional<Warehouse> findByName(String name);

    // Prevent duplicate warehouses
    boolean existsByName(String name);

    //  Search (for UI dropdown/filter)
    List<Warehouse> findByNameContainingIgnoreCase(String name);
}