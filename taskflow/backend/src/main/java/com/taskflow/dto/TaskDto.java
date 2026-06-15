package com.taskflow.dto;

import com.taskflow.enums.Priority;
import com.taskflow.enums.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class TaskDto {

    @Data
    public static class CreateRequest {
        @NotBlank private String title;
        private String description;
        private TaskStatus status;
        private Priority priority;
        private LocalDate dueDate;
        private Long projectId;
        private Long assigneeId;
    }

    @Data
    public static class UpdateRequest {
        private String title;
        private String description;
        private TaskStatus status;
        private Priority priority;
        private LocalDate dueDate;
        private Long assigneeId;
    }

    @Data
    public static class Response {
        private Long id;
        private String title;
        private String description;
        private TaskStatus status;
        private Priority priority;
        private LocalDate dueDate;
        private Long projectId;
        private String projectName;
        private Long assigneeId;
        private String assigneeName;
        private String assigneeColor;
        private Long createdById;
        private String createdByName;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}
