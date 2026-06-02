package com.biz360.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "warehouse")
@Data
public class Warehouse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;
    // "Main Warehouse"

    private String location;
    // "Muscat", "Dubai"
}