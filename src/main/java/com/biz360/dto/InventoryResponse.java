package com.biz360.dto;

import lombok.Data;

import java.util.List;

@Data
public class InventoryResponse {

    private String productCode;
    private String productName;
    private String warehouseName;


    private Double baseQuantity;
    private List<UomQuantity> uomBreakdown;
}