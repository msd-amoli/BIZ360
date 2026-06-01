package com.biz360.service;


import com.biz360.entity.Product;
import com.biz360.entity.ProductUom;
import com.biz360.entity.UOM;
import com.biz360.repository.ProductUomRepository;
import com.biz360.repository.ProductsRepository;
import com.biz360.repository.UomRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductUomService {

    private final ProductUomRepository productUomRepository;
    private final ProductsRepository productsRepository;
    private final UomRepository uomRepository;

    public ProductUomService(ProductUomRepository productUomRepository, ProductsRepository productsRepository, UomRepository uomRepository) {
        this.productUomRepository = productUomRepository;
        this.productsRepository = productsRepository;
        this.uomRepository = uomRepository;
    }

    //add uom to product

    public ProductUom addUomToProduct(String productCode, String uomName, ProductUom request){

        Product product = productsRepository.findByProductCode(productCode).orElseThrow(()->new RuntimeException("Product not found"));

        UOM uom = uomRepository.findByName(uomName.toUpperCase()).orElseThrow(()->new RuntimeException("UOM not found"));

        if(productUomRepository.existsByProductAndUom(product, uom)){
            throw new RuntimeException("This UOM already exist for the product");

        }

        if(request.getConversionFactor()==null || request.getConversionFactor()<=0){
            throw new RuntimeException("Conversion factor must be a positive number");

        }

        ProductUom productUom = new ProductUom();
        productUom.setProduct(product);
        productUom.setUom(uom);
        productUom.setConversionFactor(request.getConversionFactor());
        productUom.setBarcode(request.getBarcode());
       return productUomRepository.save(productUom);

    }

    //get all uom for product

    public List<ProductUom> getuomsByproduct(String productCode){

        Product product = productsRepository.findByProductCode(productCode).orElseThrow(()-> new RuntimeException("Product Not FOund"));

        return productUomRepository.findByProduct(product);

    }

    public ProductUom getByBarcode(String barcode){
        return productUomRepository.findByBarcode(barcode).orElseThrow(()->new RuntimeException("Barcode not found"));

    }


}

