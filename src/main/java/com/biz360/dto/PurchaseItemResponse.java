package com.biz360.dto;

import lombok.Data;

@Data
public class PurchaseItemResponse {

    private String productCode;

    private String productName;

    private String uom;

    private String warehouse;

    private Double quantity;

    private Double costPrice;

    private Double total;
}