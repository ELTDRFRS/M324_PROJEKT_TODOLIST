package com.example.demo.controller;

import com.example.demo.Task;
import com.example.demo.versioning.ApiVersion;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * Version 2 of the Todo API
 * Enhanced features: proper HTTP status codes, timestamps, task IDs, and metadata
 */
@RestController
@RequestMapping("/api")
@ApiVersion("v2")
@CrossOrigin
public class TodoControllerV2 {

    private List<Map<String, Object>> tasks = new ArrayList<>();
    private int nextId = 1;

    /**
     * GET /api - Returns all tasks with metadata
     * API Version: v2
     * Enhanced: Includes task IDs, timestamps, and response metadata
     */
    @GetMapping(value = {"/", ""}, produces = "application/vnd.todoapi.v2+json")
    public ResponseEntity<Map<String, Object>> getTasks() {
        System.out.println("API v2: GET '/' returns task-list of size " + tasks.size() + ".");
        
        Map<String, Object> response = new HashMap<>();
        response.put("version", "v2");
        response.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        response.put("count", tasks.size());
        response.put("tasks", tasks);
        
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/tasks - Adds a new task with enhanced features
     * API Version: v2
     * Enhanced: Auto-generated IDs, timestamps, proper HTTP status codes
     */
    @PostMapping(value = "/tasks", produces = "application/vnd.todoapi.v2+json")
    public ResponseEntity<Map<String, Object>> addTask(@RequestBody String taskdescription) {
        System.out.println("API v2: POST '/tasks': '" + taskdescription + "'");
        ObjectMapper mapper = new ObjectMapper();
        
        try {
            Task task = mapper.readValue(taskdescription, Task.class);
            
            // Check for duplicates
            for (Map<String, Object> existingTask : tasks) {
                if (existingTask.get("taskdescription").equals(task.getTaskdescription())) {
                    System.out.println(">>>v2: task: '" + task.getTaskdescription() + "' already exists!");
                    
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("version", "v2");
                    errorResponse.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
                    errorResponse.put("error", "Task already exists");
                    errorResponse.put("taskdescription", task.getTaskdescription());
                    
                    return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
                }
            }
            
            // Create enhanced task object
            Map<String, Object> enhancedTask = new HashMap<>();
            enhancedTask.put("id", nextId++);
            enhancedTask.put("taskdescription", task.getTaskdescription());
            enhancedTask.put("status", "open");
            enhancedTask.put("createdAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            enhancedTask.put("updatedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            
            tasks.add(enhancedTask);
            System.out.println("...v2: adding task with ID " + (nextId-1) + ": '" + task.getTaskdescription() + "'");
            
            Map<String, Object> response = new HashMap<>();
            response.put("version", "v2");
            response.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            response.put("message", "Task added successfully");
            response.put("task", enhancedTask);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("version", "v2");
            errorResponse.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            errorResponse.put("error", "Invalid JSON format");
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    /**
     * POST /api/delete - Deletes a task (enhanced version)
     * API Version: v2
     * Enhanced: Can delete by ID or description, proper HTTP status codes
     */
    @PostMapping(value = "/delete", produces = "application/vnd.todoapi.v2+json")
    public ResponseEntity<Map<String, Object>> deleteTask(@RequestBody String taskdescription) {
        System.out.println("API v2: POST '/delete': '" + taskdescription + "'");
        ObjectMapper mapper = new ObjectMapper();
        
        try {
            Task task = mapper.readValue(taskdescription, Task.class);
            Iterator<Map<String, Object>> it = tasks.iterator();
            
            while (it.hasNext()) {
                Map<String, Object> existingTask = it.next();
                if (existingTask.get("taskdescription").equals(task.getTaskdescription())) {
                    System.out.println("...v2: deleting task ID " + existingTask.get("id") + ": '" + task.getTaskdescription() + "'");
                    it.remove();
                    
                    Map<String, Object> response = new HashMap<>();
                    response.put("version", "v2");
                    response.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
                    response.put("message", "Task deleted successfully");
                    response.put("deletedTask", existingTask);
                    
                    return ResponseEntity.ok(response);
                }
            }
            
            System.out.println(">>>v2: task: '" + task.getTaskdescription() + "' not found!");
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("version", "v2");
            errorResponse.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            errorResponse.put("error", "Task not found");
            errorResponse.put("taskdescription", task.getTaskdescription());
            
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("version", "v2");
            errorResponse.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            errorResponse.put("error", "Invalid JSON format");
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    /**
     * GET /api/version - Returns API version info
     * API Version: v2
     * New endpoint to show version capabilities
     */
    @GetMapping("/version")
    public ResponseEntity<Map<String, Object>> getVersionInfo() {
        Map<String, Object> versionInfo = new HashMap<>();
        versionInfo.put("version", "v2");
        versionInfo.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        versionInfo.put("features", Arrays.asList(
            "Enhanced task objects with IDs and timestamps",
            "Proper HTTP status codes",
            "Task status tracking",
            "Detailed error responses",
            "Response metadata"
        ));
        versionInfo.put("endpoints", Arrays.asList(
            "GET / - List all tasks",
            "POST /tasks - Create new task",
            "POST /delete - Delete task",
            "GET /version - Version information"
        ));
        
        return ResponseEntity.ok(versionInfo);
    }
}
