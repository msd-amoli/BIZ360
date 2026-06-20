package com.biz360.service;

import com.biz360.dto.AiResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AiResponseFormatter {

    public AiResponse lowStock(List<?> data) {

        if (data.isEmpty()) {
            return AiResponse.builder()
                    .success(true)
                    .intent("LOW_STOCK")
                    .message("🎉 Great! No products are currently low in stock.")
                    .data(data)
                    .suggestion("You can create a purchase order for new stock")
                    .build();
        }

        return AiResponse.builder()
                .success(true)
                .intent("LOW_STOCK")
                .message("⚠️ Found " + data.size() + " products that need restocking")
                .data(data)
                .suggestion("Create purchase orders for these products")
                .build();
    }

    public AiResponse totalProducts(int count) {

        return AiResponse.builder()
                .success(true)
                .intent("TOTAL_PRODUCTS")
                .message("📦 Total products in system: " + count)
                .data(count)
                .suggestion("You can add new products anytime")
                .build();
    }

    public AiResponse defaultResponse(String intent) {

        return AiResponse.builder()
                .success(true)
                .intent(intent)
                .message("I understood your request as: " + intent)
                .suggestion("This feature will be enhanced soon")
                .build();
    }
}