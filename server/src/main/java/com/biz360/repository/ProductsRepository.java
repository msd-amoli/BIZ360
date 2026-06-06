package com.biz360.repository;

import com.biz360.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

  public interface ProductsRepository extends JpaRepository<Product, Long> {


    Optional<Product> findByProductCode(String productCode);


    List<Product> findByNameContainingIgnoreCase(String name);


    boolean existsByProductCode(String productCode);
}