package com.biz360.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class InvoiceResponse {

    private Long id;

    private String invoiceNumber;

    private String customerName;

    private String status;

    private Double subTotal;

    private Double discount;
    private Double discountAmount;

    private Double vat;
    private Double vatAmount;

    private Double netTotal;

    private LocalDateTime createdAt;

    private List<InvoiceItemResponse> items;
}