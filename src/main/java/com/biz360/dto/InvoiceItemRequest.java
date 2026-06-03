package com.biz360.dto;

import lombok.Data;

@Data
public class InvoiceItemRequest {

    private String productCode;
    private String uomName;
    private Double quantity;
    private Double price;
    private String warehouseName;
}