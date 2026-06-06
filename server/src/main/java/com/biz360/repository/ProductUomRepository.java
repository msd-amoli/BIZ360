package com.biz360.repository;

import com.biz360.entity.Product;
import com.biz360.entity.UOM;
import org.springframework.data.jpa.repository.JpaRepository;
import com.biz360.entity.ProductUom;

import java.util.List;
import java.util.Optional;

public interface ProductUomRepository extends JpaRepository<ProductUom , Long> {

    List<ProductUom> findByProduct(Product product);

    boolean existsByProductAndUom(Product product, UOM uom);

    Optional<ProductUom> findByProductAndUom(Product product, UOM uom);

    Optional<ProductUom> findByBarcode(String barcode);
    Optional<ProductUom> findByProductAndUom_NameIgnoreCase(Product product, String uomName);



}
