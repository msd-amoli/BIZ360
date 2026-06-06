package com.biz360.controller;

import com.biz360.entity.UOM;
import com.biz360.service.UomService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/uoms")
public class UomController {

    private final UomService uomService;

    public UomController(UomService uomService) {
        this.uomService = uomService;
    }

    // 🟢 CREATE UOM (ADMIN)
    @PostMapping
    public UOM create(@RequestBody UOM uom) {
        return uomService.createUom(uom);
    }

    // 🔍 GET ALL (for dropdowns)
    @GetMapping
    public List<UOM> getAll() {
        return uomService.findAllUom();
    }

    // 🔍 GET BY NAME
    @GetMapping("/{name}")
    public UOM getByName(@PathVariable String name) {
        return uomService.getByName(name);
    }

    // 🔍 SEARCH (for UI typing)
    @GetMapping("/search")
    public List<UOM> search(@RequestParam String name) {
        return uomService.search(name);
    }

    //  UPDATE
    @PutMapping("/{id}")
    public UOM update(@PathVariable Long id,
                      @RequestBody UOM uom) {
        return uomService.updateUom(id, uom);
    }
}