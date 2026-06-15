package com.taskflow.config;

import com.taskflow.entity.Project;
import com.taskflow.entity.Task;
import com.taskflow.entity.User;
import com.taskflow.enums.Priority;
import com.taskflow.enums.TaskStatus;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Create demo user
        User admin = User.builder()
                .username("demo")
                .email("demo@taskflow.io")
                .password(passwordEncoder.encode("demo123"))
                .fullName("Demo User")
                .avatarColor("#6366f1")
                .build();
        admin = userRepository.save(admin);

        // Create projects
        Project p1 = projectRepository.save(Project.builder()
                .name("Website Redesign").description("Complete overhaul of the marketing site")
                .color("#6366f1").emoji("🎨").owner(admin).build());

        Project p2 = projectRepository.save(Project.builder()
                .name("Mobile App").description("React Native app for iOS and Android")
                .color("#14b8a6").emoji("📱").owner(admin).build());

        Project p3 = projectRepository.save(Project.builder()
                .name("API Integration").description("Third-party service integrations")
                .color("#f59e0b").emoji("🔌").owner(admin).build());

        // Seed tasks for p1
        taskRepository.save(Task.builder().title("Wireframe new landing page").status(TaskStatus.DONE)
                .priority(Priority.HIGH).project(p1).createdBy(admin).assignee(admin)
                .dueDate(LocalDate.now().minusDays(3)).build());
        taskRepository.save(Task.builder().title("Design system components").status(TaskStatus.IN_PROGRESS)
                .priority(Priority.HIGH).project(p1).createdBy(admin).assignee(admin)
                .dueDate(LocalDate.now().plusDays(5)).build());
        taskRepository.save(Task.builder().title("Implement responsive nav").status(TaskStatus.IN_REVIEW)
                .priority(Priority.MEDIUM).project(p1).createdBy(admin)
                .dueDate(LocalDate.now().plusDays(2)).build());
        taskRepository.save(Task.builder().title("SEO meta tags audit").status(TaskStatus.TODO)
                .priority(Priority.LOW).project(p1).createdBy(admin)
                .dueDate(LocalDate.now().plusDays(10)).build());
        taskRepository.save(Task.builder().title("Performance optimization").status(TaskStatus.TODO)
                .priority(Priority.MEDIUM).project(p1).createdBy(admin).build());

        // Seed tasks for p2
        taskRepository.save(Task.builder().title("Setup project structure").status(TaskStatus.DONE)
                .priority(Priority.HIGH).project(p2).createdBy(admin).assignee(admin).build());
        taskRepository.save(Task.builder().title("Auth flow implementation").status(TaskStatus.IN_PROGRESS)
                .priority(Priority.URGENT).project(p2).createdBy(admin).assignee(admin)
                .dueDate(LocalDate.now().plusDays(1)).build());
        taskRepository.save(Task.builder().title("Push notifications setup").status(TaskStatus.TODO)
                .priority(Priority.MEDIUM).project(p2).createdBy(admin)
                .dueDate(LocalDate.now().plusDays(7)).build());

        // Seed tasks for p3
        taskRepository.save(Task.builder().title("Stripe payment integration").status(TaskStatus.IN_PROGRESS)
                .priority(Priority.URGENT).project(p3).createdBy(admin).assignee(admin)
                .dueDate(LocalDate.now().plusDays(3)).build());
        taskRepository.save(Task.builder().title("SendGrid email service").status(TaskStatus.TODO)
                .priority(Priority.HIGH).project(p3).createdBy(admin)
                .dueDate(LocalDate.now().plusDays(6)).build());
        taskRepository.save(Task.builder().title("Google OAuth setup").status(TaskStatus.DONE)
                .priority(Priority.HIGH).project(p3).createdBy(admin).assignee(admin).build());
    }
}
