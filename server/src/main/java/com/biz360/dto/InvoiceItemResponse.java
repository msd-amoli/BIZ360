package com.biz360.dto;

import lombok.Data;

@Data
public class InvoiceItemResponse {

    private String productCode;
    private String productName;

    private String uom;

    private String warehouse;

    private Double quantity;

    private Double price;

    private Double total;
}