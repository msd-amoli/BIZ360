package com.biz360.service;

import com.biz360.dto.*;
import com.biz360.entity.*;
import com.biz360.repository.*;
import com.biz360.service.InventoryService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final PurchaseItemRepository purchaseItemRepository;
    private final ProductsRepository productRepository;
    private final ProductUomRepository productUomRepository;
    private final WarehouseRepository warehouseRepository;
    private final InventoryService inventoryService;

    public PurchaseService(
            PurchaseRepository purchaseRepository,
            PurchaseItemRepository purchaseItemRepository,
            ProductsRepository productRepository,
            ProductUomRepository productUomRepository,
            WarehouseRepository warehouseRepository,
            InventoryService inventoryService) {

        this.purchaseRepository = purchaseRepository;
        this.purchaseItemRepository = purchaseItemRepository;
        this.productRepository = productRepository;
        this.productUomRepository = productUomRepository;
        this.warehouseRepository = warehouseRepository;
        this.inventoryService = inventoryService;
    }

    @Transactional
    public PurchaseResponse createPurchase(
            PurchaseRequest request) {

        Purchase purchase = new Purchase();

        purchase.setPurchaseNumber(generatePurchaseNumber());
        purchase.setSupplierName(request.getSupplierName());
        purchase.setCreatedAt(LocalDateTime.now());
        purchase.setStatus("POSTED");

        List<PurchaseItem> items = new ArrayList<>();

        double subTotal = 0;

        for (PurchaseItemRequest itemReq : request.getItems()) {

            Product product = productRepository
                    .findByProductCode(itemReq.getProductCode())
                    .orElseThrow(() ->
                            new RuntimeException("Product not found"));

            ProductUom productUom = productUomRepository
                    .findByProductAndUom_NameIgnoreCase(
                            product,
                            itemReq.getUomName())
                    .orElseThrow(() ->
                            new RuntimeException("UOM not linked"));

            Warehouse warehouse = warehouseRepository
                    .findByName(itemReq.getWarehouseName())
                    .orElseThrow(() ->
                            new RuntimeException("Warehouse not found"));

            double lineTotal =
                    itemReq.getQuantity() * itemReq.getCostPrice();

            PurchaseItem item = new PurchaseItem();

            item.setPurchase(purchase);
            item.setProduct(product);
            item.setUom(productUom.getUom());
            item.setWarehouse(warehouse);
            item.setQuantity(itemReq.getQuantity());
            item.setCostPrice(itemReq.getCostPrice());
            item.setTotal(lineTotal);

            items.add(item);

            subTotal += lineTotal;

            inventoryService.addStock(
                    itemReq.getProductCode(),
                    itemReq.getWarehouseName(),
                    itemReq.getUomName(),
                    itemReq.getQuantity()
            );
        }

        double discount =
                request.getDiscount() == null
                        ? 0
                        : request.getDiscount();
        double discountAmount = subTotal * discount/100;
        double vat =
                request.getVat() == null
                        ? 0
                        : request.getVat();
        double vatAmount =
                subTotal * vat / 100;
        double netTotal =
                subTotal - discountAmount + vatAmount;

        purchase.setItems(items);
        purchase.setSubTotal(subTotal);
        purchase.setDiscount(discount);
        purchase.setVat(vat);
        purchase.setVatAmount(vatAmount);
        purchase.setNetTotal(netTotal);
        purchase.setDiscountAmount(discountAmount);

        Purchase savedPurchase =
                purchaseRepository.save(purchase);

        return mapToResponse(savedPurchase);
    }

    @Transactional
    public void cancelPurchase(Long purchaseId) {

        Purchase purchase = purchaseRepository.findById(purchaseId)
                .orElseThrow(() -> new RuntimeException("Purchase not found"));

        if ("CANCELLED".equals(purchase.getStatus())) {
            throw new RuntimeException("Purchase already cancelled");
        }

        for (PurchaseItem item : purchase.getItems()) {

            inventoryService.reduceStock(
                    item.getProduct().getProductCode(),
                    item.getWarehouse().getName(),
                    item.getUom().getName(),
                    item.getQuantity()
            );
        }

        purchase.setStatus("CANCELLED");

        purchaseRepository.save(purchase);
    }

    public List<PurchaseResponse> getAllPurchase() {

        return purchaseRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public PurchaseResponse getPurchaseById(Long id) {

        Purchase purchase = purchaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase not found"));

        return mapToResponse(purchase);
    }

    public PurchaseResponse getByInvoiceNumber(
            String invoiceNumber) {

        Purchase invoice = purchaseRepository
                .findByPurchaseNumber(invoiceNumber)
                .orElseThrow(() ->
                        new RuntimeException("Invoice not found"));

        return mapToResponse(invoice);

    }

    public List<PurchaseResponse> getBySupplierName(
            String customerName) {

        return purchaseRepository
                .findBySupplierNameContainingIgnoreCase(
                        customerName)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private PurchaseResponse mapToResponse(Purchase purchase) {

        PurchaseResponse response = new PurchaseResponse();

        response.setId(purchase.getId());
        response.setPurchaseNumber(purchase.getPurchaseNumber());
        response.setSupplierName(purchase.getSupplierName());
        response.setStatus(purchase.getStatus());

        response.setSubTotal(purchase.getSubTotal());
        response.setDiscount(purchase.getDiscount());
        response.setVat(purchase.getVat());
        response.setDiscountAmount(purchase.getDiscountAmount());
        response.setVatAmount(purchase.getVatAmount());
        response.setNetTotal(purchase.getNetTotal());

        response.setCreatedAt(purchase.getCreatedAt());

        List<PurchaseItemResponse> items =
                purchase.getItems()
                        .stream()
                        .map(item -> {

                            PurchaseItemResponse dto =
                                    new PurchaseItemResponse();

                            dto.setProductCode(
                                    item.getProduct().getProductCode());

                            dto.setProductName(
                                    item.getProduct().getName());

                            dto.setUom(
                                    item.getUom().getName());

                            dto.setWarehouse(
                                    item.getWarehouse().getName());

                            dto.setQuantity(
                                    item.getQuantity());

                            dto.setCostPrice(
                                    item.getCostPrice());

                            dto.setTotal(
                                    item.getTotal());

                            return dto;

                        }).toList();

        response.setItems(items);

        return response;
    }

    private String generatePurchaseNumber() {

        Optional<Purchase> lastPurchase =
                purchaseRepository.findTopByOrderByIdDesc();

        if (lastPurchase.isEmpty()) {
            return "PUR-000001";
        }

        Long nextId = lastPurchase.get().getId() + 1;

        return String.format("PUR-%06d", nextId);
    }

}