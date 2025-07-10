import logo from './logo.svg';
import './App.css';
import React from 'react';
/**
 * ==================================
 * Gemeinsames Basisprojekt: ToDo-App
 * ==================================
 * Die Todo-App basiert auf einem React-JS Frontend und Rest-API mit Springboot-Framework (Deploy on JAR -> Docker).
 *
 * Execute and build information:
 *  - Frontend Start: npm start  (Terminalbefehl im Frontend Verzeichnis)
 *  - Backend Start: EE Eclipse-Projekt -> maven build -> spring-boot:run oder JAR auf docker mit Java 8 oder höher
 *  - Browser: http://localhost:3000 für Frontend; http://localhost:8080/ für Backend
 *
 * Aktuelle Featureliste:
 *  - Singlepage App
 *  - neues Todo in Textfeld eingeben, submit zum Speichern und direkt als Liste in der Eingabereihenfolge anzeigen
 *  - Speicherung zunächst nur "In memory"
 *  - im Moment nur ein Text Eingabefeld für die ToDo Beschreibung
 *  - alle offenen Todos werden als Liste angezeigt, jedes Todo hat einen Button zum "abschliessen" und
 *    werden dabei definitiv und ohne Bestätigung direkt gelöscht
 *
 * Mögliche Erweiterungen für die Lernenden:
 *  - Persistent storage (das MySQL Plugin ist im Spring-Framework bereits integriert)
 *  - Deadlines (duedate)
 *  - nicht löschen sondern mit Status (open, done) mit evtl. Anzeigefilter
 *  - Sortieren nach Deadline
 *  - Desing Verbesserungen
 *  - ...
 */
class App extends React.Component {

 /** The constructor is called when mounting App (see index.js).
  ** It sets up the initial state of the component (see below).
  ** The argument props will not be 'undefined' if in index.js App is instantiated with i.e.:
  **    const todoList = [{title: 'Task 1'}, {title: 'Task 2'}];
  **    ReactDOM.render(<App todos={todoList} />, document.getElementById('root'));).
  **
  ** It sets the component's initial state using the this.state object (see below).
  ** It will set the initial value of its todos property and will set its task property to "":
  **   todos: is an array of todos (todo list) and its value is either an empty array (if props.todos is undefined) or the value of props.todos. **(
  **   task:  is a string that holds the value of the input field.
  **
  ** The attribute state is a predefined term in React. It refers to the internal data storage for a React component.
  ** In React, state is used to store and manage component-level data that can change and affect the component's behavior and render output.
  ** The state can be updated using the setState method and accessed within the component using this.state.
  ** Note: state should only be modified using setState and should not be directly mutated.
  **       Direct mutations to state can cause unexpected behavior and bugs in the component.
  */
  constructor(props) {
    super(props);      // ensure that the constructor of the parent class (React.Component) is properly called.
    this.state = {
      todos: typeof props.todos === 'undefined' ? [] : props.todos,
      taskdescription: "",
      apiVersion: "v1",  // Default to v1 for backward compatibility
      searchTerm: ""
    };
    // **( Remark:
    // If props.todos is of the type undefined, the expression typeof props.todos === 'undefined' will return true,
    // and the value of todos will be set to an empty array [] otherwise todos will be set to the value of props.todos.
    // By using this check, the component can accept an optional todos prop, or use an empty array as a default value.
  }

 /** Is called when ever the html input field value below changes to update the component's state.
  ** This is, because the submit should not take the field value directly.
  ** The task property in the state is used to store the current value of the input field as the user types into it.
  ** This is necessary because React operates on the principle of state and props, which means that a component's state
  ** determines the component's behavior and render.
  ** If we used the value directly from the HTML form field, we wouldn't be able to update the component's state and react to changes in the input field.
  */
  handleChange = event => {
    this.setState({ taskdescription: event.target.value });
  }

  handleVersionChange = event => {
    this.setState({ apiVersion: event.target.value }, () => {
      // Reload tasks when version changes
      this.loadTasks();
    });
  }

  handleSearchChange = event => {
    this.setState({ searchTerm: event.target.value });
  }

 /** Is called when the html form is submitted. It sends a POST request to the API endpoint '/tasks' and updates the component's state with the new todo.
  ** In this case a new taskdecription is added to the actual list on the server.
  */
  handleSubmit = event => {
    event.preventDefault();
    console.log(`Sending task description to Spring-Server (${this.state.apiVersion}): ${this.state.taskdescription}`);
    fetch("http://localhost:8080/api/tasks", {  // API endpoint (the complete URL!) to save a taskdescription
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Version": this.state.apiVersion  // Add API version header
      },
      body: JSON.stringify({ taskdescription: this.state.taskdescription }) // both 'taskdescription' are identical to Task-Class attribute in Spring
    })
    .then(response => {
      console.log(`Receiving answer after sending to Spring-Server (${this.state.apiVersion}): `);
      console.log(response);
      
      if (this.state.apiVersion === "v2") {
        // For v2, handle JSON response with enhanced task object
        return response.json();
      }
      
      // For v1, just reload the tasks
      this.loadTasks();
      this.setState({taskdescription: ""});             // clear input field
    })
    .then(data => {
      if (this.state.apiVersion === "v2" && data) {
        // Handle v2 response with enhanced task object
        console.log("V2 Response data:", data);
        this.loadTasks(); // Reload to get the full updated list
        this.setState({taskdescription: ""});             // clear input field
      }
    })
    .catch(error => console.log(error))
  }

 /** Is called when the component is mounted (after any refresh or F5).
  ** It updates the component's state with the fetched todos from the API Endpoint '/'.
  */
  componentDidMount() {
    this.loadTasks();
  }

  loadTasks = () => {
    console.log(`Loading tasks with API version: ${this.state.apiVersion}`);
    fetch("http://localhost:8080/api/", {
      headers: {
        "API-Version": this.state.apiVersion
      }
    })
      .then(response => {
        console.log(`Response status: ${response.status}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log(`Receiving task list data from Spring-Server (${this.state.apiVersion}): `);
        console.log(data);
        console.log(`Data type: ${typeof data}, Is Array: ${Array.isArray(data)}`);
        
        if (this.state.apiVersion === "v2") {
          // For v2, extract tasks from the response object
          const tasks = data.tasks || [];
          console.log(`V2 tasks extracted:`, tasks);
          this.setState({todos: Array.isArray(tasks) ? tasks : []});
        } else {
          // For v1, data should be directly the array
          console.log(`V1 tasks received:`, data);
          this.setState({todos: Array.isArray(data) ? data : []});
        }
      })
      .catch(error => {
        console.error('Error loading tasks:', error);
        // Set empty array on error to prevent filter issues
        this.setState({todos: []});
      })
  }

 /** Is called when the Done-Butten is pressed. It sends a POST request to the API endpoint '/delete' and updates the component's state with the new todo.
  ** In this case if the task with the unique taskdecription is found on the server, it will be removed from the list.
  */
  handleClick = taskdescription => {
    console.log(`Sending task description to delete on Spring-Server (${this.state.apiVersion}): ${taskdescription}`);
    fetch(`http://localhost:8080/api/delete`, { // API endpoint (the complete URL!) to delete an existing taskdescription in the list
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Version": this.state.apiVersion  // Add API version header
      },
      body: JSON.stringify({ taskdescription: taskdescription })
    })
    .then(response => {
      console.log(`Receiving answer after deleting on Spring-Server (${this.state.apiVersion}): `);
      console.log(response);
      
      if (this.state.apiVersion === "v2") {
        // For v2, handle JSON response
        return response.json().then(data => {
          console.log("V2 Delete response:", data);
          this.loadTasks(); // Reload tasks
        });
      } else {
        // For v1, just reload
        this.loadTasks();
      }
    })
    .catch(error => console.log(error))
  }

  /**
   * Filter and render tasks based on search term
   * @param {*} todos : Task list
   * @returns html code snippet
   */
  getFilteredTodos() {
    return this.state.todos.filter(todo => 
      todo.taskdescription.toLowerCase().includes(this.state.searchTerm.toLowerCase())
    );
  }

  /**
   * render all task lines
   * @param {*} todos : Task list
   * @returns html code snippet
   */
  renderTasks(todos) {
    if (todos.length === 0) {
      return <p>No tasks found.</p>;
    }

    return (
      <ul>
        {todos.map((todo, index) => {
          // Handle both v1 and v2 task formats
          const taskDesc = todo.taskdescription;
          const taskId = todo.id || null;
          const taskStatus = todo.status || null;
          const createdAt = todo.createdAt || null;
          
          return (
            <li key={taskId || taskDesc}>
              <div>
                <strong>Task {index+1}:</strong> {taskDesc}
                {this.state.apiVersion === "v2" && (
                  <div style={{fontSize: '0.8em', color: '#666', marginTop: '4px'}}>
                    ID: {taskId} | Status: {taskStatus} | Created: {createdAt}
                  </div>
                )}
              </div>
              <button onClick={this.handleClick.bind(this, taskDesc)}>Done</button>
            </li>
          );
        })}
      </ul>
    );
  }

 /** It returns the JSX code that describes the UI of the component.
  ** It renders the header, form, and todo list.
  */
  render() {
    const filteredTodos = this.getFilteredTodos();
    
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>
            ToDo Liste
          </h1>
          
          {/* API Version Selector */}
          <div style={{marginBottom: '20px'}}>
            <label htmlFor="version-select" style={{marginRight: '10px'}}>API Version:</label>
            <select 
              id="version-select"
              value={this.state.apiVersion} 
              onChange={this.handleVersionChange}
              style={{padding: '5px', fontSize: '14px'}}
            >
              <option value="v1">Version 1 (Basic)</option>
              <option value="v2">Version 2 (Enhanced)</option>
            </select>
            <span style={{marginLeft: '10px', fontSize: '0.8em', color: '#ccc'}}>
              Current: {this.state.apiVersion}
            </span>
          </div>
          
          {/* Search Box */}
          <div style={{marginBottom: '20px'}}>
            <input
              type="text"
              placeholder="Search todos..."
              value={this.state.searchTerm}
              onChange={this.handleSearchChange}
              style={{padding: '8px', fontSize: '14px', width: '200px'}}
            />
            {this.state.searchTerm && (
              <button 
                onClick={() => this.setState({searchTerm: ''})} 
                style={{marginLeft: '5px', padding: '8px'}}
              >
                ✕
              </button>
            )}
          </div>
          
          {/* Add Task Form */}
          <form onSubmit={this.handleSubmit} style={{marginBottom: '20px'}}>
            <input
              type="text"
              placeholder="Enter new task..."
              value={this.state.taskdescription}
              onChange={this.handleChange}
              style={{padding: '8px', fontSize: '14px', width: '200px'}}
            />
            <button type="submit" style={{marginLeft: '10px', padding: '8px 16px'}}>Absenden</button>
          </form>
          
          {/* Task Statistics */}
          <div style={{marginBottom: '20px', fontSize: '0.9em', color: '#ccc'}}>
            Showing {filteredTodos.length} of {this.state.todos.length} tasks
            {this.state.searchTerm && (
              <span> (filtered by "{this.state.searchTerm}")</span>
            )}
          </div>
          
          {/* Task List */}
          <div>
            {this.renderTasks(filteredTodos)}
          </div>
        </header>
      </div>
    );
  }

}

export default App;
