package com.biz360.dto;

import lombok.Data;

@Data
public class InventoryResponse {

    private String productCode;
    private String productName;
    private String warehouseName;
    private Double quantity;
}