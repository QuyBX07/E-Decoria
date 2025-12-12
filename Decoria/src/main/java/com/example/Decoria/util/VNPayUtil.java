package com.example.Decoria.util;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.util.*;

public class VNPayUtil {

    public static String hmacSHA512(final String key, final String data) {
        try {
            Mac hmac = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes("UTF-8"), "HmacSHA512");
            hmac.init(secretKey);
            byte[] bytes = hmac.doFinal(data.getBytes("UTF-8"));
            StringBuilder hash = new StringBuilder();
            for (byte b : bytes) {
                hash.append(String.format("%02x", b));
            }
            return hash.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error while hashing", e);
        }
    }

    // build query chuẩn VNPAY (encode UTF8 + sort + bỏ null + không crash)
    public static String buildQuery(Map<String, String> params) {
        try {
            List<String> fieldNames = new ArrayList<>(params.keySet());
            Collections.sort(fieldNames);

            StringBuilder sb = new StringBuilder();
            for (String key : fieldNames) {
                if (params.get(key) != null && params.get(key).length() > 0) {
                    sb.append(URLEncoder.encode(key, "UTF-8"));
                    sb.append("=");
                    sb.append(URLEncoder.encode(params.get(key), "UTF-8"));
                    sb.append("&");
                }
            }
            // bỏ dấu & cuối
            if (sb.length() > 0) {
                sb.deleteCharAt(sb.length() - 1);
            }
            return sb.toString();

        } catch (Exception e) {
            throw new RuntimeException("Error building query", e);
        }
    }
}

