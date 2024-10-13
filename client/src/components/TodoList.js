import React, { useEffect, useState } from 'react';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editComment, setEditComment] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/todo');
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.log('Error fetching todos:', error);
    }
  };

  const handleEdit = (id, title, comment) => {
    setEditId(id);
    setEditTitle(title);
    setEditComment(comment);
  };

  const handleUpdate = async (id) => {
    try {
      const data = { title: editTitle, comment: editComment };
      const response = await fetch(`http://localhost:3000/api/todo/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const updatedTodo = await response.json();
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo._id === id ? updatedTodo : todo))
      );
      setEditId(null);
      setEditTitle('');
      setEditComment('');
    } catch (error) {
      console.log('Error updating todo:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditTitle('');
    setEditComment('');
  };

  const handleRemoveTodo = (id) => {
    fetch(`http://localhost:3000/api/todo/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setTodos((prevTodos) =>
          prevTodos.filter((todo) => todo._id !== id)
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <h2>Todo List</h2>
      {todos.length === 0 ? (
        <p>Nothing to do, enjoy your day!</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Comment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo) => (
              <tr key={todo._id}>
                <td>{editId === todo._id ? <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} /> : todo.title}</td>
                <td>{editId === todo._id ? <input type="text" value={editComment} onChange={(e) => setEditComment(e.target.value)} /> : todo.comment}</td>
                <td>
                  {editId === todo._id ? (
                    <>
                      <button onClick={() => handleUpdate(todo._id)}>Save</button>
                      <button onClick={handleCancelEdit}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(todo._id, todo.title, todo.comment)}>Edit</button>
                      <button onClick={() => handleRemoveTodo(todo._id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TodoList;
