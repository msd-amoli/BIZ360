package com.biz360.service;


import com.biz360.entity.Warehouse;
import com.biz360.repository.WarehouseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WarehouseService {

    private final WarehouseRepository warehouseRepository;

    public WarehouseService(WarehouseRepository warehouseRepository) {
        this.warehouseRepository = warehouseRepository;
    }

    public Warehouse createWarehouse(Warehouse warehouse) {
        String name = warehouse.getName().trim();

        if(warehouseRepository.existsByName(name)) {
            throw new RuntimeException("Warehouse with this name already exists");

        }

        warehouse.setName(name);

        return warehouseRepository.save(warehouse);
    }

    public List<Warehouse> getAll(){
        return warehouseRepository.findAll();
    }

    public Warehouse getByName(String name){
        return warehouseRepository.findByName(name).orElseThrow(() -> new RuntimeException("Warehouse with this name does not exist"));

    }

    public List<Warehouse> search(String name){
        return warehouseRepository.findByNameContainingIgnoreCase(name);

    }

    public Warehouse update(Long id, Warehouse warehouse){
        Warehouse existing = warehouseRepository.findById(id).orElseThrow(() -> new RuntimeException("Warehouse with this id does not exist"));
        String newName = warehouse.getName().trim();
        if(!existing.getName().equals(newName)&&warehouseRepository.existsByName(newName)) {
            throw new RuntimeException("Warehouse with this name already exists");
        }

        existing.setName(newName);
        existing.setLocation(warehouse.getLocation());
        return warehouseRepository.save(existing);
    }


}
