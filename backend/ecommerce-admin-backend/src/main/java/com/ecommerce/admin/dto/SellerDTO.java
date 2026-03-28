package com.ecommerce.admin.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data @Builder
public class SellerDTO {
    private Long id;
    private Long userId;
    private String storeName;
    private String gstNumber;
    private String bankAccount;
    private Boolean isApproved;
    private LocalDateTime createdAt;
}
