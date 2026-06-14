package com.biz360.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PurchaseResponse {

    private Long id;

    private String purchaseNumber;

    private String supplierName;

    private String status;

    private Double subTotal;

    private Double discount;
    private Double discountAmount;
    private Double vat;
    private Double vatAmount;
    private Double netTotal;

    private LocalDateTime createdAt;

    private List<PurchaseItemResponse> items;
}