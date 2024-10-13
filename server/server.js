const mongoose = require("mongoose");
const express = require("express");
const Todo = require("./model/Todo.js");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://liviucaciulatu:Converse10@cluster0.gsylu01.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));



app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Acces-Control-Allow-Methods");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.post('/api/todo', (req, res) => {
  const title = req.body.title;
  const comment = req.body.comment;
  const createdAt = Date.now();
  const newTodo = new Todo({
    title,
    comment,
    createdAt
  });

  newTodo.save()
    .then(todo => {
      res.json(todo);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'An error occurred' });
    });
});

app.get('/api/todo', (req, res) => {
  Todo.find()
    .then(todos => {res.json(todos);})
    .catch(err => {console.log(err); res.status(500).json({ error: 'An error occurred' });
    });
});

app.get('/api/todo/:id', (req, res)=>{
    const todoId = req.params.id;

    Todo.findById(todoId)
    .then(todo=>{
        if(!todo){
            return res.status(404).json({error: "Todo not found"})
        }
        res.json(todo);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error: "An error occurred"})
    })
})

app.delete('/api/todo/:id', (req, res)=>{
    const todoId = req.params.id;

    Todo.findByIdAndDelete(todoId)
    .then(()=>{
        res.json({message: "Todo removed successfully"})
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error: "An error accurred"})
    })
})

app.patch('/api/todo/:id', async (req, res) => {
  const { id } = req.params;
  const { title, comment } = req.body;

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(id, { title, comment }, { new: true });
    res.json(updatedTodo);
  } catch (error) {
    console.log('Error updating todo:', error);
    res.status(400).json({ success: false });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});