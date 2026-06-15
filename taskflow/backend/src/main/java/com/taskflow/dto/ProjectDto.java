package com.taskflow.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;

public class ProjectDto {

    @Data
    public static class CreateRequest {
        @NotBlank private String name;
        private String description;
        private String color;
        private String emoji;
    }

    @Data
    public static class Response {
        private Long id;
        private String name;
        private String description;
        private String color;
        private String emoji;
        private Long ownerId;
        private String ownerName;
        private long totalTasks;
        private long doneTasks;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}
