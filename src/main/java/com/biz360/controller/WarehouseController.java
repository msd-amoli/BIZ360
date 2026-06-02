package com.biz360.controller;

import com.biz360.entity.Warehouse;
import com.biz360.service.WarehouseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/warehouses")
public class WarehouseController {

    private final WarehouseService warehouseService;

    @Autowired
    public WarehouseController(WarehouseService warehouseService) {
        this.warehouseService = warehouseService;
    }

    @PostMapping
    public Warehouse create(@RequestBody Warehouse warehouse){
        return warehouseService.createWarehouse(warehouse);
    }

    @GetMapping
    public List<Warehouse> getAll() {
     return warehouseService.getAll();
    }

    @GetMapping("/{name}")
    public Warehouse getByName(@PathVariable String name){
        return warehouseService.getByName(name);
    }
    @GetMapping("/search")
    public List<Warehouse> search(@RequestParam String name){
        return warehouseService.search(name);
    }

    @PutMapping("/{id}")
    public Warehouse update(@PathVariable Long id, @RequestBody Warehouse warehouse){
        return warehouseService.update(id, warehouse);
    }
}
