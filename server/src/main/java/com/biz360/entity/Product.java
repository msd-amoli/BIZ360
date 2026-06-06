package com.biz360.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Data
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String productCode;
    // ERP identifier (NOT id)

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private Double basePrice;

    @Column(nullable = false)
    private Boolean active;

    @Column(nullable = false)
    private Double minStockLevel = 0.0;

    private LocalDateTime createdAt;
}