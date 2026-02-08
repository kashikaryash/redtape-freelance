package com.payload.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignupRequest {
    @NotBlank
    @Size(max = 15)
    private String name;

    @NotBlank
    @Size(max = 25)
    @Email
    private String email;

    @NotBlank
    @Size(min = 6, max = 255)
    private String password;

    // Optional fields based on User entity
    private String gender;
    private String mobile;
}
