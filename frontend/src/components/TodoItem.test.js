import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock TodoItem component for testing
const TodoItem = ({ todo, onToggle, onDelete }) => (
  <div className="todo-item" data-testid={`todo-${todo.id}`}>
    <span 
      className={todo.completed ? 'completed' : ''}
      onClick={() => onToggle(todo.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onToggle(todo.id);
        }
      }}
    >
      {todo.taskdescription}
    </span>
    <button 
      onClick={() => onDelete(todo.id)}
      aria-label={`Delete ${todo.taskdescription}`}
    >
      Delete
    </button>
  </div>
);

describe('TodoItem', () => {
  const mockTodo = {
    id: 1,
    taskdescription: 'Test todo',
    completed: false
  };

  const mockOnToggle = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders todo item correctly', () => {
    render(
      <TodoItem 
        todo={mockTodo} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    );
    
    expect(screen.getByText('Test todo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete test todo/i })).toBeInTheDocument();
  });

  test('calls onToggle when todo is clicked', async () => {
    render(
      <TodoItem 
        todo={mockTodo} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    );
    
    const todoSpan = screen.getByText('Test todo');
    await userEvent.click(todoSpan);
    
    expect(mockOnToggle).toHaveBeenCalledWith(1);
  });

  test('calls onDelete when delete button is clicked', async () => {
    render(
      <TodoItem 
        todo={mockTodo} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    );
    
    const deleteButton = screen.getByRole('button', { name: /delete test todo/i });
    await userEvent.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  test('applies completed class when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: true };
    
    render(
      <TodoItem 
        todo={completedTodo} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    );
    
    const todoSpan = screen.getByText('Test todo');
    expect(todoSpan).toHaveClass('completed');
  });

  test('handles keyboard navigation', async () => {
    render(
      <TodoItem 
        todo={mockTodo} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    );
    
    const todoSpan = screen.getByText('Test todo');
    
    // Test Enter key
    await userEvent.type(todoSpan, '{enter}');
    expect(mockOnToggle).toHaveBeenCalledWith(1);
    
    // Test Space key
    jest.clearAllMocks();
    await userEvent.type(todoSpan, ' ');
    expect(mockOnToggle).toHaveBeenCalledWith(1);
  });
});
