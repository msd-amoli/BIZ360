package com.biz360.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class InvoiceItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "invoice_id")
    @JsonIgnore
    private Invoice invoice;

    @ManyToOne
    private Product product;

    @ManyToOne
    private UOM uom;

    private Double quantity;

    private Double price;

    private Double total;

    @ManyToOne
    private Warehouse warehouse;
}