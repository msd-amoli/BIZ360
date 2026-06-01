package com.biz360.service;


import com.biz360.entity.UOM;
import com.biz360.repository.UomRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UomService {

    private final UomRepository uomRepository;
    public UomService(UomRepository uomRepository) {
        this.uomRepository = uomRepository;
    }
    //Create uom if not exist....
    public UOM createUom(UOM uom) {
        String name = uom.getName().toUpperCase();
        uom.setName(name);
        if(uomRepository.existsByName(name)){
            throw new RuntimeException("UOM Already Exists");

        }

        return uomRepository.save(uom);
    }

    //get all uom as list
    public List<UOM> findAllUom() {
        return uomRepository.findAll();
    }

    //get by name
    public UOM getByName(String name){
        return uomRepository.findByName(name.toUpperCase()).orElseThrow(()->new RuntimeException("UOM Not Found"));

    }


    public List<UOM>search(String name){
        return uomRepository.findByNameContainingIgnoreCase(name.toUpperCase());
    }

    public UOM updateUom(Long id,UOM uom){
        UOM existingUom = uomRepository.findById(id).orElseThrow(()->new RuntimeException("UOM Not Found"));
        String name = uom.getName().toUpperCase();
        if(existingUom.getName().equals(name)&&uomRepository.existsByName(name)){
            throw new RuntimeException("UOM Already Exists");
        }

        existingUom.setName(name);
        return uomRepository.save(existingUom);
    }




}


