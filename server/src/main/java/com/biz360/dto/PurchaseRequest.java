package com.biz360.dto;

import lombok.Data;

import java.util.List;

@Data
public class PurchaseRequest {

    private String supplierName;

    private Double discount;

    private Double vat;

    private List<PurchaseItemRequest> items;
}