package com.biz360.entity;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name="product_uom")
@Data
public class ProductUom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //relation to product
    @ManyToOne
    @JoinColumn(name="product_id", nullable = false)
    private Product product;


    //relation to uom
    @ManyToOne
    @JoinColumn(name="uom_id", nullable = false)
    private UOM uom;

    @Column(nullable = false)
    private Double conversionFactor;

    @Column(unique = true)
    private String barcode;
}
