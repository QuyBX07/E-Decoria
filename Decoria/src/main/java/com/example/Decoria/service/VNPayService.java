package com.example.Decoria.service;
import com.example.Decoria.entity.Order;
import com.example.Decoria.entity.Payment;
import com.example.Decoria.repository.OrderRepository;
import com.example.Decoria.repository.PaymentRepository;
import com.example.Decoria.util.VNPayUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VNPayService {

    @Value("${vnpay.tmn-code}")
    private String tmnCode;

    @Value("${vnpay.hash-secret}")
    private String secretKey;

    @Value("${vnpay.pay-url}")
    private String payUrl;

    @Value("${vnpay.return-url}")
    private String returnUrl;

    private final OrderRepository orderRepo;
    private final PaymentRepository paymentRepo;

    public String createPaymentUrl(long amount, String orderId, String ipAddr) {
        Map<String, String> params = new HashMap<>();

        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", tmnCode);
        params.put("vnp_Amount", String.valueOf(amount * 100));
        params.put("vnp_CurrCode", "VND");
        params.put("vnp_TxnRef", orderId);
        params.put("vnp_OrderInfo", "Thanh toán đơn hàng " + orderId);
        params.put("vnp_OrderType", "other");
        params.put("vnp_Locale", "vn");
        params.put("vnp_ReturnUrl", returnUrl);
        params.put("vnp_IpAddr", ipAddr);

        String createDate = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
        params.put("vnp_CreateDate", createDate);

        String query = VNPayUtil.buildQuery(params);
        String secureHash = VNPayUtil.hmacSHA512(secretKey, query);

        return payUrl + "?" + query + "&vnp_SecureHash=" + secureHash;
    }

    public String handleReturn(Map<String, String> fields) {

        String vnpSecureHash = fields.remove("vnp_SecureHash");
        fields.remove("vnp_SecureHashType"); // BẮT BUỘC PHẢI REMOVE

        // build lại query chuẩn
        String checkHash = VNPayUtil.hmacSHA512(secretKey, VNPayUtil.buildQuery(fields));

        if (!checkHash.equals(vnpSecureHash)) {
            return "Invalid signature";
        }

        String responseCode = fields.get("vnp_ResponseCode");
        String orderId = fields.get("vnp_TxnRef");
        String transactionNo = fields.get("vnp_TransactionNo");
        long amount = Long.parseLong(fields.get("vnp_Amount")) / 100;

        Order order = orderRepo.findById(UUID.fromString(orderId)).orElse(null);
        if (order == null) {
            return "Order not found";
        }

        Payment payment = order.getPayment();
        if (payment == null) {
            payment = new Payment();
            payment.setOrder(order);
        }

        if ("00".equals(responseCode)) {
            payment.setMethod(Payment.PaymentMethod.VNPAY);
            payment.setStatus(Payment.PaymentStatus.COMPLETED);
            payment.setTransactionId(transactionNo);
            payment.setAmount(BigDecimal.valueOf(amount));

            order.setPaymentStatus("PAID");

            paymentRepo.save(payment);
            orderRepo.save(order);

            return "Thanh toán thành công";
        }

        payment.setStatus(Payment.PaymentStatus.FAILED);
        paymentRepo.save(payment);

        return "Thanh toán thất bại, mã lỗi: " + responseCode;
    }
}
