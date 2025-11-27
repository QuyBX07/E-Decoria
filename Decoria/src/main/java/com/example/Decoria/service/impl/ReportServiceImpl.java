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
import java.time.LocalDateTime;
import java.time.Month;
import java.time.temporal.WeekFields;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final OrderRepository orderRepo;
    private final OrderItemRepository orderItemRepo;
    private final ImportOrderRepository importRepo;

    // ==================== REVENUE ====================

    @Override
    public List<RevenuePointDTO> getRevenueLast7Days() {
        LocalDate today = LocalDate.now();
        LocalDate start = today.minusDays(6);

        List<Object[]> raw = orderRepo.getRevenueBetweenDates(start, today);

        // Map kết quả thực tế từ DB
        Map<LocalDate, BigDecimal> revenueMap = new HashMap<>();
        for (Object[] r : raw) {
            LocalDate date = ((java.sql.Date) r[0]).toLocalDate();
            BigDecimal value = (BigDecimal) r[1];
            revenueMap.put(date, value);
        }

        // Tạo list đủ 7 ngày
        List<RevenuePointDTO> result = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            LocalDate current = start.plusDays(i);
            BigDecimal value = revenueMap.getOrDefault(current, BigDecimal.ZERO);

            result.add(new RevenuePointDTO(
                    current.getDayOfWeek().toString(),
                    value
            ));
        }

        return result;
    }




    @Override
    public List<RevenuePointDTO> getRevenueByWeeks(int month, int year) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

        List<Object[]> raw = orderRepo.getRevenueBetweenDates(start, end);

        Map<Integer, BigDecimal> weekMap = new HashMap<>();
        for (Object[] r : raw) {
            LocalDate date = ((java.sql.Date) r[0]).toLocalDate();
            int week = date.get(WeekFields.ISO.weekOfYear());
            BigDecimal value = (BigDecimal) r[1];
            weekMap.put(week, weekMap.getOrDefault(week, BigDecimal.ZERO).add(value));
        }

        // Lấy tuần đầu – tuần cuối của tháng
        int firstWeek = start.get(WeekFields.ISO.weekOfYear());
        int lastWeek = end.get(WeekFields.ISO.weekOfYear());

        List<RevenuePointDTO> result = new ArrayList<>();
        for (int week = firstWeek; week <= lastWeek; week++) {
            result.add(new RevenuePointDTO(
                    "Week " + week,
                    weekMap.getOrDefault(week, BigDecimal.ZERO)
            ));
        }

        return result;
    }



    @Override
    public List<RevenuePointDTO> getRevenueByMonths(int year) {
        List<Object[]> raw = orderRepo.getRevenueBetweenDates(
                LocalDate.of(year, 1, 1),
                LocalDate.of(year, 12, 31)
        );

        Map<Integer, BigDecimal> monthMap = new HashMap<>();
        for (Object[] r : raw) {
            LocalDate date = ((java.sql.Date) r[0]).toLocalDate();
            int month = date.getMonthValue();
            BigDecimal value = (BigDecimal) r[1];

            monthMap.put(month, monthMap.getOrDefault(month, BigDecimal.ZERO).add(value));
        }

        List<RevenuePointDTO> result = new ArrayList<>();
        for (int m = 1; m <= 12; m++) {
            result.add(new RevenuePointDTO(
                    LocalDate.of(year, m, 1).getMonth().toString(),
                    monthMap.getOrDefault(m, BigDecimal.ZERO)
            ));
        }

        return result;
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
    public List<BestSellingProductDTO> getBestSellingProducts(Integer year, Integer month, Integer quarter) {
        List<Object[]> raw = orderItemRepo.getBestSellingProducts(year, month, quarter);
        List<BestSellingProductDTO> list = new ArrayList<>();
        for (Object[] r : raw) {
            list.add(new BestSellingProductDTO(
                    r[0].toString(),
                    (String) r[1],
                    ((Number) r[2]).intValue()
            ));
        }
        return list;
    }


    // ==================== IMPORT COST & PROFIT ====================
    @Override
    public ProfitDTO getProfitBetween(LocalDate start, LocalDate end) {
        // Chuyển sang LocalDateTime
        LocalDateTime startDateTime = start.atStartOfDay();
        LocalDateTime endDateTime = end.atTime(23, 59, 59);

        BigDecimal revenue = orderRepo.getRevenueBetween(startDateTime, endDateTime);
        BigDecimal importCost = importRepo.getImportCostBetween(startDateTime, endDateTime);

        return new ProfitDTO(
                revenue,
                importCost,
                revenue.subtract(importCost)
        );
    }


    @Override
    public ProfitDTO getProfitMonthly(int month, int year) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());
        return getProfitBetween(start, end);
    }

    @Override
    public ProfitDTO getProfitQuarter(int quarter, int year) {
        int startMonth = (quarter - 1) * 3 + 1;

        LocalDate start = LocalDate.of(year, startMonth, 1);
        LocalDate end = start.plusMonths(2).withDayOfMonth(start.plusMonths(2).lengthOfMonth());

        return getProfitBetween(start, end);
    }

    @Override
    public ProfitDTO getProfitYearly(int year) {
        LocalDate start = LocalDate.of(year, 1, 1);
        LocalDate end = LocalDate.of(year, 12, 31);
        return getProfitBetween(start, end);
    }

    @Override
    public List<ProfitChartPointDTO> getProfitChartByYear(int year) {

        List<Object[]> revenueRaw = orderRepo.getRevenueByMonths(year);
        List<Object[]> importRaw = importRepo.getImportCostByMonths(year);

        Map<Integer, BigDecimal> revenueMap = new HashMap<>();
        Map<Integer, BigDecimal> importMap = new HashMap<>();

        for (Object[] r : revenueRaw) {
            revenueMap.put((Integer) r[0], (BigDecimal) r[1]);
        }

        for (Object[] r : importRaw) {
            importMap.put((Integer) r[0], (BigDecimal) r[1]);
        }

        List<ProfitChartPointDTO> result = new ArrayList<>();

        String[] monthLabel = { "", "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec" };

        for (int month = 1; month <= 12; month++) {

            BigDecimal rev = revenueMap.getOrDefault(month, BigDecimal.ZERO);
            BigDecimal imp = importMap.getOrDefault(month, BigDecimal.ZERO);

            result.add(new ProfitChartPointDTO(
                    monthLabel[month],
                    rev,
                    imp,
                    rev.subtract(imp)
            ));
        }

        return result;
    }



}
