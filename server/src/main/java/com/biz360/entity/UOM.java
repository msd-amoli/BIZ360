package com.biz360.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Table (name="uom")
@Entity
public class UOM {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true,nullable = false)
    private String name;

    private String description;

}
