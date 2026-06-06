package com.biz360.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import jakarta.validation.constraints.*;
@Data
public class UserRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @Size(min = 6, message="Password must be atleast 6 chracters")
    private String password;

    @Email(message="Invalid email format")
    private String email;

    @NotBlank(message="Role is required")
    private String role;
}
