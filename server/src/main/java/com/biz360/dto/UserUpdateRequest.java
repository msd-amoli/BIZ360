package com.biz360.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class UserUpdateRequest {
    @NotBlank(message="Name is required")
    private String name;

    @Email(message="Invalid email format")
    @NotBlank(message="email required")
    private String email;

    @NotBlank(message = "role is required")
    private String role;


}
