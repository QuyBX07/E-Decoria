package com.example.Decoria.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // ✅ Map URL /images/** đến thư mục "images" ở root của project
        Path imageUploadDir = Paths.get("images");
        String imagePath = imageUploadDir.toFile().getAbsolutePath();

        System.out.println("📁 Serving images from: " + imagePath);

        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:" + imagePath + "/");
    }
}
