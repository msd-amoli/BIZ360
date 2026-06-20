package com.biz360.memory;

import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class ChatSessionMemory {

    private final Map<String, String> lastIntentByUser = new HashMap<>();

    public void saveLastIntent(String userId, String intent) {
        lastIntentByUser.put(userId, intent);
    }

    public String getLastIntent(String userId) {
        return lastIntentByUser.getOrDefault(userId, "NONE");
    }
}