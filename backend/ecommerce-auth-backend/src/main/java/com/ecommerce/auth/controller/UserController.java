package com.ecommerce.auth.controller;

import com.ecommerce.auth.dto.UserProfileDTO;
import com.ecommerce.auth.service.UserDetailsImpl;
import com.ecommerce.auth.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserProfileDTO> getCurrentUser(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(userService.getUserProfile(userDetails.getUsername()));
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileDTO> updateCurrentUser(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                          @RequestBody UserProfileDTO updateDto) {
        return ResponseEntity.ok(userService.updateUserProfile(userDetails.getUsername(), updateDto));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserProfileDTO> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserProfileById(id));
    }
}
