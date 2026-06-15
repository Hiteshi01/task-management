package com.taskflow.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(unique = true)
    private String username;

    @Email
    @NotBlank
    @Column(unique = true)
    private String email;

    @NotBlank
    private String password;

    private String fullName;
    private String avatarColor;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Project> ownedProjects;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        if (avatarColor == null) {
            String[] colors = {"#6366f1","#8b5cf6","#ec4899","#14b8a6","#f59e0b","#ef4444"};
            avatarColor = colors[(int)(Math.random() * colors.length)];
        }
    }
}
