package com.biz360.service;

import com.biz360.dto.InvoiceRequest;
import com.biz360.dto.InvoiceItemRequest;
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
    public Invoice createInvoice(InvoiceRequest request) {

        Invoice invoice = new Invoice();

        invoice.setInvoiceNumber(UUID.randomUUID().toString());
        invoice.setCustomerName(request.getCustomerName());
        invoice.setCreatedAt(LocalDateTime.now());

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

        double netTotal = subTotal - discount + vat;

        invoice.setItems(items);
        invoice.setSubTotal(subTotal);
        invoice.setDiscount(discount);
        invoice.setVat(vat);
        invoice.setNetTotal(netTotal);

        return invoiceRepository.save(invoice);
    }
}