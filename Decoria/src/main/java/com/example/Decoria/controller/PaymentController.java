package com.example.Decoria.controller;

import com.example.Decoria.service.VNPayService;
import com.example.Decoria.util.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final VNPayService vnPayService;

    @GetMapping("/vnpay")
    public ResponseEntity<?> pay(@RequestParam long amount,
                                 @RequestParam String orderId,
                                 HttpServletRequest request) {

        String ipAddress = request.getRemoteAddr();
        String url = vnPayService.createPaymentUrl(amount, orderId, ipAddress);

        Map<String, Object> response = new HashMap<>();
        response.put("payment_url", url);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/vnpay-return")
    public void vnpayReturn(HttpServletRequest request, HttpServletResponse response) throws IOException {

        Map<String, String[]> params = request.getParameterMap();
        Map<String, String> fields = new HashMap<>();

        params.forEach((k, v) -> fields.put(k, v[0]));

        // Xử lý verify hash + cập nhật đơn hàng
        vnPayService.handleReturn(fields);

        // Lấy orderId ( mã đơn hàng ) — tuỳ m dùng TxnRef hay OrderInfo
        String orderId = fields.get("vnp_TxnRef");

        // Redirect sang frontend
        String redirectUrl = "http://localhost:5173/order-success/" + orderId;

        response.sendRedirect(redirectUrl);
    }

}


