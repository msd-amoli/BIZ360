package com.biz360.service;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AiSuggestionService {

    public List<String> getSuggestions(String intent) {

        return switch (intent) {

            case "LOW_STOCK" -> List.of(
                    "Create Purchase Order",
                    "View Inventory Report",
                    "Export Low Stock List"
            );

            case "TOTAL_PRODUCTS" -> List.of(
                    "Add New Product",
                    "View Product List",
                    "Import Products"
            );

            case "CREATE_PO" -> List.of(
                    "Select Supplier",
                    "Check Stock Levels",
                    "View Pending Orders"
            );

            case "CREATE_INVOICE" -> List.of(
                    "Create Sales Order",
                    "Check Customer Details",
                    "View Pending Invoices"
            );

            default -> List.of(
                    "View Dashboard",
                    "Ask Help",
                    "Show Reports"
            );
        };
    }
}