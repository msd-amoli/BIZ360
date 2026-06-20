package com.biz360.service;

import com.biz360.dto.AiResponse;
import com.biz360.dto.ChatResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AiOrchestratorService {

    private final AiService aiService;
    private final InventoryService inventoryService;
    private final ProductService productService;
    private final PurchaseService purchaseService;
    private final InvoiceService invoiceService;

    public AiResponse process(String message) {

        ChatResponse prediction =
                aiService.predictIntent(message);

        String intent = prediction.getIntent();

        switch (intent) {

            case "LOW_STOCK" -> {

                var lowStock =
                        inventoryService.getLowStockItems();

                return AiResponse.builder()
                        .success(true)
                        .message(
                                "Found "
                                        + lowStock.size()
                                        + " low stock products"
                        )
                        .data(lowStock)
                        .build();
            }

            case "TOTAL_PRODUCTS" -> {

                int totalProducts =
                        productService.getAllProducts().size();

                return AiResponse.builder()
                        .success(true)
                        .message(
                                "There are "
                                        + totalProducts
                                        + " products in the system"
                        )
                        .data(totalProducts)
                        .build();
            }

            default -> {

                return AiResponse.builder()
                        .success(true)
                        .message(
                                "I understood your request as "
                                        + intent
                        )
                        .build();
            }
        }
    }
}