package com.biz360.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiResponse {

    private boolean success;
    private String intent;


    private String message;

    // Actual ERP data
    private Object data;


    private String suggestion;

    private List<String> suggestions;
}