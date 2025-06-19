package com.example.demo;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

/**
 * Unit Tests für die Task Klasse
 * Testet die grundlegenden Funktionalitäten der Task Bean
 */
class TaskTest {

    private Task task;

    @BeforeEach
    void setUp() {
        task = new Task();
    }

    @Test
    @DisplayName("Test 1: Task Konstruktor erstellt leere Task")
    void testTaskConstructor() {
        // Arrange & Act
        Task newTask = new Task();
        
        // Assert
        assertNotNull(newTask, "Task Objekt sollte nicht null sein");
        assertNull(newTask.getTaskdescription(), "Task description sollte initial null sein");
    }

    @Test
    @DisplayName("Test 2: SetTaskdescription setzt Beschreibung korrekt")
    void testSetTaskdescription() {
        // Arrange
        String description = "Einkaufen gehen";
        
        // Act
        task.setTaskdescription(description);
        
        // Assert
        assertEquals(description, task.getTaskdescription(), 
                    "Task description sollte korrekt gesetzt werden");
    }

    @Test
    @DisplayName("Test 3: GetTaskdescription gibt korrekte Beschreibung zurück")
    void testGetTaskdescription() {
        // Arrange
        String expectedDescription = "Unit Tests schreiben";
        task.setTaskdescription(expectedDescription);
        
        // Act
        String actualDescription = task.getTaskdescription();
        
        // Assert
        assertEquals(expectedDescription, actualDescription, 
                    "Getter sollte die gleiche Beschreibung zurückgeben wie gesetzt");
    }

    @Test
    @DisplayName("Test 4: Task mit null Beschreibung")
    void testTaskWithNullDescription() {
        // Arrange & Act
        task.setTaskdescription(null);
        
        // Assert
        assertNull(task.getTaskdescription(), 
                  "Task sollte null description akzeptieren");
    }

    @Test
    @DisplayName("Test 5: Task mit leerem String")
    void testTaskWithEmptyString() {
        // Arrange
        String emptyDescription = "";
        
        // Act
        task.setTaskdescription(emptyDescription);
        
        // Assert
        assertEquals(emptyDescription, task.getTaskdescription(), 
                    "Task sollte leeren String als Beschreibung akzeptieren");
        assertTrue(task.getTaskdescription().isEmpty(), 
                  "Task description sollte leer sein");
    }
}
