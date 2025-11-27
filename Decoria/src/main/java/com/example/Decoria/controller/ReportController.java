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

    @GetMapping("/revenue/last-7-days")
    public List<RevenuePointDTO> getRevenueLast7Days() {
        return reportService.getRevenueLast7Days();
    }

    @GetMapping("/revenue/by-weeks")
    public List<RevenuePointDTO> getRevenueByWeeks(
            @RequestParam int month,
            @RequestParam int year
    ) {
        return reportService.getRevenueByWeeks(month, year);
    }

    @GetMapping("/revenue/by-months")
    public List<RevenuePointDTO> getRevenueByMonths(
            @RequestParam int year
    ) {
        return reportService.getRevenueByMonths(year);
    }


    // ==================== ORDER STATUS ====================

    @GetMapping("/orders/status")
    public List<OrderStatusDTO> getOrderStatusReport() {
        return reportService.getOrderStatusReport();
    }

    // ==================== BEST SELLING PRODUCTS ====================

    @GetMapping("/products/best-selling")
    public List<BestSellingProductDTO> getBestSellingProducts(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer quarter
    ) {
        return reportService.getBestSellingProducts(year, month, quarter);
    }


    // ==================== IMPORT COST & PROFIT ====================
    @GetMapping("/profit/monthly")
    public ProfitDTO getProfitMonthly(@RequestParam int month, @RequestParam int year) {
        return reportService.getProfitMonthly(month, year);
    }

    @GetMapping("/profit/yearly")
    public ProfitDTO getProfitYearly(@RequestParam int year) {
        return reportService.getProfitYearly(year);
    }

    @GetMapping("/profit/quarter")
    public ProfitDTO getProfitQuarter(@RequestParam int quarter, @RequestParam int year) {
        return reportService.getProfitQuarter(quarter, year);
    }

    @GetMapping("/profit/yearly-chart")
    public List<ProfitChartPointDTO> getProfitYearlyChart(
            @RequestParam int year
    ) {
        return reportService.getProfitChartByYear(year);
    }

}
