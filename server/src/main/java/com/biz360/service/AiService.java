package com.biz360.service;


import com.biz360.dto.ChatRequest;
import com.biz360.dto.ChatResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class AiService {

    private final RestTemplate restTemplate;

    private static final String AI_URL =
            "http://localhost:8000/chat";

    public ChatResponse predictIntent(String message) {

        ChatRequest request =
                new ChatRequest(message);

        return restTemplate.postForObject(
                AI_URL,
                request,
                ChatResponse.class
        );
    }
}