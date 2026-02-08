package com.controller.pub;

import com.service.CouponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/coupons")
public class PublicCouponController {

    @Autowired
    private CouponService couponService;

    @GetMapping("/validate")
    public ResponseEntity<?> validateCoupon(@RequestParam String code, @RequestParam double cartValue) {
        var result = couponService.validateCoupon(code, cartValue);

        if (result.isValid()) {
            return ResponseEntity.ok(Map.of(
                    "valid", true,
                    "discountAmount", result.getDiscount(),
                    "message", result.getMessage(),
                    "code", result.getCoupon().getCode()));
        } else {
            return ResponseEntity.ok(Map.of(
                    "valid", false,
                    "discountAmount", 0,
                    "message", result.getMessage()));
        }
    }

    @GetMapping("/active")
    public ResponseEntity<java.util.List<com.entity.Coupon>> getActiveCoupons() {
        return ResponseEntity.ok(couponService.getActiveCoupons());
    }
}
