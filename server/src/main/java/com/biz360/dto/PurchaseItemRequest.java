package com.biz360.dto;

import lombok.Data;

@Data
public class PurchaseItemRequest {

    private String productCode;

    private String uomName;

    private String warehouseName;

    private Double quantity;

    private Double costPrice;
}