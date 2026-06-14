package com.biz360.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name="purchases")
@Data
public class Purchase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String purchaseNumber;

    private String supplierName;

    @Column(nullable = false)
    private String status;

    private Double subTotal;

    private Double discount;
    private Double discountAmount;
    private Double vat;
    private Double vatAmount;

    private Double netTotal;

    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "purchase", cascade = CascadeType.ALL)
    private List<PurchaseItem> items;

}
