package com.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(Objects.requireNonNull(to, "Email recipient is required"));
            helper.setSubject(Objects.requireNonNull(subject, "Email subject is required"));
            helper.setText(Objects.requireNonNull(body, "Email body is required"), true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }

    private String getHeader() {
        return "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;'>"
                +
                "<div style='text-align: center; padding-bottom: 20px; border-bottom: 2px solid #e63946;'>" +
                "<h1 style='color: #e63946; margin: 0;'>SOLECRAFT</h1>" +
                "<p style='color: #555; font-size: 14px; margin: 5px 0 0;'>Premium Footwear for the Modern Soul</p>" +
                "</div>" +
                "<div style='padding: 30px 20px; background-color: #ffffff;'>";
    }

    private String getFooter() {
        return "</div>" +
                "<div style='text-align: center; padding-top: 20px; border-top: 1px solid #e0e0e0; margin-top: 20px;'>"
                +
                "<p style='color: #888; font-size: 12px; margin: 0;'>&copy; 2024 SoleCraft. All rights reserved.</p>" +
                "<p style='color: #888; font-size: 12px; margin: 5px 0 0;'>Need help? Contact us at support@solecraft.com</p>"
                +
                "</div>" +
                "</div>";
    }

    public void sendOtpEmail(String to, String otp) {
        String subject = "Your Verification Code - SoleCraft";
        String body = getHeader() +
                "<h2 style='color: #333; text-align: center;'>Verify Your Account</h2>" +
                "<p style='color: #555; font-size: 16px; line-height: 1.5;'>Hello,</p>" +
                "<p style='color: #555; font-size: 16px; line-height: 1.5;'>Use the following One-Time Password (OTP) to complete your verification/password reset. This code is valid for 5 minutes.</p>"
                +
                "<div style='text-align: center; margin: 30px 0;'>" +
                "<span style='display: inline-block; padding: 15px 30px; font-size: 24px; font-weight: bold; color: #ffffff; background-color: #e63946; border-radius: 5px; letter-spacing: 5px;'>"
                + otp + "</span>" +
                "</div>" +
                "<p style='color: #555; font-size: 14px; text-align: center;'>If you didn't request this, please ignore this email.</p>"
                +
                getFooter();
        sendEmail(to, subject, body);
    }

    public void sendWelcomeEmail(String to, String name) {
        String subject = "Welcome to SoleCraft!";
        String body = getHeader() +
                "<h2 style='color: #333; text-align: center;'>Welcome to the Family, " + name + "!</h2>" +
                "<p style='color: #555; font-size: 16px; line-height: 1.5;'>We are thrilled to have you on board. At SoleCraft, we believe in stepping forward with style and comfort.</p>"
                +
                "<p style='color: #555; font-size: 16px; line-height: 1.5;'>Explore our latest collection and find the perfect pair that speaks to you.</p>"
                +
                "<div style='text-align: center; margin: 30px 0;'>" +
                "<a href='http://localhost:5173/' style='display: inline-block; padding: 15px 30px; font-size: 16px; font-weight: bold; color: #ffffff; background-color: #e63946; text-decoration: none; border-radius: 5px;'>Start Shopping</a>"
                +
                "</div>" +
                getFooter();
        sendEmail(to, subject, body);
    }

    public void sendOrderConfirmation(String to, String orderId) {
        String subject = "Order Confirmed! #" + orderId;
        String body = getHeader() +
                "<h2 style='color: #333; text-align: center;'>Order Confirmed</h2>" +
                "<p style='color: #555; font-size: 16px; line-height: 1.5;'>Thank you for your purchase! We have received your order <b>#"
                + orderId + "</b> and are getting it ready for shipment.</p>" +
                "<p style='color: #555; font-size: 16px; line-height: 1.5;'>You will receive another email once your order has been shipped.</p>"
                +
                "<div style='text-align: center; margin: 30px 0;'>" +
                "<a href='http://localhost:5173/orders' style='display: inline-block; padding: 15px 30px; font-size: 16px; font-weight: bold; color: #ffffff; background-color: #e63946; text-decoration: none; border-radius: 5px;'>View My Order</a>"
                +
                "</div>" +
                getFooter();
        sendEmail(to, subject, body);
    }

    public void sendOrderStatusUpdate(String to, String orderId, String status, String customerName) {
        String statusEmoji = getStatusEmoji(status);
        String statusColor = getStatusColor(status);
        String statusMessage = getStatusMessage(status, orderId);

        String subject = statusEmoji + " Order #" + orderId + " - " + formatStatus(status);
        String body = getHeader() +
                "<h2 style='color: #333; text-align: center;'>" + statusEmoji + " Order Status Update</h2>" +
                "<p style='color: #555; font-size: 16px; line-height: 1.5;'>Hi " + customerName + ",</p>" +
                "<p style='color: #555; font-size: 16px; line-height: 1.5;'>Your order <b>#" + orderId
                + "</b> has been updated.</p>" +
                "<div style='text-align: center; margin: 30px 0;'>" +
                "<div style='display: inline-block; padding: 20px 40px; background-color: " + statusColor
                + "; border-radius: 10px;'>" +
                "<p style='margin: 0; font-size: 14px; color: #ffffff; opacity: 0.9;'>Current Status</p>" +
                "<p style='margin: 5px 0 0; font-size: 24px; font-weight: bold; color: #ffffff;'>"
                + formatStatus(status) + "</p>" +
                "</div>" +
                "</div>" +
                "<p style='color: #555; font-size: 16px; line-height: 1.5; text-align: center;'>" + statusMessage
                + "</p>" +
                "<div style='text-align: center; margin: 30px 0;'>" +
                "<a href='http://localhost:5173/my-orders' style='display: inline-block; padding: 15px 30px; font-size: 16px; font-weight: bold; color: #ffffff; background-color: #e63946; text-decoration: none; border-radius: 5px;'>Track Your Order</a>"
                +
                "</div>" +
                getFooter();
        sendEmail(to, subject, body);
    }

    private String getStatusEmoji(String status) {
        return switch (status.toUpperCase()) {
            case "SHIPPED" -> "📦";
            case "DELIVERED" -> "✅";
            case "CANCELLED" -> "❌";
            case "PROCESSING" -> "⚙️";
            default -> "📋";
        };
    }

    private String getStatusColor(String status) {
        return switch (status.toUpperCase()) {
            case "SHIPPED" -> "#8b5cf6";
            case "DELIVERED" -> "#10b981";
            case "CANCELLED" -> "#ef4444";
            case "PROCESSING" -> "#3b82f6";
            default -> "#f59e0b";
        };
    }

    private String getStatusMessage(String status, String orderId) {
        return switch (status.toUpperCase()) {
            case "SHIPPED" -> "Great news! Your order is on its way. You'll receive it soon!";
            case "DELIVERED" -> "Your order has been delivered. We hope you love your new shoes! 🎉";
            case "CANCELLED" -> "Your order has been cancelled. If you have any questions, please contact support.";
            case "PROCESSING" -> "We're preparing your order and it will be shipped soon.";
            default -> "Your order status has been updated. Check the details below.";
        };
    }

    private String formatStatus(String status) {
        if (status == null)
            return "";
        return status.substring(0, 1).toUpperCase() + status.substring(1).toLowerCase();
    }
}
