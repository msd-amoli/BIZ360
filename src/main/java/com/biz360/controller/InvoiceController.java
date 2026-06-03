package com.biz360.controller;

import com.biz360.dto.InvoiceRequest;
import com.biz360.entity.Invoice;
import com.biz360.service.InvoiceService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    // 🟢 CREATE INVOICE
    @PostMapping
    public Invoice createInvoice(@RequestBody InvoiceRequest request) {
        return invoiceService.createInvoice(request);
    }
}