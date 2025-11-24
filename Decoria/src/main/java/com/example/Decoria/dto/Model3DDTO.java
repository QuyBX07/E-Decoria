package com.example.Decoria.dto;

import lombok.*;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Model3DDTO {

    private UUID id;
    private UUID productId;
    private String modelUrl;
    private String previewImage;
    private Double fileSize;
}
