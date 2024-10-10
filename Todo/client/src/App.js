import { useState, useEffect } from 'react'
import "./index.css";
import Header from './component/Header';
import AddToDo from './component/AddTodo';
import Todos from './component/Todos';

function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const getTodos = async () => {
      try {
        const todosFromServer = await fetchTodos();
        setTodos(todosFromServer);
      } catch (error) {
        console.error(error);
      }
    }

    getTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await fetch('http://localhost:3000/get')
      const data = await res.json();
      return data.todos;
    } catch (error) {
      console.error(error);
    }
  }

  const fetchTodo = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/get/${id}`)
      const data = await res.json();
      return data.todo
    } catch (error) {
      console.error(error);
    }
  }

  const addTodo = async (todo) => {
    try {
      const res = await fetch('http://localhost:3000/post', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(todo),
      })

      const data = await res.json();

      setTodos([...todos, data.todo])
    } catch (error) {
      console.error(error);
    }
  }

  const removeTodo = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/delete/${id}`, {
        method: 'DELETE',
      });

      if (res.status === 200) {
        setTodos(todos.filter((todo) => todo.id !== id))
      } else {
        alert('There was an error while deleting');
      }
    } catch (error) {
      console.error(error);
    }
  }

  const markTodo = async (id) => {
    try {
      const todoToToggle = await fetchTodo(id);
      const updatedTodo = { status: !todoToToggle.status }

      const res = await fetch(`http://localhost:3000/put/${id}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(updatedTodo),
      });

      if (res.status === 200) {
        const data = await res.json();

        setTodos(
          todos.map((todo) =>
            todo.id === id ? { ...todo, status: data.todo.status } : todo
          )
        )
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="app">
      <div className="container">
        <Header />		
        <AddToDo addTodo={addTodo}/>
        {todos.length > 0 ? (<Todos todos={todos} removeTodo={removeTodo} markTodo={markTodo} />) : ('No Todos To Show')}		
      </div>
    </div>
  );
}

export default App;