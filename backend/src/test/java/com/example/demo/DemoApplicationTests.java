package com.example.demo;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class DemoApplicationTests {

	private DemoApplication app;

	@BeforeEach
	void setUp() {
		app = new DemoApplication();
	}

	@Test
	@DisplayName("Test 6: Spring Context lädt erfolgreich")
	void contextLoads() {
		assertTrue(true, "Spring Context sollte erfolgreich laden");
	}

	@Test
	@DisplayName("Test 7: getTasks gibt leere Liste zurück wenn keine Tasks vorhanden")
	void testGetTasksWhenEmpty() {
		// Arrange & Act
		List<Task> tasks = app.getTasks();
		
		// Assert
		assertNotNull(tasks, "Task Liste sollte nicht null sein");
		assertTrue(tasks.isEmpty(), "Task Liste sollte initial leer sein");
		assertEquals(0, tasks.size(), "Task Liste sollte Größe 0 haben");
	}

	@Test
	@DisplayName("Test 8: addTask mit gültiger JSON Task")
	void testAddTaskWithValidJson() {
		// Arrange
		String validTaskJson = "{\"taskdescription\":\"Test Task\"}";
		
		// Act
		String result = app.addTask(validTaskJson);
		List<Task> tasks = app.getTasks();
		
		// Assert
		assertEquals("redirect:/", result, "addTask sollte redirect zurückgeben");
		assertEquals(1, tasks.size(), "Nach Hinzufügen sollte Liste 1 Task enthalten");
		assertEquals("Test Task", tasks.get(0).getTaskdescription(), 
					"Task description sollte korrekt gesetzt sein");
	}
}
