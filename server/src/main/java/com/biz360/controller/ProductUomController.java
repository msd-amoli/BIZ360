package com.biz360.controller;


import com.biz360.entity.ProductUom;
import com.biz360.service.ProductUomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products/{productCode}/uoms")
public class ProductUomController {
    @Autowired
    private ProductUomService productUomService;

    public ProductUomController(ProductUomService productUomService) {
        this.productUomService = productUomService;
    }

    @PostMapping
    public ProductUom addUom(@PathVariable String productCode, @RequestParam String uomName, @RequestBody ProductUom productUom){
        return productUomService.addUomToProduct(productCode, uomName, productUom);

    }

    @GetMapping
    public List<ProductUom> getUom(@PathVariable String productCode){
        return productUomService.getuomsByproduct(productCode);
    }
}
