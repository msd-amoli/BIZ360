package com.biz360.controller;

import com.biz360.dto.InvoiceRequest;
import com.biz360.dto.InvoiceResponse;
import com.biz360.entity.Invoice;
import com.biz360.service.InvoiceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    // 🟢 CREATE INVOICE
    @PostMapping
    public InvoiceResponse createInvoice(@RequestBody InvoiceRequest request) {
        return invoiceService.createInvoice(request);
    }
    @PutMapping("/{id}/cancel")
    public String cancelInvoice(@PathVariable Long id) {

        invoiceService.cancelInvoice(id);

        return "Invoice cancelled successfully";
    }
    @GetMapping
    public List<InvoiceResponse> getAllInvoices() {

        return invoiceService.getAllInvoices();
    }
    @GetMapping("/{id}")
    public InvoiceResponse getInvoiceById(
            @PathVariable Long id) {

        return invoiceService.getInvoiceById(id);
    }
    @GetMapping("/number/{invoiceNumber}")
    public InvoiceResponse getByInvoiceNumber(
            @PathVariable String invoiceNumber) {

        return invoiceService
                .getByInvoiceNumber(invoiceNumber);
    }
    @GetMapping("/customer/{customerName}")
    public List<InvoiceResponse> getByCustomerName(
            @PathVariable String customerName) {

        return invoiceService
                .getByCustomerName(customerName);
    }
}