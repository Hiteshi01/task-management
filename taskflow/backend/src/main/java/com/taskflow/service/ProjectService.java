package com.taskflow.service;

import com.taskflow.dto.ProjectDto;
import com.taskflow.entity.Project;
import com.taskflow.entity.User;
import com.taskflow.enums.TaskStatus;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public List<ProjectDto.Response> getMyProjects() {
        User me = getCurrentUser();
        return projectRepository.findByOwnerIdOrderByUpdatedAtDesc(me.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ProjectDto.Response getProject(Long id) {
        Project p = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        return toResponse(p);
    }

    public ProjectDto.Response create(ProjectDto.CreateRequest req) {
        User me = getCurrentUser();
        Project p = Project.builder()
                .name(req.getName())
                .description(req.getDescription())
                .color(req.getColor())
                .emoji(req.getEmoji())
                .owner(me)
                .build();
        return toResponse(projectRepository.save(p));
    }

    public ProjectDto.Response update(Long id, ProjectDto.CreateRequest req) {
        Project p = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        if (req.getName() != null) p.setName(req.getName());
        if (req.getDescription() != null) p.setDescription(req.getDescription());
        if (req.getColor() != null) p.setColor(req.getColor());
        if (req.getEmoji() != null) p.setEmoji(req.getEmoji());
        return toResponse(projectRepository.save(p));
    }

    public void delete(Long id) {
        projectRepository.deleteById(id);
    }

    private ProjectDto.Response toResponse(Project p) {
        ProjectDto.Response r = new ProjectDto.Response();
        r.setId(p.getId());
        r.setName(p.getName());
        r.setDescription(p.getDescription());
        r.setColor(p.getColor());
        r.setEmoji(p.getEmoji());
        r.setOwnerId(p.getOwner().getId());
        r.setOwnerName(p.getOwner().getFullName());
        r.setTotalTasks(taskRepository.countByProjectId(p.getId()));
        r.setDoneTasks(taskRepository.countByProjectIdAndStatus(p.getId(), TaskStatus.DONE));
        r.setCreatedAt(p.getCreatedAt());
        r.setUpdatedAt(p.getUpdatedAt());
        return r;
    }

    User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
