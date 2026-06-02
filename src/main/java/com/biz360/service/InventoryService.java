package com.biz360.service;


import com.biz360.dto.InventoryResponse;
import com.biz360.entity.*;
import com.biz360.repository.InventoryRepository;
import com.biz360.repository.ProductUomRepository;
import com.biz360.repository.ProductsRepository;
import com.biz360.repository.WarehouseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
   public class InventoryService {

        private final InventoryRepository inventoryRepository;
        private final WarehouseRepository warehouseRepository;
        private final ProductsRepository productsRepository;
        private final ProductUomRepository productUomRepository;

        public InventoryService(InventoryRepository inventoryRepository,ProductsRepository productsRepository,WarehouseRepository warehouseRepository,ProductUomRepository productUomRepository) {
            this.inventoryRepository = inventoryRepository;
            this.warehouseRepository = warehouseRepository;
            this.productsRepository = productsRepository;
            this.productUomRepository = productUomRepository;
       }

       public Inventory addStock(String productCode,String warehouseName,String uomName,Double quantity){

           Product product = productsRepository.findByProductCode(productCode).orElseThrow(()->new RuntimeException("product not found"));
           Warehouse warehouse = warehouseRepository.findByName(warehouseName).orElseThrow(()->new RuntimeException("warehouse not found"));
           ProductUom productUom = productUomRepository.findByProductAndUom_NameIgnoreCase(product,uomName).orElseThrow(()->new RuntimeException( "UOM not linked to product"));

           double baseQty = quantity * productUom.getConversionFactor();

           Inventory inventory =  inventoryRepository.findByProductAndWarehouse(product,warehouse).orElse(new Inventory());
           inventory.setProduct(product);
           inventory.setWarehouse(warehouse);
           double existingQty = inventory.getQuantity()==null?0:inventory.getQuantity();
           inventory.setQuantity(existingQty+baseQty);
         return   inventoryRepository.save(inventory);

       }

       public Inventory reduceStock(String productCode,String warehouseName,String uomName,Double quantity){
           // 1. Validate product
           Product product = productsRepository.findByProductCode(productCode)
                   .orElseThrow(() -> new RuntimeException("Product not found"));

           // 2. Validate warehouse
           Warehouse warehouse = warehouseRepository.findByName(warehouseName)
                   .orElseThrow(() -> new RuntimeException("Warehouse not found"));

           // 3. Get ProductUOM
           ProductUom productUom = productUomRepository
                   .findByProductAndUom_NameIgnoreCase(product, uomName)
                   .orElseThrow(() -> new RuntimeException("UOM not linked to product"));

           // 4. Convert to base unit
           double baseQty = quantity * productUom.getConversionFactor();

           // 5. Get inventory (must exist)
           Inventory inventory = inventoryRepository
                   .findByProductAndWarehouse(product, warehouse)
                   .orElseThrow(() -> new RuntimeException("No stock available"));

           double currentQty = inventory.getQuantity();

           // Prevent negative stock
           if (currentQty < baseQty) {
               throw new RuntimeException("Insufficient stock");
           }

           // 6. Reduce stock
           inventory.setQuantity(currentQty - baseQty);

           return inventoryRepository.save(inventory);
       }

       public List<InventoryResponse> getAllInventory() {

           List<Inventory> inventoryList = inventoryRepository.findAll();

           return inventoryList.stream().map(inv -> {
               InventoryResponse res = new InventoryResponse();

               res.setProductCode(inv.getProduct().getProductCode());
               res.setProductName(inv.getProduct().getName());
               res.setWarehouseName(inv.getWarehouse().getName());
               res.setQuantity(inv.getQuantity());

               return res;
           }).toList();
       }

    public List<InventoryResponse> getInventoryByProduct(String productCode) {

        Product product = productsRepository.findByProductCode(productCode)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        return inventoryRepository.findByProduct(product)
                .stream()
                .map(inv -> {
                    InventoryResponse res = new InventoryResponse();
                    res.setProductCode(product.getProductCode());
                    res.setProductName(product.getName());
                    res.setWarehouseName(inv.getWarehouse().getName());
                    res.setQuantity(inv.getQuantity());
                    return res;
                }).toList();
    }

    public List<InventoryResponse> getInventoryByWarehouse(String warehouseName) {

        Warehouse warehouse = warehouseRepository.findByName(warehouseName)
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));

        return inventoryRepository.findByWarehouse(warehouse)
                .stream()
                .map(inv -> {
                    InventoryResponse res = new InventoryResponse();
                    res.setProductCode(inv.getProduct().getProductCode());
                    res.setProductName(inv.getProduct().getName());
                    res.setWarehouseName(warehouse.getName());
                    res.setQuantity(inv.getQuantity());
                    return res;
                }).toList();
    }

   }
