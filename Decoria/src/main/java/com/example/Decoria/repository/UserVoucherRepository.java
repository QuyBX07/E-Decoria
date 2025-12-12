package com.example.Decoria.repository;

import com.example.Decoria.entity.UserVoucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserVoucherRepository extends JpaRepository<UserVoucher, UUID> {

    // Kiểm tra user đã claim voucher chưa
    boolean existsByUserIdAndVoucherId(UUID userId, UUID voucherId);

    // Lấy list voucher user đang sở hữu
    List<UserVoucher> findByUserId(UUID userId);

    Optional<UserVoucher> findByUserIdAndVoucherId(UUID userId, UUID voucherId);
}
