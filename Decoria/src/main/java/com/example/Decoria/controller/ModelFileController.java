package com.example.Decoria.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.time.Instant;

@RestController
@RequestMapping("/api/models")
@CrossOrigin(origins = "*")
public class ModelFileController {

    private static final String MODEL_DIR = "models/";

    @PostMapping("/upload")
    public ResponseEntity<String> uploadModel(@RequestParam("file") MultipartFile file) {
        try {
            // Tạo thư mục nếu chưa có
            File dir = new File(MODEL_DIR);
            if (!dir.exists()) dir.mkdirs();

            // Đặt tên file duy nhất
            String filename = Instant.now().toEpochMilli() + "_" + file.getOriginalFilename();
            Path path = Paths.get(MODEL_DIR + filename);

            // Lưu file
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

            // URL trả về
            String fileUrl = "http://localhost:8081/models/" + filename;

            return ResponseEntity.ok(fileUrl);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Upload model failed");
        }
    }
}
