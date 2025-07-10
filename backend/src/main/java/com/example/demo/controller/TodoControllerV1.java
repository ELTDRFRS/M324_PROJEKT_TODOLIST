package com.example.demo.controller;

import com.example.demo.Task;
import com.example.demo.versioning.ApiVersion;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 * Version 1 of the Todo API
 * Basic CRUD operations for tasks
 */
@RestController
@RequestMapping("/api")
@ApiVersion("v1")
@CrossOrigin
public class TodoControllerV1 {

    private List<Task> tasks = new ArrayList<>();

    /**
     * GET /api - Returns all tasks
     * API Version: v1
     */
    @GetMapping(value = {"/", ""}, produces = "application/vnd.todoapi.v1+json")
    public List<Task> getTasks() {
        System.out.println("API v1: GET '/' returns task-list of size " + tasks.size() + ".");
        if (tasks.size() > 0) {
            int i = 1;
            for (Task task : tasks) {
                System.out.println("-task " + (i++) + ":" + task.getTaskdescription());
            }
        }
        return tasks;
    }

    /**
     * POST /api/tasks - Adds a new task
     * API Version: v1
     */
    @PostMapping(value = "/tasks", produces = "application/vnd.todoapi.v1+json")
    public Map<String, String> addTask(@RequestBody String taskdescription) {
        System.out.println("API v1: POST '/tasks': '" + taskdescription + "'");
        ObjectMapper mapper = new ObjectMapper();
        try {
            Task task = mapper.readValue(taskdescription, Task.class);
            
            // Check for duplicates
            for (Task t : tasks) {
                if (t.getTaskdescription().equals(task.getTaskdescription())) {
                    System.out.println(">>>v1: task: '" + task.getTaskdescription() + "' already exists!");
                    return Map.of("message", "Task already exists");
                }
            }
            
            System.out.println("...v1: adding task: '" + task.getTaskdescription() + "'");
            tasks.add(task);
            return Map.of("message", "Task added successfully");
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return Map.of("error", "Error processing task");
        }
    }

    /**
     * POST /api/delete - Deletes a task
     * API Version: v1
     */
    @PostMapping(value = "/delete", produces = "application/vnd.todoapi.v1+json")
    public Map<String, String> deleteTask(@RequestBody String taskdescription) {
        System.out.println("API v1: POST '/delete': '" + taskdescription + "'");
        ObjectMapper mapper = new ObjectMapper();
        try {
            Task task = mapper.readValue(taskdescription, Task.class);
            Iterator<Task> it = tasks.iterator();
            while (it.hasNext()) {
                Task t = it.next();
                if (t.getTaskdescription().equals(task.getTaskdescription())) {
                    System.out.println("...v1: deleting task: '" + task.getTaskdescription() + "'");
                    it.remove();
                    return Map.of("message", "Task deleted successfully");
                }
            }
            System.out.println(">>>v1: task: '" + task.getTaskdescription() + "' not found!");
            return Map.of("message", "Task not found");
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return Map.of("error", "Error processing task");
        }
    }
}
