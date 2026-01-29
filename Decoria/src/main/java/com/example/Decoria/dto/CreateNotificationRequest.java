package com.example.Decoria.dto;

import lombok.Data;

@Data
public class CreateNotificationRequest {

    private String title;

    private String message;

    private String type; 
    // SYSTEM, ORDER, PAYMENT, VOUCHER...
}
