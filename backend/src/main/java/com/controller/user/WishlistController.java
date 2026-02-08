package com.controller.user;

import com.entity.User;
import com.entity.Wishlist;
import com.repository.UserRepository;
import com.service.UserDetailsImpl;
import com.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<Wishlist> getWishlist() {
        User user = getCurrentUser();
        return ResponseEntity.ok(wishlistService.getWishlistByUser(user));
    }

    @PostMapping("/add/{productModelNo}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<Wishlist> addToWishlist(@PathVariable Long productModelNo) {
        User user = getCurrentUser();
        return ResponseEntity.ok(wishlistService.addToWishlist(user, productModelNo));
    }

    @DeleteMapping("/remove/{productModelNo}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<Wishlist> removeFromWishlist(@PathVariable Long productModelNo) {
        User user = getCurrentUser();
        return ResponseEntity.ok(wishlistService.removeFromWishlist(user, productModelNo));
    }

    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        return userRepository.findById(Objects.requireNonNull(userDetails.getId(), "User ID is required"))
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
