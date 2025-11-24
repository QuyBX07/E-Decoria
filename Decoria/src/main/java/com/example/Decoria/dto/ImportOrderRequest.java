package com.example.Decoria.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImportOrderRequest {

    private String supplierName;         // Tên nhà cung cấp
    private List<ImportItemDTO> items;   // Danh sách sản phẩm nhập
}
