package com.biz360.service;


import com.biz360.entity.Product;
import com.biz360.repository.ProductsRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProductService {

    private final ProductsRepository productsRepository;
    public ProductService(ProductsRepository productsRepository) {
        this.productsRepository = productsRepository;

    }

    public Product createProduct(Product product) {
        if(productsRepository.existsByProductCode(product.getProductCode())) {
            throw new RuntimeException("Product code already exists");

        }
        if (product.getActive() == null) {
            product.setActive(true); // default enabled
        }

        product.setCreatedAt(LocalDateTime.now());
        return productsRepository.save(product);
    }


    public List<Product> getAllProducts() {
        return productsRepository.findAll();
    }

    public Product getProductByCode(String code) {
        return productsRepository.findByProductCode(code).orElseThrow(()->new RuntimeException("Product not found!!!"));

    }

    public List<Product> searchProducts(String name){
        return productsRepository.findByNameContainingIgnoreCase(name);
    }

    public Product updateProduct(String code,Product product) {

        Product existingProduct = productsRepository.findByProductCode(code).orElseThrow(()->new RuntimeException("Product not found"));

        existingProduct.setName(product.getName());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setBasePrice(product.getBasePrice());

        return productsRepository.save(existingProduct);

    }
    public Product changeActiveStatus(String code, Boolean active) {

        Product product = productsRepository.findByProductCode(code)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setActive(active);

        return productsRepository.save(product);
    }
}
