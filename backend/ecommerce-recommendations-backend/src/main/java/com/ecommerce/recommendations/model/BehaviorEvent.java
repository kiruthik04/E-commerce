package com.ecommerce.recommendations.model;

import lombok.Getter;

@Getter
public enum BehaviorEvent {
    VIEW(1),
    WISHLIST(2),
    CART_ADD(3),
    PURCHASE(5);

    private final int weight;

    BehaviorEvent(int weight) {
        this.weight = weight;
    }
}
