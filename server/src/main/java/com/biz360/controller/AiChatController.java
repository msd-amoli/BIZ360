package com.biz360.controller;

import com.biz360.dto.AiResponse;
import com.biz360.service.AiOrchestratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")

public class AiChatController {

    private final AiOrchestratorService aiOrchestratorService;
    public AiChatController(AiOrchestratorService aiOrchestratorService) {
        this.aiOrchestratorService = aiOrchestratorService;
    }

    @PostMapping("/chat")
    public AiResponse chat(
            @RequestParam String message,
            @RequestHeader("userId") String userId
    ) {
        return aiOrchestratorService.process(message,userId);
    }
}