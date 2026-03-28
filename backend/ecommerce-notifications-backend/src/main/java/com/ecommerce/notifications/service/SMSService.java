package com.ecommerce.notifications.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class SMSService {

    public boolean sendSMS(String phoneNumber, String message) {
        try {
            // Mocking SMS gateway execution
            log.info("================ SMS DISPATCH ===============");
            log.info("To: {}", phoneNumber);
            log.info("Message: {}", message);
            log.info("=============================================");
            return true;
        } catch (Exception e) {
            log.error("Failed to mock SMS to {}", phoneNumber, e);
            return false;
        }
    }
}
