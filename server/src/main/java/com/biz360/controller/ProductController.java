package com.biz360.controller;


import com.biz360.entity.Product;
import com.biz360.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    public Product create(@RequestBody Product product) {
        return productService.createProduct(product);

    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{code}")
    public Product getByCode(@PathVariable String code) {
        return productService.getProductByCode(code);
    }

    @GetMapping("/search")
    public List<Product> search(@RequestParam String name) {
        return productService.searchProducts(name);
    }

    @PutMapping("/{code}")
    public Product update( @PathVariable String code,@RequestBody Product product) {
        return productService.updateProduct(code, product);
    }

    @PatchMapping("/{code}/status")
    public Product changeStatus(@PathVariable String code,
                                @RequestBody Product product) {

        return productService.changeActiveStatus(code, product.getActive());
    }
}
