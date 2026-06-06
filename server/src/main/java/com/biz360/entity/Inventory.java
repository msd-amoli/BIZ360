package com.biz360.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "inventory")
@Data
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Product
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    //  Warehouse
    @ManyToOne
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    //  Quantity in BASE UNIT ONLY
    @Column(nullable = false)
    private Double quantity;
}