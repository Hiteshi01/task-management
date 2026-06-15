package com.taskflow.service;

import com.taskflow.dto.TaskDto;
import com.taskflow.entity.Task;
import com.taskflow.entity.User;
import com.taskflow.enums.TaskStatus;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectService projectService;

    public List<TaskDto.Response> getByProject(Long projectId) {
        return taskRepository.findByProjectIdOrderByCreatedAtDesc(projectId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<TaskDto.Response> getMyTasks() {
        User me = projectService.getCurrentUser();
        return taskRepository.findByAssigneeIdOrderByCreatedAtDesc(me.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public TaskDto.Response getTask(Long id) {
        return toResponse(taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found")));
    }

    public TaskDto.Response create(TaskDto.CreateRequest req) {
        User me = projectService.getCurrentUser();
        Task t = Task.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .status(req.getStatus() != null ? req.getStatus() : TaskStatus.TODO)
                .priority(req.getPriority())
                .dueDate(req.getDueDate())
                .project(projectRepository.findById(req.getProjectId())
                        .orElseThrow(() -> new RuntimeException("Project not found")))
                .createdBy(me)
                .assignee(req.getAssigneeId() != null
                        ? userRepository.findById(req.getAssigneeId()).orElse(null) : null)
                .build();
        return toResponse(taskRepository.save(t));
    }

    public TaskDto.Response update(Long id, TaskDto.UpdateRequest req) {
        Task t = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        if (req.getTitle() != null) t.setTitle(req.getTitle());
        if (req.getDescription() != null) t.setDescription(req.getDescription());
        if (req.getStatus() != null) t.setStatus(req.getStatus());
        if (req.getPriority() != null) t.setPriority(req.getPriority());
        if (req.getDueDate() != null) t.setDueDate(req.getDueDate());
        if (req.getAssigneeId() != null)
            t.setAssignee(userRepository.findById(req.getAssigneeId()).orElse(null));
        return toResponse(taskRepository.save(t));
    }

    public void delete(Long id) {
        taskRepository.deleteById(id);
    }

    private TaskDto.Response toResponse(Task t) {
        TaskDto.Response r = new TaskDto.Response();
        r.setId(t.getId());
        r.setTitle(t.getTitle());
        r.setDescription(t.getDescription());
        r.setStatus(t.getStatus());
        r.setPriority(t.getPriority());
        r.setDueDate(t.getDueDate());
        r.setProjectId(t.getProject().getId());
        r.setProjectName(t.getProject().getName());
        if (t.getAssignee() != null) {
            r.setAssigneeId(t.getAssignee().getId());
            r.setAssigneeName(t.getAssignee().getFullName());
            r.setAssigneeColor(t.getAssignee().getAvatarColor());
        }
        r.setCreatedById(t.getCreatedBy().getId());
        r.setCreatedByName(t.getCreatedBy().getFullName());
        r.setCreatedAt(t.getCreatedAt());
        r.setUpdatedAt(t.getUpdatedAt());
        return r;
    }
}
