package com.controller.pub;

import com.service.DeliveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/delivery")
@CrossOrigin
public class DeliveryController {

    @Autowired
    private DeliveryService deliveryService;

    @PostMapping("/check")
    public ResponseEntity<?> checkDelivery(@RequestBody Map<String, Object> request) {
        Long productId = Long.valueOf(request.get("productId").toString());
        String pincode = request.get("destinationPincode").toString();

        return ResponseEntity.ok(deliveryService.checkDelivery(productId, pincode));
    }
}
