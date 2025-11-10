package com.example.Decoria.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.time.Instant;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ImageController {

    private static final String IMAGE_DIR = "images/";

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            // Tạo thư mục images nếu chưa có
            File dir = new File(IMAGE_DIR);
            if (!dir.exists()) dir.mkdirs();

            // Đặt tên file duy nhất
            String filename = Instant.now().toEpochMilli() + "_" + file.getOriginalFilename();
            Path path = Paths.get(IMAGE_DIR + filename);

            // Lưu file
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

            // Trả URL để frontend lưu vào DB
            String imageUrl = "http://localhost:8081/images/" + filename;
            return ResponseEntity.ok(imageUrl);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Upload failed");
        }
    }
}
