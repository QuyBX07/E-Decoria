package com.example.Decoria.service.impl;

import com.example.Decoria.dto.*;
import com.example.Decoria.repository.ImportOrderRepository;
import com.example.Decoria.repository.OrderItemRepository;
import com.example.Decoria.repository.OrderRepository;
import com.example.Decoria.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final OrderRepository orderRepo;
    private final OrderItemRepository orderItemRepo;
    private final ImportOrderRepository importRepo;

    // ==================== REVENUE ====================

    @Override
    public RevenueDTO getDailyRevenue(LocalDate date) {
        BigDecimal revenue = orderRepo.getDailyRevenue(date);
        return new RevenueDTO(revenue != null ? revenue : BigDecimal.ZERO);
    }

    @Override
    public RevenueDTO getMonthlyRevenue(int month, int year) {
        BigDecimal revenue = orderRepo.getMonthlyRevenue(month, year);
        return new RevenueDTO(revenue != null ? revenue : BigDecimal.ZERO);
    }

    @Override
    public RevenueDTO getYearlyRevenue(int year) {
        BigDecimal revenue = orderRepo.getYearlyRevenue(year);
        return new RevenueDTO(revenue != null ? revenue : BigDecimal.ZERO);
    }

    @Override
    public RevenueDTO getTotalRevenue() {
        BigDecimal revenue = orderRepo.getTotalRevenue();
        return new RevenueDTO(revenue != null ? revenue : BigDecimal.ZERO);
    }

    // ==================== ORDER STATUS ====================

    @Override
    public List<OrderStatusDTO> getOrderStatusReport() {
        List<Object[]> raw = orderRepo.getOrderCountByStatus();
        List<OrderStatusDTO> list = new ArrayList<>();
        for (Object[] r : raw) {
            String status = r[0].toString();
            Long count = ((Number) r[1]).longValue();
            list.add(new OrderStatusDTO(status, count));
        }
        return list;
    }

    // ==================== BEST SELLING PRODUCTS ====================

    @Override
    public List<BestSellingProductDTO> getBestSellingProducts() {
        List<Object[]> raw = orderItemRepo.getBestSellingProducts();
        List<BestSellingProductDTO> list = new ArrayList<>();
        for (Object[] r : raw) {
            list.add(new BestSellingProductDTO(
                    r[0].toString(),          // productId
                    (String) r[1],            // name
                    ((Number) r[2]).intValue() // totalSold
            ));
        }
        return list;
    }

    // ==================== IMPORT COST & PROFIT ====================

    @Override
    public RevenueDTO getTotalImportCost() {
        BigDecimal importCost = importRepo.getTotalImportCost();
        return new RevenueDTO(importCost != null ? importCost : BigDecimal.ZERO);
    }

    @Override
    public ProfitDTO getProfit() {
        BigDecimal revenue = orderRepo.getTotalRevenue();
        BigDecimal importCost = importRepo.getTotalImportCost();
        BigDecimal profit = (revenue != null ? revenue : BigDecimal.ZERO)
                .subtract(importCost != null ? importCost : BigDecimal.ZERO);
        return new ProfitDTO(
                revenue != null ? revenue : BigDecimal.ZERO,
                importCost != null ? importCost : BigDecimal.ZERO,
                profit
        );
    }
}
