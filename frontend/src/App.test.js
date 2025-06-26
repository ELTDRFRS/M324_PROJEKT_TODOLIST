import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Mock fetch for API calls
global.fetch = jest.fn();

describe('Todo App', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    fetch.mockClear();
    // Mock successful API responses
    fetch.mockResolvedValue({
      ok: true,
      json: async () => [],
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('renders todo app header', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('ToDo Liste')).toBeInTheDocument();
    });
  });

  test('renders input field and submit button', async () => {
    render(<App />);
    
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /absenden/i })).toBeInTheDocument();
  });

  test('displays todos from API', async () => {
    const mockTodos = [
      { taskdescription: 'Buy groceries' },
      { taskdescription: 'Walk the dog' },
      { taskdescription: 'Buy milk' }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTodos,
    });

    render(<App />);
    
    // Wait for todos to load
    await waitFor(() => {
      expect(screen.getByText('Task 1: Buy groceries')).toBeInTheDocument();
    });
    expect(screen.getByText('Task 2: Walk the dog')).toBeInTheDocument();
    expect(screen.getByText('Task 3: Buy milk')).toBeInTheDocument();
  });

  test('input field updates when typing', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByRole('textbox');
    
    await user.type(input, 'New task');
    
    expect(input.value).toBe('New task');
  });

  test('handles form submission', async () => {
    const user = userEvent.setup();
    // Mock successful POST response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<App />);

    const input = screen.getByRole('textbox');
    const submitButton = screen.getByRole('button', { name: /absenden/i });
    
    await user.type(input, 'New task');
    await user.click(submitButton);
    
    // Check if fetch was called with correct data
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:8080/addTask",
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ taskdescription: 'New task' })
        })
      );
    });
  });

  test('displays done buttons for each todo', async () => {
    const mockTodos = [
      { taskdescription: 'Buy groceries' },
      { taskdescription: 'Walk the dog' }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTodos,
    });

    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Task 1: Buy groceries')).toBeInTheDocument();
    });

    const doneButtons = screen.getAllByText('Done');
    expect(doneButtons).toHaveLength(2);
  });

  test('handles empty todo list', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<App />);
    
    // Should render without crashing
    await waitFor(() => {
      expect(screen.getByText('ToDo Liste')).toBeInTheDocument();
    });
    
    // Should not show any tasks
    expect(screen.queryByText(/Task \d+:/)).not.toBeInTheDocument();
  });

  test('handles API error gracefully', async () => {
    // Mock API error
    fetch.mockRejectedValueOnce(new Error('API Error'));

    render(<App />);
    
    // Should not crash and still show the basic UI
    await waitFor(() => {
      expect(screen.getByText('ToDo Liste')).toBeInTheDocument();
    });
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('handles done button click', async () => {
    const user = userEvent.setup();
    const mockTodos = [
      { taskdescription: 'Buy groceries' }
    ];

    // Mock initial fetch
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTodos,
    });

    // Mock delete fetch
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Task 1: Buy groceries')).toBeInTheDocument();
    });

    const doneButton = screen.getByText('Done');
    
    await user.click(doneButton);
    
    // Check if delete fetch was called
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:8080/delete",
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ taskdescription: 'Buy groceries' })
        })
      );
    });
  });
});
