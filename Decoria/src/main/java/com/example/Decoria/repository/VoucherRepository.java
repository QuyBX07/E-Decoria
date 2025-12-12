package com.example.Decoria.repository;

import com.example.Decoria.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, UUID> {

    Optional<Voucher> findByCode(String code);

    @Query("SELECT v FROM Voucher v WHERE v.status = 'ACTIVE' AND CURRENT_TIMESTAMP BETWEEN v.startDate AND v.endDate")
    List<Voucher> findAllActiveVouchers();
}