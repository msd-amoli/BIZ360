package com.biz360.exception;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    //Handle Validation Errors here
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String,Object>>handleValidationExceptions(MethodArgumentNotValidException ex){
        Map<String,Object> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error->
              errors.put(error.getField(),error.getDefaultMessage())
                );
        Map<String,Object>response = new HashMap<>();
        response.put("message","Validation Failed");
        response.put("errors",errors);
        return ResponseEntity.badRequest().body(response);
    }

    //Handle Generic Errors
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String,Object>>handleRuntimeException(RuntimeException ex){
        Map<String,Object> response = new HashMap<>();
        response.put("message",ex.getMessage());
        return ResponseEntity.badRequest().body(response);
    }

}
