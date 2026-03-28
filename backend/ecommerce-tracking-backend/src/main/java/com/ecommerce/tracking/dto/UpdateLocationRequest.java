package com.ecommerce.tracking.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateLocationRequest {
    @NotBlank
    private String location;
}
