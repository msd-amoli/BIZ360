package com.biz360.controller;

import com.biz360.dto.InvoiceResponse;
import com.biz360.dto.PurchaseRequest;
import com.biz360.dto.PurchaseResponse;
import com.biz360.service.PurchaseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/purchases")
public class PurchaseController {

    private final PurchaseService purchaseService;

    public PurchaseController(PurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }

    @PostMapping
    public PurchaseResponse createPurchase(
            @RequestBody PurchaseRequest request) {

        return purchaseService.createPurchase(request);
    }

    @PutMapping("/{id}/cancel")
    public String cancelPurchase(@PathVariable Long id) {

        purchaseService.cancelPurchase(id);

        return "Purchase cancelled successfully";
    }


    @GetMapping
    public List<PurchaseResponse> getAllInvoices() {

        return purchaseService.getAllPurchase();
    }
    @GetMapping("/{id}")
    public PurchaseResponse getPurchaseById(
            @PathVariable Long id) {

        return purchaseService.getPurchaseById(id);
    }
    @GetMapping("/number/{invoiceNumber}")
    public PurchaseResponse getByInvoiceNumber(
            @PathVariable String invoiceNumber) {

        return purchaseService
                .getByInvoiceNumber(invoiceNumber);
    }
    @GetMapping("/supplier/{SupplierName}")
    public List<PurchaseResponse> getBySupplierName(
            @PathVariable String supplierName) {

        return purchaseService
                .getBySupplierName(supplierName);
    }

}