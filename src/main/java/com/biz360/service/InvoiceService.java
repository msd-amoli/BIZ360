package com.biz360.service;

import com.biz360.dto.InvoiceItemResponse;
import com.biz360.dto.InvoiceRequest;
import com.biz360.dto.InvoiceItemRequest;
import com.biz360.dto.InvoiceResponse;
import com.biz360.entity.*;
import com.biz360.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final ProductsRepository productRepository;
    private final ProductUomRepository productUomRepository;
    private final WarehouseRepository warehouseRepository;
    private final InventoryService inventoryService;


    public InvoiceService(InvoiceRepository invoiceRepository,
                          ProductsRepository productRepository,
                          ProductUomRepository productUomRepository,
                          WarehouseRepository warehouseRepository,
                          InventoryService inventoryService) {
        this.invoiceRepository = invoiceRepository;
        this.productRepository = productRepository;
        this.productUomRepository = productUomRepository;
        this.warehouseRepository = warehouseRepository;
        this.inventoryService = inventoryService;

    }

    @Transactional
    public InvoiceResponse createInvoice(InvoiceRequest request) {

        Invoice invoice = new Invoice();

        invoice.setInvoiceNumber(generateInvoiceNumber());
        invoice.setCustomerName(request.getCustomerName());
        invoice.setCreatedAt(LocalDateTime.now());
        invoice.setStatus("POSTED");

        List<InvoiceItem> items = new ArrayList<>();

        double subTotal = 0;

        for (InvoiceItemRequest itemReq : request.getItems()) {

            //  Product
            Product product = productRepository.findByProductCode(itemReq.getProductCode())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            // UOM validation
            ProductUom productUom = productUomRepository
                    .findByProductAndUom_NameIgnoreCase(product, itemReq.getUomName())
                    .orElseThrow(() -> new RuntimeException("UOM not linked"));

            //  Warehouse (dynamic)
            Warehouse warehouse = warehouseRepository.findByName(itemReq.getWarehouseName())
                    .orElseThrow(() -> new RuntimeException("Warehouse not found"));

            // Line total
            double lineTotal = itemReq.getQuantity() * itemReq.getPrice();

            //  Create item
            InvoiceItem item = new InvoiceItem();
            item.setInvoice(invoice);
            item.setProduct(product);
            item.setUom(productUom.getUom());
            item.setWarehouse(warehouse);
            item.setQuantity(itemReq.getQuantity());
            item.setPrice(itemReq.getPrice());
            item.setTotal(lineTotal);

            items.add(item);

            subTotal += lineTotal;

            //  Reduce stock (IMPORTANT)
            inventoryService.reduceStock(
                    itemReq.getProductCode(),
                    itemReq.getWarehouseName(),
                    itemReq.getUomName(),
                    itemReq.getQuantity()
            );
        }

        //  Financials
        double discount = request.getDiscount() == null ? 0 : request.getDiscount();
        double vat = request.getVat() == null ? 0 : request.getVat();

        double preTotal = subTotal - discount ;

        double netTotal = preTotal + (preTotal*(vat/100));

        invoice.setItems(items);
        invoice.setSubTotal(subTotal);
        invoice.setDiscount(discount);
        invoice.setVat(vat);
        invoice.setNetTotal(netTotal);

        Invoice savedInvoice = invoiceRepository.save(invoice);

        return mapToResponse(savedInvoice);
    }

    @Transactional
    public void cancelInvoice(Long invoiceId) {

        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        if ("CANCELLED".equals(invoice.getStatus())) {
            throw new RuntimeException("Invoice already cancelled");
        }

        for (InvoiceItem item : invoice.getItems()) {

            inventoryService.addStock(
                    item.getProduct().getProductCode(),
                    item.getWarehouse().getName(),
                    item.getUom().getName(),
                    item.getQuantity()
            );
        }

        invoice.setStatus("CANCELLED");

        invoiceRepository.save(invoice);
    }

    private String generateInvoiceNumber() {

        Optional<Invoice> lastInvoice =
                invoiceRepository.findTopByOrderByIdDesc();

        if (lastInvoice.isEmpty()) {
            return "INV-000001";
        }

        Long lastId = lastInvoice.get().getId() + 1;

        return String.format("INV-%06d", lastId);
    }
    public List<InvoiceResponse> getAllInvoices() {

        return invoiceRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
    public InvoiceResponse getInvoiceById(Long id) {

        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        return mapToResponse(invoice);
    }

    public InvoiceResponse getByInvoiceNumber(
            String invoiceNumber) {

        Invoice invoice = invoiceRepository
                .findByInvoiceNumber(invoiceNumber)
                .orElseThrow(() ->
                        new RuntimeException("Invoice not found"));

        return mapToResponse(invoice);

    }

    public List<InvoiceResponse> getByCustomerName(
            String customerName) {

        return invoiceRepository
                .findByCustomerNameContainingIgnoreCase(
                        customerName)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    private InvoiceResponse mapToResponse(Invoice invoice) {

        InvoiceResponse response = new InvoiceResponse();

        response.setId(invoice.getId());
        response.setInvoiceNumber(invoice.getInvoiceNumber());
        response.setCustomerName(invoice.getCustomerName());
        response.setStatus(invoice.getStatus());

        response.setSubTotal(invoice.getSubTotal());
        response.setDiscount(invoice.getDiscount());
        response.setVat(invoice.getVat());
        response.setNetTotal(invoice.getNetTotal());

        response.setCreatedAt(invoice.getCreatedAt());

        List<InvoiceItemResponse> items =
                invoice.getItems()
                        .stream()
                        .map(item -> {

                            InvoiceItemResponse dto =
                                    new InvoiceItemResponse();

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

                            dto.setPrice(
                                    item.getPrice());

                            dto.setTotal(
                                    item.getTotal());

                            return dto;

                        }).toList();

        response.setItems(items);

        return response;
    }
}