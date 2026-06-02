package com.biz360.controller;

import com.biz360.dto.InventoryResponse;
import com.biz360.entity.Inventory;
import com.biz360.service.InventoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    // ADD STOCK (INWARD)
    @PostMapping("/add")
    public Inventory addStock(@RequestParam String productCode,
                              @RequestParam String warehouseName,
                              @RequestParam String uomName,
                              @RequestParam Double quantity) {

        return inventoryService.addStock(productCode, warehouseName, uomName, quantity);
    }

    //  REDUCE STOCK (OUTWARD)
    @PostMapping("/reduce")
    public Inventory reduceStock(@RequestParam String productCode,
                                 @RequestParam String warehouseName,
                                 @RequestParam String uomName,
                                 @RequestParam Double quantity) {

        return inventoryService.reduceStock(productCode, warehouseName, uomName, quantity);
    }

    @GetMapping
    public List<InventoryResponse> getAllInventory() {
        return inventoryService.getAllInventory();
    }

    @GetMapping("/product/{productCode}")
    public List<InventoryResponse> getByProduct(@PathVariable String productCode) {
        return inventoryService.getInventoryByProduct(productCode);
    }
    @GetMapping("/warehouse/{warehouseName}")
    public List<InventoryResponse> getByWarehouse(@PathVariable String warehouseName) {
        return inventoryService.getInventoryByWarehouse(warehouseName);
    }
}