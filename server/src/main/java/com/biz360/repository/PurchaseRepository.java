package com.biz360.repository;

import com.biz360.entity.Purchase;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    Optional<Purchase> findTopByOrderByIdDesc();
    Optional<Purchase> findByPurchaseNumber(String purchaseNumber);

    List<Purchase> findBySupplierNameContainingIgnoreCase(
            String supplierName);

}
