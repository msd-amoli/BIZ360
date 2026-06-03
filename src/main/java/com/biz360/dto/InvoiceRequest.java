package com.biz360.dto;

import lombok.Data;

import java.util.List;

@Data
public class InvoiceRequest {

    private String customerName;
    private Double discount;
    private Double vat;

    private List<InvoiceItemRequest> items;
}