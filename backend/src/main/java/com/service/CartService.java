package com.service;

import com.entity.*;
import com.mapper.CartMapper;
import com.payload.request.CartItemRequest;
import com.payload.response.CartResponseDTO;
import com.repository.CartRepository;
import com.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private com.repository.CartItemRepository cartItemRepository;

    @Transactional
    public CartResponseDTO getCartResponseByUser(User user) {
        Cart cart = getCartByUser(user);
        return CartMapper.toDTO(cart);
    }

    @Transactional
    public Cart getCartByUser(User user) {
        // Warning: Native query cleanup might fail, so we also do in-memory cleanup
        try {
            cartItemRepository.deleteOrphanedItems();
        } catch (Exception e) {
            // Ignore
        }

        Cart cart = cartRepository.findByUser(user).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUser(user);
            newCart.setTotalAmount(0.0);
            return cartRepository.save(newCart);
        });

        // Robust cleanup: Iterate and validate items
        if (cart.getItems() != null) {
            java.util.Iterator<CartItem> iterator = cart.getItems().iterator();
            while (iterator.hasNext()) {
                CartItem item = iterator.next();
                try {
                    // Force load product
                    if (item.getProduct() != null) {
                        Product p = item.getProduct();
                        Double activePrice = (p.getSalePrice() != null && p.getSaleEndTime() != null
                                && p.getSaleEndTime().isAfter(java.time.LocalDateTime.now()))
                                        ? p.getSalePrice()
                                        : p.getPrice();
                        item.setPrice(activePrice);
                    } else {
                        iterator.remove(); // Remove null product items
                    }
                } catch (jakarta.persistence.EntityNotFoundException | org.hibernate.ObjectNotFoundException e) {
                    iterator.remove();
                } catch (Exception e) {
                    iterator.remove();
                }
            }
            // Save changes if items were removed or prices updated
            updateTotalAmount(cart);
            cart = cartRepository.save(cart);
        }
        return cart;
    }

    @Transactional
    public CartResponseDTO addItemToCart(User user, CartItemRequest request) {

        // Use internal helper to get entity
        Cart cart = getCartByUser(user);

        Long modelNo = Long.parseLong(Objects.requireNonNull(request.getProductModelNo()));
        Product product = productRepository.findById(modelNo)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getModelNo() == product.getModelNo())
                .findFirst();

        Double activePrice = (product.getSalePrice() != null && product.getSaleEndTime() != null
                && product.getSaleEndTime().isAfter(java.time.LocalDateTime.now()))
                        ? product.getSalePrice()
                        : product.getPrice();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            item.setPrice(activePrice);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(request.getQuantity());
            newItem.setPrice(activePrice);
            cart.getItems().add(newItem);
        }

        updateTotalAmount(cart);
        return CartMapper.toDTO(cartRepository.save(cart));
    }

    @Transactional
    public CartResponseDTO updateItemQuantity(User user, String productModelNo, int quantity) {
        Cart cart = getCartByUser(user);
        Long modelNo = Long.parseLong(productModelNo);

        cart.getItems().stream()
                .filter(item -> item.getProduct().getModelNo() == modelNo)
                .findFirst()
                .ifPresent(item -> {
                    if (quantity > 0) {
                        item.setQuantity(quantity);
                    } else {
                        cart.getItems().remove(item);
                    }
                });

        updateTotalAmount(cart);
        return CartMapper.toDTO(cartRepository.save(cart));
    }

    @Transactional
    public CartResponseDTO removeItemFromCart(User user, String productModelNo) {
        Cart cart = getCartByUser(user);
        Long modelNo = Long.parseLong(productModelNo);

        cart.getItems().removeIf(item -> item.getProduct().getModelNo() == modelNo);

        updateTotalAmount(cart);
        return CartMapper.toDTO(cartRepository.save(cart));
    }

    @Transactional
    public CartResponseDTO clearCart(User user) {
        Cart cart = getCartByUser(user);
        cart.getItems().clear();

        updateTotalAmount(cart);
        return CartMapper.toDTO(cartRepository.save(cart));
    }

    private void updateTotalAmount(Cart cart) {
        double total = cart.getItems().stream()
                .mapToDouble(i -> i.getPrice() * i.getQuantity())
                .sum();
        cart.setTotalAmount(total);
    }
}
