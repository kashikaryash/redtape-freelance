package com.service;

import com.payload.response.ChartData;
import com.payload.response.DashboardResponse;
import com.repository.OrderRepository;
import com.repository.ProductRepository;
import com.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public DashboardResponse getDashboardStats() {
        DashboardResponse stats = new DashboardResponse();

        // 1. Basic Counts
        stats.setTotalOrders(orderRepository.count());
        stats.setTotalUsers(userRepository.count());
        stats.setTotalProducts(productRepository.count());

        Double revenue = orderRepository.getTotalRevenue();
        stats.setTotalRevenue(revenue != null ? revenue : 0.0);

        // Segmented Counts
        try {
            stats.setAdminCount(userRepository.countByRole(com.entity.Role.ADMIN));
            stats.setModeratorCount(userRepository.countByRole(com.entity.Role.MODERATOR));
            stats.setUserCount(userRepository.countByRole(com.entity.Role.USER));

            stats.setMenProducts(productRepository.countByCategory(com.entity.Category.MEN));
            stats.setWomenProducts(productRepository.countByCategory(com.entity.Category.WOMEN));
            stats.setKidsProducts(productRepository.countByCategory(com.entity.Category.KIDS));
        } catch (Exception e) {
            // Fallback if enums differ or error
            System.err.println("Error fetching segmented stats: " + e.getMessage());
        }

        // 2. Status Distribution
        List<Object[]> statusData = orderRepository.getStatusDistribution();
        List<ChartData> statusChart = statusData.stream()
                .map(obj -> new ChartData(obj[0].toString(), ((Number) obj[1]).doubleValue()))
                .collect(Collectors.toList());
        stats.setOrderStatusDistribution(statusChart);

        // 3. Revenue Trend
        List<Object[]> trendData = orderRepository.getRevenueTrend();
        List<ChartData> trendChart = trendData.stream()
                .map(obj -> new ChartData((String) obj[0], ((Number) obj[1]).doubleValue()))
                .collect(Collectors.toList());
        stats.setRevenueTrend(trendChart);

        return stats;
    }
}
