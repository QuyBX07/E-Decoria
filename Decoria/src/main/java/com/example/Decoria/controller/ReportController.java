package com.example.Decoria.controller;

import com.example.Decoria.dto.*;
import com.example.Decoria.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ReportController {

    private final ReportService reportService;

    // ==================== REVENUE ====================

    @GetMapping("/revenue/daily")
    public RevenueDTO getDailyRevenue(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return reportService.getDailyRevenue(date);
    }

    @GetMapping("/revenue/monthly")
    public RevenueDTO getMonthlyRevenue(@RequestParam int month, @RequestParam int year) {
        return reportService.getMonthlyRevenue(month, year);
    }

    @GetMapping("/revenue/yearly")
    public RevenueDTO getYearlyRevenue(@RequestParam int year) {
        return reportService.getYearlyRevenue(year);
    }

    @GetMapping("/revenue/total")
    public RevenueDTO getTotalRevenue() {
        return reportService.getTotalRevenue();
    }

    // ==================== ORDER STATUS ====================

    @GetMapping("/orders/status")
    public List<OrderStatusDTO> getOrderStatusReport() {
        return reportService.getOrderStatusReport();
    }

    // ==================== BEST SELLING PRODUCTS ====================

    @GetMapping("/products/best-selling")
    public List<BestSellingProductDTO> getBestSellingProducts() {
        return reportService.getBestSellingProducts();
    }

    // ==================== IMPORT COST & PROFIT ====================

    @GetMapping("/imports/total-cost")
    public RevenueDTO getTotalImportCost() {
        return reportService.getTotalImportCost();
    }

    @GetMapping("/profit")
    public ProfitDTO getProfit() {
        return reportService.getProfit();
    }
}
