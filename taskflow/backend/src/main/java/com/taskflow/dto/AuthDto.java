package com.taskflow.dto;

import com.taskflow.enums.Priority;
import com.taskflow.enums.TaskStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

// ===== AUTH =====
public class AuthDto {

    @Data
    public static class RegisterRequest {
        @NotBlank @Size(min = 3, max = 30)
        private String username;
        @Email @NotBlank
        private String email;
        @NotBlank @Size(min = 6)
        private String password;
        private String fullName;
    }

    @Data
    public static class LoginRequest {
        @NotBlank private String username;
        @NotBlank private String password;
    }

    @Data
    public static class AuthResponse {
        private String token;
        private Long id;
        private String username;
        private String email;
        private String fullName;
        private String avatarColor;
    }
}

// ===== PROJECT =====
class ProjectDto {

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

// ===== TASK =====
class TaskDto {

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
