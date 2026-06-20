package com.biz360.controller;


import com.biz360.dto.ChatResponse;
import com.biz360.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @PostMapping("/test")
    public ChatResponse test(
            @RequestParam String message
    ) {
        return aiService.predictIntent(message);
    }
}