package com.example.Decoria.service;

import com.example.Decoria.dto.*;

import java.time.LocalDate;
import java.util.List;

public interface ReportService {

    // ==================== REVENUE ====================
    List<RevenuePointDTO> getRevenueLast7Days();

    List<RevenuePointDTO> getRevenueByWeeks(int month, int year);

    List<RevenuePointDTO> getRevenueByMonths(int year);


    // ==================== ORDER STATUS ====================
    List<OrderStatusDTO> getOrderStatusReport();

    // ==================== BEST SELLING PRODUCTS ====================
    List<BestSellingProductDTO> getBestSellingProducts(Integer year, Integer month, Integer quarter);

    // ==================== Profit ====================
    ProfitDTO getProfitBetween(LocalDate start, LocalDate end);

    ProfitDTO getProfitMonthly(int month, int year);

    ProfitDTO getProfitQuarter(int quarter, int year);

    ProfitDTO getProfitYearly(int year);

    List<ProfitChartPointDTO> getProfitChartByYear(int year);
}
