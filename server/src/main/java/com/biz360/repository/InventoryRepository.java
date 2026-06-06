package com.biz360.repository;

import com.biz360.entity.Inventory;
import com.biz360.entity.Product;
import com.biz360.entity.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    //  Find stock by product + warehouse
    Optional<Inventory> findByProductAndWarehouse(Product product, Warehouse warehouse);

    //  Get all stock for a product
    List<Inventory> findByProduct(Product product);

    //  Get all stock in a warehouse
    List<Inventory> findByWarehouse(Warehouse warehouse);
}