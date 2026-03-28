package com.ecommerce.tracking.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable a simple memory-based message broker to carry the tracking updates
        // back to the client on destinations prefixed with "/topic"
        config.enableSimpleBroker("/topic");
        
        // Prefix for messages sent from client to server (if any)
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Register the STOMP endpoint the clients will connect to
        // Example connecting to: ws://localhost:8086/ws
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:5177", "http://localhost:3000") // Frontend origin
                .withSockJS(); // Fallback option for browsers that don't support WebSocket
    }
}
