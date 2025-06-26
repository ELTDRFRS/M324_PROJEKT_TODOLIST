// Mock search utility functions for testing
const filterTodos = (todos, searchTerm) => {
  if (!searchTerm || !searchTerm.trim()) return todos;
  
  const trimmedSearch = searchTerm.trim();
  return todos.filter(todo =>
    todo.taskdescription.toLowerCase().includes(trimmedSearch.toLowerCase())
  );
};

const getTodoStats = (todos) => {
  const total = todos.length;
  const completed = todos.filter(todo => todo.completed).length;
  const pending = total - completed;
  
  return { total, completed, pending };
};

describe('Search Utilities', () => {
  const mockTodos = [
    { id: 1, taskdescription: 'Buy groceries', completed: false },
    { id: 2, taskdescription: 'Walk the dog', completed: true },
    { id: 3, taskdescription: 'Buy milk', completed: false },
    { id: 4, taskdescription: 'Read a book', completed: true },
    { id: 5, taskdescription: 'Call grandmother', completed: false }
  ];

  describe('filterTodos', () => {
    test('returns all todos when search term is empty', () => {
      const result = filterTodos(mockTodos, '');
      expect(result).toEqual(mockTodos);
      expect(result).toHaveLength(5);
    });

    test('filters todos by search term (case insensitive)', () => {
      const result = filterTodos(mockTodos, 'buy');
      expect(result).toHaveLength(2);
      expect(result[0].taskdescription).toBe('Buy groceries');
      expect(result[1].taskdescription).toBe('Buy milk');
    });

    test('handles case insensitive search', () => {
      const result = filterTodos(mockTodos, 'BUY');
      expect(result).toHaveLength(2);
    });

    test('returns empty array when no matches found', () => {
      const result = filterTodos(mockTodos, 'xyz123');
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    test('handles partial word matches', () => {
      const result = filterTodos(mockTodos, 'gro');
      expect(result).toHaveLength(1);
      expect(result[0].taskdescription).toBe('Buy groceries');
    });

    test('handles whitespace in search term', () => {
      const result = filterTodos(mockTodos, '  buy  ');
      expect(result).toHaveLength(2);
    });

    test('performance test with large dataset', () => {
      const largeTodos = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        taskdescription: `Task ${i} buy groceries`,
        completed: i % 2 === 0
      }));

      const start = performance.now();
      const result = filterTodos(largeTodos, 'buy');
      const end = performance.now();
      
      expect(result).toHaveLength(10000);
      expect(end - start).toBeLessThan(100); // Should complete in less than 100ms
    });
  });

  describe('getTodoStats', () => {
    test('calculates correct statistics', () => {
      const stats = getTodoStats(mockTodos);
      
      expect(stats.total).toBe(5);
      expect(stats.completed).toBe(2);
      expect(stats.pending).toBe(3);
    });

    test('handles empty todo list', () => {
      const stats = getTodoStats([]);
      
      expect(stats.total).toBe(0);
      expect(stats.completed).toBe(0);
      expect(stats.pending).toBe(0);
    });

    test('handles all completed todos', () => {
      const allCompleted = mockTodos.map(todo => ({ ...todo, completed: true }));
      const stats = getTodoStats(allCompleted);
      
      expect(stats.total).toBe(5);
      expect(stats.completed).toBe(5);
      expect(stats.pending).toBe(0);
    });

    test('handles all pending todos', () => {
      const allPending = mockTodos.map(todo => ({ ...todo, completed: false }));
      const stats = getTodoStats(allPending);
      
      expect(stats.total).toBe(5);
      expect(stats.completed).toBe(0);
      expect(stats.pending).toBe(5);
    });
  });
});
