package com.biz360.service;

import com.biz360.dto.AiResponse;
import com.biz360.memory.ChatSessionMemory;
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

    private final AiResponseFormatter formatter;
    private final ChatSessionMemory memory;
    private final AiSuggestionService suggestionService;

    public AiResponse process(String message, String userId) {

        var prediction = aiService.predictIntent(message);
        String intent = prediction.getIntent();

        String lastIntent = memory.getLastIntent(userId);

        memory.saveLastIntent(userId, intent);

        switch (intent) {

            case "LOW_STOCK" -> {

                var data = inventoryService.getLowStockItems();

                return AiResponse.builder()
                        .success(true)
                        .intent("LOW_STOCK")
                        .message(
                                data.isEmpty()
                                        ? "🎉 No low stock items found"
                                        : "⚠️ Found " + data.size() + " low stock items"
                        )
                        .data(data)
                        .suggestions(suggestionService.getSuggestions("LOW_STOCK"))
                        .build();
            }

            case "TOTAL_PRODUCTS" -> {

                int count = productService.getAllProducts().size();

                return AiResponse.builder()
                        .success(true)
                        .intent("TOTAL_PRODUCTS")
                        .message("📦 Total products: " + count)
                        .data(count)
                        .suggestions(suggestionService.getSuggestions("TOTAL_PRODUCTS"))
                        .build();
            }
            case "CREATE_PO" -> {

                String latIntent = memory.getLastIntent(userId);

                if ("LOW_STOCK".equals(lastIntent)) {

                    return AiResponse.builder()
                            .success(true)
                            .intent("CREATE_PO")
                            .message("Do you want to create purchase orders for low stock items?")
                            .suggestions(suggestionService.getSuggestions("CREATE_PO"))
                            .build();
                }

                return AiResponse.builder()
                        .success(true)
                        .intent("CREATE_PO")
                        .message("Please provide supplier details to create purchase order")
                        .suggestions(suggestionService.getSuggestions("CREATE_PO"))
                        .build();
            }

            default -> {
                return formatter.defaultResponse(intent);
            }
        }
    }
}