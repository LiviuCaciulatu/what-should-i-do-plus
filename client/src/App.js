import './App.css';
import React, {useState} from "react";
import TodoList from "./components/TodoList.js"

function App() {

    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [createdAt] = useState('');
    const [showTodoList, setShowTodoList] = useState(false)
  
    const handleSubmit = (e) => {
      e.preventDefault();
  
      const newTodo = {
        title,
        comment,
        createdAt
      };
  
      fetch('http://localhost:3000/api/todo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTodo)
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
        })
        .catch(error => {
          console.log(error);
        });
    };

    const handleShowTodoList = () => {
      setShowTodoList(true)
    }

    const handleHideTodoList = () => {
      setShowTodoList(false)
    }
  
    return (
      <div>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <br />
        <label>
          Comment:
          <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} />
        </label>
        <br />
        <button type="submit">Add Todo</button>
      </form>
      <div>
      <h1>My Todo App</h1>
      {showTodoList ? (
        <div>
          <button onClick={handleHideTodoList}>Hide Todo's</button>
          <TodoList />
        </div>
      ) : (
        <button onClick={handleShowTodoList}>Show Todo's</button>
      )}
    </div>
    </div>
    );

}

export default App;
