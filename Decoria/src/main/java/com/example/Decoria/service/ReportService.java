package com.example.Decoria.service;

import com.example.Decoria.dto.*;

import java.time.LocalDate;
import java.util.List;

public interface ReportService {

    // ==================== REVENUE ====================
    RevenueDTO getDailyRevenue(LocalDate date);

    RevenueDTO getMonthlyRevenue(int month, int year);

    RevenueDTO getYearlyRevenue(int year);

    RevenueDTO getTotalRevenue();

    // ==================== ORDER STATUS ====================
    List<OrderStatusDTO> getOrderStatusReport();

    // ==================== BEST SELLING PRODUCTS ====================
    List<BestSellingProductDTO> getBestSellingProducts();

    // ==================== IMPORT COST & PROFIT ====================
    RevenueDTO getTotalImportCost();

    ProfitDTO getProfit();
}
